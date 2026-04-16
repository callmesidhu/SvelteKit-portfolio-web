<script lang="ts">
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { user } from '$lib/auth';
	import { Rocket } from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	$effect(() => {
		if ($user) {
			goto('/admin');
		}
	});

	const handleLogin = async (e: Event) => {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			await signInWithEmailAndPassword(auth, email, password);
			goto('/admin');
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
	<div class="w-full max-w-md rounded-2xl border border-violet-900/30 bg-[#121212] p-8 shadow-2xl">
		<div class="mb-8 flex flex-col items-center">
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-600/30 bg-violet-600/20"
			>
				<Rocket class="text-violet-400" size={32} />
			</div>
			<h1 class="text-3xl font-bold text-white">Welcome Back</h1>
			<p class="mt-2 text-gray-400">Login to your portfolio admin</p>
		</div>

		<form onsubmit={handleLogin} class="space-y-6">
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-gray-400">Email Address</label
				>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-violet-600 focus:outline-none"
					placeholder="admin@example.com"
				/>
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-gray-400">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all focus:ring-2 focus:ring-violet-600 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			{#if error}
				<div class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
					{error}
				</div>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-xl bg-violet-600 py-3 font-bold text-white shadow-lg shadow-violet-600/20 transition-all duration-200 hover:bg-violet-700 disabled:opacity-50"
			>
				{loading ? 'Logging in...' : 'Login'}
			</button>
		</form>
	</div>
</div>
