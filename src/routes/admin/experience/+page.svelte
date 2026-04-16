<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
	import { Briefcase, Trash2, Plus, MapPin, Calendar, Building, Tag } from 'lucide-svelte';

	interface Experience {
		id: string;
		title: string;
		company: string;
		type: string;
		duration: string;
		location: string;
		description: string;
		skills: string[];
		rank: number;
	}

	let experiences = $state<Experience[]>([]);
	let title = $state('');
	let company = $state('');
	let type = $state('');
	let duration = $state('');
	let location = $state('');
	let description = $state('');
	let skills = $state('');
	let rank = $state('');

	let status = $state('');
	let loading = $state(true);
	let adding = $state(false);

	const fetchExperience = async () => {
		loading = true;
		try {
			const q = query(collection(db, 'experience'), orderBy('rank', 'asc'));
			const querySnapshot = await getDocs(q);
			experiences = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Experience);
		} catch (error) {
			console.error('Error fetching experience:', error);
		} finally {
			loading = false;
		}
	};

	onMount(fetchExperience);

	const handleAdd = async (e: SubmitEvent) => {
		e.preventDefault();
		if (experiences.length >= 6) {
			status = '⚠️ Max 6 entries allowed.';
			return;
		}

		if (!title || !company || !rank) {
			status = '⚠️ Title, Company, and Rank are required.';
			return;
		}

		adding = true;
		try {
			const newItem = {
				title,
				company,
				type,
				duration,
				location,
				description,
				skills: skills
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean),
				rank: parseInt(rank || '99')
			};

			await addDoc(collection(db, 'experience'), newItem);
			status = '✅ Added successfully!';
			// Reset form
			title = '';
			company = '';
			type = '';
			duration = '';
			location = '';
			description = '';
			skills = '';
			rank = '';
			await fetchExperience();
		} catch (error) {
			console.error('Error adding experience:', error);
			status = '❌ Failed to add.';
		} finally {
			adding = false;
			setTimeout(() => (status = ''), 3000);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Delete this experience?')) return;
		try {
			await deleteDoc(doc(db, 'experience', id));
			experiences = experiences.filter((e) => e.id !== id);
		} catch (error) {
			console.error('Error deleting experience:', error);
		}
	};
</script>

<div class="mx-auto max-w-6xl space-y-10 pb-20">
	<header>
		<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
			<Briefcase class="text-violet-400" />
			Work Experience
		</h1>
		<p class="mt-2 text-gray-400">Manage your career timeline (Max 6 entries).</p>
	</header>

	<!-- Add Experience Form -->
	<div class="rounded-2xl border border-violet-900/20 bg-[#121212] p-8 shadow-2xl">
		<h2 class="mb-6 text-xl font-bold text-gray-200">New Experience</h2>
		<form onsubmit={handleAdd} class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="space-y-2">
				<label for="exp-title" class="flex items-center gap-2 text-sm font-medium text-gray-400"
					><Building size={14} /> Title *</label
				>
				<input
					id="exp-title"
					type="text"
					bind:value={title}
					placeholder="e.g. Senior Dev"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2">
				<label for="exp-company" class="flex items-center gap-2 text-sm font-medium text-gray-400"
					><Briefcase size={14} /> Company *</label
				>
				<input
					id="exp-company"
					type="text"
					bind:value={company}
					placeholder="e.g. Google"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2">
				<label for="exp-rank" class="text-sm font-medium text-gray-400">Order/Rank *</label>
				<input
					id="exp-rank"
					type="number"
					bind:value={rank}
					placeholder="1"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2">
				<label for="exp-type" class="flex items-center gap-2 text-sm font-medium text-gray-400"
					><Tag size={14} /> Type</label
				>
				<input
					id="exp-type"
					type="text"
					bind:value={type}
					placeholder="Full-time / Internship"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2">
				<label for="exp-duration" class="flex items-center gap-2 text-sm font-medium text-gray-400"
					><Calendar size={14} /> Duration</label
				>
				<input
					id="exp-duration"
					type="text"
					bind:value={duration}
					placeholder="Jan 2023 - Present"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2">
				<label for="exp-location" class="flex items-center gap-2 text-sm font-medium text-gray-400"
					><MapPin size={14} /> Location</label
				>
				<input
					id="exp-location"
					type="text"
					bind:value={location}
					placeholder="Remote / City"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2 lg:col-span-2">
				<label for="exp-skills" class="text-sm font-medium text-gray-400">Skills (Comma separated)</label>
				<input
					id="exp-skills"
					type="text"
					bind:value={skills}
					placeholder="React, Node.js, AWS"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>
			<div class="space-y-2">
				<label for="exp-description" class="text-sm font-medium text-gray-400">Description</label>
				<input
					id="exp-description"
					type="text"
					bind:value={description}
					placeholder="Short summary..."
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>

			<div class="pt-4 lg:col-span-3">
				<button
					type="submit"
					disabled={adding || experiences.length >= 6}
					class="flex items-center gap-2 rounded-xl bg-violet-600 px-10 py-4 font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 disabled:opacity-50"
				>
					{#if adding}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
					{:else}
						<Plus size={20} />
						Add Experience
					{/if}
				</button>
				{#if status}
					<p
						class="mt-4 text-sm font-medium {status.includes('✅')
							? 'text-emerald-400'
							: 'text-amber-400'}"
					>
						{status}
					</p>
				{/if}
			</div>
		</form>
	</div>

	<!-- Experience List -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		{#if loading}
			{#each Array(2) as _, i (i)}
				<div class="h-64 animate-pulse rounded-2xl border border-violet-900/10 bg-[#121212]"></div>
			{/each}
		{:else}
			{#each experiences as exp (exp.id)}
				<div
					class="group relative rounded-2xl border border-violet-900/20 bg-[#121212] p-8 shadow-xl transition-all duration-300 hover:border-violet-600/30"
				>
					<div class="mb-4 flex items-start justify-between">
						<div>
							<h3
								class="text-xl font-bold text-white transition-colors group-hover:text-violet-400"
							>
								{exp.title}
							</h3>
							<p class="mt-1 flex items-center gap-2 font-medium text-violet-400">
								<Building size={14} />
								{exp.company}
							</p>
						</div>
						<div
							class="rounded-full border border-violet-600/20 bg-violet-600/10 px-3 py-1 text-xs font-bold text-violet-400"
						>
							Rank {exp.rank}
						</div>
					</div>

					<div class="mb-6 grid grid-cols-2 gap-4">
						<div class="flex items-center gap-2 text-sm text-gray-500">
							<Calendar size={14} />
							{exp.duration || 'N/A'}
						</div>
						<div class="flex items-center gap-2 text-sm text-gray-500">
							<MapPin size={14} />
							{exp.location || 'N/A'}
						</div>
					</div>

					<p class="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-400">
						{exp.description || 'No description provided.'}
					</p>

					<div class="mb-8 flex flex-wrap gap-2">
						{#each exp.skills as skill (skill)}
							<span
								class="rounded border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] text-gray-400"
							>
								{skill}
							</span>
						{/each}
					</div>

					<button
						onclick={() => handleDelete(exp.id)}
						class="absolute right-6 bottom-6 rounded-lg p-2 text-gray-600 transition-all hover:bg-red-400/10 hover:text-red-400"
						aria-label="Delete experience"
					>
						<Trash2 size={18} />
					</button>
				</div>
			{/each}
		{/if}
	</div>
</div>
