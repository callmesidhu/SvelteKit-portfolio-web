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
      experiences = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      loading = false;
    }
  };

  onMount(fetchExperience);

  const handleAdd = async (e: SubmitEvent) => {
    e.preventDefault();
    if (experiences.length >= 6) {
      status = "⚠️ Max 6 entries allowed.";
      return;
    }

    if (!title || !company || !rank) {
      status = "⚠️ Title, Company, and Rank are required.";
      return;
    }

    adding = true;
    try {
      const newItem = {
        title, company, type, duration, location, description,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        rank: parseInt(rank || "99")
      };

      await addDoc(collection(db, 'experience'), newItem);
      status = "✅ Added successfully!";
      // Reset form
      title = ''; company = ''; type = ''; duration = '';
      location = ''; description = ''; skills = ''; rank = '';
      await fetchExperience();
    } catch (error) {
      console.error("Error adding experience:", error);
      status = "❌ Failed to add.";
    } finally {
      adding = false;
      setTimeout(() => status = '', 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await deleteDoc(doc(db, 'experience', id));
      experiences = experiences.filter(e => e.id !== id);
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };
</script>

<div class="space-y-10 max-w-6xl mx-auto pb-20">
  <header>
    <h1 class="text-3xl font-bold text-white flex items-center gap-3">
      <Briefcase class="text-violet-400" />
      Work Experience
    </h1>
    <p class="text-gray-400 mt-2">Manage your career timeline (Max 6 entries).</p>
  </header>

  <!-- Add Experience Form -->
  <div class="bg-[#121212] border border-violet-900/20 rounded-2xl p-8 shadow-2xl">
    <h2 class="text-xl font-bold mb-6 text-gray-200">New Experience</h2>
    <form onsubmit={handleAdd} class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2"><Building size={14} /> Title *</label>
        <input type="text" bind:value={title} placeholder="e.g. Senior Dev" class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2"><Briefcase size={14} /> Company *</label>
        <input type="text" bind:value={company} placeholder="e.g. Google" class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400">Order/Rank *</label>
        <input type="number" bind:value={rank} placeholder="1" class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2"><Tag size={14} /> Type</label>
        <input type="text" bind:value={type} placeholder="Full-time / Internship" class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2"><Calendar size={14} /> Duration</label>
        <input type="text" bind:value={duration} placeholder="Jan 2023 - Present" class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2"><MapPin size={14} /> Location</label>
        <input type="text" bind:value={location} placeholder="Remote / City" class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      <div class="lg:col-span-2 space-y-2">
        <label class="text-sm font-medium text-gray-400">Skills (Comma separated)</label>
        <input type="text" bind:value={skills} placeholder="React, Node.js, AWS" class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400">Description</label>
        <input type="text" bind:value={description} placeholder="Short summary..." class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
      </div>
      
      <div class="lg:col-span-3 pt-4">
        <button
          type="submit"
          disabled={adding || experiences.length >= 6}
          class="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2"
        >
          {#if adding}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {:else}
            <Plus size={20} />
            Add Experience
          {/if}
        </button>
        {#if status}
          <p class="mt-4 text-sm font-medium {status.includes('✅') ? 'text-emerald-400' : 'text-amber-400'}">{status}</p>
        {/if}
      </div>
    </form>
  </div>

  <!-- Experience List -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#if loading}
      {#each Array(2) as _}
        <div class="h-64 bg-[#121212] border border-violet-900/10 rounded-2xl animate-pulse"></div>
      {/each}
    {:else}
      {#each experiences as exp}
        <div class="group bg-[#121212] border border-violet-900/20 rounded-2xl p-8 hover:border-violet-600/30 transition-all duration-300 relative shadow-xl">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                {exp.title}
              </h3>
              <p class="text-violet-400 font-medium flex items-center gap-2 mt-1">
                <Building size={14} /> {exp.company}
              </p>
            </div>
            <div class="px-3 py-1 bg-violet-600/10 text-violet-400 border border-violet-600/20 rounded-full text-xs font-bold">
              Rank {exp.rank}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-gray-500 text-sm flex items-center gap-2">
              <Calendar size={14} /> {exp.duration || "N/A"}
            </div>
            <div class="text-gray-500 text-sm flex items-center gap-2">
              <MapPin size={14} /> {exp.location || "N/A"}
            </div>
          </div>

          <p class="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">
            {exp.description || "No description provided."}
          </p>

          <div class="flex flex-wrap gap-2 mb-8">
            {#each exp.skills as skill}
              <span class="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] rounded border border-white/5">
                {skill}
              </span>
            {/each}
          </div>

          <button
            onclick={() => handleDelete(exp.id)}
            class="absolute bottom-6 right-6 p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            aria-label="Delete experience"
          >
            <Trash2 size={18} />
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>
