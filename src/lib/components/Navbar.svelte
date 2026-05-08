<script lang="ts">
	import { onMount } from 'svelte';
	import Icons from './Icons.svelte';
	const logo = '/favicon.png';

	const links = ['Home', 'About', 'Skills', 'Experiences', 'Projects', 'Contact'];
	let isDark = $state(true);
	let menuOpen = $state(false);

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

	function closeMenu() {
		menuOpen = false;
	}
</script>

<nav
	class="fixed top-4 right-0 left-0 z-50 flex items-center justify-between px-4 py-3 text-white sm:px-8 lg:px-16"
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

	<!-- Center nav pill (desktop only) -->
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

	<!-- Right side -->
	<div class="flex items-center gap-2">
		<!-- Desktop: Admin + Resume -->
		<a
			href="/admin"
			class="hidden items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium backdrop-blur-md transition-transform duration-200 hover:scale-105 md:flex"
		>
			Admin
			<Icons name="ArrowUpRight" size={14} />
		</a>

		<!-- Theme toggle — always visible -->
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
			href="/resume"
			target="_blank"
			class="hidden items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium backdrop-blur-md transition-transform duration-200 hover:scale-105 md:flex"
		>
			Resume
			<Icons name="ArrowUpRight" size={14} />
		</a>

		<!-- Mobile hamburger -->
		<button
			onclick={() => menuOpen = !menuOpen}
			class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-all hover:bg-black/60 md:hidden"
			aria-label="Toggle menu"
			aria-expanded={menuOpen}
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
				{#if menuOpen}
					<path d="M6 18L18 6M6 6l12 12"/>
				{:else}
					<path d="M4 6h16M4 12h16M4 18h16"/>
				{/if}
			</svg>
		</button>
	</div>
</nav>

<!-- Mobile slide-down menu -->
{#if menuOpen}
	<div
		class="mobile-menu fixed inset-x-4 top-[76px] z-40 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl md:hidden"
	>
		<nav class="flex flex-col gap-1">
			{#each links as link (link)}
				<a
					href="#{link.toLowerCase()}"
					onclick={closeMenu}
					class="flex items-center justify-between rounded-xl px-4 py-3 font-body text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white {link === 'Contact' ? 'mt-1 rounded-xl bg-white/10 text-white' : ''}"
				>
					{link}
					{#if link === 'Contact'}
						<Icons name="ArrowUpRight" size={14} />
					{/if}
				</a>
			{/each}
		</nav>
		<div class="mt-3 flex gap-2 border-t border-white/10 pt-3">
			<a
				href="/admin"
				class="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10"
			>
				Admin <Icons name="ArrowUpRight" size={13} />
			</a>
			<a
				href="/resume"
				target="_blank"
				class="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10"
			>
				Resume <Icons name="ArrowUpRight" size={13} />
			</a>
		</div>
	</div>
{/if}

<style>
	.mobile-menu {
		animation: slideDown 0.2s ease-out;
	}
	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-8px); }
		to   { opacity: 1; transform: translateY(0); }
	}
</style>
