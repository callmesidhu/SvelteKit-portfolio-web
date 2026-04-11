<script lang="ts">
  import Icons from './Icons.svelte';
  import HlsVideo from './HlsVideo.svelte';
  import BlurText from './BlurText.svelte';

  const HLS_URL = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
  const year = new Date().getFullYear();
</script>

<section id="contact" class="relative overflow-hidden pt-40 pb-0">
  <!-- HLS Video BG -->
  <HlsVideo src={HLS_URL} />

  <!-- Overlays -->
  <div
    class="pointer-events-none absolute top-0 left-0 right-0 z-10"
    style="height: 200px; background: linear-gradient(to bottom, black, transparent);"
  ></div>
  <div
    class="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
    style="height: 200px; background: linear-gradient(to top, black, transparent);"
  ></div>

  <!-- CTA Content -->
  <div class="relative z-20 mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-8">
    <div class="liquid-glass inline-flex rounded-full px-3.5 py-1">
      <span class="text-xs font-medium text-white font-body">Let's Build</span>
    </div>

    <h2 class="text-5xl font-heading italic text-white leading-[0.85] tracking-tight md:text-6xl lg:text-7xl">
      <BlurText text="Your next project starts here." delay={100} direction="bottom" />
    </h2>

    <p class="max-w-xl text-sm md:text-base text-white/60 font-body font-light leading-relaxed">
      Let's talk about what you're building. Free discovery call — no commitment, no pressure. Just possibilities and a developer who cares.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4">
      <a
        href="mailto:hello@callmesidhu.xyphx.com"
        class="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white font-body hover:scale-105 transition-transform duration-200"
      >
        Book a Call
        <Icons name="ArrowUpRight" size={16} />
      </a>
      <a
        href="#work"
        class="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black font-body hover:scale-105 transition-transform duration-200"
      >
        View My Work
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div class="relative z-20 mx-auto mt-32 max-w-6xl border-t border-white/10 px-6 py-8">
    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-xs text-white/40 font-body">© {year} callmesidhu · All rights reserved.</p>
      <div class="flex items-center gap-6">
        <a href="/privacy" class="text-xs text-white/40 font-body hover:text-white/70 transition-colors">Privacy</a>
        <a href="/terms" class="text-xs text-white/40 font-body hover:text-white/70 transition-colors">Terms</a>
        <a href="mailto:hello@callmesidhu.xyphx.com" class="text-xs text-white/40 font-body hover:text-white/70 transition-colors">Contact</a>
      </div>
    </div>
  </div>
</section>
