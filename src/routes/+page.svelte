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

		<!-- About Section Container (Handles sticky pinning on desktop) -->
		<div class="about-container">
			<!-- About Section (AI Chat Style) -->
			<section id="about" class="about-sticky bg-black pt-24 pb-6 sm:pt-36 sm:pb-8 min-h-screen flex flex-col justify-between">
				<div class="mx-auto max-w-7xl px-4 sm:px-6 w-full flex-1 flex flex-col justify-between">
					<div class="mb-6 text-center sm:mb-8">
						<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
							About <span class="text-[#B58A6C]">Me</span>
						</h2>
						<p class="mt-3 text-base text-white/40 sm:text-lg">
							Get to know the person behind the code and the designs.
						</p>
					</div>
					<AboutAI />
				</div>
			</section>
		</div>

		<!-- Tech Stack Section -->
		<section id="skills" class="skills-stack snap-start bg-black pt-24 pb-10 sm:pt-28 sm:pb-16 min-h-screen flex flex-col justify-center">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 w-full">
				<div class="mb-10 text-center sm:mb-16">
					<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
						My <span class="text-[#B58A6C]">Tech Stack</span>
					</h2>
					<p class="mt-4 text-base text-white/40 sm:text-lg">
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
