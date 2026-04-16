<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import {
		collection,
		doc,
		onSnapshot,
		runTransaction,
		addDoc,
		deleteDoc,
		query,
		orderBy
	} from 'firebase/firestore';
	import {
		Star,
		Plus,
		Trash2,
		ExternalLink,
		Image as ImageIcon,
		Code,
		Type,
		Link as LinkIcon
	} from 'lucide-svelte';

	interface Project {
		docId: string;
		id: number;
		title: string;
		tech: string;
		description: string;
		link: string;
		image: string;
	}

	let projects = $state<Project[]>([]);
	let title = $state('');
	let tech = $state('');
	let description = $state('');
	let link = $state('');
	let image = $state('');
	let loading = $state(true);
	let adding = $state(false);

	onMount(() => {
		const q = query(collection(db, 'projects'), orderBy('id', 'asc'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const projArr: Project[] = [];
			snapshot.forEach((doc) => {
				projArr.push({ docId: doc.id, ...doc.data() } as Project);
			});
			projects = projArr;
			loading = false;
		});
		return () => unsubscribe();
	});

	const addProject = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!title || !tech) {
			alert('Title and Tech are required');
			return;
		}
		adding = true;

		try {
			await runTransaction(db, async (transaction) => {
				const counterRef = doc(db, 'counters', 'projects');
				const counterDoc = await transaction.get(counterRef);

				let newId = 1;
				if (counterDoc.exists()) {
					newId = counterDoc.data().current + 1;
				}

				const newProject = {
					id: newId,
					title,
					tech,
					description,
					link,
					image,
					createdAt: new Date().toISOString()
				};

				const projectsCol = collection(db, 'projects');
				await addDoc(projectsCol, newProject);

				transaction.set(counterRef, { current: newId });
			});

			title = '';
			tech = '';
			description = '';
			link = '';
			image = '';
		} catch (e) {
			console.error('Failed to add project:', e);
			alert('Error adding project');
		} finally {
			adding = false;
		}
	};

	const deleteProject = async (docId: string) => {
		if (!confirm('Are you sure you want to delete this project?')) return;
		try {
			await deleteDoc(doc(db, 'projects', docId));
		} catch (e) {
			console.error('Failed to delete project:', e);
		}
	};
</script>

<div class="space-y-10 pb-20">
	<header>
		<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
			<Star class="text-violet-400" />
			Project Portfolio
		</h1>
		<p class="mt-2 text-gray-400">Showcase your best work to the world.</p>
	</header>

	<!-- Add Project Form -->
	<div class="rounded-2xl border border-violet-900/20 bg-[#121212] p-8 shadow-2xl">
		<h2 class="mb-6 text-xl font-bold text-gray-200">Add New Project</h2>
		<form onsubmit={addProject} class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<label for="proj-title" class="flex items-center gap-2 text-sm font-medium text-gray-400">
					<Type size={14} /> Title *
				</label>
				<input
					id="proj-title"
					type="text"
					placeholder="e.g., E-commerce App"
					bind:value={title}
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
					required
				/>
			</div>

			<div class="space-y-2">
				<label for="proj-tech" class="flex items-center gap-2 text-sm font-medium text-gray-400">
					<Code size={14} /> Technologies *
				</label>
				<input
					id="proj-tech"
					type="text"
					placeholder="e.g., SvelteKit, Tailwind, Firebase"
					bind:value={tech}
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
					required
				/>
			</div>

			<div class="space-y-2 md:col-span-2">
				<label for="proj-desc" class="text-sm font-medium text-gray-400">Description</label>
				<textarea
					id="proj-desc"
					rows={3}
					placeholder="Briefly describe the project..."
					bind:value={description}
					class="w-full resize-none rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				></textarea>
			</div>

			<div class="space-y-2">
				<label for="proj-url" class="flex items-center gap-2 text-sm font-medium text-gray-400">
					<LinkIcon size={14} /> Project URL
				</label>
				<input
					id="proj-url"
					type="url"
					placeholder="https://your-project.com"
					bind:value={link}
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>

			<div class="space-y-2">
				<label for="proj-image" class="flex items-center gap-2 text-sm font-medium text-gray-400">
					<ImageIcon size={14} /> Cover Image URL
				</label>
				<input
					id="proj-image"
					type="url"
					placeholder="https://image-url.com"
					bind:value={image}
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-violet-600"
				/>
			</div>

			<div class="pt-4 md:col-span-2">
				<button
					type="submit"
					disabled={adding}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-12 py-4 font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 disabled:opacity-50 md:w-auto"
				>
					{#if adding}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Adding Project...
					{:else}
						<Plus size={20} />
						Add Project
					{/if}
				</button>
			</div>
		</form>
	</div>

	<!-- Projects Grid -->
	<section>
		<h2 class="mb-8 text-2xl font-bold text-gray-200">Active Projects ({projects.length})</h2>

		{#if loading}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _, i (i)}
					<div
						class="h-96 animate-pulse rounded-2xl border border-violet-900/10 bg-[#121212]"
					></div>
				{/each}
			</div>
		{:else if projects.length === 0}
			<div class="rounded-2xl border border-violet-900/20 bg-[#121212] py-20 text-center">
				<ImageIcon class="mx-auto mb-4 text-gray-600" size={48} />
				<p class="text-lg text-gray-500">No projects added yet.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each projects as proj (proj.docId)}
					<div
						class="group flex flex-col overflow-hidden rounded-2xl border border-violet-900/20 bg-[#121212] shadow-xl transition-all duration-300 hover:border-violet-600/30"
					>
						{#if proj.image}
							<div class="relative h-48 overflow-hidden">
								<img
									src={proj.image}
									alt={proj.title}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								<div
									class="absolute top-4 right-4 rounded bg-black/60 px-2 py-1 font-mono text-xs text-gray-300 backdrop-blur-md"
								>
									ID: {proj.id}
								</div>
							</div>
						{:else}
							<div
								class="flex h-48 items-center justify-center bg-violet-900/10 text-violet-900/30"
							>
								<ImageIcon size={48} />
							</div>
						{/if}

						<div class="flex flex-grow flex-col p-6">
							<h3
								class="mb-2 text-xl font-bold text-white transition-colors group-hover:text-violet-400"
							>
								{proj.title}
							</h3>
							<div class="mb-4 flex flex-wrap gap-2">
								{#each proj.tech.split(',') as t (t)}
									<span
										class="rounded border border-violet-600/20 bg-violet-600/10 px-2 py-1 text-[10px] font-bold tracking-wider text-violet-400 uppercase"
									>
										{t.trim()}
									</span>
								{/each}
							</div>
							<p class="mb-6 line-clamp-3 flex-grow text-sm text-gray-400">
								{proj.description || 'No description provided.'}
							</p>

							<div class="flex items-center justify-between border-t border-violet-900/10 pt-6">
								{#if proj.link}
									<a
										href={proj.link}
										target="_blank"
										rel="noreferrer"
										class="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white"
									>
										<ExternalLink size={14} /> Preview
									</a>
								{:else}
									<div></div>
								{/if}

								<button
									onclick={() => deleteProject(proj.docId)}
									class="rounded-lg p-2 text-gray-500 transition-all hover:bg-red-400/10 hover:text-red-400"
									aria-label="Delete project"
								>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
