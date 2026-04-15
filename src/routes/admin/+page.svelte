<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "$lib/firebase"; 
  import { doc, getDoc } from "firebase/firestore";
  import { Eye, Users, MousePointer2, TrendingUp } from "lucide-svelte";

  let count = $state<number | null>(null);
  let loading = $state(true);

  onMount(async () => {
    try {
      const docRef = doc(db, 'dashboard', 'visitors');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        count = docSnap.data().count;
      }
    } catch (err) {
      console.error('Error fetching visitor count:', err);
    } finally {
      loading = false;
    }
  });

  const stats = $derived([
    { name: "Total Visitors", value: count !== null ? count.toLocaleString() : "...", icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Unique Sessions", value: "1,234", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Click Rate", value: "12.5%", icon: MousePointer2, color: "text-amber-400", bg: "bg-amber-400/10" },
    { name: "Growth", value: "+18%", icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-400/10" },
  ]);
</script>

<div class="space-y-8">
  <header>
    <h1 class="text-3xl font-bold text-white">Dashboard Overview</h1>
    <p class="text-gray-400 mt-2">Real-time statistics for your portfolio</p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat}
      <div class="bg-[#121212] border border-violet-900/20 p-6 rounded-2xl shadow-xl hover:border-violet-600/30 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 {stat.bg} {stat.color} rounded-xl flex items-center justify-center">
            <stat.icon size={24} />
          </div>
          <span class="text-xs font-medium text-emerald-400 px-2 py-1 bg-emerald-400/10 rounded-full">Active</span>
        </div>
        <div class="space-y-1">
          <p class="text-gray-400 text-sm font-medium">{stat.name}</p>
          <h2 class="text-3xl font-bold text-white">{stat.value}</h2>
        </div>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
    <div class="bg-[#121212] border border-violet-900/20 p-8 rounded-2xl">
      <h3 class="text-xl font-bold mb-6">Recent Activity</h3>
      <div class="space-y-6">
        {#each Array(4) as _, i}
          <div class="flex items-start gap-4">
            <div class="w-2 h-2 mt-2 rounded-full bg-violet-600"></div>
            <div>
              <p class="text-gray-300 text-sm">Someone from New York viewed your <span class="text-violet-400">Project AI</span></p>
              <p class="text-gray-500 text-xs mt-1">{i + 1} hour ago</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-violet-600/20 p-8 rounded-2xl flex flex-col justify-center">
      <h3 class="text-2xl font-bold mb-4">Portfolio Performance</h3>
      <p class="text-gray-400 mb-6 leading-relaxed">
        Your portfolio is performing better than <span class="text-white font-bold">85%</span> of other creators this month. 
        Keep updating your projects to maintain visibility.
      </p>
      <button class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl self-start transition-all">
        View Full Report
      </button>
    </div>
  </div>
</div>
