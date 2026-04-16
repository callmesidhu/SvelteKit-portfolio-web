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
		class="pointer-events-none absolute top-0 right-0 left-0 z-10"
		style="height: 200px; background: linear-gradient(to bottom, black, transparent);"
	></div>
	<div
		class="pointer-events-none absolute right-0 bottom-0 left-0 z-10"
		style="height: 200px; background: linear-gradient(to top, black, transparent);"
	></div>

	<!-- CTA Content -->
	<div class="relative z-20 mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
		<div class="liquid-glass inline-flex rounded-full px-3.5 py-1">
			<span class="font-body text-xs font-medium text-white">Let's Build</span>
		</div>

		<h2
			class="font-heading text-5xl leading-[0.85] tracking-tight text-white italic md:text-6xl lg:text-7xl"
		>
			<BlurText text="Your next project starts here." delay={100} direction="bottom" />
		</h2>

		<p class="max-w-xl font-body text-sm leading-relaxed font-light text-white/60 md:text-base">
			Let's talk about what you're building. Free discovery call — no commitment, no pressure. Just
			possibilities and a developer who cares.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-4">
			<a
				href="mailto:hello@callmesidhu.xyphx.com"
				class="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white transition-transform duration-200 hover:scale-105"
			>
				Book a Call
				<Icons name="ArrowUpRight" size={16} />
			</a>
			<a
				href="#work"
				class="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-body text-sm font-medium text-black transition-transform duration-200 hover:scale-105"
			>
				View My Work
			</a>
		</div>
	</div>

	<!-- Footer -->
	<div class="relative z-20 mx-auto mt-32 max-w-6xl border-t border-white/10 px-6 py-8">
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<p class="font-body text-xs text-white/40">© {year} callmesidhu · All rights reserved.</p>
			<div class="flex items-center gap-6">
				<a
					href="/privacy"
					class="font-body text-xs text-white/40 transition-colors hover:text-white/70">Privacy</a
				>
				<a
					href="/terms"
					class="font-body text-xs text-white/40 transition-colors hover:text-white/70">Terms</a
				>
				<a
					href="mailto:hello@callmesidhu.xyphx.com"
					class="font-body text-xs text-white/40 transition-colors hover:text-white/70">Contact</a
				>
			</div>
		</div>
	</div>
</section>
