<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { appState } from '$lib/state.svelte';
	import { getVisitorLocation } from '$lib/analytics';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		// Track visitor analytics dynamically to avoid SSR issues
		const trackAnalytics = async () => {
			if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
				return;
			}
			try {
				const { db } = await import('$lib/firebase');
				const { doc, updateDoc, increment, setDoc, getDoc, collection, addDoc } =
					await import('firebase/firestore');

				const docRef = doc(db, 'dashboard', 'visitors');
				const docSnap = await getDoc(docRef);

				let isNewSession = false;
				if (typeof sessionStorage !== 'undefined') {
					if (!sessionStorage.getItem('session_active')) {
						sessionStorage.setItem('session_active', 'true');
						isNewSession = true;
					}
				}

				const updates: any = {
					count: increment(1)
				};
				if (isNewSession) {
					updates.sessions = increment(1);
				}

				if (docSnap.exists()) {
					await updateDoc(docRef, updates);
				} else {
					await setDoc(docRef, { count: 1, sessions: 1, clicks: 0 });
				}

				// Get visitor location for more realistic logs
				const location = await getVisitorLocation();
				const description =
					location === 'Someone'
						? 'Someone viewed the home page'
						: `Someone from ${location} viewed the home page`;

				// Log page view activity
				await addDoc(collection(db, 'activity_logs'), {
					type: 'page_view',
					description,
					createdAt: new Date()
				});
			} catch (err) {
				console.error('Failed to track visitor analytics:', err);
			}
		};
		trackAnalytics();

		const lenis = new Lenis({
			lerp: 0.05,
			duration: 2.0,
			smoothWheel: true,
			wheelMultiplier: 0.8
		});

		// Dynamic import to avoid SSR issues with Snap
		import('lenis/snap').then(({ default: Snap }) => {
			const snap = new Snap(lenis, {
				type: 'proximity',
				lerp: 0.04,
				duration: 1,
				distanceThreshold: '50%'
			});

			// Add all elements with snap-start class
			setTimeout(() => {
				const elements = Array.from(document.querySelectorAll('.snap-start')) as HTMLElement[];
				snap.addElements(elements, { align: 'start' });
			}, 100);

			// Store snap instance in window for cleanup if needed
			(window as any).lenisSnap = snap;
		});

		// If we're still loading, stop scroll immediately
		if (appState.isInitialLoading) {
			lenis.stop();
		}

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Synchronize scroll with global state
		$effect(() => {
			if (appState.isInitialLoading) {
				lenis.stop();
				document.documentElement.style.overflow = 'hidden';
				document.body.style.overflow = 'hidden';
			} else {
				lenis.start();
				document.documentElement.style.overflow = '';
				document.body.style.overflow = '';
			}
		});

		return () => {
			if ((window as any).lenisSnap) {
				(window as any).lenisSnap.destroy();
			}
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<style>
		html.lenis,
		html.lenis body {
			height: auto;
		}
		.lenis.lenis-smooth {
			scroll-behavior: auto !important;
		}
		.lenis.lenis-smooth [data-lenis-prevent] {
			overscroll-behavior: contain;
		}
		.lenis.lenis-stopped {
			overflow: hidden;
		}
		.lenis.lenis-scrolling iframe {
			pointer-events: none;
		}
	</style>
</svelte:head>

<CustomCursor />
{@render children()}
