<script lang="ts">
	import { onMount } from 'svelte';

	const resumePath = '/resume/callmesidhu_resumeV6.pdf';
	let downloadLink: HTMLAnchorElement;

	onMount(() => {
		downloadLink.click();
	});
</script>

<svelte:head>
	<title>Resume | callmesidhu</title>
	<meta name="description" content="View and download callmesidhu's resume." />
</svelte:head>

<main class="h-screen bg-slate-900">
	<iframe
		src={resumePath}
		title="callmesidhu resume"
		class="h-full w-full border-0"
	></iframe>

	<a
		bind:this={downloadLink}
		href={resumePath}
		download="callmesidhu_resumeV6.pdf"
		class="fixed right-4 bottom-4 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-lg transition-transform hover:scale-105"
	>
		Download resume
	</a>
</main>
