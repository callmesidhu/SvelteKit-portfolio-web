<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ProjectsGrid from '$lib/components/ProjectsGrid.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO 
	title="Projects | CallMeSidhu"
	description="Explore the portfolio of web, mobile, and AI projects developed by S Sidharth (CallMeSidhu), including React, SvelteKit, and Flutter applications."
	canonical="https://callmesidhu.xyphx.com/projects"
	breadcrumbs={[
		{ name: 'Home', item: 'https://callmesidhu.xyphx.com' },
		{ name: 'Projects', item: 'https://callmesidhu.xyphx.com/projects' }
	]}
/>

<div class="bg-black min-h-screen">
	<Navbar />
	<main>
		<ProjectsGrid />
	</main>
</div>
