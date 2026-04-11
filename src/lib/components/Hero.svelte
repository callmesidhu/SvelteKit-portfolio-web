<script lang="ts">
  import { onMount } from 'svelte';
  import Icons from './Icons.svelte';
  import BlurText from './BlurText.svelte';

  const partners = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma'];

  let subVisible = $state(false);
  let ctaVisible = $state(false);

  onMount(() => {
    const t1 = setTimeout(() => (subVisible = true), 800);
    const t2 = setTimeout(() => (ctaVisible = true), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });
</script>

<section id="home" class="relative overflow-hidden" style="height: 1000px;">
  <!-- Background Video -->
  <video
    autoplay
    loop
    muted
    playsinline
    poster="/images/hero_bg.jpeg"
    class="absolute left-0 w-full h-auto object-contain z-0"
    style="top: 20%;"
  >
    <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" type="video/mp4" />
  </video>

  <!-- Dark overlay -->
  <div class="absolute inset-0 bg-black/20 z-0 pointer-events-none"></div>

  <!-- Bottom fade -->
  <div
    class="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
    style="height: 300px; background: linear-gradient(to bottom, transparent, black);"
  ></div>

  <!-- Content -->
  <div class="relative z-20 flex flex-col items-center text-center px-6 pt-[150px]">
    <!-- Badge -->
    <div class="liquid-glass mb-8 flex items-center gap-2 rounded-full px-1 py-1">
      <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black font-body">New</span>
      <span class="pr-3 text-xs font-medium text-white/80 font-body">Available for hire — Full Stack & AI Projects.</span>
    </div>

    <!-- Heading -->
    <h1 class="font-heading italic text-white leading-[0.85] max-w-4xl tracking-[-4px] text-6xl md:text-7xl lg:text-[5.5rem] mb-6">
      <BlurText text="The Developer Your Project Deserves" delay={100} direction="bottom" />
    </h1>

    <!-- Subtext -->
    <p
      class="max-w-xl text-sm md:text-base text-white/70 font-body font-light leading-relaxed mt-4 mb-8"
      style:transition="filter 0.6s ease, opacity 0.6s ease, transform 0.6s ease"
      style:transition-delay="0s"
      style:filter={subVisible ? 'blur(0px)' : 'blur(10px)'}
      style:opacity={subVisible ? 1 : 0}
      style:transform={subVisible ? 'translateY(0)' : 'translateY(20px)'}
    >
      Stunning interfaces. Blazing performance. Built with modern frameworks, refined with obsessive detail. This is full-stack development, wildly reimagined.
    </p>

    <!-- CTA Buttons -->
    <div
      class="flex flex-wrap items-center justify-center gap-4"
      style:transition="filter 0.6s ease, opacity 0.6s ease, transform 0.6s ease"
      style:transition-delay="0s"
      style:filter={ctaVisible ? 'blur(0px)' : 'blur(10px)'}
      style:opacity={ctaVisible ? 1 : 0}
      style:transform={ctaVisible ? 'translateY(0)' : 'translateY(20px)'}
    >
      <a href="#contact" class="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white font-body hover:scale-105 transition-transform duration-200">
        Get In Touch
        <Icons name="ArrowUpRight" size={16} />
      </a>
      <a href="#work" class="flex items-center gap-2 text-sm font-medium text-white/70 font-body hover:text-white transition-colors duration-200">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
          <Icons name="Play" size={13} />
        </div>
        View My Work
      </a>
    </div>

    <!-- Partners Bar -->
    <div class="mt-16 flex flex-col items-center gap-5 pb-8">
      <div class="liquid-glass rounded-full px-4 py-2">
        <span class="text-xs font-medium text-white/50 font-body tracking-wider uppercase">Trusted by the teams behind</span>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {#each partners as partner}
          <span class="text-2xl md:text-3xl font-heading italic text-white/60 hover:text-white transition-colors duration-300 cursor-default">
            {partner}
          </span>
        {/each}
      </div>
    </div>
  </div>
</section>
