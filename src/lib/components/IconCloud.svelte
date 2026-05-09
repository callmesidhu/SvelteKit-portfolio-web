<script lang="ts">
	import { onMount } from 'svelte';

	import { 
		Code2, Cpu, Globe, Cloud, Database, Layers, 
		Brain, Network, ShieldCheck, Terminal, 
		Briefcase, Smartphone, Zap, Bot
	} from 'lucide-svelte';

	interface Icon {
		id: number;
		name: string;
		src: string;
	}

	const ALL_ICONS: Icon[] = [
		{ id: 1, name: 'C', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
		{ id: 2, name: 'C++', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
		{ id: 3, name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
		{ id: 4, name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
		{ id: 5, name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
		{ id: 6, name: 'PHP', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
		{ id: 7, name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
		{ id: 8, name: 'Rust', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg' },
		{ id: 9, name: 'Go', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
		{ id: 10, name: 'R', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
		{ id: 11, name: 'Dart', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
		{ id: 12, name: 'Firebase', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
		{ id: 13, name: 'Supabase', src: 'https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg' },
		{ id: 14, name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
		{ id: 15, name: 'Arduino', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
		{ id: 16, name: 'Figma', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
		{ id: 17, name: 'Power BI', src: 'https://www.vectorlogo.zone/logos/microsoft_powerbi/microsoft_powerbi-icon.svg' },
		{ id: 18, name: 'Jupyter', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
		{ id: 19, name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
		{ id: 20, name: 'Next.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
		{ id: 21, name: 'Vue', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
		{ id: 22, name: 'Nuxt', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg' },
		{ id: 23, name: 'Flutter', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
		{ id: 24, name: 'SvelteKit', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
		{ id: 25, name: 'Django', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
		{ id: 26, name: 'FastAPI', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
		{ id: 27, name: 'Flask', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
		{ id: 28, name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
		{ id: 29, name: 'NestJS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg' },
		{ id: 30, name: 'Spring Boot', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
		{ id: 31, name: 'Fastify', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastify/fastify-original.svg' },
		{ id: 32, name: 'Laravel', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' }
	];

	let canvas: HTMLCanvasElement;
	let icons = $state<Icon[]>([]);
	let loading = $state(true);

	// ─── Constants ─────────────────────────────────────────────────────────────
	let RADIUS = 220;
	const ICON_SIZE = 50;
	const ROTATION_SPEED = 0.015;
	const PARTICLE_COUNT = 60;

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
		opacity: number = 0;
		neighbors: number[] = [];

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
			const cosY = Math.cos(ry);
			const sinY = Math.sin(ry);
			const x1 = this.x * cosY - this.z * sinY;
			const z1 = this.x * sinY + this.z * cosY;

			const cosX = Math.cos(rx);
			const sinX = Math.sin(rx);
			const y1 = this.y * cosX - z1 * sinX;
			const z2 = this.y * sinX + z1 * cosX;

			this.x = x1;
			this.y = y1;
			this.z = z2;
		}

		update(width: number, height: number) {
			if (!width || !height) return { x2d: 0, y2d: 0, scale: 1, edgeFade: 1 };
			const depth = 500;
			const scale = depth / (depth + this.z);
			const x2d = this.x * scale + width / 2;
			const y2d = this.y * scale + height / 2;

			// Simplified visibility
			this.opacity = Math.max(0.1, scale); 
			return { x2d, y2d, scale, edgeFade: 1 };
		}

		draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
			const { x2d, y2d, scale } = this.update(width, height);
			const size = ICON_SIZE * scale;

			if (this.img && this.img.complete) {
				ctx.globalAlpha = this.opacity;
				ctx.drawImage(this.img, x2d - size / 2, y2d - size / 2, size, size);
			} else {
				// Fallback: draw a glowing dot if image isn't ready
				ctx.globalAlpha = this.opacity * 0.5;
				ctx.fillStyle = '#B58A6C';
				ctx.beginPath();
				ctx.arc(x2d, y2d, 4 * scale, 0, Math.PI * 2);
				ctx.fill();
			}

			if (scale > 0.8) {
				ctx.globalAlpha = this.opacity;
				ctx.font = `700 ${Math.round(10 * scale)}px Inter, sans-serif`;
				ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
				ctx.textAlign = 'center';
				ctx.fillText(this.name.toUpperCase(), x2d, y2d + size / 2 + 15);
			}
		}
	}

	class Particle {
		x: number;
		y: number;
		z: number;
		vx: number;
		vy: number;
		vz: number;

		constructor() {
			this.x = (Math.random() - 0.5) * 2000;
			this.y = (Math.random() - 0.5) * 2000;
			this.z = (Math.random() - 0.5) * 2000;
			this.vx = (Math.random() - 0.5) * 0.2;
			this.vy = (Math.random() - 0.5) * 0.2;
			this.vz = (Math.random() - 0.5) * 0.2;
		}

		update() {
			this.x += this.vx;
			this.y += this.vy;
			this.z += this.vz;
			if (Math.abs(this.x) > 1000) this.vx *= -1;
			if (Math.abs(this.y) > 1000) this.vy *= -1;
			if (Math.abs(this.z) > 1000) this.vz *= -1;
		}

		draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
			const depth = 500;
			const scale = depth / (depth + this.z);
			const x2d = this.x * scale + width / 2;
			const y2d = this.y * scale + height / 2;
			
			if (x2d < 0 || x2d > width || y2d < 0 || y2d > height) return;
			
			ctx.globalAlpha = Math.max(0, (scale - 0.2) * 0.3);
			ctx.fillStyle = '#B58A6C';
			ctx.beginPath();
			ctx.arc(x2d, y2d, 1 * scale, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	let points: Point[] = [];
	let particles: Particle[] = [];

	function init() {
		if (RADIUS <= 0 || points.length > 0) return;
		
		try {
			icons = ALL_ICONS;
			const n = icons.length;
			const phi = Math.PI * (3 - Math.sqrt(5));
			
			points = icons.map((icon, i) => {
				const y = 1 - (i / (n - 1)) * 2;
				const radiusAtY = Math.sqrt(1 - y * y);
				const theta = phi * i;
				const x = Math.cos(theta) * radiusAtY;
				const z = Math.sin(theta) * radiusAtY;
				return new Point(x * RADIUS, y * RADIUS, z * RADIUS, icon.name, icon.src);
			});

			// Fullerene Logic
			points.forEach((p, i) => {
				const distances = points.map((p2, j) => ({
					index: j,
					dist: Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2) + Math.pow(p.z - p2.z, 2))
				}))
				.filter(d => d.index !== i)
				.sort((a, b) => a.dist - b.dist);
				
				p.neighbors = distances.slice(0, 5).map(d => d.index);
			});

			if (particles.length === 0) {
				for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
			}
			
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
		
		if (loading || points.length === 0) {
			requestAnimationFrame(render);
			return;
		}

		ctx.globalAlpha = 1;

		let targetRX = ROTATION_SPEED;
		let targetRY = ROTATION_SPEED;
		if (isMouseOver) {
			targetRX = (mouseY - canvas.height / 2) * 0.0002;
			targetRY = (mouseX - canvas.width / 2) * 0.0002;
		}
		rotationX += (targetRX - rotationX) * 0.03;
		rotationY += (targetRY - rotationY) * 0.03;

		// Draw Particles
		particles.forEach(p => {
			p.update();
			p.draw(ctx, canvas.width, canvas.height);
		});

		// Update and Rotate Points
		points.forEach(p => {
			p.rotate(rotationX, rotationY);
			p.update(canvas.width, canvas.height);
		});

		const depth = 500;
		// Draw Mesh Lines
		const drawnLines = new Set<string>();
		points.forEach((p1, i) => {
			p1.neighbors.forEach(neighborIdx => {
				const p2 = points[neighborIdx];
				const lineKey = [i, neighborIdx].sort().join('-');
				if (!drawnLines.has(lineKey)) {
					drawnLines.add(lineKey);
					const scale1 = depth / (depth + p1.z);
					const scale2 = depth / (depth + p2.z);
					const x1 = p1.x * scale1 + canvas.width / 2;
					const y1 = p1.y * scale1 + canvas.height / 2;
					const x2 = p2.x * scale2 + canvas.width / 2;
					const y2 = p2.y * scale2 + canvas.height / 2;
					
					const lineFlicker = Math.random() > 0.95 ? Math.random() * 0.4 : 1;
					const lineOpacity = Math.min(p1.opacity, p2.opacity) * 0.8 * lineFlicker;
					if (lineOpacity > 0.02) {
						ctx.beginPath();
						ctx.strokeStyle = `rgba(181, 138, 108, ${lineOpacity})`;
						ctx.lineWidth = 1.2 * Math.min(scale1, scale2);
						ctx.moveTo(x1, y1);
						ctx.lineTo(x2, y2);
						ctx.stroke();
					}
				}
			});
		});

		// Draw Icons
		const sortedPoints = [...points].sort((a, b) => b.z - a.z);
		sortedPoints.forEach(p => {
			ctx.globalAlpha = 1; // Reset for each icon's own alpha logic
			p.draw(ctx, canvas.width, canvas.height);
		});

		requestAnimationFrame(render);
	}

	onMount(() => {
		const resize = () => {
			if (!canvas || !canvas.parentElement) return;
			const w = canvas.parentElement.clientWidth;
			const h = canvas.parentElement.clientHeight;
			if (w === 0 || h === 0) return;

			canvas.width = w;
			canvas.height = h;
			RADIUS = Math.min(220, w * 0.38);
			
			// Initialize if not already done and we have valid dimensions
			if (points.length === 0 && RADIUS > 0) {
				init();
			}
		};

		const observer = new ResizeObserver(resize);
		if (canvas && canvas.parentElement) {
			observer.observe(canvas.parentElement);
		}

		resize();
		requestAnimationFrame(render);
		
		return () => {
			observer.disconnect();
		};
	});

	function handleMouseMove(e: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		isMouseOver = true;
	}
	function handleMouseLeave() { isMouseOver = false; }
</script>

<div class="group relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-black sm:h-[500px] lg:h-[650px]">
	<!-- Holographic Scanline -->
	<div class="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] opacity-40"></div>
	
	<!-- Background Mesh/Glow -->
	<div class="absolute inset-0 z-0">
		<div class="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B58A6C]/10 blur-[120px] animate-pulse"></div>
		<div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:90%)]"></div>
	</div>

	<!-- LEFT COLUMN BADGES -->
	<div class="absolute left-[2%] top-[10%] z-20 flex flex-col gap-8 hidden lg:flex">
		<!-- DSA & OS -->
		<div class="animate-float">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-blue-500/10 p-2 text-blue-400 group-hover/badge:scale-110 transition-transform"><Layers size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Foundations</div>
					<div class="text-xs font-medium text-white/80">DSA & OS</div>
				</div>
			</div>
		</div>
		<!-- System Design -->
		<div class="animate-float-delayed">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 group-hover/badge:scale-110 transition-transform"><Network size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Architecture</div>
					<div class="text-xs font-medium text-white/80">System Design</div>
				</div>
			</div>
		</div>
		<!-- Full Stack Dev -->
		<div class="animate-float-slower">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 group-hover/badge:scale-110 transition-transform"><Globe size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Web</div>
					<div class="text-xs font-medium text-white/80">Full Stack Dev</div>
				</div>
			</div>
		</div>
		<!-- Blockchain -->
		<div class="animate-float">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-pink-500/10 p-2 text-pink-400 group-hover/badge:scale-110 transition-transform"><ShieldCheck size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Web3</div>
					<div class="text-xs font-medium text-white/80">Blockchain</div>
				</div>
			</div>
		</div>
		<!-- DevOps -->
		<div class="animate-float-delayed">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 group-hover/badge:scale-110 transition-transform"><Cloud size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Infrastructure</div>
					<div class="text-xs font-medium text-white/80">DevOps</div>
				</div>
			</div>
		</div>
	</div>

	<!-- RIGHT COLUMN BADGES -->
	<div class="absolute right-[2%] top-[10%] z-20 flex flex-col gap-8 items-end hidden lg:flex">
		<!-- Project Management -->
		<div class="animate-float-delayed">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-rose-500/10 p-2 text-rose-400 group-hover/badge:scale-110 transition-transform"><Briefcase size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Leadership</div>
					<div class="text-xs font-medium text-white/80 text-right">Project Management</div>
				</div>
			</div>
		</div>
		<!-- Machine Learning -->
		<div class="animate-float-slower">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-purple-500/10 p-2 text-purple-400 group-hover/badge:scale-110 transition-transform"><Brain size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Intelligence</div>
					<div class="text-xs font-medium text-white/80 text-right">Machine Learning</div>
				</div>
			</div>
		</div>
		<!-- AI Agents -->
		<div class="animate-float">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-orange-500/10 p-2 text-orange-400 group-hover/badge:scale-110 transition-transform"><Bot size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Automation</div>
					<div class="text-xs font-medium text-white/80 text-right">AI Agents</div>
				</div>
			</div>
		</div>
		<!-- IoT Systems -->
		<div class="animate-float-delayed">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-yellow-500/10 p-2 text-yellow-400 group-hover/badge:scale-110 transition-transform"><Zap size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Hardware</div>
					<div class="text-xs font-medium text-white/80 text-right">IoT Systems</div>
				</div>
			</div>
		</div>
		<!-- Cloud Computing -->
		<div class="animate-float">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 group-hover/badge:scale-110 transition-transform"><Cloud size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Infrastructure</div>
					<div class="text-xs font-medium text-white/80 text-right">Cloud Computing</div>
				</div>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm">
			<div class="h-12 w-12 animate-spin rounded-full border-4 border-[#B58A6C]/20 border-t-[#B58A6C]"></div>
			<p class="font-mono text-xs uppercase tracking-[0.3em] text-[#B58A6C] animate-pulse">Syncing Tech Ecosystem</p>
		</div>
	{/if}
	
	<canvas
		bind:this={canvas}
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		class="z-10 cursor-grab active:cursor-grabbing transition-opacity duration-1000 {loading ? 'opacity-0' : 'opacity-100'}"
	></canvas>

	<div class="pointer-events-none absolute inset-0 z-20 bg-radial-[circle_at_center,_transparent_0%,_black_95%] opacity-70"></div>
</div>

<style>
	canvas {
		max-width: 100%;
		max-height: 100%;
	}
	.animate-float { animation: float 7s ease-in-out infinite; }
	.animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
	.animate-float-slower { animation: float-slower 12s ease-in-out infinite; }

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-15px); }
	}
	@keyframes float-delayed {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(15px); }
	}
	@keyframes float-slower {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-20px); }
	}
</style>
