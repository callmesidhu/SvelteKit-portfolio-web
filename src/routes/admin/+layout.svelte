<script lang="ts">
	import { user } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { LayoutDashboard, User, Briefcase, Rocket, Star, Code, LogOut } from 'lucide-svelte';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';

	let { children } = $props();

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
	<div class="flex min-h-screen bg-[#0a0a0a] font-sans text-white">
		<!-- Sidebar -->
		<aside
			class="sticky top-0 flex h-screen w-64 flex-col border-r border-violet-900/30 bg-[#121212]"
		>
			<div class="p-6">
				<h1
					class="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-2xl font-bold text-transparent"
				>
					Admin Panel
				</h1>
			</div>

			<nav class="mt-4 flex-grow space-y-2 px-4">
				{#each menuItems as item (item.path)}
					<a
						href={item.path}
						class="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 {page
							.url.pathname === item.path
							? 'border border-violet-600/30 bg-violet-600/20 text-violet-400'
							: 'text-gray-400 hover:bg-white/5 hover:text-white'}"
					>
						<item.icon size={20} />
						<span class="font-medium">{item.name}</span>
					</a>
				{/each}
			</nav>

			<div class="border-t border-violet-900/20 p-4">
				<button
					onclick={handleLogout}
					class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
				>
					<LogOut size={20} />
					<span class="font-medium">Logout</span>
				</button>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-grow overflow-y-auto p-8">
			<div class="mx-auto max-w-6xl">
				{@render children()}
			</div>
		</main>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"
		></div>
	</div>
{/if}

<style>
	:global(body) {
		background-color: #0a0a0a;
	}
</style>
