<script lang="ts">
  import HlsVideo from './HlsVideo.svelte';
  import BlurText from './BlurText.svelte';

  const HLS_URL = 'https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8';

  const stats = [
    { value: '12+', label: 'Projects launched' },
    { value: '100%', label: 'Client satisfaction' },
    { value: '3.2x', label: 'Faster delivery' },
    { value: '5 days', label: 'Average turnaround' },
  ];
</script>

<section class="relative overflow-hidden py-40">
  <!-- Desaturated HLS Video -->
  <div class="absolute inset-0" style="filter: saturate(0);">
    <HlsVideo src={HLS_URL} />
  </div>

  <!-- Overlays -->
  <div
    class="pointer-events-none absolute top-0 left-0 right-0 z-10"
    style="height: 200px; background: linear-gradient(to bottom, black, transparent);"
  ></div>
  <div
    class="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
    style="height: 200px; background: linear-gradient(to top, black, transparent);"
  ></div>

  <!-- Content -->
  <div class="relative z-20 mx-auto max-w-5xl px-6">
    <div class="liquid-glass rounded-3xl p-12 md:p-16">

      <!-- Header -->
      <div class="mb-12 text-center">
        <h2 class="text-4xl font-heading italic text-white tracking-tight leading-[0.9] md:text-5xl">
          <BlurText text="Numbers that speak." delay={100} direction="bottom" />
        </h2>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        {#each stats as stat}
          <div class="flex flex-col items-center gap-2 text-center">
            <span class="text-4xl font-heading italic text-white md:text-5xl lg:text-6xl">{stat.value}</span>
            <span class="text-xs text-white/60 font-body font-light uppercase tracking-widest">{stat.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
