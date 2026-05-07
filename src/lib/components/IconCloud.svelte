<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs, query, orderBy } from 'firebase/firestore';

	interface Icon {
		id: number;
		name: string;
		src: string;
	}

	let canvas: HTMLCanvasElement;
	let icons = $state<Icon[]>([]);
	let loading = $state(true);

	// ─── Constants ─────────────────────────────────────────────────────────────
	const RADIUS = 220;
	const ICON_SIZE = 45;
	const ROTATION_SPEED = 0.005;

	// ─── 3D State ─────────────────────────────────────────────────────────────
	let rotationX = 0;
	let rotationY = 0;
	let mouseX = 0;
	let mouseY = 0;
	let isMouseOver = false;

	class Point {
		x: number;
		y: number;
		z: number;
		img: HTMLImageElement | null = null;
		name: string;

		constructor(x: number, y: number, z: number, name: string, src: string) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.name = name;
			
			const img = new Image();
			img.src = src;
			img.onload = () => {
				this.img = img;
			};
		}

		rotate(rx: number, ry: number) {
			// Rotate around Y
			const cosY = Math.cos(ry);
			const sinY = Math.sin(ry);
			const x1 = this.x * cosY - this.z * sinY;
			const z1 = this.x * sinY + this.z * cosY;

			// Rotate around X
			const cosX = Math.cos(rx);
			const sinX = Math.sin(rx);
			const y1 = this.y * cosX - z1 * sinX;
			const z2 = this.y * sinX + z1 * cosX;

			this.x = x1;
			this.y = y1;
			this.z = z2;
		}

		draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
			const depth = 400;
			const scale = depth / (depth + this.z);
			const x2d = this.x * scale + width / 2;
			const y2d = this.y * scale + height / 2;

			if (this.img) {
				const size = ICON_SIZE * scale;
				
				// Calculate distance from canvas center in 2D to fade out at edges
				const dx = x2d - width / 2;
				const dy = y2d - height / 2;
				const dist2d = Math.sqrt(dx * dx + dy * dy);
				const maxRadius = Math.min(width, height) / 2;
				const edgeFade = Math.max(0, 1 - Math.pow(dist2d / maxRadius, 4));
				
				ctx.globalAlpha = Math.max(0, (scale - 0.1) * edgeFade);
				ctx.drawImage(this.img, x2d - size / 2, y2d - size / 2, size, size);
				
				// Optional: Draw text
				if (scale > 0.85 && edgeFade > 0.6) {
					ctx.font = `${Math.round(12 * scale)}px sans-serif`;
					ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, (edgeFade - 0.2) * 0.8)})`;
					ctx.textAlign = 'center';
					ctx.fillText(this.name, x2d, y2d + size / 2 + 15);
				}
			}
		}
	}

	let points: Point[] = [];

	// Refined fetch and point creation
	async function init() {
		try {
			const collections = ['languages', 'frameworks', 'technologies'];
			let allIcons: Icon[] = [];
			
			for (const col of collections) {
				const q = query(collection(db, col), orderBy('id', 'asc'));
				const snap = await getDocs(q);
				snap.forEach(doc => {
					allIcons.push(doc.data() as Icon);
				});
			}

			// Fallback icons if DB is empty
			if (allIcons.length === 0) {
				const fallbacks = [
					{ id: 1, name: 'Svelte', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
					{ id: 2, name: 'Nuxt', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg' },
					{ id: 3, name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
					{ id: 4, name: 'Flutter', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
					{ id: 5, name: 'Vue', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
					{ id: 6, name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
					{ id: 7, name: 'PHP', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
					{ id: 8, name: 'Laravel', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
					{ id: 9, name: 'Spring Boot', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
					{ id: 10, name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
					{ id: 11, name: 'NestJS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg' },
					{ id: 12, name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
					{ id: 13, name: 'C', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
					{ id: 14, name: 'C++', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
					{ id: 15, name: 'Arduino', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
					{ id: 16, name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
					{ id: 17, name: 'Next.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
					{ id: 18, name: 'FastAPI', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
					{ id: 19, name: 'Django', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
					{ id: 20, name: 'Flask', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
					{ id: 21, name: 'Firebase', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
					{ id: 22, name: 'Supabase', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
					{ id: 23, name: 'PowerBI', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Power_bi_logo_black.svg' },
					{ id: 24, name: 'Fastify', src: 'https://www.vectorlogo.zone/logos/fastifyio/fastifyio-icon.svg' }
				];
				allIcons = fallbacks;
			}
			
			icons = allIcons;
			
			// Create points on a sphere using Fibonacci lattice
			const n = icons.length;
			const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

			points = icons.map((icon, i) => {
				// Fibonacci sphere distribution
				const y = 1 - (i / (n - 1)) * 2; // y goes from 1 to -1
				const radiusAtY = Math.sqrt(1 - y * y); // radius at y
				const theta = phi * i; // golden angle increment

				const x = Math.cos(theta) * radiusAtY;
				const z = Math.sin(theta) * radiusAtY;

				return new Point(x * RADIUS, y * RADIUS, z * RADIUS, icon.name, icon.src);
			});
			
			loading = false;
		} catch (e) {
			console.error('Error initializing IconCloud:', e);
			loading = false;
		}
	}

	function render() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Adjust rotation based on mouse or auto
		let targetRX = ROTATION_SPEED;
		let targetRY = ROTATION_SPEED;

		if (isMouseOver) {
			targetRX = (mouseY - canvas.height / 2) * 0.0001;
			targetRY = (mouseX - canvas.width / 2) * 0.0001;
		}

		rotationX += (targetRX - rotationX) * 0.05;
		rotationY += (targetRY - rotationY) * 0.05;

		points.forEach(p => {
			p.rotate(rotationX, rotationY);
		});

		// Sort points by Z to draw back-to-front
		const sortedPoints = [...points].sort((a, b) => b.z - a.z);
		
		sortedPoints.forEach(p => {
			p.draw(ctx, canvas.width, canvas.height);
		});

		requestAnimationFrame(render);
	}

	onMount(() => {
		init();
		
		const resize = () => {
			canvas.width = canvas.parentElement?.clientWidth || 600;
			canvas.height = canvas.parentElement?.clientHeight || 600;
		};
		
		window.addEventListener('resize', resize);
		resize();
		
		requestAnimationFrame(render);
		
		return () => window.removeEventListener('resize', resize);
	});

	function handleMouseMove(e: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		isMouseOver = true;
	}

	function handleMouseLeave() {
		isMouseOver = false;
	}
</script>

<div class="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-black">
	{#if loading}
		<div class="flex flex-col items-center gap-4">
			<div class="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
			<p class="text-white/50 font-mono text-sm uppercase tracking-widest">Initializing Cloud...</p>
		</div>
	{/if}
	
	<canvas
		bind:this={canvas}
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		class="cursor-grab active:cursor-grabbing"
	></canvas>

	<!-- Gradient Fades -->
	<div class="pointer-events-none absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_black_90%]"></div>
</div>

<style>
	canvas {
		max-width: 100%;
		max-height: 100%;
	}
</style>
