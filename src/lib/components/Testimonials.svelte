<script lang="ts">
  import BlurText from './BlurText.svelte';

  const testimonials = [
    {
      quote: 'A complete rebuild in five days. The result outperformed everything we\'d spent months building before.',
      name: 'Sarah Chen',
      role: 'CEO, Luminary',
    },
    {
      quote: 'Conversions up 4x. That\'s not a typo. The code and design combination just works differently.',
      name: 'Marcus Webb',
      role: 'Head of Growth, Arcline',
    },
    {
      quote: 'He didn\'t just build our site. He defined our digital identity. World-class doesn\'t begin to cover it.',
      name: 'Elena Voss',
      role: 'Brand Director, Helix',
    },
  ];
</script>

<section class="py-24 px-6">
  <div class="mx-auto max-w-6xl">

    <!-- Section header -->
    <div class="mb-14 flex flex-col items-center gap-4 text-center">
      <div class="liquid-glass inline-flex rounded-full px-3.5 py-1">
        <span class="text-xs font-medium text-white font-body">Testimonials</span>
      </div>
      <h2 class="text-4xl font-heading italic text-white tracking-tight leading-[0.9] md:text-5xl lg:text-6xl">
        <BlurText text="Don't take my word for it." delay={100} direction="bottom" />
      </h2>
    </div>

    <!-- Cards -->
    <div class="grid gap-6 md:grid-cols-3">
      {#each testimonials as t}
        <div class="liquid-glass flex flex-col gap-6 rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300">
          <!-- Quote icon -->
          <div class="text-white/20 text-4xl font-heading italic leading-none">"</div>
          <p class="flex-1 text-sm italic text-white/80 font-body font-light leading-relaxed">{t.quote}</p>
          <div class="flex flex-col gap-0.5 border-t border-white/10 pt-5">
            <span class="text-sm font-medium text-white font-body">{t.name}</span>
            <span class="text-xs text-white/50 font-body font-light">{t.role}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
