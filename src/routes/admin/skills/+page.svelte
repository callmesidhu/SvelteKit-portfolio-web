<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy
  } from 'firebase/firestore';
  import { Code, Trash2, Plus, ImageIcon, Layers } from 'lucide-svelte';

  const tabs = [
    { id: 'languages', label: 'Languages' },
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'technologies', label: 'Technologies' },
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
      items = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() } as SkillItem));
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      loading = false;
    }
  };

  $effect(() => {
    fetchItems();
    name = ''; src = '';
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
      const nextId = items.length === 0 ? 1 : Math.max(...items.map(i => i.id)) + 1;
      await addDoc(collection(db, activeTab), {
        id: nextId,
        name: name.trim(),
        src: src.trim(),
      });
      status = '✅ Added successfully!';
      name = ''; src = '';
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      status = '❌ Failed to add item!';
    } finally {
      adding = false;
      setTimeout(() => status = '', 3000);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await deleteDoc(doc(db, activeTab, docId));
      items = items.filter(i => i.docId !== docId);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
</script>

<div class="space-y-8 max-w-5xl mx-auto">
  <header>
    <h1 class="text-3xl font-bold text-white flex items-center gap-3">
      <Code class="text-violet-400" />
      Skill Management
    </h1>
    <p class="text-gray-400 mt-2">Manage your tech stack categories and icons.</p>
  </header>

  <!-- Tabs -->
  <div class="flex gap-2 p-1 bg-[#121212] rounded-xl border border-violet-900/20 w-fit">
    {#each tabs as tab}
      <button
        onclick={() => activeTab = tab.id}
        class="px-6 py-2 rounded-lg font-medium transition-all {activeTab === tab.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-500 hover:text-gray-300'}"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- Add Skill Form -->
  <div class="bg-[#121212] border border-violet-900/20 rounded-2xl p-8 shadow-2xl">
    <form onsubmit={handleAdd} class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400">Skill Name</label>
        <input
          type="text"
          placeholder="e.g., JavaScript"
          bind:value={name}
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400">Icon URL (SVG/PNG)</label>
        <input
          type="text"
          placeholder="https://icon-url.com"
          bind:value={src}
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={adding}
        class="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white h-[52px] rounded-xl font-bold transition-all flex items-center justify-center gap-2"
      >
        {#if adding}
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        {:else}
          <Plus size={20} />
          Add to {tabs.find(t => t.id === activeTab)?.label}
        {/if}
      </button>
    </form>
    
    {#if status}
      <p class="mt-4 text-center text-sm font-medium {status.includes('✅') ? 'text-emerald-400' : 'text-red-400'}">
        {status}
      </p>
    {/if}
  </div>

  <!-- Skills Grid -->
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
    {#if loading}
      {#each Array(6) as _}
        <div class="h-40 bg-[#121212] border border-violet-900/10 rounded-2xl animate-pulse"></div>
      {/each}
    {:else if items.length === 0}
      <div class="col-span-full text-center py-20 bg-[#121212] border border-violet-900/20 rounded-2xl">
        <Layers class="mx-auto text-gray-600 mb-4" size={48} />
        <p class="text-gray-500">No {activeTab} added yet.</p>
      </div>
    {:else}
      {#each items as item}
        <div class="group relative bg-[#121212] border border-violet-900/20 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-violet-600/40 hover:bg-[#1a1a1a] transition-all duration-300">
          <div class="w-16 h-16 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <img src={item.src} alt={item.name} class="max-w-full max-h-full object-contain" />
          </div>
          <p class="text-sm font-bold text-gray-200 text-center">{item.name}</p>
          <span class="text-[10px] text-gray-600 mt-1 font-mono">ID: {item.id}</span>
          
          <button
            onclick={() => handleDelete(item.docId)}
            class="absolute top-2 right-2 p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
            aria-label="Delete skill"
          >
            <Trash2 size={14} />
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>
