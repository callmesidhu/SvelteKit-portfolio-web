<script lang="ts">
  import { onMount } from 'svelte';
  import Icons from './Icons.svelte';
  import logo from '$lib/assets/logo.png';

  const links = ['Home', 'About', 'Work', 'Skills', 'Contact'];
  let isDark = $state(true);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }
</script>

<nav class="fixed left-0 right-0 top-4 z-50 flex items-center justify-between px-8 py-3 lg:px-16 text-white">
  <!-- Logo -->
  <a href="/" class="flex items-center gap-3 group">
    <div class="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-white/10 backdrop-blur-md">
      <img src={logo} alt="Logo" class="w-full h-full object-cover" />
    </div>
    <span class="font-body text-sm font-medium hidden sm:block tracking-wider uppercase">callmesidhu</span>
  </a>

  <!-- Center nav pill (desktop) -->
  <div class="hidden rounded-full px-1.5 py-1 md:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20">
    {#each links as link}
      {#if link === 'Contact'}
        <a
          href="#{link.toLowerCase()}"
          class="flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-black font-body transition-colors"
        >
          {link}
          <Icons name="ArrowUpRight" size={14} />
        </a>
      {:else}
        <a
          href="#{link.toLowerCase()}"
          class="rounded-full px-3 py-2 text-sm font-medium font-body hover:bg-white/20 transition-all duration-200"
        >
          {link}
        </a>
      {/if}
    {/each}
  </div>

  <!-- Right CTA & Theme Toggle -->
  <div class="flex items-center gap-3">
    <button
      onclick={toggleTheme}
      class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
      aria-label="Toggle Theme"
    >
      {#if isDark}
        <Icons name="Sun" size={18} />
      {:else}
        <Icons name="Moon" size={18} />
      {/if}
    </button>

    <a
      href="/resume.pdf"
      download
      class="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium hover:scale-105 transition-transform duration-200"
    >
      Resume
      <Icons name="ArrowUpRight" size={14} />
    </a>
  </div>
</nav>
