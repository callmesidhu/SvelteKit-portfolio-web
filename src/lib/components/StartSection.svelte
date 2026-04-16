<script lang="ts">
	import Icons from './Icons.svelte';
	import HlsVideo from './HlsVideo.svelte';
	import BlurText from './BlurText.svelte';

	const HLS_URL = 'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8';
</script>

<section id="about" class="relative overflow-hidden py-40">
	<!-- HLS Video BG -->
	<HlsVideo src={HLS_URL} />

	<!-- Overlays -->
	<div
		class="pointer-events-none absolute top-0 right-0 left-0 z-10"
		style="height: 200px; background: linear-gradient(to bottom, black, transparent);"
	></div>
	<div
		class="pointer-events-none absolute right-0 bottom-0 left-0 z-10"
		style="height: 200px; background: linear-gradient(to top, black, transparent);"
	></div>

	<!-- Content -->
	<div
		class="relative z-20 mx-auto max-w-4xl px-6 text-center"
		style="min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem;"
	>
		<!-- Badge -->
		<div class="liquid-glass inline-flex rounded-full px-3.5 py-1">
			<span class="font-body text-xs font-medium text-white">About Me</span>
		</div>

		<!-- Heading -->
		<h2
			class="font-heading text-4xl leading-[0.9] tracking-tight text-white italic md:text-5xl lg:text-6xl"
		>
			<BlurText text="You dream it. I ship it." delay={120} direction="bottom" />
		</h2>

		<!-- Subtext -->
		<p class="max-w-xl font-body text-sm leading-relaxed font-light text-white/60 md:text-base">
			I'm S Sidharth — a full-stack developer who builds end-to-end digital products. Share your
			vision, I handle the rest — architecture, design, code, deploy. All in days, not quarters.
		</p>

		<!-- CTA -->
		<a
			href="#contact"
			class="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white transition-transform duration-200 hover:scale-105"
		>
			Work With Me
			<Icons name="ArrowUpRight" size={16} />
		</a>
	</div>
</section>
