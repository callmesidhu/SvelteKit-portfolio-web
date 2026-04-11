<script lang="ts">
  import { onMount } from 'svelte';
  
  let loaded = false;
  onMount(() => {
    loaded = true;
  });
</script>

<section id="home" class="hero-glass-section relative min-h-screen flex items-center overflow-hidden font-inter">
  <!-- Background Image with soft depth-of-field effect -->
  <div class="absolute inset-0 z-0">
    <!-- Using a wrapper that slightly scales to hide blur edge artifacts -->
    <div 
      class="absolute inset-[-10px] bg-cover bg-center blur-[4px] transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style:opacity={loaded ? 1 : 0}
      style="background-image: url('/hero-section/hero.png');"
    ></div>
    <!-- Soft tint overlay to blend background with theme slightly -->
    <div class="absolute inset-0 bg-[var(--bg-primary)] opacity-20 dark:opacity-40 transition-colors duration-700 pointer-events-none"></div>
  </div>

  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
    <!-- Glassmorphic Card -->
    <div 
      class="glass-card flex flex-col items-center md:items-start text-center md:text-left max-w-2xl mx-auto md:mx-0 p-10 md:p-14
             transition-all duration-[1s] ease-out delay-300"
      class:translate-y-0={loaded}
      class:translate-y-[20px]={!loaded}
      class:opacity-100={loaded}
      class:opacity-0={!loaded}
    >
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-[var(--text-heading)] transition-colors duration-500">
        Hi, I'm Sidharth
      </h1>
      <h2 class="text-xl md:text-2xl font-medium mb-6 text-[var(--accent-primary)] transition-colors duration-500">
        Full Stack Developer & Founder of XyphX
      </h2>
      <p class="text-base md:text-lg mb-10 leading-relaxed font-light text-[var(--text-sub)] transition-colors duration-500 max-w-lg">
        I build scalable apps, modern web experiences, and AI-powered solutions.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <a href="#work" class="btn-primary rounded-full px-8 py-3.5 text-sm md:text-base font-medium flex items-center justify-center">
          View Projects
        </a>
        <a href="#contact" class="btn-secondary rounded-full px-8 py-3.5 text-sm md:text-base font-medium flex items-center justify-center border transition-all">
          Contact Me
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .font-inter {
    font-family: 'Inter', sans-serif;
  }

  .hero-glass-section {
    /* LIGHT THEME VARIABLES */
    --bg-primary: #F5EFEA;
    --bg-secondary: #E8E5E1;
    --bg-surface: #FFFFFF;
    
    --glass-bg: rgba(255, 255, 255, 0.25);
    --glass-border: rgba(255, 255, 255, 0.4);
    
    --text-heading: #2B2B2B;
    --text-sub: #5C5C5C;
    
    --accent-primary: #B68A6E;
    --accent-secondary: #9C8F82;
    
    --btn-primary-bg: #B68A6E;
    --btn-primary-text: #FFFFFF;
    --btn-primary-hover: #9C8F82;
    
    --btn-secondary-border: #B68A6E;
    --btn-secondary-hover-border: #9C8F82;
  }

  /* Note: using :global(.dark) so the section reacts when the HTML tag has dark class */
  :global(.dark) .hero-glass-section {
    /* DARK THEME VARIABLES */
    --bg-primary: #121212;
    --bg-secondary: #1E1E1E;
    --bg-surface: #2B2B2B;
    
    --glass-bg: rgba(255, 255, 255, 0.06);
    --glass-border: rgba(255, 255, 255, 0.12);
    
    --text-heading: #FFFFFF;
    --text-sub: #CFCFCF;
    
    --accent-primary: #B68A6E;
    --accent-secondary: #CFC3B6;
    
    --btn-primary-bg: #B68A6E;
    --btn-primary-text: #121212;
    --btn-primary-hover: #E8E5E1;
    
    --btn-secondary-border: #CFC3B6;
    --btn-secondary-hover-border: #E8E5E1;
  }

  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    
    /* Subtle float animation */
    animation: floatY 8s ease-in-out infinite;
  }

  /* Interaction: Slight glow on hover */
  .glass-card:hover {
    box-shadow: 0 0 40px rgba(182, 138, 110, 0.15);
  }

  /* Buttons */
  .btn-primary {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                background-color 0.3s ease, 
                box-shadow 0.3s ease;
  }

  .btn-primary:hover {
    transform: scale(1.05);
    background-color: var(--btn-primary-hover);
    box-shadow: 0 0 20px rgba(182, 138, 110, 0.3);
  }

  .btn-secondary {
    background-color: transparent;
    border-color: var(--btn-secondary-border);
    color: var(--text-heading);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                border-color 0.3s ease, 
                color 0.3s ease,
                box-shadow 0.3s ease;
  }

  .btn-secondary:hover {
    transform: scale(1.05);
    border-color: var(--btn-secondary-hover-border);
    color: var(--btn-secondary-hover-border);
    /* subtle inner/outer glow on secondary border */
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
  }

  @keyframes floatY {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
    100% { transform: translateY(0px); }
  }
</style>
