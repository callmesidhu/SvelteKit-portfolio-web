<script lang="ts">
  import Icons from './Icons.svelte';

  const links = ['Home', 'About', 'Work', 'Skills', 'Contact'];
</script>

<nav class="fixed left-0 right-0 top-4 z-50 flex items-center justify-between px-8 py-3 lg:px-16">
  <!-- Logo -->
  <a href="/" class="flex items-center gap-3 group">
    <div class="liquid-glass-strong flex h-10 w-10 items-center justify-center rounded-full">
      <span class="font-heading italic text-white text-lg leading-none">S</span>
    </div>
    <span class="font-body text-sm font-medium text-white/80 hidden sm:block tracking-wider uppercase">callmesidhu</span>
  </a>

  <!-- Center nav pill (desktop) -->
  <div class="liquid-glass hidden rounded-full px-1.5 py-1 md:flex items-center gap-1">
    {#each links as link}
      {#if link === 'Contact'}
        <a
          href="#{link.toLowerCase()}"
          class="flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-black font-body"
        >
          {link}
          <Icons name="ArrowUpRight" size={14} />
        </a>
      {:else}
        <a
          href="#{link.toLowerCase()}"
          class="rounded-full px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {link}
        </a>
      {/if}
    {/each}
  </div>

  <!-- Right CTA -->
  <a
    href="/resume.pdf"
    download
    class="liquid-glass-strong flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white font-body hover:scale-105 transition-transform duration-200"
  >
    Resume
    <Icons name="ArrowUpRight" size={14} />
  </a>
</nav>
