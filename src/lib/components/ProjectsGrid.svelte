<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs, query, orderBy } from 'firebase/firestore';

	interface Project {
		id: string;
		title: string;
		tech: string;
		description: string;
		link: string;
		image: string;
	}

	let projects = $state<Project[]>([]);
	let loading  = $state(true);

	const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNDQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';

	onMount(async () => {
		try {
			const snap = await getDocs(query(collection(db, 'projects'), orderBy('id', 'asc')));
			projects = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Project);
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	// Split projects into 3 rows (cycle through if fewer than needed)
	function makeRow(all: Project[], rowIndex: number, total = 5): Project[] {
		if (!all.length) return [];
		// Pick projects for this row by rotating offset
		const offset = rowIndex * 2;
		const result: Project[] = [];
		for (let i = 0; i < total; i++) {
			result.push(all[(offset + i) % all.length]);
		}
		return result;
	}

	// Skeleton items for loading state
	const SKEL = Array(6).fill(null);
</script>

<section id="projects" class="projects-section">

	<!-- Scrolling rows -->
	<div class="rows-wrap">

		{#each [0, 1, 2] as rowIdx (rowIdx)}
			{@const reverse = rowIdx % 2 === 1}
			<div class="row-track {reverse ? 'row-rtl' : 'row-ltr'}">
				<!-- Inner strip duplicated for seamless loop -->
				<div class="row-strip">
					{#if loading}
						{#each SKEL as _, i (i)}
							<div class="card skel" style="--i:{i}"></div>
						{/each}
						{#each SKEL as _, i (i)}
							<div class="card skel" style="--i:{i}"></div>
						{/each}
					{:else}
						{@const row = makeRow(projects, rowIdx)}
						<!-- Original set -->
						{#each row as proj (proj.id + '-' + rowIdx + '-a')}
							<a class="card" href={proj.link || '#'} target="_blank" rel="noopener" title={proj.title}>
								<img
									src={proj.image || PLACEHOLDER}
									alt={proj.title}
									loading="lazy"
									onerror={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
								/>
								<div class="card-info">
									<p class="card-title">{proj.title}</p>
									{#if proj.tech}<p class="card-tech">{proj.tech}</p>{/if}
								</div>
							</a>
						{/each}
						<!-- Duplicate for seamless loop -->
						{#each row as proj (proj.id + '-' + rowIdx + '-b')}
							<a class="card" href={proj.link || '#'} target="_blank" rel="noopener" title={proj.title} aria-hidden="true" tabindex="-1">
								<img
									src={proj.image || PLACEHOLDER}
									alt=""
									loading="lazy"
									onerror={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
								/>
								<div class="card-info">
									<p class="card-title">{proj.title}</p>
									{#if proj.tech}<p class="card-tech">{proj.tech}</p>{/if}
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</div>
		{/each}

	</div>

	<!-- Vignette overlays -->
	<div class="vig vig-top"    aria-hidden="true"></div>
	<div class="vig vig-bottom" aria-hidden="true"></div>
	<div class="vig vig-left"   aria-hidden="true"></div>
	<div class="vig vig-right"  aria-hidden="true"></div>

	<!-- Center text overlay -->
	<div class="center-overlay">
		<h2 class="center-title">My <span>Projects</span></h2>
		<p class="center-desc">
			Ideas built into reality — each one a story of creativity and code.
		</p>
	</div>

</section>

<style>
	/* ── Section ───────────────────────────────────────────────────── */
	.projects-section {
		position: relative;
		width: 100%;
		height: 100svh;
		min-height: 480px;
		background: #000;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ── Rows wrapper ────────────────────────────────────────────────── */
	.rows-wrap {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px 0;
	}

	/* ── Single row track ────────────────────────────────────────────── */
	.row-track {
		flex: 1;
		min-height: 0; /* allow flex children to shrink */
		overflow: hidden;
		display: flex;
		align-items: stretch;
	}

	/* The moving strip — wide enough to hold 2× cards */
	.row-strip {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
		width: max-content;
		height: 100%;
	}

	/* Left-to-right: animate translateX 0 → -50% */
	.row-ltr .row-strip {
		animation: scroll-ltr 28s linear infinite;
	}
	/* Right-to-left: animate translateX -50% → 0 */
	.row-rtl .row-strip {
		animation: scroll-rtl 32s linear infinite;
	}

	/* Pause on hover */
	.row-track:hover .row-strip { animation-play-state: paused; }

	@keyframes scroll-ltr {
		from { transform: translateX(0); }
		to   { transform: translateX(-50%); }
	}
	@keyframes scroll-rtl {
		from { transform: translateX(-50%); }
		to   { transform: translateX(0); }
	}

	/* ── Card ────────────────────────────────────────────────────────── */
	.card {
		position: relative;
		flex-shrink: 0;
		width: 320px;
		height: 100%;
		border-radius: 10px;
		overflow: hidden;
		display: block;
		text-decoration: none;
		transition: transform .3s ease, box-shadow .3s ease;
	}

	.card:hover {
		box-shadow: 0 0 30px rgba(181,138,108,0.25);
		z-index: 2;
	}

	.card img {
		width: 100%; height: 100%;
		object-fit: cover;
		display: block;
		filter: brightness(0.55) saturate(0.75);
		transition: filter .35s ease;
	}
	.card:hover img {
		filter: brightness(0.4) saturate(0.6);
	}

	.card-info {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 12px 14px;
		background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
		opacity: 1;
		transition: opacity .3s ease;
	}

	.card-title { font-size: .8rem; font-weight: 700; color: #fff; margin: 0 0 3px; }
	.card-tech  { font-size: .62rem; color: #B58A6C; margin: 0; }

	/* ── Skeleton ────────────────────────────────────────────────────── */
	.skel {
		width: 260px;
		background: linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.08), rgba(255,255,255,.04));
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		animation-delay: calc(var(--i) * 0.1s);
	}
	@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

	/* ── Vignettes ───────────────────────────────────────────────────── */
	.vig {
		position: absolute;
		pointer-events: none;
		z-index: 3;
	}
	.vig-top    { top:0; left:0; right:0; height:28%; background: linear-gradient(to bottom, #000 0%, transparent 100%); }
	.vig-bottom { bottom:0; left:0; right:0; height:28%; background: linear-gradient(to top, #000 0%, transparent 100%); }
	.vig-left   { top:0; bottom:0; left:0; width:10%; background: linear-gradient(to right, #000 0%, transparent 100%); }
	.vig-right  { top:0; bottom:0; right:0; width:10%; background: linear-gradient(to left, #000 0%, transparent 100%); }

	/* ── Center overlay ──────────────────────────────────────────────── */
	.center-overlay {
		position: relative;
		z-index: 10;
		text-align: center;
		padding: 36px 28px;
		max-width: 480px;
	}

	.center-sub {
		font-size: .62rem;
		letter-spacing: .3em;
		text-transform: uppercase;
		color: rgba(255,255,255,.3);
		margin-bottom: 8px;
	}

	.center-title {
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		font-weight: 800;
		color: #fff;
		line-height: 1.1;
		margin: 0 0 12px;
		letter-spacing: -.03em;
	}
	.center-title span { color: #B58A6C; }

	.center-desc {
		font-size: .8rem;
		color: rgba(255,255,255,.38);
		line-height: 1.65;
		margin-bottom: 18px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		font-size: .6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: .08em;
		color: rgba(255,255,255,.55);
		background: rgba(255,255,255,.06);
		border: 1px solid rgba(255,255,255,.1);
		border-radius: 99px;
		padding: 3px 11px;
		backdrop-filter: blur(4px);
	}

	/* ── Mobile ───────────────────────────────────────────────────── */
	@media (max-width: 480px) {
		.card { width: 160px; }
		.center-overlay { padding: 16px 12px; max-width: 85vw; }
		.center-title { font-size: clamp(1.6rem, 7vw, 2.2rem); }
		.vig-top    { height: 22%; }
		.vig-bottom { height: 22%; }
	}
	@media (max-width: 400px) {
		.card { width: 140px; }
		.center-overlay { padding: 12px 10px; max-width: 90vw; }
		.center-title { font-size: clamp(1.4rem, 8vw, 1.8rem); }
		.rows-wrap { gap: 6px; padding: 6px 0; }
		.row-strip { gap: 6px; }
	}
	@media (max-width: 768px) {
		.card { width: 200px; }
		.vig-left, .vig-right { display: none; }
		.center-overlay { padding: 24px 18px; max-width: 90vw; }
	}
</style>
