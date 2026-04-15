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
  let newRole = $state("");
  let loading = $state(true);
  let adding = $state(false);

  const fetchRoles = async () => {
    loading = true;
    try {
      const querySnapshot = await getDocs(collection(db, "roles"));
      const fetchedRoles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Role[];
      fetchedRoles.sort((a, b) => a.order - b.order); 
      roles = fetchedRoles;
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      loading = false;
    }
  };

  const addRole = async () => {
    if (!newRole.trim()) return;
    adding = true;

    try {
      const nextOrder = roles.length > 0 ? Math.max(...roles.map(r => r.order)) + 1 : 1;

      await addDoc(collection(db, "roles"), {
        role: newRole.trim(),
        order: nextOrder,
      });

      newRole = "";
      await fetchRoles();
    } catch (err) {
      console.error("Error adding role:", err);
    } finally {
      adding = false;
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteDoc(doc(db, "roles", id));
      roles = roles.filter(r => r.id !== id);
    } catch (err) {
      console.error("Error deleting role:", err);
    }
  };

  onMount(() => {
    fetchRoles();
  });
</script>

<div class="max-w-3xl mx-auto space-y-8">
  <header>
    <h1 class="text-3xl font-bold text-white flex items-center gap-3">
      <Rocket class="text-violet-400" />
      Manage Hero Roles
    </h1>
    <p class="text-gray-400 mt-2">These roles will cycle through your hero section text.</p>
  </header>

  <!-- Add Role Form -->
  <div class="bg-[#121212] border border-violet-900/20 rounded-2xl p-6 shadow-xl">
    <div class="flex gap-4">
      <div class="relative flex-grow">
        <input
          type="text"
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all"
          placeholder="e.g., Full Stack Developer"
          bind:value={newRole}
          onkeydown={(e) => e.key === 'Enter' && addRole()}
        />
      </div>
      <button
        onclick={addRole}
        disabled={adding || !newRole.trim()}
        class="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-8 rounded-xl font-bold transition-all flex items-center gap-2"
      >
        {#if adding}
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
      {#each Array(3) as _}
        <div class="h-20 bg-[#121212] border border-violet-900/10 rounded-2xl animate-pulse"></div>
      {/each}
    {:else if roles.length === 0}
      <div class="text-center py-12 bg-[#121212] border border-violet-900/20 rounded-2xl">
        <p class="text-gray-500">No roles added yet.</p>
      </div>
    {:else}
      {#each roles as role}
        <div class="group flex items-center justify-between bg-[#121212] border border-violet-900/20 rounded-2xl p-5 hover:border-violet-600/30 hover:bg-[#1a1a1a] transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="text-gray-600 cursor-grab active:cursor-grabbing hover:text-gray-400">
              <GripVertical size={20} />
            </div>
            <span class="text-lg font-medium text-gray-200">{role.role}</span>
          </div>
          
          <button
            onclick={() => handleDeleteRole(role.id)}
            class="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            aria-label="Delete role"
          >
            <Trash2 size={18} />
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>
