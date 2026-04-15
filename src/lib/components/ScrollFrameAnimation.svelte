<script lang="ts">
  import { onMount } from 'svelte';

  // ─── Config ────────────────────────────────────────────────────────────────
  const TOTAL_FRAMES = 552;
  const FRAME_PATH = (n: number) =>
    `/frames/frame_${String(n).padStart(4, '0')}.jpg`;

  // ─── State ─────────────────────────────────────────────────────────────────
  let canvas: HTMLCanvasElement;
  let container: HTMLElement;

  let currentFrame = $state(0);
  let loadedCount  = $state(0);
  let isReady      = $state(false);

  const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
  let ctx: CanvasRenderingContext2D | null = null;
  let rafId: number;

  // ─── Preload all frames ────────────────────────────────────────────────────
  function preloadFrames() {
    let loaded = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        loaded++;
        loadedCount = loaded;
        if (loaded === TOTAL_FRAMES) {
          isReady = true;
          unlockScroll();   // re-enable scroll once everything is loaded
          drawFrame(0);
        }
      };
      img.onerror = () => {
        // count broken frames so we don't hang forever
        loaded++;
        loadedCount = loaded;
        if (loaded === TOTAL_FRAMES) { isReady = true; unlockScroll(); }
      };
      images[i] = img;
    }
  }

  // ─── Draw a specific frame (contain-fit — no crop, no zoom) ──────────────
  function drawFrame(index: number) {
    if (!ctx || !canvas) return;
    const img = images[index];
    if (!img?.complete || !img.naturalWidth) return;

    // Physical pixel dimensions
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // CONTAIN: scale so entire image is always visible
    const scale = Math.min(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }

  // ─── Resize canvas to match CSS size × device pixel ratio ─────────────────
  function resizeCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    drawFrame(currentFrame);
  }

  // ─── Scroll Lock helpers ───────────────────────────────────────────────────
  function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  // ─── Frame scrubbing via wheel / touch ────────────────────────────────────
  //     We intercept wheel events ourselves and advance frames.
  //     Only when the last frame is reached do we unlock native scroll.

  let finished = false;
  let touchStartY = 0;

  function onWheel(e: WheelEvent) {
    if (!isReady || finished) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? 1 : -1;
    // advance by ~2 frames per wheel tick for a responsive feel
    targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrame + delta * 2));

    if (targetFrame >= TOTAL_FRAMES - 1) {
      finished = true;
      unlockScroll();
    } else {
      finished = false;
    }
  }

  function onTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e: TouchEvent) {
    if (!isReady || finished) return;
    e.preventDefault();
    const dy = touchStartY - e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
    const delta = dy > 0 ? 1 : -1;
    targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrame + delta * 2));

    if (targetFrame >= TOTAL_FRAMES - 1) {
      finished = true;
      unlockScroll();
    } else {
      finished = false;
    }
  }

  // ─── rAF render loop ──────────────────────────────────────────────────────
  let targetFrame  = 0;
  let renderedFrame = -1;

  function loop() {
    if (renderedFrame !== targetFrame) {
      // lerp: step by ≤4 frames per tick
      const delta = targetFrame - renderedFrame;
      const step  = Math.sign(delta) * Math.min(Math.abs(delta), 4);
      renderedFrame = Math.round(renderedFrame + step);
      currentFrame  = renderedFrame;
      drawFrame(renderedFrame);
    }
    rafId = requestAnimationFrame(loop);
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  onMount(() => {
    ctx = canvas.getContext('2d');
    resizeCanvas();

    // Lock scroll immediately while frames load
    lockScroll();
    preloadFrames();

    renderedFrame = 0;
    rafId = requestAnimationFrame(loop);

    // Wheel listener (passive:false so we can preventDefault)
    window.addEventListener('wheel', onWheel, { passive: false });
    // Touch
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      unlockScroll();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  });

  // ─── Derived ───────────────────────────────────────────────────────────────
  let loadProgress  = $derived(Math.round((loadedCount  / TOTAL_FRAMES)       * 100));
  let frameProgress = $derived(Math.round((currentFrame / (TOTAL_FRAMES - 1)) * 100));
</script>

<!--
  The section itself has no scroll height — instead we intercept wheel/touch
  events manually and only release scroll once the final frame is reached.
-->
<section
  bind:this={container}
  class="frame-anim-container"
  aria-label="Scroll animation"
>
  <div class="sticky-canvas">
    <canvas bind:this={canvas} class="frame-canvas"></canvas>

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

    <!-- Progress bar (visible while scrubbing) -->
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

    <!-- Scroll cue -->
    {#if isReady}
      <div class="scroll-cue" style:opacity={currentFrame < 5 ? 1 : 0}>
        <span class="scroll-cue-text">Scroll to explore</span>
        <div class="scroll-chevron">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  /* ── Full-viewport sticky section ─────────────────────────────────────── */
  .frame-anim-container {
    position: relative;
    width: 100%;
    height: 100vh; /* just one viewport tall — no extra scroll space needed */
  }

  .sticky-canvas {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    background: #000;
  }

  /* Canvas fills wrapper exactly */
  .frame-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ── Loading overlay ──────────────────────────────────────────────────── */
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
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: rgba(255,255,255,0.9);
    animation: spin 0.9s linear infinite;
  }

  .loader-pct {
    font-family: 'Barlow', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.5px;
  }

  .loader-label {
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.3px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Progress bar ─────────────────────────────────────────────────────── */
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
    background: rgba(255,255,255,0.15);
    border-radius: 99px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: rgba(255,255,255,0.75);
    border-radius: 99px;
    transition: width 0.04s linear;
  }

  /* ── Scroll cue ───────────────────────────────────────────────────────── */
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
    color: rgba(255,255,255,0.5);
  }

  .scroll-chevron {
    animation: bob 1.4s ease-in-out infinite;
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(6px); }
  }
</style>
