<script lang="ts">
	import { onMount } from 'svelte';

	let loaded = $state(false);
	let scrollY = $state(0);

	onMount(() => {
		loaded = true;
	});
</script>

<svelte:window bind:scrollY />

<section
	id="home"
	class="hero-glass-section font-inter relative flex min-h-screen items-center overflow-hidden"
>
	<!-- Background Image with soft depth-of-field effect and Parallax -->
	<div class="absolute inset-0 z-0">
		<!-- Using a wrapper that slightly scales to hide blur edge artifacts and applies scroll translation -->
		<div
			class="absolute inset-[-40px] bg-cover bg-center blur-[4px] transition-opacity duration-[1.5s] ease-out will-change-transform"
			style:opacity={loaded ? 1 : 0}
			style:transform="translate3d(0, {scrollY * 0.35}px, 0) scale(1.05)"
			style="background-image: url('/hero-section/hero.png');"
		></div>
		<!-- Soft tint overlay to blend background with theme slightly -->
		<div
			class="pointer-events-none absolute inset-0 bg-[var(--bg-primary)] opacity-20 transition-colors duration-700 dark:opacity-40"
		></div>
	</div>

	<div class="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-24">
		<!-- Parallax wrapper for the card so it scrolls at a different speed -->
		<div class="will-change-transform" style:transform="translate3d(0, {scrollY * -0.15}px, 0)">
			<!-- Glassmorphic Card -->
			<div
				class="glass-card relative z-20 mx-auto flex max-w-2xl flex-col items-center p-10 text-center transition-all delay-300
               duration-[1s] ease-out md:mx-0 md:items-start md:p-14 md:text-left"
				class:translate-y-0={loaded}
				class:translate-y-[40px]={!loaded}
				class:opacity-100={loaded}
				class:opacity-0={!loaded}
			>
				<h1
					class="mb-4 text-4xl font-bold tracking-tight text-[var(--text-heading)] transition-colors duration-500 md:text-5xl lg:text-6xl"
				>
					Hi, I'm Sidharth
				</h1>
				<h2
					class="mb-6 text-xl font-medium text-[var(--accent-primary)] transition-colors duration-500 md:text-2xl"
				>
					Full Stack Developer & Founder of XyphX
				</h2>
				<p
					class="mb-10 max-w-lg text-base leading-relaxed font-light text-[var(--text-sub)] transition-colors duration-500 md:text-lg"
				>
					I build scalable apps, modern web experiences, and AI-powered solutions.
				</p>

				<div class="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
					<a
						href="#work"
						class="btn-primary flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium md:text-base"
					>
						View Projects
					</a>
					<a
						href="#contact"
						class="btn-secondary flex items-center justify-center rounded-full border px-8 py-3.5 text-sm font-medium transition-all md:text-base"
					>
						Contact Me
					</a>
				</div>
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
		--bg-primary: #f5efea;
		--bg-secondary: #e8e5e1;
		--bg-surface: #ffffff;

		--glass-bg: rgba(255, 255, 255, 0.25);
		--glass-border: rgba(255, 255, 255, 0.4);

		--text-heading: #2b2b2b;
		--text-sub: #5c5c5c;

		--accent-primary: #b68a6e;
		--accent-secondary: #9c8f82;

		--btn-primary-bg: #b68a6e;
		--btn-primary-text: #ffffff;
		--btn-primary-hover: #9c8f82;

		--btn-secondary-border: #b68a6e;
		--btn-secondary-hover-border: #9c8f82;
	}

	/* Note: using :global(.dark) so the section reacts when the HTML tag has dark class */
	:global(.dark) .hero-glass-section {
		/* DARK THEME VARIABLES */
		--bg-primary: #121212;
		--bg-secondary: #1e1e1e;
		--bg-surface: #2b2b2b;

		--glass-bg: rgba(255, 255, 255, 0.06);
		--glass-border: rgba(255, 255, 255, 0.12);

		--text-heading: #ffffff;
		--text-sub: #cfcfcf;

		--accent-primary: #b68a6e;
		--accent-secondary: #cfc3b6;

		--btn-primary-bg: #b68a6e;
		--btn-primary-text: #121212;
		--btn-primary-hover: #e8e5e1;

		--btn-secondary-border: #cfc3b6;
		--btn-secondary-hover-border: #e8e5e1;
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
		transition:
			transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
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
		transition:
			transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
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
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-12px);
		}
		100% {
			transform: translateY(0px);
		}
	}
</style>
