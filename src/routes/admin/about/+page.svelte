<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { User, Save, CheckCircle, XCircle } from 'lucide-svelte';

  let aboutText = $state('');
  let loading = $state(true);
  let status = $state('');
  let error = $state('');

  const docRef = doc(db, "about", "zPae0pmZUUI8p6dmga76");

  onMount(async () => {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        aboutText = data.content;
      } else {
        aboutText = "";
      }
    } catch (err) {
      console.error("Error fetching about:", err);
      error = "Failed to fetch about content.";
    } finally {
      loading = false;
    }
  });

  const updateAbout = async () => {
    try {
      status = "saving";
      await updateDoc(docRef, {
        content: aboutText,
      });
      status = "saved";
      setTimeout(() => status = "", 3000);
    } catch (err) {
      console.error("Error updating about:", err);
      status = "error";
      setTimeout(() => status = "", 3000);
    }
  };
</script>

<div class="max-w-4xl mx-auto space-y-8">
  <header class="flex justify-between items-end">
    <div>
      <h1 class="text-3xl font-bold text-white flex items-center gap-3">
        <User class="text-violet-400" />
        Edit About Section
      </h1>
      <p class="text-gray-400 mt-2">Update the text that appears in your portfolio's about section.</p>
    </div>
    
    <button
      onclick={updateAbout}
      disabled={status === "saving"}
      class="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-600/20"
    >
      {#if status === "saving"}
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Saving...
      {:else}
        <Save size={18} />
        Save Changes
      {/if}
    </button>
  </header>

  {#if loading}
    <div class="bg-[#121212] border border-violet-900/20 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4">
      <div class="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400">Fetching current data...</p>
    </div>
  {:else}
    <div class="bg-[#121212] border border-violet-900/20 rounded-2xl p-8 shadow-xl">
      <textarea
        rows={16}
        class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl p-6 text-gray-200 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all placeholder-gray-600"
        bind:value={aboutText}
        placeholder="Write about yourself, your skills, and your passion..."
      ></textarea>
      
      <div class="mt-6 flex items-center justify-between">
        <p class="text-sm text-gray-500 italic">
          Tip: Use Markdown for better formatting if your frontend supports it.
        </p>
        
        {#if status === "saved"}
          <div class="flex items-center gap-2 text-emerald-400 font-medium animate-in fade-in slide-in-from-right-4">
            <CheckCircle size={18} />
            Success! Saved changes.
          </div>
        {:else if status === "error"}
          <div class="flex items-center gap-2 text-red-400 font-medium animate-in fade-in slide-in-from-right-4">
            <XCircle size={18} />
            Failed to save changes.
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
