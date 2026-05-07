<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ScrollFrameAnimation from '$lib/components/ScrollFrameAnimation.svelte';
</script>

<svelte:head>
	<title>callmesidhu</title>
	<meta
		name="description"
		content="Portfolio of S Sidharth (callmesidhu), a premium Full Stack Developer building AI-powered web experiences."
	/>
</svelte:head>

<div class="bg-black">
	<!-- Navbar floats above everything -->
	<Navbar />

	<main>
		<!-- Scroll-scrubbed frame animation (full viewport hero) -->
		<ScrollFrameAnimation />
	</main>
</div>
