<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs, query, orderBy } from 'firebase/firestore';

	interface Experience {
		id: string; title: string; company: string; type: string;
		duration: string; location: string; description: string;
		skills: string[]; rank: number;
	}

	const CARD_W = 350, CARD_H = 250, STEP = 400, PAD = 200, AMP = 100;
	const WAVE_BASE = [-AMP, 0, AMP, 0]; // static vertical positions

	let experiences = $state<Experience[]>([]);
	let loading     = $state(true);
	let outer: HTMLElement;  // tall outer div
	let section: HTMLElement; // sticky inner div
	let pathEl: SVGPathElement | null = null;

	// Smooth scroll state (lerped)
	let displayX = $state(0);
	let targetX  = 0;
	let progress = $state(0);
	let pathLen  = $state(8000);
	let vh = 0, vw = 0;
	let outerH = $state(4000); // updated after data loads

	const count  = $derived(loading ? 5 : experiences.length);
	const trackW = $derived(PAD + count * STEP + CARD_W + PAD);
	function maxX() { return Math.max(0, trackW - vw); }

	// Static wave base + dynamic ripple based on scroll progress
	function cardY(i: number): number {
		const base  = WAVE_BASE[i % 4];
		const ripple = Math.sin(progress * Math.PI * 4 + i * 1.1) * 18;
		return base + ripple;
	}
	function cardTop(i: number) { return vh / 2 + cardY(i) - CARD_H / 2; }

	function buildPath(): string {
		if (!vh) return '';
		const mid = vh / 2;
		const pts = [
			{ x: 0, y: mid },
			...Array.from({ length: count }, (_, i) => ({
				x: PAD + i * STEP + CARD_W / 2,
				y: mid + cardY(i)
			})),
			{ x: trackW, y: mid }
		];
		let d = `M ${pts[0].x} ${pts[0].y}`;
		for (let i = 1; i < pts.length; i++) {
			const a = pts[i - 1], b = pts[i], cx = (a.x + b.x) / 2;
			d += ` C ${cx} ${a.y} ${cx} ${b.y} ${b.x} ${b.y}`;
		}
		return d;
	}

	function recalc() {
		vh = window.innerHeight;
		vw = window.innerWidth;
		// outer height = viewport height + horizontal scroll distance
		outerH = vh + Math.max(0, trackW - vw) + 60;
	}

	onMount(async () => {
		recalc();

		try {
			const snap = await getDocs(query(collection(db, 'experience'), orderBy('rank', 'asc')));
			experiences = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Experience);
		} catch (e) { console.error(e); } finally { loading = false; }

		// Recalc after data (trackW changes when count changes)
		requestAnimationFrame(() => {
			recalc();
			if (pathEl) pathLen = pathEl.getTotalLength();
		});

		// ── RAF loop: lerp displayX toward targetX ────────────────────────
		let rafId: number;
		function loop() {
			const dist = targetX - displayX;
			displayX = Math.abs(dist) > 0.3 ? displayX + dist * 0.09 : targetX;
			progress = maxX() > 0 ? displayX / maxX() : 0;
			rafId = requestAnimationFrame(loop);
		}
		rafId = requestAnimationFrame(loop);

		// ── Native scroll drives horizontal progress ──────────────────────
		// Outer div is tall; as page scrolls INTO it, targetX increases.
		// Scrolling back UP decreases targetX. No wheel interception needed.
		function onScroll() {
			if (!outer) return;
			const scrollable = outer.offsetHeight - vh;
			const scrolled   = Math.max(0, Math.min(scrollable, -outer.getBoundingClientRect().top));
			const raw = scrollable > 0 ? scrolled / scrollable : 0;
			targetX = raw * Math.max(0, trackW - vw);
		}

		function onResize() {
			recalc();
			if (pathEl) pathLen = pathEl.getTotalLength();
			onScroll();
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<!-- Tall outer div gives browser real scroll distance -->
<div bind:this={outer} style="position:relative; height:{outerH}px">

<!-- Sticky inner: pins at top while user scrolls through outer -->
<div bind:this={section} class="exp-section" id="experience">

	<!-- Section heading (static, centered top) -->
	<div class="heading">
		<p class="heading-sub">The journey that shaped my craft</p>
		<h2 class="heading-title">Work <span>Experience</span></h2>
	</div>

	<!-- Static glowing reference line at 50vh (z-index: 0, behind cards) -->
	<div class="ref-line"></div>

	<!-- Horizontally translated track -->
	<div class="track" style="transform:translateX(-{displayX}px); width:{trackW}px">

		<!-- Animated wave SVG -->
		{#if vh}
			<svg class="wave-svg" viewBox="0 0 {trackW} {vh}" width={trackW} height={vh}>
				<defs>
					<filter id="wave-glow" x="-20%" y="-200%" width="140%" height="500%">
						<feGaussianBlur stdDeviation="4" result="blur"/>
						<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
					</filter>
				</defs>
				<path d={buildPath()} fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1.5"/>
				<path
					bind:this={pathEl}
					d={buildPath()}
					fill="none"
					stroke="#B58A6C"
					stroke-width="2.5"
					stroke-dasharray={pathLen}
					stroke-dashoffset={pathLen * (1 - progress)}
					filter="url(#wave-glow)"
					style="transition:stroke-dashoffset .05s linear"
				/>
			</svg>
		{/if}

		<!-- Cards — positioned dynamically with wave ripple -->
		{#if loading}
			{#each Array(5) as _, i (i)}
				<div
					class="card skel"
					style="left:{PAD+i*STEP}px; top:{vh/2-CARD_H/2}px; width:{CARD_W}px; height:{CARD_H}px"
				>
					<div class="sk l"></div><div class="sk m mt2"></div>
					<div class="sk f mt4"></div><div class="sk s"></div>
				</div>
			{/each}
		{:else}
			{#each experiences as exp, i (exp.id)}
				<div
					class="card"
					style="
						left:{PAD+i*STEP}px;
						top:{cardTop(i)}px;
						width:{CARD_W}px;
						height:{CARD_H}px;
						--delay:{i*0.05}s;
					"
				>
					<div class="card-glow"></div>

					<div class="ch">
						<span class="cn">{String(i+1).padStart(2,'0')}</span>
						{#if exp.type}<span class="badge">{exp.type}</span>{/if}
					</div>
					<h3 class="ct">{exp.title}</h3>
					<p class="cc"><span class="pip"></span>{exp.company}</p>
					<div class="meta">
						{#if exp.duration}<span class="pill">📅 {exp.duration}</span>{/if}
						{#if exp.location}<span class="pill">📍 {exp.location}</span>{/if}
					</div>
					{#if exp.description}<p class="cd">{exp.description}</p>{/if}
					{#if exp.skills?.length}
						<div class="skills">{#each exp.skills as sk (sk)}<span class="sk-tag">{sk}</span>{/each}</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	<!-- Scroll hint -->
	<div class="cue" style:opacity={progress < 0.04 ? 1 : 0}>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
		<span>Scroll to explore</span>
	</div>
</div> <!-- /exp-section (sticky) -->
</div> <!-- /outer (tall scroll container) -->

<style>
	/* ── Section ───────────────────────────────────────────────────────── */
	.exp-section {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
		background: #000;
	}

	/* ── Section heading (centered top) ──────────────────────────────── */
	.heading {
		position: absolute;
		top: 40px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 10;
		pointer-events: none;
		white-space: nowrap;
	}
	.heading-sub {
		font-size: .68rem;
		letter-spacing: .28em;
		text-transform: uppercase;
		color: rgba(255,255,255,.28);
		margin-bottom: 6px;
	}
	.heading-title {
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 800;
		color: #fff;
		line-height: 1;
		margin: 0;
		letter-spacing: -.02em;
	}
	.heading-title span { color: #B58A6C; }

	/* ── Glowing reference line ────────────────────────────────────────── */
	.ref-line {
		position: absolute;
		top: 50%; left: 0; right: 0;
		height: 1px;
		transform: translateY(-50%);
		background: rgba(181,138,108,0.12);
		box-shadow: 0 0 20px 4px rgba(181,138,108,0.18), 0 0 60px 8px rgba(181,138,108,0.08);
		pointer-events: none;
		z-index: 0;
	}


	/* ── Horizontal track ─────────────────────────────────────────────── */
	.track {
		position: absolute;
		top: 0; left: 0;
		height: 100%;
		/* no CSS transition — RAF loop handles smoothness */
	}

	/* ── SVG wave (behind cards) ──────────────────────────────────────── */
	.wave-svg { position:absolute; top:0; left:0; pointer-events:none; z-index:1; }

	/* ── Card ─────────────────────────────────────────────────────────── */
	.card {
		position: absolute;
		background: rgba(12,12,14,0.85);
		border: 1px solid rgba(255,255,255,.08);
		border-radius: 20px;
		padding: 22px 20px;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		transition: border-color .35s, box-shadow .35s;
		z-index: 4;
		overflow: hidden;
	}
	.card:hover {
		border-color: rgba(181,138,108,.4);
		box-shadow: 0 0 40px rgba(181,138,108,.08), 0 24px 48px rgba(0,0,0,.5);
	}

	/* Inner glow that activates on hover */
	.card-glow {
		position: absolute;
		inset: 0;
		border-radius: 20px;
		background: radial-gradient(circle at 50% -20%, rgba(181,138,108,.12) 0%, transparent 70%);
		opacity: 0;
		transition: opacity .35s;
		pointer-events: none;
	}
	.card:hover .card-glow { opacity: 1; }

	.ch { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
	.cn { font-size:1.9rem; font-weight:800; color:rgba(181,138,108,.12); line-height:1; user-select:none; }
	.badge {
		font-size:.57rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em;
		color:#B58A6C; background:rgba(181,138,108,.1); border:1px solid rgba(181,138,108,.2);
		border-radius:99px; padding:3px 10px;
	}
	.ct { font-size:1.05rem; font-weight:700; color:#fff; margin:0 0 5px; line-height:1.3; }
	.cc { display:flex; align-items:center; gap:6px; font-size:.76rem; font-weight:600; color:#B58A6C; margin-bottom:12px; }
	.pip { width:5px; height:5px; border-radius:50%; background:#B58A6C; flex-shrink:0; }
	.meta { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:11px; }
	.pill {
		display:inline-flex; align-items:center; gap:4px; font-size:.68rem;
		color:rgba(255,255,255,.32); background:rgba(255,255,255,.04);
		border:1px solid rgba(255,255,255,.07); border-radius:99px; padding:2px 9px;
	}
	.cd {
		font-size:.76rem; line-height:1.65; color:rgba(255,255,255,.38); margin-bottom:12px;
		display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
	}
	.skills { display:flex; flex-wrap:wrap; gap:4px; }
	.sk-tag {
		font-size:.6rem; font-weight:600; color:rgba(255,255,255,.36);
		background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
		border-radius:6px; padding:2px 7px;
		transition: color .2s, border-color .2s;
	}
	.card:hover .sk-tag { color:rgba(255,255,255,.65); border-color:rgba(181,138,108,.2); }

	/* ── Skeleton ─────────────────────────────────────────────────────── */
	.skel { pointer-events:none; }
	.sk { height:10px; border-radius:5px; margin-bottom:6px; background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.09),rgba(255,255,255,.04)); background-size:200% 100%; animation:shimmer 1.5s infinite; }
	.sk.l { width:38%; height:13px; }
	.sk.m { width:58%; }
	.sk.f { width:100%; }
	.sk.s { width:72%; }
	.mt2 { margin-top:8px; }
	.mt4 { margin-top:16px; }
	@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

	/* ── Scroll cue ───────────────────────────────────────────────────── */
	.cue {
		position:absolute; bottom:30px; right:44px; z-index:10;
		display:flex; align-items:center; gap:8px;
		font-size:.7rem; letter-spacing:.12em; color:rgba(255,255,255,.22);
		transition:opacity .6s ease; pointer-events:none;
		animation:nudge 2s ease-in-out infinite;
	}
	@keyframes nudge { 0%,100%{transform:translateX(0)} 50%{transform:translateX(7px)} }

	/* ── Mobile ───────────────────────────────────────────────────────── */
	@media (max-width:768px) {
		.exp-section { overflow-x:auto; scrollbar-width:none; }
		.exp-section::-webkit-scrollbar { display:none; }
		.track { transform:none !important; }
		.ref-line, .prog-bar, .cue, .heading { display:none; }
	}
</style>
