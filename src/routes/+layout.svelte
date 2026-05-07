<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { appState } from '$lib/state.svelte';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		const lenis = new Lenis({
			lerp: 0.1,
			duration: 1.2,
			smoothWheel: true
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

{@render children()}
