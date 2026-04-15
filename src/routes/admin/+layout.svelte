<script lang="ts">
  import { user } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { LayoutDashboard, User, Briefcase, Rocket, Star, Code, LogOut } from "lucide-svelte";
  import { auth } from "$lib/firebase";
  import { signOut } from "firebase/auth";

  let { children } = $props();

  $effect(() => {
    if (!$user && page.url.pathname !== "/admin/login") {
      goto("/admin/login");
    }
  });

  const handleLogout = async () => {
    await signOut(auth);
    goto("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Hero", path: "/admin/hero", icon: Rocket },
    { name: "About", path: "/admin/about", icon: User },
    { name: "Experience", path: "/admin/experience", icon: Briefcase },
    { name: "Projects", path: "/admin/projects", icon: Star },
    { name: "Skills", path: "/admin/skills", icon: Code },
  ];
</script>

{#if page.url.pathname === "/admin/login"}
  {@render children()}
{:else if $user}
  <div class="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#121212] border-r border-violet-900/30 flex flex-col sticky top-0 h-screen">
      <div class="p-6">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>

      <nav class="flex-grow px-4 space-y-2 mt-4">
        {#each menuItems as item}
          <a
            href={item.path}
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {page.url.pathname === item.path ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
          >
            <item.icon size={20} />
            <span class="font-medium">{item.name}</span>
          </a>
        {/each}
      </nav>

      <div class="p-4 border-t border-violet-900/20">
        <button
          onclick={handleLogout}
          class="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto">
        {@render children()}
      </div>
    </main>
  </div>
{:else}
  <div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div class="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
{/if}

<style>
  :global(body) {
    background-color: #0a0a0a;
  }
</style>
