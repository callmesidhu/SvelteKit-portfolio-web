<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ScrollFrameAnimation from '$lib/components/ScrollFrameAnimation.svelte';
	import IconCloud from '$lib/components/IconCloud.svelte';
	import AboutAI from '$lib/components/AboutAI.svelte';
	import ExperienceTimeline from '$lib/components/ExperienceTimeline.svelte';
	import ProjectsGrid from '$lib/components/ProjectsGrid.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO />

<div class="bg-black">
	<!-- Navbar floats above everything -->
	<Navbar />

	<main>
		<!-- Scroll-scrubbed frame animation (full viewport hero) -->
		<ScrollFrameAnimation />

		<!-- About Section (AI Chat Style) -->
		<section id="about" class="relative bg-black py-24">
			<div class="mx-auto max-w-7xl px-6">
				<div class="mb-16 text-center">
					<h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
						About <span class="text-[#B58A6C]">Me</span>
					</h2>
					<p class="mt-4 text-lg text-white/40">
						Get to know the person behind the code and the designs.
					</p>
				</div>
				<AboutAI />
			</div>
		</section>

		<!-- Tech Stack Section -->
		<section id="skills" class="relative bg-black py-24">
			<div class="mx-auto max-w-7xl px-6">
				<div class="mb-16 text-center">
					<h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
						My <span class="text-[#B58A6C]">Tech Stack</span>
					</h2>
					<p class="mt-4 text-lg text-white/40">
						Tools and technologies I use to bring ideas to life.
					</p>
				</div>

				<IconCloud />
			</div>
		</section>

		<!-- Experience Section: scroll-jacked, 100vh sticky panel -->
		<ExperienceTimeline />

		<!-- Projects Section -->
		<ProjectsGrid />

		<!-- Contact Section -->
		<Contact />
	</main>
</div>
