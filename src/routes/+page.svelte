<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import ScrollFrameAnimation from '$lib/components/ScrollFrameAnimation.svelte';
  import FeaturesChess from '$lib/components/FeaturesChess.svelte';
  import FeaturesGrid from '$lib/components/FeaturesGrid.svelte';
  import Stats from '$lib/components/Stats.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';
  import CtaFooter from '$lib/components/CtaFooter.svelte';
</script>

<svelte:head>
  <title>callmesidhu</title>
  <meta name="description" content="Portfolio of S Sidharth (callmesidhu), a premium Full Stack Developer building AI-powered web experiences." />
</svelte:head>

<div class="bg-black">
  <!-- Navbar floats above everything -->
  <Navbar />

  <main>
    <!-- Scroll-scrubbed frame animation (full viewport hero) -->
    <ScrollFrameAnimation />

    <div class="bg-black relative z-10">
      <FeaturesChess />
      <FeaturesGrid />
      <Stats />
      <Testimonials />
      <CtaFooter />
    </div>
  </main>
</div>
