<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		const lenis = new Lenis({
			lerp: 0.1,
			duration: 1.2,
			smoothWheel: true
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<style>
		html.lenis, html.lenis body {
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
