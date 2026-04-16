<script lang="ts">
	import { onMount } from 'svelte';

	// ─── Config ────────────────────────────────────────────────────────────────
	const TOTAL_FRAMES = 552;
	const FRAME_PATH = (n: number) => `/frames/frame_${String(n).padStart(4, '0')}.jpg`;

	// How many viewport-heights tall the scroll section is.
	// More = slower, more cinematic. 5 means you scroll 4 full screens to finish.
	const SCROLL_MULTIPLIER = 5;

	// ─── DOM refs ──────────────────────────────────────────────────────────────
	let section: HTMLElement;
	let canvas: HTMLCanvasElement;

	// ─── Reactive state ────────────────────────────────────────────────────────
	let loadedCount = $state(0);
	let isReady = $state(false);
	let currentFrame = $state(0);

	// ─── Internal (non-reactive) ───────────────────────────────────────────────
	const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
	let ctx: CanvasRenderingContext2D | null = null;
	let rafId: number;
	let targetFrame = 0;
	let renderedFrame = 0;

	// ─── Preload ───────────────────────────────────────────────────────────────
	function preloadFrames() {
		let loaded = 0;
		for (let i = 0; i < TOTAL_FRAMES; i++) {
			const img = new Image();
			img.src = FRAME_PATH(i + 1);
			img.onload = img.onerror = () => {
				loadedCount = ++loaded;
				if (loaded === TOTAL_FRAMES) {
					isReady = true;
					drawFrame(0);
				}
			};
			images[i] = img;
		}
	}

	// ─── Draw a single frame — cover-fit, DPR-correct ────────────────────────
	function drawFrame(index: number) {
		if (!ctx || !canvas) return;
		const img = images[index];
		if (!img?.complete || !img.naturalWidth) return;

		const cw = canvas.width; // physical pixels
		const ch = canvas.height;
		const iw = img.naturalWidth;
		const ih = img.naturalHeight;

		// Object-fit: cover — fills full canvas, centres the image
		const scale = Math.max(cw / iw, ch / ih);
		const sw = iw * scale;
		const sh = ih * scale;
		const sx = (cw - sw) / 2;
		const sy = (ch - sh) / 2;

		ctx.clearRect(0, 0, cw, ch);
		ctx.drawImage(img, sx, sy, sw, sh);
	}

	// ─── Resize canvas (physical px = CSS px × DPR, no extra ctx.scale) ───────
	function resizeCanvas() {
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = canvas.offsetWidth * dpr;
		canvas.height = canvas.offsetHeight * dpr;
		ctx = canvas.getContext('2d');
		drawFrame(Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(renderedFrame))));
	}

	// ─── Scroll → target frame ────────────────────────────────────────────────
	function onScroll() {
		if (!section || !isReady) return;
		const rect = section.getBoundingClientRect();
		const sectionH = section.offsetHeight;
		// scrolled distance from the top of the section (clamped 0–sectionH)
		const scrolled = Math.max(0, Math.min(sectionH - window.innerHeight, -rect.top));
		const progress = scrolled / (sectionH - window.innerHeight);
		targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));
	}

	// ─── rAF render loop (lerp toward targetFrame) ────────────────────────────
	function loop() {
		onScroll(); // poll each frame — smooth without scroll jank

		const delta = targetFrame - renderedFrame;
		if (Math.abs(delta) > 0.5) {
			// lerp speed: approaches target at ~20% per tick (feels snappy but smooth)
			renderedFrame += delta * 0.2;
			const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(renderedFrame)));
			currentFrame = idx;
			drawFrame(idx);
		}

		rafId = requestAnimationFrame(loop);
	}

	// ─── Lifecycle ─────────────────────────────────────────────────────────────
	onMount(() => {
		ctx = canvas.getContext('2d');
		resizeCanvas();
		preloadFrames();

		rafId = requestAnimationFrame(loop);

		const ro = new ResizeObserver(resizeCanvas);
		ro.observe(canvas);

		return () => {
			cancelAnimationFrame(rafId);
			ro.disconnect();
		};
	});

	// ─── Derived ───────────────────────────────────────────────────────────────
	let loadProgress = $derived(Math.round((loadedCount / TOTAL_FRAMES) * 100));
	let frameProgress = $derived(Math.round((currentFrame / (TOTAL_FRAMES - 1)) * 100));
</script>

<!--
  Outer section is tall so the browser gives us real scroll distance.
  Inner sticky div holds the canvas at viewport height while the user scrolls.
-->
<section bind:this={section} class="frame-anim-section" aria-label="Scroll-driven frame animation">
	<div class="sticky-viewport">
		<canvas bind:this={canvas} class="frame-canvas"></canvas>

		<!-- Bottom-fade gradient — hides Veo watermark, blends into next section -->
		<div class="bottom-fade" aria-hidden="true"></div>

		<!-- Loading overlay -->
		{#if !isReady}
			<div class="loading-overlay" aria-live="polite">
				<div class="loader-inner">
					<div class="loader-ring"></div>
					<span class="loader-pct">{loadProgress}%</span>
				</div>
				<p class="loader-label">Loading frames…</p>
			</div>
		{/if}

		<!-- Progress bar -->
		{#if isReady}
			<div
				class="progress-bar-wrap"
				style:opacity={frameProgress > 1 && frameProgress < 99 ? 1 : 0}
			>
				<div class="progress-bar-track">
					<div class="progress-bar-fill" style:width="{frameProgress}%"></div>
				</div>
			</div>
		{/if}

		<!-- Scroll cue (only at start) -->
		{#if isReady}
			<div class="scroll-cue" style:opacity={currentFrame < 8 ? 1 : 0}>
				<span class="scroll-cue-text">Scroll to explore</span>
				<div class="scroll-chevron">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M6 9l6 6 6-6"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* ── Tall outer section — gives real scroll room ────────────────────────── */
	.frame-anim-section {
		position: relative;
		width: 100%;
		/* SCROLL_MULTIPLIER × 100vh = total scroll distance for this section */
		height: 700vh; /* 8 viewport heights = scroll through 7 screens worth (slower) */
	}

	/* ── Sticky inner — stays pinned while user scrolls through the section ─── */
	.sticky-viewport {
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background: #000;
	}

	/* ── Canvas fills sticky viewport exactly ─────────────────────────────── */
	.frame-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}

	/* ── Bottom-fade: transparent → black gradient overlay ──────────────────
     Covers bottom ~50% of the frame — hides the Veo watermark and creates
     the cinematic blend into the next section.                              */
	.bottom-fade {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 55%; /* how far up the fade starts                    */
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(0, 0, 0, 0.15) 40%,
			rgba(0, 0, 0, 0.65) 70%,
			#000 100%
		);
		pointer-events: none;
		z-index: 2; /* above canvas, below UI overlays               */
	}

	/* ── Loading overlay ─────────────────────────────────────────────────────── */
	.loading-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #000;
		gap: 16px;
		z-index: 10;
	}

	.loader-inner {
		position: relative;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loader-ring {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 3px solid rgba(255, 255, 255, 0.1);
		border-top-color: rgba(255, 255, 255, 0.9);
		animation: spin 0.9s linear infinite;
	}

	.loader-pct {
		font-family: 'Barlow', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
		letter-spacing: 0.5px;
	}

	.loader-label {
		font-family: 'Barlow', sans-serif;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.4);
		letter-spacing: 0.3px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ── Progress bar ─────────────────────────────────────────────────────────── */
	.progress-bar-wrap {
		position: absolute;
		bottom: 28px;
		left: 50%;
		transform: translateX(-50%);
		width: 140px;
		transition: opacity 0.4s ease;
		z-index: 5;
	}

	.progress-bar-track {
		height: 2px;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 99px;
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: rgba(255, 255, 255, 0.75);
		border-radius: 99px;
		transition: width 0.04s linear;
	}

	/* ── Scroll cue ───────────────────────────────────────────────────────────── */
	.scroll-cue {
		position: absolute;
		bottom: 36px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		transition: opacity 0.6s ease;
		z-index: 5;
		pointer-events: none;
	}

	.scroll-cue-text {
		font-family: 'Barlow', sans-serif;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
	}

	.scroll-chevron {
		animation: bob 1.4s ease-in-out infinite;
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(6px);
		}
	}
</style>
