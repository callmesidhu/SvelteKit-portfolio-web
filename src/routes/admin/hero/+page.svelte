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
	let status = $state('');

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
		status = '';

		try {
			const nextOrder = roles.length > 0 ? Math.max(...roles.map((r) => r.order)) + 1 : 1;

			await addDoc(collection(db, 'roles'), {
				role: newRole.trim(),
				order: nextOrder
			});

			status = '✅ Role added!';
			newRole = '';
			await fetchRoles();
		} catch (err) {
			console.error('Error adding role:', err);
			status = '❌ Error adding role';
		} finally {
			adding = false;
			setTimeout(() => (status = ''), 3000);
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
		<h1 class="flex items-center gap-3 text-3xl font-bold text-admin-charcoal">
			<Rocket class="text-admin-clay" />
			Manage Hero Roles
		</h1>
		<p class="mt-2 text-admin-charcoal/70">These roles will cycle through your hero section text.</p>
	</header>

	<!-- Add Role Form -->
	<div class="rounded-2xl border border-admin-stone bg-admin-coolgray p-6 shadow-xl">
		<div class="flex flex-col gap-4 sm:flex-row">
			<div class="relative flex-grow">
				<label for="new-role" class="sr-only">New Role</label>
				<input
					id="new-role"
					type="text"
					class="w-full rounded-xl border border-admin-stone bg-admin-offwhite px-4 py-4 text-admin-charcoal placeholder-admin-charcoal/40 transition-all focus:ring-2 focus:ring-admin-clay focus:outline-none"
					placeholder="e.g., Full Stack Developer"
					bind:value={newRole}
					onkeydown={(e) => e.key === 'Enter' && addRole()}
				/>
			</div>
			<button
				onclick={addRole}
				disabled={adding || !newRole.trim()}
				class="flex items-center justify-center gap-2 rounded-xl bg-admin-clay px-8 py-4 font-bold text-white transition-all hover:bg-[#A37B60] disabled:opacity-50 sm:py-0"
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

		{#if status}
			<p
				class="mt-4 animate-in fade-in slide-in-from-top-2 text-center text-sm font-medium {status.includes('✅')
					? 'text-emerald-600'
					: 'text-red-600'} sm:text-left"
			>
				{status}
			</p>
		{/if}
	</div>

	<!-- Role List -->
	<div class="space-y-4">
		{#if loading}
			{#each Array(3) as _, i (i)}
				<div class="h-20 animate-pulse rounded-2xl border border-admin-stone bg-admin-coolgray"></div>
			{/each}
		{:else if roles.length === 0}
			<div class="rounded-2xl border border-admin-stone bg-admin-coolgray py-12 text-center">
				<p class="text-admin-charcoal/50">No roles added yet.</p>
			</div>
		{:else}
			{#each roles as role (role.id)}
				<div
					class="group flex items-center justify-between rounded-2xl border border-admin-stone bg-admin-coolgray p-5 transition-all duration-300 hover:border-admin-taupe/50 hover:bg-admin-stone/10"
				>
					<div class="flex items-center gap-4">
						<div class="cursor-grab text-admin-charcoal/40 hover:text-admin-charcoal/60 active:cursor-grabbing">
							<GripVertical size={20} />
						</div>
						<span class="text-lg font-medium text-admin-charcoal">{role.role}</span>
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
