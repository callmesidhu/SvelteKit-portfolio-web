<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { 
		Code2, Cpu, Globe, Cloud, Database, Layers, 
		Brain, Network, ShieldCheck, Terminal, 
		Briefcase, Smartphone, Zap, Bot
	} from 'lucide-svelte';
	import { ALL_ICONS } from '$lib/icons';

	interface Icon {
		id: number;
		name: string;
		src: string;
	}

	let container: HTMLDivElement;
	let loading = $state(true);

	onMount(() => {
		if (!container) return;

		// --- Three.js Initialization ---
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ 
			alpha: true, 
			antialias: true,
			powerPreference: 'high-performance'
		});
		renderer.outputColorSpace = THREE.SRGBColorSpace; // Match texture color space
		
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);

		renderer.domElement.classList.add('three-canvas');
		if (window.innerWidth <= 640) {
			renderer.domElement.classList.add('mobile-fade');
		}

		camera.position.z = 12;

		const group = new THREE.Group();
		scene.add(group);

		const iconSprites: THREE.Sprite[] = [];
		const points: THREE.Vector3[] = [];
		const n = ALL_ICONS.length;
		const phi = Math.PI * (3 - Math.sqrt(5));
		const radius = 4.5;

		// Helper to create combined icon + text texture
		function createIconTexture(img: HTMLImageElement, name: string) {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d')!;
			canvas.width = 512; // Higher resolution for sharpness
			canvas.height = 512;
			
			// Draw icon
			ctx.drawImage(img, 96, 40, 320, 320);
			
			// Draw label
			ctx.font = '700 48px Inter, sans-serif';
			ctx.fillStyle = '#FFFFFF'; // Solid white
			ctx.textAlign = 'center';
			ctx.fillText(name.toUpperCase(), 256, 420);
			
			const texture = new THREE.CanvasTexture(canvas);
			texture.colorSpace = THREE.SRGBColorSpace; // Critical for "full color"
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.generateMipmaps = false;
			return texture;
		}

		// Load images and create sprites
		let loadedCount = 0;
		ALL_ICONS.forEach((icon, i) => {
			const y = 1 - (i / (n - 1)) * 2;
			const radiusAtY = Math.sqrt(1 - y * y);
			const theta = phi * i;
			const x = Math.cos(theta) * radiusAtY;
			const z = Math.sin(theta) * radiusAtY;

			const pos = new THREE.Vector3(x * radius, y * radius, z * radius);
			points.push(pos);

			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.src = icon.src;
			img.onload = () => {
				const texture = createIconTexture(img, icon.name);
				const material = new THREE.SpriteMaterial({ 
					map: texture, 
					transparent: true,
					opacity: 1.0, 
					depthTest: false
				});
				const sprite = new THREE.Sprite(material);
				sprite.position.copy(pos);
				
				const size = window.innerWidth < 640 ? 1.5 : 1.5;
				sprite.scale.set(size, size, 1);	
				
				group.add(sprite);
				iconSprites.push(sprite);

				loadedCount++;
				if (loadedCount === n) loading = false;
			};
			img.onerror = () => {
				console.warn(`Failed to load icon: ${icon.name}`);
				loadedCount++;
				if (loadedCount === n) loading = false;
			};
		});

		// Safety timeout to ensure it loads even if images hang
		const safetyTimeout = setTimeout(() => { loading = false; }, 3000);

		// --- Mesh Lines ---
		const lineMaterial = new THREE.LineBasicMaterial({ 
			color: 0xB58A6C, 
			transparent: true, 
			opacity: 0.1 
		});
		const lineGeometry = new THREE.BufferGeometry();
		const linePoints: number[] = [];

		points.forEach((p1, i) => {
			const distances = points
				.map((p2, j) => ({ index: j, dist: p1.distanceTo(p2) }))
				.filter(d => d.index !== i)
				.sort((a, b) => a.dist - b.dist);
			
			const neighbors = distances.slice(0, 5);
			neighbors.forEach(n => {
				linePoints.push(p1.x, p1.y, p1.z);
				linePoints.push(points[n.index].x, points[n.index].y, points[n.index].z);
			});
		});

		lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
		const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
		group.add(lines);

		// --- Background Particles ---
		const pCount = 80;
		const pGeom = new THREE.BufferGeometry();
		const pPos = new Float32Array(pCount * 3);
		for(let i=0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
		pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
		const pMat = new THREE.PointsMaterial({ color: 0xB58A6C, size: 0.04, transparent: true, opacity: 0.3 });
		const particles = new THREE.Points(pGeom, pMat);
		scene.add(particles);

		// --- Interaction ---
		let mX = 0, mY = 0, tRX = 0.005, tRY = 0.005, isOver = false;
		let curSX = 0.005, curSY = 0.005;

		const onMM = (e: MouseEvent) => {
			const r = container.getBoundingClientRect();
			mX = ((e.clientX - r.left) / container.clientWidth) * 2 - 1;
			mY = -((e.clientY - r.top) / container.clientHeight) * 2 + 1;
			isOver = true;
		};

		container.addEventListener('mousemove', onMM);
		container.addEventListener('mouseleave', () => isOver = false);

		const animate = () => {
			const id = requestAnimationFrame(animate);

			if (isOver) {
				tRY = mX * 0.06;
				tRX = -mY * 0.06;
			} else {
				tRY = 0.015;
				tRX = 0.015;
			}

			curSY = THREE.MathUtils.lerp(curSY, tRY, 0.05);
			curSX = THREE.MathUtils.lerp(curSX, tRX, 0.05);

			group.rotation.y += curSY;
			group.rotation.x += curSX;
			group.position.y = Math.sin(Date.now() * 0.002) * 0.15; // Faster float
			particles.rotation.y += 0.001;
			
			// Icons stay fully opaque
			iconSprites.forEach(s => {
				s.material.opacity = 1.0;
			});

			if (Math.random() > 0.98) lineMaterial.opacity = 0.05 + Math.random() * 0.15;
			else lineMaterial.opacity = THREE.MathUtils.lerp(lineMaterial.opacity, 0.1, 0.05);

			renderer.render(scene, camera);
			return id;
		};

		const animationId = animate();

		const onResize = () => {
			if (!container) return;
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};

		const ro = new ResizeObserver(onResize);
		ro.observe(container);

		return () => {
			clearTimeout(safetyTimeout);
			cancelAnimationFrame(animationId);
			ro.disconnect();
			renderer.dispose();
			scene.clear();
		};
	});
</script>

<div class="group relative flex h-[300px] w-full items-center justify-center overflow-hidden bg-black sm:h-[400px] lg:h-[500px]">
	<!-- Holographic Scanline -->
	<div class="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,255,0,0.02))] bg-[size:100%_4px,3px_100%] opacity-40 animate-scan"></div>
	
	<!-- Background Mesh/Glow -->
	<div class="absolute inset-0 z-0">
		<div class="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B58A6C]/10 blur-[120px] animate-pulse"></div>
		<div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:90%)]"></div>
	</div>

	<!-- LEFT COLUMN BADGES -->
	<div class="absolute left-[2%] top-[10%] z-20 flex flex-col gap-8 hidden lg:flex">
		<div class="animate-float">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-blue-500/10 p-2 text-blue-400 group-hover/badge:scale-110 transition-transform"><Layers size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Foundations</div>
					<div class="text-xs font-medium text-white/80">DSA & OS</div>
				</div>
			</div>
		</div>
		<div class="animate-float-delayed">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 group-hover/badge:scale-110 transition-transform"><Network size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Architecture</div>
					<div class="text-xs font-medium text-white/80">System Design</div>
				</div>
			</div>
		</div>
		<div class="animate-float-slower">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 group-hover/badge:scale-110 transition-transform"><Globe size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Web</div>
					<div class="text-xs font-medium text-white/80">Full Stack Dev</div>
				</div>
			</div>
		</div>
		<div class="animate-float">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-pink-500/10 p-2 text-pink-400 group-hover/badge:scale-110 transition-transform"><ShieldCheck size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40">Web3</div>
					<div class="text-xs font-medium text-white/80">Blockchain</div>
				</div>
			</div>
		</div>
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
		<div class="animate-float-delayed">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-rose-500/10 p-2 text-rose-400 group-hover/badge:scale-110 transition-transform"><Briefcase size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Leadership</div>
					<div class="text-xs font-medium text-white/80 text-right">Project Management</div>
				</div>
			</div>
		</div>
		<div class="animate-float-slower">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-purple-500/10 p-2 text-purple-400 group-hover/badge:scale-110 transition-transform"><Brain size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Intelligence</div>
					<div class="text-xs font-medium text-white/80 text-right">Machine Learning</div>
				</div>
			</div>
		</div>
		<div class="animate-float">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-orange-500/10 p-2 text-orange-400 group-hover/badge:scale-110 transition-transform"><Bot size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Automation</div>
					<div class="text-xs font-medium text-white/80 text-right">AI Agents</div>
				</div>
			</div>
		</div>
		<div class="animate-float-delayed">
			<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl transition-all hover:bg-white/10 group/badge">
				<div class="rounded-lg bg-yellow-500/10 p-2 text-yellow-400 group-hover/badge:scale-110 transition-transform"><Zap size={18} /></div>
				<div>
					<div class="text-[9px] font-bold uppercase tracking-widest text-white/40 text-right">Hardware</div>
					<div class="text-xs font-medium text-white/80 text-right">IoT Systems</div>
				</div>
			</div>
		</div>
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
	
	<div 
		bind:this={container} 
		class="absolute inset-0 z-40 cursor-grab active:cursor-grabbing transition-opacity duration-1000 {loading ? 'opacity-0' : 'opacity-100'}"
	></div>

	<div class="pointer-events-none absolute inset-0 z-20 bg-radial-[circle_at_center,_transparent_0%,_black_95%] opacity-70"></div>
</div>

<style>
	:global(.three-canvas) {
		max-width: 100%;
		max-height: 100%;
		outline: none;
	}
	
	:global(.mobile-fade) {
		mask-image: linear-gradient(to bottom, 
			transparent 0%, 
			black 15%, 
			black 85%, 
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(to bottom, 
			transparent 0%, 
			black 15%, 
			black 85%, 
			transparent 100%
		);
	}

	.animate-float { animation: float 7s ease-in-out infinite; }
	.animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
	.animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
	.animate-scan { animation: scan 10s linear infinite; }

	@keyframes scan {
		0% { background-position: 0 0; }
		100% { background-position: 0 100%; }
	}

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
