<script lang="ts">
	let copied = $state(false);
	const EMAIL = 'callmesidhu@myyahoo.com';

	async function copyEmail() {
		await navigator.clipboard.writeText(EMAIL);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}

	const socials = [
		{
			label: 'GitHub',
			handle: '@callmesidhu',
			href: 'https://github.com/callmesidhu',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`
		},
		{
			label: 'LinkedIn',
			handle: 'callmesidhu',
			href: 'https://linkedin.com/in/callmesidhu',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
		},
		{
			label: 'Instagram',
			handle: '@callmesidhu.x',
			href: 'https://instagram.com/callmesidhu.x',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`
		},
		{
			label: 'WhatsApp',
			handle: '+91 9496225620',
			href: 'https://wa.me/919496225620',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`
		}
	];
</script>

<section id="contact" class="contact-section">

	<!-- Animated grid background -->
	<div class="grid-bg" aria-hidden="true"></div>

	<!-- Orbital rings -->
	<div class="orb-wrap" aria-hidden="true">
		<div class="orb orb1"></div>
		<div class="orb orb2"></div>
		<div class="orb orb3"></div>
		<div class="orb-core"></div>
	</div>

	<!-- Main content -->
	<div class="content">

		<!-- Eyebrow -->
		<p class="eyebrow">
			<span class="blink">▮</span> CONNECT WITH ME
		</p>

		<!-- Heading -->
		<h2 class="title">Let's Build<br/><span>Something</span> Together</h2>

		<p class="subtitle">
			Pick your preferred channel — I'll respond fast.
		</p>

		<!-- Email CTA -->
		<button class="email-btn" onclick={copyEmail} aria-label="Copy email address">
			<span class="email-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="2" y="4" width="20" height="16" rx="2"/>
					<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
				</svg>
			</span>
			<span class="email-text">{EMAIL}</span>
			<span class="email-badge {copied ? 'copied' : ''}">
				{copied ? '✓ Copied!' : 'Copy'}
			</span>
		</button>

		<!-- Social links -->
		<div class="socials">
			{#each socials as s (s.label)}
				<a
					href={s.href}
					target="_blank"
					rel="noopener noreferrer"
					class="social-card"
					aria-label="{s.label} profile"
				>
					<div class="s-icon">{@html s.icon}</div>
					<div class="s-info">
						<span class="s-label">{s.label}</span>
						<span class="s-handle">{s.handle}</span>
					</div>
					<div class="s-arrow">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</div>
					<!-- Corner accent -->
					<div class="s-corner tl"></div>
					<div class="s-corner br"></div>
				</a>
			{/each}
		</div>

		<!-- Footer line -->
		<p class="footer-note">
			© {new Date().getFullYear()} <span>callmesidhu</span> — Built with SvelteKit
		</p>
	</div>

</section>

<style>
	/* ── Section ─────────────────────────────────────────────────────── */
	.contact-section {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 140px 20px 10px;
	}

	/* ── Animated grid background ────────────────────────────────────── */
	.grid-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(181,138,108,.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(181,138,108,.04) 1px, transparent 1px);
		background-size: 60px 60px;
		animation: grid-drift 20s linear infinite;
	}
	@keyframes grid-drift {
		from { background-position: 0 0; }
		to   { background-position: 60px 60px; }
	}

	/* ── Orbital rings ───────────────────────────────────────────────── */
	.orb-wrap {
		position: absolute;
		right: -10vw;
		top: 50%;
		transform: translateY(-50%);
		width: 60vw;
		height: 60vw;
		max-width: 700px;
		max-height: 700px;
		pointer-events: none;
	}
	.orb {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px solid rgba(181,138,108,0.12);
	}
	.orb1 { animation: spin 18s linear infinite; border-color: rgba(181,138,108,.15); }
	.orb2 {
		inset: 12%;
		border-color: rgba(181,138,108,.1);
		animation: spin 26s linear infinite reverse;
	}
	.orb3 {
		inset: 26%;
		border-color: rgba(181,138,108,.08);
		animation: spin 34s linear infinite;
	}
	/* Orbit dots */
	.orb1::before, .orb2::before, .orb3::before {
		content: '';
		position: absolute;
		top: -4px; left: 50%;
		width: 8px; height: 8px;
		border-radius: 50%;
		background: #B58A6C;
		box-shadow: 0 0 12px #B58A6C, 0 0 24px rgba(181,138,108,.5);
		transform: translateX(-50%);
	}
	.orb-core {
		position: absolute;
		inset: 38%;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(181,138,108,.08) 0%, transparent 70%);
		border: 1px solid rgba(181,138,108,.2);
		box-shadow: inset 0 0 40px rgba(181,138,108,.05), 0 0 60px rgba(181,138,108,.06);
		animation: pulse-core 4s ease-in-out infinite;
	}
	@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
	@keyframes pulse-core {
		0%,100% { transform: scale(1); opacity: 0.6; }
		50%      { transform: scale(1.08); opacity: 1; }
	}

	/* ── Content ─────────────────────────────────────────────────────── */
	.content {
		position: relative;
		z-index: 10;
		max-width: 600px;
		width: 100%;
	}

	/* Eyebrow */
	.eyebrow {
		font-size: .6rem;
		letter-spacing: .35em;
		text-transform: uppercase;
		color: #B58A6C;
		margin-bottom: 18px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.blink { animation: blink 1s step-end infinite; }
	@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

	/* Heading */
	.title {
		font-size: clamp(2.4rem, 5vw, 4rem);
		font-weight: 800;
		color: #fff;
		line-height: 1.1;
		margin: 0 0 16px;
		letter-spacing: -.03em;
	}
	.title span {
		color: #B58A6C;
		position: relative;
	}
	.title span::after {
		content: '';
		position: absolute;
		bottom: -2px; left: 0; right: 0;
		height: 2px;
		background: linear-gradient(90deg, #B58A6C, transparent);
		border-radius: 2px;
	}

	/* Subtitle */
	.subtitle {
		font-size: .88rem;
		color: rgba(255,255,255,.38);
		line-height: 1.7;
		margin-bottom: 36px;
	}

	/* ── Email CTA ───────────────────────────────────────────────────── */
	.email-btn {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		background: rgba(181,138,108,.06);
		border: 1px solid rgba(181,138,108,.22);
		border-radius: 14px;
		padding: 14px 18px;
		cursor: pointer;
		transition: background .25s, border-color .25s, box-shadow .25s;
		margin-bottom: 28px;
		text-align: left;
	}
	.email-btn:hover {
		background: rgba(181,138,108,.1);
		border-color: rgba(181,138,108,.45);
		box-shadow: 0 0 30px rgba(181,138,108,.12);
	}
	.email-icon {
		flex-shrink: 0;
		width: 36px; height: 36px;
		border-radius: 10px;
		background: rgba(181,138,108,.1);
		display: flex; align-items: center; justify-content: center;
		color: #B58A6C;
	}
	.email-icon svg { width: 18px; height: 18px; }

	.email-text {
		flex: 1;
		font-size: .88rem;
		font-weight: 600;
		color: #fff;
		font-family: 'Courier New', monospace;
		letter-spacing: .02em;
	}

	.email-badge {
		font-size: .6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: .1em;
		color: rgba(255,255,255,.35);
		border: 1px solid rgba(255,255,255,.12);
		border-radius: 99px;
		padding: 3px 10px;
		transition: color .2s, border-color .2s, background .2s;
		white-space: nowrap;
	}
	.email-badge.copied {
		color: #B58A6C;
		border-color: rgba(181,138,108,.4);
		background: rgba(181,138,108,.08);
	}

	/* ── Social cards ────────────────────────────────────────────────── */
	.socials {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 40px;
	}

	.social-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 18px;
		background: rgba(255,255,255,.02);
		border: 1px solid rgba(255,255,255,.06);
		border-radius: 14px;
		text-decoration: none;
		transition: background .25s, border-color .25s, transform .25s;
		overflow: hidden;
	}
	.social-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, rgba(181,138,108,.05), transparent);
		opacity: 0;
		transition: opacity .3s;
	}
	.social-card:hover {
		background: rgba(255,255,255,.04);
		border-color: rgba(181,138,108,.25);
		transform: translateX(4px);
	}
	.social-card:hover::before { opacity: 1; }

	/* Corner accents */
	.s-corner {
		position: absolute;
		width: 10px; height: 10px;
		opacity: 0;
		transition: opacity .3s;
	}
	.s-corner.tl { top: 5px; left: 5px; border-top: 1px solid #B58A6C; border-left: 1px solid #B58A6C; }
	.s-corner.br { bottom: 5px; right: 5px; border-bottom: 1px solid #B58A6C; border-right: 1px solid #B58A6C; }
	.social-card:hover .s-corner { opacity: 1; }

	.s-icon {
		flex-shrink: 0;
		width: 36px; height: 36px;
		border-radius: 10px;
		background: rgba(181,138,108,.08);
		border: 1px solid rgba(181,138,108,.12);
		display: flex; align-items: center; justify-content: center;
		color: #B58A6C;
		transition: background .25s;
	}
	.social-card:hover .s-icon { background: rgba(181,138,108,.15); }
	.s-icon :global(svg) { width: 16px; height: 16px; }

	.s-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.s-label  { font-size: .78rem; font-weight: 700; color: #fff; }
	.s-handle { font-size: .65rem; color: rgba(255,255,255,.3); }

	.s-arrow {
		flex-shrink: 0;
		color: rgba(181,138,108,.4);
		transition: color .25s, transform .25s;
	}
	.social-card:hover .s-arrow { color: #B58A6C; transform: translateX(3px); }
	.s-arrow svg { width: 16px; height: 16px; }

	/* ── Footer note ─────────────────────────────────────────────────── */
	.footer-note {
		font-size: .65rem;
		color: rgba(255,255,255,.18);
		text-align: center;
		letter-spacing: .05em;
	}
	.footer-note span { color: rgba(181,138,108,.5); }

	/* ── Responsive ──────────────────────────────────────────────────── */
	@media (max-width: 768px) {
		.orb-wrap { display: none; }
		.title { font-size: 2.2rem; }
		.contact-section { padding: 80px 16px; }
	}
</style>
