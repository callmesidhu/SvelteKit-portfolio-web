<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { Rocket, Trash2, Plus, GripVertical } from 'lucide-svelte';

	interface Role {
		id: string;
		role: string;
		order: number;
	}

	let roles = $state<Role[]>([]);
	let newRole = $state('');
	let loading = $state(true);
	let adding = $state(false);

	const fetchRoles = async () => {
		loading = true;
		try {
			const querySnapshot = await getDocs(collection(db, 'roles'));
			const fetchedRoles = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			})) as Role[];
			fetchedRoles.sort((a, b) => a.order - b.order);
			roles = fetchedRoles;
		} catch (err) {
			console.error('Error fetching roles:', err);
		} finally {
			loading = false;
		}
	};

	const addRole = async () => {
		if (!newRole.trim()) return;
		adding = true;

		try {
			const nextOrder = roles.length > 0 ? Math.max(...roles.map((r) => r.order)) + 1 : 1;

			await addDoc(collection(db, 'roles'), {
				role: newRole.trim(),
				order: nextOrder
			});

			newRole = '';
			await fetchRoles();
		} catch (err) {
			console.error('Error adding role:', err);
		} finally {
			adding = false;
		}
	};

	const handleDeleteRole = async (id: string) => {
		try {
			await deleteDoc(doc(db, 'roles', id));
			roles = roles.filter((r) => r.id !== id);
		} catch (err) {
			console.error('Error deleting role:', err);
		}
	};

	onMount(() => {
		fetchRoles();
	});
</script>

<div class="mx-auto max-w-3xl space-y-8">
	<header>
		<h1 class="flex items-center gap-3 text-3xl font-bold text-white">
			<Rocket class="text-violet-400" />
			Manage Hero Roles
		</h1>
		<p class="mt-2 text-gray-400">These roles will cycle through your hero section text.</p>
	</header>

	<!-- Add Role Form -->
	<div class="rounded-2xl border border-violet-900/20 bg-[#121212] p-6 shadow-xl">
		<div class="flex gap-4">
			<div class="relative flex-grow">
				<label for="new-role" class="sr-only">New Role</label>
				<input
					id="new-role"
					type="text"
					class="w-full rounded-xl border border-violet-900/30 bg-[#1a1a1a] px-4 py-4 text-white placeholder-gray-600 transition-all focus:ring-2 focus:ring-violet-600 focus:outline-none"
					placeholder="e.g., Full Stack Developer"
					bind:value={newRole}
					onkeydown={(e) => e.key === 'Enter' && addRole()}
				/>
			</div>
			<button
				onclick={addRole}
				disabled={adding || !newRole.trim()}
				class="flex items-center gap-2 rounded-xl bg-violet-600 px-8 font-bold text-white transition-all hover:bg-violet-700 disabled:opacity-50"
			>
				{#if adding}
					<div
						class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				{:else}
					<Plus size={20} />
					Add Role
				{/if}
			</button>
		</div>
	</div>

	<!-- Role List -->
	<div class="space-y-4">
		{#if loading}
			{#each Array(3) as _, i (i)}
				<div class="h-20 animate-pulse rounded-2xl border border-violet-900/10 bg-[#121212]"></div>
			{/each}
		{:else if roles.length === 0}
			<div class="rounded-2xl border border-violet-900/20 bg-[#121212] py-12 text-center">
				<p class="text-gray-500">No roles added yet.</p>
			</div>
		{:else}
			{#each roles as role (role.id)}
				<div
					class="group flex items-center justify-between rounded-2xl border border-violet-900/20 bg-[#121212] p-5 transition-all duration-300 hover:border-violet-600/30 hover:bg-[#1a1a1a]"
				>
					<div class="flex items-center gap-4">
						<div class="cursor-grab text-gray-600 hover:text-gray-400 active:cursor-grabbing">
							<GripVertical size={20} />
						</div>
						<span class="text-lg font-medium text-gray-200">{role.role}</span>
					</div>

					<button
						onclick={() => handleDeleteRole(role.id)}
						class="rounded-lg p-2 text-gray-500 transition-all hover:bg-red-400/10 hover:text-red-400"
						aria-label="Delete role"
					>
						<Trash2 size={18} />
					</button>
				</div>
			{/each}
		{/if}
	</div>
</div>
