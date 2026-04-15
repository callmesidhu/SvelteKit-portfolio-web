<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { 
    collection, doc, onSnapshot, runTransaction, addDoc, deleteDoc, query, orderBy 
  } from 'firebase/firestore';
  import { Star, Plus, Trash2, ExternalLink, Image as ImageIcon, Code, Type, Link as LinkIcon } from 'lucide-svelte';

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
      snapshot.forEach(doc => {
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

      title = ''; tech = ''; description = ''; link = ''; image = '';
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
    <h1 class="text-3xl font-bold text-white flex items-center gap-3">
      <Star class="text-violet-400" />
      Project Portfolio
    </h1>
    <p class="text-gray-400 mt-2">Showcase your best work to the world.</p>
  </header>

  <!-- Add Project Form -->
  <div class="bg-[#121212] border border-violet-900/20 rounded-2xl p-8 shadow-2xl">
    <h2 class="text-xl font-bold mb-6 text-gray-200">Add New Project</h2>
    <form onsubmit={addProject} class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Type size={14} /> Title *
        </label>
        <input
          type="text"
          placeholder="e.g., E-commerce App"
          bind:value={title}
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
          required
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Code size={14} /> Technologies *
        </label>
        <input
          type="text"
          placeholder="e.g., SvelteKit, Tailwind, Firebase"
          bind:value={tech}
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
          required
        />
      </div>

      <div class="md:col-span-2 space-y-2">
        <label class="text-sm font-medium text-gray-400">Description</label>
        <textarea
          rows={3}
          placeholder="Briefly describe the project..."
          bind:value={description}
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all resize-none"
        ></textarea>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <LinkIcon size={14} /> Project URL
        </label>
        <input
          type="url"
          placeholder="https://your-project.com"
          bind:value={link}
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <ImageIcon size={14} /> Cover Image URL
        </label>
        <input
          type="url"
          placeholder="https://image-url.com"
          bind:value={image}
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
        />
      </div>

      <div class="md:col-span-2 pt-4">
        <button
          type="submit"
          disabled={adding}
          class="w-full md:w-auto bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-12 py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
        >
          {#if adding}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    <h2 class="text-2xl font-bold mb-8 text-gray-200">Active Projects ({projects.length})</h2>
    
    {#if loading}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Array(3) as _}
          <div class="h-96 bg-[#121212] border border-violet-900/10 rounded-2xl animate-pulse"></div>
        {/each}
      </div>
    {:else if projects.length === 0}
      <div class="text-center py-20 bg-[#121212] border border-violet-900/20 rounded-2xl">
        <ImageIcon class="mx-auto text-gray-600 mb-4" size={48} />
        <p class="text-gray-500 text-lg">No projects added yet.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each projects as proj}
          <div class="group bg-[#121212] border border-violet-900/20 rounded-2xl overflow-hidden hover:border-violet-600/30 transition-all duration-300 flex flex-col shadow-xl">
            {#if proj.image}
              <div class="h-48 overflow-hidden relative">
                <img
                  src={proj.image}
                  alt={proj.title}
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-mono text-gray-300">
                  ID: {proj.id}
                </div>
              </div>
            {:else}
              <div class="h-48 bg-violet-900/10 flex items-center justify-center text-violet-900/30">
                <ImageIcon size={48} />
              </div>
            {/if}

            <div class="p-6 flex-grow flex flex-col">
              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                {proj.title}
              </h3>
              <div class="flex flex-wrap gap-2 mb-4">
                {#each proj.tech.split(',') as t}
                  <span class="px-2 py-1 bg-violet-600/10 text-violet-400 text-[10px] font-bold uppercase tracking-wider rounded border border-violet-600/20">
                    {t.trim()}
                  </span>
                {/each}
              </div>
              <p class="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                {proj.description || "No description provided."}
              </p>

              <div class="flex items-center justify-between pt-6 border-t border-violet-900/10">
                {#if proj.link}
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    class="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium"
                  >
                    <ExternalLink size={14} /> Preview
                  </a>
                {:else}
                  <div></div>
                {/if}
                
                <button
                  onclick={() => deleteProject(proj.docId)}
                  class="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
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
