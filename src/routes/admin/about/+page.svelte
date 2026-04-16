<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import { User, Save, CheckCircle, XCircle } from 'lucide-svelte';

	let aboutText = $state('');
	let loading = $state(true);
	let status = $state('');
	let error = $state('');

	const docRef = doc(db, 'about', 'zPae0pmZUUI8p6dmga76');

	onMount(async () => {
		try {
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				aboutText = data.content;
			} else {
				aboutText = '';
			}
		} catch (err) {
			console.error('Error fetching about:', err);
			error = 'Failed to fetch about content.';
		} finally {
			loading = false;
		}
	});

	const updateAbout = async () => {
		try {
			status = 'saving';
			await updateDoc(docRef, {
				content: aboutText
			});
			status = 'saved';
			setTimeout(() => (status = ''), 3000);
		} catch (err) {
			console.error('Error updating about:', err);
			status = 'error';
			setTimeout(() => (status = ''), 3000);
		}
	};
</script>

<div class="mx-auto max-w-4xl space-y-8">
	<header class="flex items-end justify-between">
		<div>
			<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
				<User class="text-violet-400" />
				Edit About Section
			</h1>
			<p class="mt-2 text-gray-400">
				Update the text that appears in your portfolio's about section.
			</p>
		</div>

		<button
			onclick={updateAbout}
			disabled={status === 'saving'}
			class="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 disabled:opacity-50"
		>
			{#if status === 'saving'}
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
				></div>
				Saving...
			{:else}
				<Save size={18} />
				Save Changes
			{/if}
		</button>
	</header>

	{#if loading}
		<div
			class="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-violet-900/20 bg-[#121212] p-12"
		>
			<div
				class="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"
			></div>
			<p class="text-gray-400">Fetching current data...</p>
		</div>
	{:else}
			<div class="space-y-2 rounded-2xl border border-violet-900/20 bg-[#121212] p-8 shadow-xl">
			<label for="about-content" class="text-sm font-medium text-gray-400">About Content</label>
			<textarea
				id="about-content"
				rows={16}
				class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] p-6 text-lg leading-relaxed text-gray-200 placeholder-gray-600 transition-all focus:border-transparent focus:ring-2 focus:ring-violet-600 focus:outline-none"
				bind:value={aboutText}
				placeholder="Write about yourself, your skills, and your passion..."
			></textarea>

			<div class="mt-6 flex items-center justify-between">
				<p class="text-sm text-gray-500 italic">
					Tip: Use Markdown for better formatting if your frontend supports it.
				</p>

				{#if status === 'saved'}
					<div
						class="animate-in fade-in slide-in-from-right-4 flex items-center gap-2 font-medium text-emerald-400"
					>
						<CheckCircle size={18} />
						Success! Saved changes.
					</div>
				{:else if status === 'error'}
					<div
						class="animate-in fade-in slide-in-from-right-4 flex items-center gap-2 font-medium text-red-400"
					>
						<XCircle size={18} />
						Failed to save changes.
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
