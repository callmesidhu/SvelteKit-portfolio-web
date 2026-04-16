<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
	import { Code, Trash2, Plus, ImageIcon, Layers } from 'lucide-svelte';

	const tabs = [
		{ id: 'languages', label: 'Languages' },
		{ id: 'frameworks', label: 'Frameworks' },
		{ id: 'technologies', label: 'Technologies' }
	];

	interface SkillItem {
		docId: string;
		id: number;
		name: string;
		src: string;
	}

	let activeTab = $state('languages');
	let items = $state<SkillItem[]>([]);
	let name = $state('');
	let src = $state('');
	let status = $state('');
	let loading = $state(true);
	let adding = $state(false);

	const fetchItems = async () => {
		loading = true;
		try {
			const q = query(collection(db, activeTab), orderBy('id', 'asc'));
			const querySnapshot = await getDocs(q);
			items = querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }) as SkillItem);
		} catch (error) {
			console.error('Error fetching items:', error);
		} finally {
			loading = false;
		}
	};

	$effect(() => {
		fetchItems();
		name = '';
		src = '';
		status = '';
	});

	const handleAdd = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!name.trim() || !src.trim()) {
			status = '⚠️ Please fill both fields.';
			return;
		}

		adding = true;
		try {
			const nextId = items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
			await addDoc(collection(db, activeTab), {
				id: nextId,
				name: name.trim(),
				src: src.trim()
			});
			status = '✅ Added successfully!';
			name = '';
			src = '';
			await fetchItems();
		} catch (error) {
			console.error('Error adding item:', error);
			status = '❌ Failed to add item!';
		} finally {
			adding = false;
			setTimeout(() => (status = ''), 3000);
		}
	};

	const handleDelete = async (docId: string) => {
		if (!confirm('Delete this skill?')) return;
		try {
			await deleteDoc(doc(db, activeTab, docId));
			items = items.filter((i) => i.docId !== docId);
		} catch (error) {
			console.error('Error deleting item:', error);
		}
	};
</script>

<div class="mx-auto max-w-5xl space-y-8">
	<header>
		<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
			<Code class="text-violet-400" />
			Skill Management
		</h1>
		<p class="mt-2 text-gray-400">Manage your tech stack categories and icons.</p>
	</header>

	<!-- Tabs -->
	<div class="flex w-fit gap-2 rounded-xl border border-violet-900/20 bg-[#121212] p-1">
		{#each tabs as tab (tab.id)}
			<button
				onclick={() => (activeTab = tab.id)}
				class="rounded-lg px-6 py-2 font-medium transition-all {activeTab === tab.id
					? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
					: 'text-gray-500 hover:text-gray-300'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Add Skill Form -->
	<div class="rounded-2xl border border-violet-900/20 bg-[#121212] p-8 shadow-2xl">
		<form onsubmit={handleAdd} class="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
			<div class="space-y-2">
				<label for="skill-name" class="text-sm font-medium text-gray-400">Skill Name</label>
				<input
					id="skill-name"
					type="text"
					placeholder="e.g., JavaScript"
					bind:value={name}
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2">
				<label for="icon-url" class="text-sm font-medium text-gray-400">Icon URL (SVG/PNG)</label>
				<input
					id="icon-url"
					type="text"
					placeholder="https://icon-url.com"
					bind:value={src}
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<button
				type="submit"
				disabled={adding}
				class="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-violet-600 font-bold text-white transition-all hover:bg-violet-700 disabled:opacity-50"
			>
				{#if adding}
					<div
						class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				{:else}
					<Plus size={20} />
					Add to {tabs.find((t) => t.id === activeTab)?.label}
				{/if}
			</button>
		</form>

		{#if status}
			<p
				class="mt-4 text-center text-sm font-medium {status.includes('✅')
					? 'text-emerald-400'
					: 'text-red-400'}"
			>
				{status}
			</p>
		{/if}
	</div>

	<!-- Skills Grid -->
	<div class="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
		{#if loading}
			{#each Array(6) as _}
				<div class="h-40 animate-pulse rounded-2xl border border-violet-900/10 bg-[#121212]"></div>
			{/each}
		{:else if items.length === 0}
			<div
				class="col-span-full rounded-2xl border border-violet-900/20 bg-[#121212] py-20 text-center"
			>
				<Layers class="mx-auto mb-4 text-gray-600" size={48} />
				<p class="text-gray-500">No {activeTab} added yet.</p>
			</div>
		{:else}
			{#each items as item (item.docId)}
				<div
					class="group relative flex flex-col items-center justify-center rounded-2xl border border-violet-900/20 bg-[#121212] p-6 transition-all duration-300 hover:border-violet-600/40 hover:bg-[#1a1a1a]"
				>
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center transition-transform duration-300 group-hover:scale-110"
					>
						<img src={item.src} alt={item.name} class="max-h-full max-w-full object-contain" />
					</div>
					<p class="text-center text-sm font-bold text-gray-200">{item.name}</p>
					<span class="mt-1 font-mono text-[10px] text-gray-600">ID: {item.id}</span>

					<button
						onclick={() => handleDelete(item.docId)}
						class="absolute top-2 right-2 rounded-lg p-2 text-gray-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
						aria-label="Delete skill"
					>
						<Trash2 size={14} />
					</button>
				</div>
			{/each}
		{/if}
	</div>
</div>
