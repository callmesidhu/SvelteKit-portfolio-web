<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import { appState } from '$lib/state.svelte';

	// ─── Config ────────────────────────────────────────────────────────────────
	const TOTAL_FRAMES = 373;
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

	// Loading Screen State
	let mouseX = $state(-1000);
	let mouseY = $state(-1000);
	let showLoadingScreen = $state(true);

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	$effect(() => {
		if (isReady) {
			setTimeout(() => {
				showLoadingScreen = false;
			}, 1000); // 1s dissolve duration
		}
	});

	// ─── Scroll Lock ───────────────────────────────────────────────────────────
	$effect(() => {
		appState.isInitialLoading = !isReady;
	});

	// ─── Internal (non-reactive) ───────────────────────────────────────────────
	const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
	let ctx: CanvasRenderingContext2D | null = null;
	let rafId: number;
	let targetFrame = 0;
	let renderedFrame = 0;

	// ─── Typing Animation ───────────────────────────────────────────────────────
	let roles = $state<string[]>([]);
	let roleIndex = $state(0);
	let charIndex = $state(0);
	let isDeleting = $state(false);
	let displayedText = $state('');
	let isTyping = $state(true);

	function type() {
		if (roles.length === 0) return;
		const currentRole = roles[roleIndex];

		if (isDeleting) {
			displayedText = currentRole.substring(0, charIndex - 1);
			charIndex--;
		} else {
			displayedText = currentRole.substring(0, charIndex + 1);
			charIndex++;
		}

		let typeSpeed = isDeleting ? 50 : 100;

		if (!isDeleting && charIndex === currentRole.length) {
			typeSpeed = 2000; // Pause at end
			isDeleting = true;
			isTyping = false;
		} else if (isDeleting && charIndex === 0) {
			isDeleting = false;
			roleIndex = (roleIndex + 1) % roles.length;
			typeSpeed = 500;
			isTyping = true;
		} else {
			isTyping = true;
		}

		setTimeout(type, typeSpeed);
	}

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

		// Fetch roles from Firebase
		const fetchRoles = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'roles'));
				const fetchedRoles = querySnapshot.docs.map(
					(doc) => doc.data() as { role: string; order: number }
				);
				// Sort by order
				fetchedRoles.sort((a, b) => (a.order || 0) - (b.order || 0));
				roles = fetchedRoles.map((r) => r.role);

				if (roles.length > 0) {
					type();
				}
			} catch (err) {
				console.error('Error fetching roles:', err);
				// Fallback if firebase fails
				roles = ['Full Stack Developer', 'App Developer', 'UI/UX Designer'];
				type();
			}
		};

		fetchRoles();

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
<section
	id="home"
	bind:this={section}
	class="frame-anim-section"
	style="height: {SCROLL_MULTIPLIER * 100}vh;"
	aria-label="Scroll-driven frame animation"
>
	<div class="sticky-viewport">
		<canvas bind:this={canvas} class="frame-canvas"></canvas>

		<!-- Top fade removed per user request -->

		<!-- Bottom-fade gradient — hides Veo watermark, blends into next section -->
		<div class="bottom-fade" aria-hidden="true"></div>

		<!-- Custom Spotlight Loading overlay -->
		{#if showLoadingScreen}
			<div
				class="custom-loading-screen"
				class:dissolving={isReady}
				onmousemove={handleMouseMove}
				role="presentation"
			>
				<div class="spotlight-image" style="--mouse-x: {mouseX}px; --mouse-y: {mouseY}px;"></div>

				<!-- Fades applied specifically to the loading background image -->
				<div class="top-fade" aria-hidden="true"></div>
				<div class="bottom-fade" aria-hidden="true"></div>
				<div class="subtle-loader" aria-live="polite">
					{loadProgress}%
				</div>
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

		<!-- Hero Text Overlay -->
		{#if isReady}
			<div
				class="hero-text-overlay"
				style:opacity={currentFrame < 15 ? 1 : Math.max(0, 1 - (currentFrame - 15) / 10)}
			>
				<div class="hero-content">
					<h1 class="hero-title">
						<span class="hero-name">S SIDHARTH</span>
						<div class="hero-role-wrapper">
							<span class="hero-role-prefix">Are you looking for a</span>
							<br class="lg:hidden" />
							<span class="hero-role-typing">{displayedText}?</span>
							<span class="hero-cursor" class:blink={!isTyping}></span>
						</div>
					</h1>
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
		/* height is set dynamically via inline style using SCROLL_MULTIPLIER */
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

	/* ── Top-fade: black → transparent gradient overlay ───────────────────────
     Adds a cinematic letterbox fade at the top edge of the frame.          */
	.top-fade {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 35%;
		background: linear-gradient(
			to bottom,
			#000 0%,
			rgba(0, 0, 0, 0.65) 20%,
			rgba(0, 0, 0, 0.15) 50%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 2;
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

	/* ── Custom Spotlight Loading overlay ─────────────────────────────────────── */
	.custom-loading-screen {
		position: absolute;
		inset: 0;
		background-color: #000;
		z-index: 100;
		transition: opacity 1s ease-in-out;
		overflow: hidden;
	}

	.custom-loading-screen.dissolving {
		opacity: 0;
		pointer-events: none;
	}

	.spotlight-image {
		position: absolute;
		inset: 0;
		background-image: url('/frames/frame_0001.jpg');
		background-size: cover;
		background-position: center;
		opacity: 0.5;
		mask-image: radial-gradient(
			circle 200px at var(--mouse-x, -1000px) var(--mouse-y, -1000px),
			black 0%,
			transparent 100%
		);
		-webkit-mask-image: radial-gradient(
			circle 200px at var(--mouse-x, -1000px) var(--mouse-y, -1000px),
			black 0%,
			transparent 100%
		);
		transition: opacity 0.3s;
	}

	.subtle-loader {
		position: absolute;
		bottom: 30px;
		right: 40px;
		font-family: 'Barlow', sans-serif;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.85);
		letter-spacing: 3px;
		font-weight: 600;
		z-index: 10;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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

	/* ── Hero Text Overlay ───────────────────────────────────────────────────── */
	.hero-text-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 5;
		pointer-events: none;
		transition: opacity 0.4s ease;
		background: radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
	}

	.hero-content {
		text-align: center;
		padding: 0 20px;
	}

	.hero-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.hero-name {
		font-family: 'Barlow', sans-serif;
		font-size: 14px;
		letter-spacing: 0.4em;
		color: #b58a6c;
		font-weight: 700;
		text-transform: uppercase;
		opacity: 0.9;
		animation: fadeInDown 1s ease-out;
	}

	.hero-role-wrapper {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 42px;
		font-weight: 800;
		color: white;
		letter-spacing: -0.02em;
	}

	.hero-role-prefix {
		color: rgba(255, 255, 255, 0.5);
		font-weight: 400;
	}

	.hero-role-typing {
		color: white;
		text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
	}

	.hero-cursor {
		display: inline-block;
		width: 3px;
		height: 40px;
		background-color: #b58a6c;
		margin-left: 4px;
		box-shadow: 0 0 10px #b58a6c;
	}

	.hero-cursor.blink {
		animation: cursorBlink 1s infinite;
	}

	@keyframes cursorBlink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 0.9;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.hero-role-wrapper {
			font-size: 30px;
			flex-direction: column;
			gap: 4px;
			align-items: center;
			text-align: center;
		}
		.hero-cursor {
			height: 32px;
		}
		.hero-content {
			padding: 0 16px;
		}
		.subtle-loader {
			bottom: 24px;
			left: 24px;
			font-size: 12px;
			letter-spacing: 2px;
		}
	}
	@media (max-width: 480px) {
		.hero-role-wrapper {
			font-size: 22px;
			gap: 2px;
		}
		.hero-cursor {
			height: 24px;
			width: 2px;
		}
		.hero-name {
			font-size: 11px;
			letter-spacing: 0.3em;
		}
		.subtle-loader {
			bottom: 16px;
			left: 16px;
			font-size: 11px;
			letter-spacing: 2px;
		}
	}
</style>
