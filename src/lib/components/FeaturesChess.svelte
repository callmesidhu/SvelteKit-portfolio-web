<script lang="ts">
	import Icons from './Icons.svelte';
	import BlurText from './BlurText.svelte';

	const rows = [
		{
			title: 'Designed to convert. Built to perform.',
			body: 'Every pixel is intentional. My approach studies what works across thousands of top products — then builds yours to outperform them all. From micro-interactions to core architecture.',
			cta: 'See My Work',
			ctaHref: '#work',
			gif: '/images/feature-1.gif',
			reverse: false
		},
		{
			title: 'Full-stack. End to end. Always.',
			body: 'Frontend finesse meets backend muscle. React, Next.js, SvelteKit, Node, Python — I architect systems that scale. No handoffs, no silos. Just clean, cohesive product.',
			cta: 'Explore Skills',
			ctaHref: '#skills',
			gif: '/images/feature-2.gif',
			reverse: true
		}
	];
</script>

<section id="work" class="px-6 py-24">
	<div class="mx-auto max-w-6xl">
		<!-- Section header -->
		<div class="mb-16 flex flex-col items-center gap-4 text-center">
			<div class="liquid-glass inline-flex rounded-full px-3.5 py-1">
				<span class="font-body text-xs font-medium text-white">Capabilities</span>
			</div>
			<h2
				class="font-heading text-4xl leading-[0.9] tracking-tight text-white italic md:text-5xl lg:text-6xl"
			>
				<BlurText text="Pro skills. Zero complexity." delay={100} direction="bottom" />
			</h2>
		</div>

		<!-- Rows -->
		{#each rows as row, i (row.title)}
			<div
				class="mb-20 flex flex-col items-center gap-12 lg:flex-row"
				class:lg:flex-row-reverse={row.reverse}
			>
				<!-- Text side -->
				<div class="flex flex-1 flex-col gap-6">
					<h3 class="font-heading text-3xl leading-tight text-white italic">{row.title}</h3>
					<p class="font-body text-sm leading-relaxed font-light text-white/60 md:text-base">
						{row.body}
					</p>
					<a
						href={row.ctaHref}
						class="liquid-glass-strong inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white transition-transform duration-200 hover:scale-105"
					>
						{row.cta}
						<Icons name="ArrowUpRight" size={15} />
					</a>
				</div>

				<!-- Image side -->
				<div class="w-full flex-1">
					<div class="liquid-glass overflow-hidden rounded-2xl">
						<img src={row.gif} alt={row.title} class="h-auto w-full object-cover" loading="lazy" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
