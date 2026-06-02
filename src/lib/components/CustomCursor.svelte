<script lang="ts">
	import { onMount } from 'svelte';

	let mouseX = $state(-100);
	let mouseY = $state(-100);
	let isHovering = $state(false);
	let isVisible = $state(false);

	// Trailing dots
	const NUM_TRAILS = 6;
	let trails = $state(Array(NUM_TRAILS).fill({ x: -100, y: -100 }));
	let rafId: number;

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			if (!isVisible) isVisible = true;
		};

		const handleMouseLeave = () => {
			isVisible = false;
		};

		const handleMouseEnter = () => {
			isVisible = true;
		};

		// Add interactivity to links and buttons
		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.closest('a, button, input, textarea, [role="button"]')) {
				isHovering = true;
			} else {
				isHovering = false;
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('mouseenter', handleMouseEnter);
		window.addEventListener('mouseover', handleMouseOver);

		// Animation loop for trails
		const updateTrails = () => {
			let newTrails = [...trails];
			
			// First trail follows mouse
			newTrails[0] = {
				x: newTrails[0].x + (mouseX - newTrails[0].x) * 0.35,
				y: newTrails[0].y + (mouseY - newTrails[0].y) * 0.35
			};
			
			// Subsequent trails follow the previous one
			for (let i = 1; i < NUM_TRAILS; i++) {
				newTrails[i] = {
					x: newTrails[i].x + (newTrails[i - 1].x - newTrails[i].x) * 0.4,
					y: newTrails[i].y + (newTrails[i - 1].y - newTrails[i].y) * 0.4
				};
			}
			
			trails = newTrails;
			rafId = requestAnimationFrame(updateTrails);
		};
		
		rafId = requestAnimationFrame(updateTrails);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('mouseenter', handleMouseEnter);
			window.removeEventListener('mouseover', handleMouseOver);
			cancelAnimationFrame(rafId);
		};
	});
</script>

<!-- Trails rendered separately so they follow behind smoothly -->
{#if isVisible && !isHovering}
	{#each trails as trail, i}
		<div 
			class="cursor-trail"
			style="
				transform: translate({trail.x}px, {trail.y}px) translate(-50%, -50%);
				opacity: {1 - (i / NUM_TRAILS)};
				width: {8 - i}px;
				height: {8 - i}px;
			"
		></div>
	{/each}
{/if}

<!-- Main dot -->
<div 
	class="cursor-dot"
	class:visible={isVisible}
	class:hovering={isHovering}
	style="transform: translate({mouseX}px, {mouseY}px) translate(-50%, -50%);"
></div>

<!-- Text Wrapper -->
<div 
	class="custom-cursor-wrapper" 
	class:visible={isVisible}
	class:hovering={isHovering}
	style="transform: translate({mouseX}px, {mouseY}px);"
>
	<div class="cursor-text">
		<svg viewBox="0 0 100 100" width="80" height="80">
			<path id="cursor-curve" d="M 50 50 m -35 0 a 35 35 0 1 1 70 0 a 35 35 0 1 1 -70 0" fill="transparent" />
			<text class="svg-text">
				<textPath href="#cursor-curve" startOffset="0" textLength="220">
					CALLMESIDHU • CALLMESIDHU • 
				</textPath>
			</text>
		</svg>
	</div>
</div>

<style>
	:global(body) {
		/* Hide default cursor on desktop */
		cursor: none;
	}

	:global(a), :global(button), :global(input), :global(textarea) {
		cursor: none !important;
	}

	.custom-cursor-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		pointer-events: none;
		z-index: 99999;
		opacity: 0;
		transition: opacity 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		/* We don't transition transform here so it tracks instantly, but can use spring in JS if wanted */
	}

	.custom-cursor-wrapper.visible {
		opacity: 1;
	}

	.cursor-dot {
		position: fixed;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background-color: #B58A6C; 
		border-radius: 50%;
		pointer-events: none;
		z-index: 100000;
		opacity: 0;
		/* Use transition only for scale/color on hover, position tracks instantly */
		transition: width 0.2s ease, height 0.2s ease, background-color 0.2s ease, opacity 0.3s ease;
	}

	.cursor-dot.visible {
		opacity: 1;
	}

	.cursor-trail {
		position: fixed;
		top: 0;
		left: 0;
		background-color: #B58A6C; 
		border-radius: 50%;
		pointer-events: none;
		z-index: 99998;
	}

	.cursor-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: spin 10s linear infinite;
		transition: opacity 0.3s ease, transform 0.3s ease;
		opacity: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cursor-text svg {
		display: block;
	}

	.svg-text {
		font-family: 'Barlow', sans-serif;
		font-size: 13px;
		letter-spacing: 2px;
		font-weight: 600;
		fill: #B58A6C;
		text-transform: uppercase;
	}

	/* Hover state */
	.cursor-dot.hovering {
		width: 48px;
		height: 48px;
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(4px);
		mix-blend-mode: normal;
	}

	.custom-cursor-wrapper.hovering .cursor-text {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.8);
	}

	@keyframes spin {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	/* Disable on mobile */
	@media (max-width: 768px) {
		:global(body), :global(a), :global(button), :global(input), :global(textarea) {
			cursor: auto !important;
		}
		.custom-cursor-wrapper {
			display: none;
		}
	}
</style>
