<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs, query, orderBy } from 'firebase/firestore';

	interface Experience {
		id: string;
		title: string;
		company: string;
		type: string;
		duration: string;
		location: string;
		description: string;
		skills: string[];
		rank: number;
	}

	let experiences = $state<Experience[]>([]);
	let loading = $state(true);
	let visibleItems = $state<Set<string>>(new Set());

	onMount(async () => {
		try {
			const q = query(collection(db, 'experience'), orderBy('rank', 'asc'));
			const snapshot = await getDocs(q);
			experiences = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Experience);
		} catch (err) {
			console.error('Error fetching experience:', err);
		} finally {
			loading = false;
		}

		// Intersection Observer for scroll-in animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visibleItems = new Set([...visibleItems, entry.target.id]);
					}
				});
			},
			{ threshold: 0.15 }
		);

		// Observe after DOM updates
		setTimeout(() => {
			document.querySelectorAll('.timeline-item').forEach((el) => observer.observe(el));
		}, 100);

		return () => observer.disconnect();
	});
</script>

<div class="timeline-container">
	{#if loading}
		<!-- Skeleton loader -->
		<div class="skeleton-wrap">
			{#each Array(4) as _, i (i)}
				<div class="skeleton-row" style="animation-delay: {i * 0.1}s">
					<div class="skeleton-dot"></div>
					<div class="skeleton-card">
						<div class="skeleton-line w-40"></div>
						<div class="skeleton-line w-64 thin"></div>
						<div class="skeleton-line w-full thin"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if experiences.length === 0}
		<p class="empty-msg">No experience entries yet.</p>
	{:else}
		<div class="timeline">
			<!-- Central line -->
			<div class="timeline-line" aria-hidden="true"></div>

			{#each experiences as exp, i (exp.id)}
				{@const isLeft = i % 2 === 0}
				{@const itemId = `exp-${exp.id}`}
				<div
					id={itemId}
					class="timeline-item {isLeft ? 'left' : 'right'} {visibleItems.has(itemId) ? 'visible' : ''}"
					style="--delay: {i * 0.12}s"
				>
					<!-- Card -->
					<div class="exp-card">
						<div class="card-header">
							<div class="card-titles">
								<h3 class="exp-title">{exp.title}</h3>
								<p class="exp-company">
									<span class="company-dot"></span>
									{exp.company}
								</p>
							</div>
							{#if exp.type}
								<span class="exp-badge">{exp.type}</span>
							{/if}
						</div>

						<div class="exp-meta">
							{#if exp.duration}
								<span class="meta-item">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
									{exp.duration}
								</span>
							{/if}
							{#if exp.location}
								<span class="meta-item">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
									{exp.location}
								</span>
							{/if}
						</div>

						{#if exp.description}
							<p class="exp-desc">{exp.description}</p>
						{/if}

						{#if exp.skills?.length}
							<div class="skills-wrap">
								{#each exp.skills as skill (skill)}
									<span class="skill-tag">{skill}</span>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Connector dot -->
					<div class="timeline-dot" aria-hidden="true">
						<div class="dot-inner"></div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.timeline-container {
		position: relative;
		width: 100%;
	}

	/* ── Timeline layout ─────────────────────────────────────────────── */
	.timeline {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.timeline-line {
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 1px;
		background: linear-gradient(to bottom, transparent, #B58A6C44 10%, #B58A6C44 90%, transparent);
		transform: translateX(-50%);
	}

	/* ── Individual timeline item ─────────────────────────────────────── */
	.timeline-item {
		position: relative;
		width: 45%;
		padding-bottom: 48px;
		opacity: 0;
		transition: opacity 0.6s ease var(--delay), transform 0.6s ease var(--delay);
	}

	.timeline-item.left {
		align-self: flex-start;
		transform: translateX(-40px);
	}

	.timeline-item.right {
		align-self: flex-end;
		transform: translateX(40px);
	}

	.timeline-item.visible {
		opacity: 1;
		transform: translateX(0);
	}

	/* ── Connector dot ────────────────────────────────────────────────── */
	.timeline-dot {
		position: absolute;
		top: 20px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #B58A6C;
		box-shadow: 0 0 0 3px rgba(181,138,108,0.2), 0 0 16px rgba(181,138,108,0.4);
	}

	.timeline-item.left .timeline-dot {
		right: -7%;
		transform: translateX(50%);
	}

	.timeline-item.right .timeline-dot {
		left: -7%;
		transform: translateX(-50%);
	}

	.dot-inner {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #fff;
		margin: 4px auto;
	}

	/* ── Card ─────────────────────────────────────────────────────────── */
	.exp-card {
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 16px;
		padding: 22px 24px;
		transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
		backdrop-filter: blur(8px);
	}

	.exp-card:hover {
		border-color: rgba(181,138,108,0.3);
		background: rgba(181,138,108,0.05);
		transform: translateY(-2px);
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}

	.exp-title {
		font-size: 1.05rem;
		font-weight: 700;
		color: #fff;
		line-height: 1.3;
		margin: 0;
	}

	.exp-company {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.8rem;
		font-weight: 500;
		color: #B58A6C;
		margin-top: 3px;
	}

	.company-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #B58A6C;
		flex-shrink: 0;
	}

	.exp-badge {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #B58A6C;
		background: rgba(181,138,108,0.12);
		border: 1px solid rgba(181,138,108,0.2);
		border-radius: 99px;
		padding: 3px 10px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.exp-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 10px;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.75rem;
		color: rgba(255,255,255,0.4);
	}

	.exp-desc {
		font-size: 0.82rem;
		color: rgba(255,255,255,0.55);
		line-height: 1.6;
		margin-bottom: 12px;
	}

	.skills-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.skill-tag {
		font-size: 0.65rem;
		font-weight: 600;
		color: rgba(255,255,255,0.5);
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 6px;
		padding: 3px 8px;
		transition: color 0.2s, border-color 0.2s;
	}

	.exp-card:hover .skill-tag {
		color: rgba(255,255,255,0.7);
		border-color: rgba(181,138,108,0.2);
	}

	/* ── Skeleton ─────────────────────────────────────────────────────── */
	.skeleton-wrap {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.skeleton-row {
		display: flex;
		align-items: center;
		gap: 16px;
		opacity: 0;
		animation: skeletonFadeIn 0.4s ease forwards;
	}

	.skeleton-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: rgba(181,138,108,0.2);
		flex-shrink: 0;
	}

	.skeleton-card {
		flex: 1;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 14px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.skeleton-line {
		height: 14px;
		border-radius: 6px;
		background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05));
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}

	.skeleton-line.thin {
		height: 10px;
	}

	.skeleton-line.w-40 { width: 40%; }
	.skeleton-line.w-64 { width: 64%; }
	.skeleton-line.w-full { width: 100%; }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	@keyframes skeletonFadeIn {
		to { opacity: 1; }
	}

	.empty-msg {
		text-align: center;
		color: rgba(255,255,255,0.3);
		font-size: 0.9rem;
		padding: 40px 0;
	}

	/* ── Responsive: stack on mobile ─────────────────────────────────── */
	@media (max-width: 768px) {
		.timeline-line {
			left: 20px;
		}

		.timeline-item {
			width: 100%;
			padding-left: 48px;
			align-self: unset !important;
			transform: translateX(-20px) !important;
		}

		.timeline-item.visible {
			transform: translateX(0) !important;
		}

		.timeline-item.left .timeline-dot,
		.timeline-item.right .timeline-dot {
			left: 13px;
			right: auto;
			transform: none;
		}
	}
</style>
