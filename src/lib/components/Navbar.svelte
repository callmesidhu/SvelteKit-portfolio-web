<script lang="ts">
	import { onMount } from 'svelte';
	import Icons from './Icons.svelte';
	import logo from '$lib/assets/logo.png';

	const links = ['Home', 'About', 'Work', 'Skills', 'Contact'];
	let isDark = $state(true);

	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');
	});

	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}
</script>

<nav
	class="fixed top-4 right-0 left-0 z-50 flex items-center justify-between px-8 py-3 text-white lg:px-16"
>
	<!-- Logo -->
	<a
		href="/"
		class="group flex items-center gap-3 rounded-full border border-white/20 bg-black/40 pr-4 backdrop-blur-md"
	>
		<div
			class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black/10 backdrop-blur-md"
		>
			<img src={logo} alt="Logo" class="h-full w-full object-cover" />
		</div>
		<span class="hidden font-body text-sm font-medium tracking-wider uppercase sm:block"
			>callmesidhu</span
		>
	</a>

	<!-- Center nav pill (desktop) -->
	<div
		class="hidden items-center gap-1 rounded-full border border-white/10 bg-black/40 px-1.5 py-1 backdrop-blur-md md:flex"
	>
		{#each links as link (link)}
			{#if link === 'Contact'}
				<a
					href="#{link.toLowerCase()}"
					class="flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 font-body text-sm font-medium text-black transition-colors"
				>
					{link}
					<Icons name="ArrowUpRight" size={14} />
				</a>
			{:else}
				<a
					href="#{link.toLowerCase()}"
					class="rounded-full px-3 py-2 font-body text-sm font-medium transition-all duration-200 hover:bg-white/20"
				>
					{link}
				</a>
			{/if}
		{/each}
	</div>

	<!-- Right CTA & Theme Toggle -->
	<div class="flex items-center gap-3">
		<button
			onclick={toggleTheme}
			class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-all hover:bg-black/60"
			aria-label="Toggle Theme"
		>
			{#if isDark}
				<Icons name="Sun" size={18} />
			{:else}
				<Icons name="Moon" size={18} />
			{/if}
		</button>

		<a
			href="/resume.pdf"
			download
			class="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium backdrop-blur-md transition-transform duration-200 hover:scale-105"
		>
			Resume
			<Icons name="ArrowUpRight" size={14} />
		</a>
	</div>
</nav>
