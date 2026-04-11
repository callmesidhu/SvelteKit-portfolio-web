<script lang="ts">
  import Icons from './Icons.svelte';
  import BlurText from './BlurText.svelte';

  const rows = [
    {
      title: 'Designed to convert. Built to perform.',
      body: "Every pixel is intentional. My approach studies what works across thousands of top products — then builds yours to outperform them all. From micro-interactions to core architecture.",
      cta: 'See My Work',
      ctaHref: '#work',
      gif: '/images/feature-1.gif',
      reverse: false,
    },
    {
      title: 'Full-stack. End to end. Always.',
      body: "Frontend finesse meets backend muscle. React, Next.js, SvelteKit, Node, Python — I architect systems that scale. No handoffs, no silos. Just clean, cohesive product.",
      cta: 'Explore Skills',
      ctaHref: '#skills',
      gif: '/images/feature-2.gif',
      reverse: true,
    },
  ];
</script>

<section id="work" class="py-24 px-6">
  <div class="mx-auto max-w-6xl">
    <!-- Section header -->
    <div class="mb-16 flex flex-col items-center gap-4 text-center">
      <div class="liquid-glass inline-flex rounded-full px-3.5 py-1">
        <span class="text-xs font-medium text-white font-body">Capabilities</span>
      </div>
      <h2 class="text-4xl font-heading italic text-white tracking-tight leading-[0.9] md:text-5xl lg:text-6xl">
        <BlurText text="Pro skills. Zero complexity." delay={100} direction="bottom" />
      </h2>
    </div>

    <!-- Rows -->
    {#each rows as row, i}
      <div
        class="mb-20 flex flex-col items-center gap-12 lg:flex-row"
        class:lg:flex-row-reverse={row.reverse}
      >
        <!-- Text side -->
        <div class="flex flex-1 flex-col gap-6">
          <h3 class="text-3xl font-heading italic text-white leading-tight">{row.title}</h3>
          <p class="text-sm md:text-base text-white/60 font-body font-light leading-relaxed">{row.body}</p>
          <a
            href={row.ctaHref}
            class="liquid-glass-strong inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white font-body hover:scale-105 transition-transform duration-200"
          >
            {row.cta}
            <Icons name="ArrowUpRight" size={15} />
          </a>
        </div>

        <!-- Image side -->
        <div class="flex-1 w-full">
          <div class="liquid-glass overflow-hidden rounded-2xl">
            <img
              src={row.gif}
              alt={row.title}
              class="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
