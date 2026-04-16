<script lang="ts">
	import Icons from './Icons.svelte';
	import BlurText from './BlurText.svelte';

	const features = [
		{
			icon: 'Zap',
			title: 'Ship-Ready Speed',
			body: "Concept to production at a pace that redefines fast. Days, not months. Because waiting isn't a strategy."
		},
		{
			icon: 'Palette',
			title: 'Design Obsessed',
			body: 'Every detail considered. Every element refined. UI so precise and polished it feels inevitable.'
		},
		{
			icon: 'BarChart3',
			title: 'Performance-First',
			body: 'Architecture informed by metrics. Every decision backed by data. Results you can actually benchmark.'
		},
		{
			icon: 'Shield',
			title: 'Production-Grade',
			body: 'Enterprise patterns, zero-downtime deploys, CI/CD pipelines, type-safety end to end. All standard.'
		}
	];
</script>

<section id="skills" class="px-6 py-24">
	<div class="mx-auto max-w-6xl">
		<!-- Section header -->
		<div class="mb-14 flex flex-col items-center gap-4 text-center">
			<div class="liquid-glass inline-flex rounded-full px-3.5 py-1">
				<span class="font-body text-xs font-medium text-white">Why Me</span>
			</div>
			<h2
				class="font-heading text-4xl leading-[0.9] tracking-tight text-white italic md:text-5xl lg:text-6xl"
			>
				<BlurText text="The difference is everything." delay={100} direction="bottom" />
			</h2>
		</div>

		<!-- Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<div
					class="liquid-glass flex flex-col gap-4 rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.02]"
				>
					<div
						class="liquid-glass-strong flex h-10 w-10 items-center justify-center rounded-full text-white"
					>
						<Icons name={feature.icon} size={18} />
					</div>
					<h3 class="font-body text-base font-medium text-white">{feature.title}</h3>
					<p class="font-body text-sm leading-relaxed font-light text-white/60">{feature.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
