<script lang="ts">
  import { auth } from "$lib/firebase";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { user } from "$lib/auth";
  import { Rocket } from "lucide-svelte";

  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  $effect(() => {
    if ($user) {
      goto("/admin");
    }
  });

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    loading = true;
    error = "";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      goto("/admin");
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  };
</script>

<div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-[#121212] border border-violet-900/30 rounded-2xl p-8 shadow-2xl">
    <div class="flex flex-col items-center mb-8">
      <div class="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mb-4 border border-violet-600/30">
        <Rocket class="text-violet-400" size={32} />
      </div>
      <h1 class="text-3xl font-bold text-white">Welcome Back</h1>
      <p class="text-gray-400 mt-2">Login to your portfolio admin</p>
    </div>

    <form onsubmit={handleLogin} class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-400 mb-2">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="w-full bg-[#1a1a1a] border border-violet-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all"
          placeholder="••••••••"
        />
      </div>

      {#if error}
        <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
          {error}
        </div>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-600/20"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
</div>
