<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
		image?: string;
		canonical?: string;
		type?: string;
	}

	let {
		title = 'S SIDHARTH | Full Stack Web & App Developer',
		description = 'Portfolio of S SIDHARTH (callmesidhu). Full Stack Web & App Developer, Tech Founder, and AI & ML Enthusiast based in India.',
		image = '/og-image.png', // You should create this image
		canonical = 'https://callmesidhu.xyphx.com',
		type = 'website'
	}: Props = $props();

	const siteName = 'callmesidhu';
	const twitterHandle = '@callmesidhu'; // Update if different
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="author" content="S SIDHARTH" />
	<meta name="keywords" content="xyphx, XyphX, callmesidhu, call me sidhu, Call Me Sidhu, S Sidharth, Full Stack Developer, Web Developer India, App Developer, Tech Founder, AI ML Enthusiast" />
	
	<!-- Canonical -->
	<link rel="canonical" href={canonical} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonical} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
	{#if twitterHandle}
		<meta property="twitter:creator" content={twitterHandle} />
	{/if}

	<!-- JSON-LD Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "S SIDHARTH",
			"url": "https://callmesidhu.xyphx.com",
			"image": "https://callmesidhu.xyphx.com/favicon.png",
			"sameAs": [
				"https://github.com/callmesidhu",
				"https://linkedin.com/in/callmesidhu",
				"https://instagram.com/callmesidhu"
			],
			"jobTitle": "Full Stack Web & App Developer",
			"worksFor": {
				"@type": "Organization",
				"name": "XyphX"
			},
			"description": "Innovative Full Stack Engineer and Tech Founder with a proven track record of architecting scalable applications."
		}
	</script>
</svelte:head>
