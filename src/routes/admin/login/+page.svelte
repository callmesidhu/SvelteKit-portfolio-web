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
			console.error('Login error:', err.code, err.message);
			switch (err.code) {
				case 'auth/invalid-credential':
				case 'auth/wrong-password':
				case 'auth/user-not-found':
					error = 'Invalid email or password. Please try again.';
					break;
				case 'auth/too-many-requests':
					error = 'Too many failed attempts. Access is temporarily disabled. Please try again later.';
					break;
				case 'auth/network-request-failed':
					error = 'Network error. Please check your internet connection.';
					break;
				default:
					error = 'An unexpected error occurred. Please try again.';
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-admin-offwhite p-4">
	<div class="w-full max-w-md rounded-2xl border border-admin-stone bg-admin-coolgray p-8 shadow-2xl">
		<div class="mb-8 flex flex-col items-center">
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-admin-taupe/30 bg-admin-taupe/20"
			>
				<Rocket class="text-admin-clay" size={32} />
			</div>
			<h1 class="text-3xl font-bold text-admin-charcoal">callmesidhu@xyphx.admin</h1>
			<p class="mt-2 text-admin-charcoal/70">Login to your portfolio admin</p>
		</div>

		<form onsubmit={handleLogin} class="space-y-6">
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-admin-charcoal/70">Email Address</label
				>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full rounded-xl border border-admin-stone bg-admin-offwhite px-4 py-3 text-admin-charcoal transition-all focus:ring-2 focus:ring-admin-clay focus:outline-none"
					placeholder="admin@example.com"
				/>
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-admin-charcoal/70">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full rounded-xl border border-admin-stone bg-admin-offwhite px-4 py-3 text-admin-charcoal transition-all focus:ring-2 focus:ring-admin-clay focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			{#if error}
				<div
					class="animate-in fade-in zoom-in-95 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600"
				>
					<div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">!</div>
					{error}
				</div>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-xl bg-admin-clay py-3 font-bold text-white shadow-lg shadow-admin-clay/20 transition-all duration-200 hover:bg-[#A37B60] disabled:opacity-50"
			>
				{loading ? 'Logging in...' : 'Login'}
			</button>
		</form>
	</div>
</div>
