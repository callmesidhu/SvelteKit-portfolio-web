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
			<h1 class="flex items-center gap-3 text-3xl font-bold text-admin-charcoal">
				<User class="text-admin-clay" />
				Edit About Section
			</h1>
			<p class="mt-2 text-admin-charcoal/70">
				Update the text that appears in your portfolio's about section.
			</p>
		</div>

		<button
			onclick={updateAbout}
			disabled={status === 'saving'}
			class="flex items-center gap-2 rounded-xl bg-admin-clay px-6 py-3 font-bold text-white shadow-lg shadow-admin-clay/20 transition-all hover:bg-[#A37B60] disabled:opacity-50"
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
			class="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-admin-stone bg-admin-coolgray p-12"
		>
			<div
				class="h-10 w-10 animate-spin rounded-full border-4 border-admin-clay border-t-transparent"
			></div>
			<p class="text-admin-charcoal/70">Fetching current data...</p>
		</div>
	{:else}
			<div class="space-y-2 rounded-2xl border border-admin-stone bg-admin-coolgray p-8 shadow-xl">
			<label for="about-content" class="text-sm font-medium text-admin-charcoal/70">About Content</label>
			<textarea
				id="about-content"
				rows={16}
				class="w-full rounded-xl border border-admin-stone bg-admin-offwhite p-6 text-lg leading-relaxed text-admin-charcoal placeholder-admin-charcoal/40 transition-all focus:border-transparent focus:ring-2 focus:ring-admin-clay focus:outline-none"
				bind:value={aboutText}
				placeholder="Write about yourself, your skills, and your passion..."
			></textarea>

			<div class="mt-6 flex items-center justify-between">
				<p class="text-sm text-admin-charcoal/50 italic">
					Tip: Use Markdown for better formatting if your frontend supports it.
				</p>

				{#if status === 'saved'}
					<div
						class="animate-in fade-in slide-in-from-right-4 flex items-center gap-2 font-medium text-emerald-600"
					>
						<CheckCircle size={18} />
						Success! Saved changes.
					</div>
				{:else if status === 'error'}
					<div
						class="animate-in fade-in slide-in-from-right-4 flex items-center gap-2 font-medium text-red-600"
					>
						<XCircle size={18} />
						Failed to save changes.
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
