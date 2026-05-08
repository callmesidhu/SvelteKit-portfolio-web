<script lang="ts">
	import { user } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { LayoutDashboard, User, Briefcase, Rocket, Star, Code, LogOut, Menu, X } from 'lucide-svelte';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { appState } from '$lib/state.svelte';

	let { children } = $props();
	let isMobileMenuOpen = $state(false);

	onMount(() => {
		appState.isInitialLoading = false;
	});

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
		if (typeof document !== 'undefined') {
			document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
		}
	};

	$effect(() => {
		if (!$user && page.url.pathname !== '/admin/login') {
			goto('/admin/login');
		}
	});

	const handleLogout = async () => {
		await signOut(auth);
		goto('/admin/login');
	};

	const menuItems = [
		{ name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
		{ name: 'Hero', path: '/admin/hero', icon: Rocket },
		{ name: 'About', path: '/admin/about', icon: User },
		{ name: 'Experience', path: '/admin/experience', icon: Briefcase },
		{ name: 'Projects', path: '/admin/projects', icon: Star },
		{ name: 'Skills', path: '/admin/skills', icon: Code }
	];
</script>

{#if page.url.pathname === '/admin/login'}
	{@render children()}
{:else if $user}
	<div class="flex min-h-screen bg-admin-offwhite font-sans text-admin-charcoal">
		<!-- Mobile Header -->
		<div
			class="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-admin-stone bg-admin-coolgray p-4 lg:hidden"
		>
			<div class="flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-admin-stone bg-admin-offwhite shadow-sm"
				>
					<img src="/favicon.png" alt="Logo" class="h-full w-full object-contain" />
				</div>
				<h1 class="text-xl font-bold text-admin-charcoal">Admin Panel</h1>
			</div>
			<button
				onclick={toggleMobileMenu}
				class="rounded-lg p-2 text-admin-charcoal hover:bg-admin-stone/20"
				aria-label="Toggle Menu"
			>
				{#if isMobileMenuOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>

		<!-- Sidebar overlay -->
		{#if isMobileMenuOpen}
			<button
				onclick={toggleMobileMenu}
				class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
				aria-label="Close Menu"
			></button>
		{/if}

		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-admin-stone bg-admin-coolgray transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 {isMobileMenuOpen
				? 'translate-x-0'
				: '-translate-x-full'}"
		>
			<div class="flex items-center gap-3 p-6">
				<div
					class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-admin-stone bg-admin-offwhite shadow-sm"
				>
					<img src="/favicon.png" alt="Logo" class="h-full w-full object-contain" />
				</div>
				<h1 class="text-2xl font-bold text-admin-charcoal">Admin Panel</h1>
			</div>

			<nav class="mt-4 flex-grow space-y-2 px-4">
				{#each menuItems as item (item.path)}
					<a
						href={item.path}
						class="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] {page
							.url.pathname === item.path
							? 'border border-admin-taupe bg-admin-taupe/20 text-admin-charcoal'
							: 'text-admin-charcoal/70 hover:bg-admin-stone/50 hover:text-admin-charcoal'}"
					>
						<item.icon size={20} class="transition-transform duration-200 group-hover:scale-110" />
						<span class="font-medium">{item.name}</span>
					</a>
				{/each}
			</nav>

			<div class="border-t border-admin-stone p-4">
				{#if $user}
					<div class="mb-4 px-4">
						<p class="text-[10px] font-bold tracking-wider text-admin-charcoal/40 uppercase">
							Logged in as
						</p>
						<p class="truncate text-sm font-medium text-admin-charcoal">
							{$user.email}
						</p>
					</div>
				{/if}
				<button
					onclick={handleLogout}
					class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-admin-charcoal/70 transition-all duration-200 hover:bg-admin-clay/10 hover:text-admin-clay"
				>
					<LogOut size={20} />
					<span class="font-medium">Logout</span>
				</button>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-grow overflow-y-auto p-4 pt-20 md:p-8 lg:pt-8">
			<div class="mx-auto max-w-6xl">
				{@render children()}
			</div>
		</main>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-admin-offwhite">
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-admin-clay border-t-transparent"
		></div>
	</div>
{/if}

<style>
	:global(body) {
		background-color: var(--color-admin-offwhite);
	}
</style>
