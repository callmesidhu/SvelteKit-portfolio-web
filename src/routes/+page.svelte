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

<SEO
	title="CallMeSidhu | Full Stack Developer & Founder of XyphX"
	description="Sidharth, known as CallMeSidhu, is a Full Stack Developer, Founder & CEO of XyphX, Freelancer, and Software Engineer specializing in React, Node.js, Flutter, Cloudflare, DevOps, AI and modern web technologies."
	canonical="https://callmesidhu.xyphx.com"
	breadcrumbs={[{ name: 'Home', item: 'https://callmesidhu.xyphx.com' }]}
/>

<div class="bg-black">
	<!-- Navbar floats above everything -->
	<Navbar />

	<main>
		<!-- SEO Boost Content (Visually Hidden for Screen Readers & Search Engines) -->
		<div class="sr-only">
			<h1>CallMeSidhu - Full Stack Developer & Founder of XyphX</h1>
			<p>
				Sidharth, known as CallMeSidhu, is a Full Stack Developer, Founder & CEO of XyphX,
				Freelancer, and Software Engineer specializing in React, Node.js, Flutter, Cloudflare,
				DevOps, AI and modern web technologies.
			</p>
			<a href="https://github.com/callmesidhu">GitHub</a>
			<a href="https://linkedin.com/in/callmesidhu">LinkedIn</a>
		</div>
		<!-- Scroll-scrubbed frame animation (full viewport hero) -->
		<ScrollFrameAnimation />

		<!-- About Section Container (Handles sticky pinning on desktop) -->
		<div class="about-container">
			<!-- About Section (AI Chat Style) -->
			<section
				id="about"
				class="about-sticky flex min-h-screen flex-col justify-start bg-black pt-24 pb-6 sm:justify-between sm:pt-36 sm:pb-8"
			>
				<div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:flex-1 sm:justify-between sm:px-6">
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
		<section
			id="skills"
			class="skills-stack flex min-h-screen snap-start flex-col justify-center bg-black pt-24 pb-10 sm:pt-28 sm:pb-16"
		>
			<div class="mx-auto w-full max-w-7xl px-4 sm:px-6">
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
