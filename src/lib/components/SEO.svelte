<script lang="ts">
	interface Breadcrumb {
		name: string;
		item: string;
	}

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		canonical?: string;
		type?: string;
		keywords?: string;
		robots?: string;
		breadcrumbs?: Breadcrumb[];
	}

	let {
		title = 'CallMeSidhu | S SIDHARTH | Full Stack Developer',
		description = 'Sidharth, known as CallMeSidhu, is a Full Stack Developer, Founder & CEO of XyphX, Freelancer, and Software Engineer specializing in React, Node.js, Flutter, Cloudflare, DevOps, AI and modern web technologies.',
		image = '/favicon.png',
		canonical = 'https://callmesidhu.xyphx.com',
		type = 'website',
		keywords = 'callmesidhu, CallMeSidhu, S Sidharth, XyphX, Full Stack Developer, Freelancer, Software Engineer, React, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, Flutter, Docker, AWS, Cloudflare, DevOps, CI/CD, AI, Machine Learning',
		robots = 'index, follow',
		breadcrumbs = []
	}: Props = $props();

	const siteName = 'CallMeSidhu';
	const twitterHandle = '@callmesidhu'; // Assumed
	const authorName = 'Sidharth';

	const baseSchemaUrl = 'https://callmesidhu.xyphx.com';

	// Person and Organization combined schema
	const personSchema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': `${baseSchemaUrl}/#person`,
				name: 'Sidharth',
				alternateName: ['CallMeSidhu', 'S SIDHARTH'],
				url: baseSchemaUrl,
				image: `${baseSchemaUrl}/favicon.png`,
				jobTitle: ['Full Stack Developer', 'Founder & CEO', 'Freelancer', 'Software Engineer'],
				worksFor: {
					'@type': 'Organization',
					'@id': `${baseSchemaUrl}/#organization`,
					name: 'XyphX',
					url: 'https://xyphx.com' // Update if different
				},
				description:
					'Sidharth, known as CallMeSidhu, is a Full Stack Developer, Founder & CEO of XyphX, Freelancer, and Software Engineer.',
				sameAs: ['https://github.com/callmesidhu', 'https://linkedin.com/in/callmesidhu']
			},
			{
				'@type': 'Organization',
				'@id': `${baseSchemaUrl}/#organization`,
				name: 'XyphX',
				url: 'https://xyphx.com', // Assumed URL, update if needed
				founder: {
					'@id': `${baseSchemaUrl}/#person`
				}
			},
			{
				'@type': 'WebSite',
				'@id': `${baseSchemaUrl}/#website`,
				url: baseSchemaUrl,
				name: 'CallMeSidhu',
				description:
					'Portfolio of Sidharth (CallMeSidhu), Full Stack Developer and Founder of XyphX.',
				publisher: {
					'@id': `${baseSchemaUrl}/#person`
				}
			}
		]
	};

	// Breadcrumb schema
	const breadcrumbSchema =
		breadcrumbs.length > 0
			? {
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: breadcrumbs.map((crumb, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: crumb.name,
						item: crumb.item
					}))
				}
			: null;

	const schemaData = JSON.stringify(personSchema);
	const breadcrumbData = breadcrumbSchema ? JSON.stringify(breadcrumbSchema) : null;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="author" content={authorName} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content={robots} />

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
	<meta property="twitter:creator" content={twitterHandle} />

	<!-- JSON-LD Structured Data -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${schemaData}<\/script>`}

	{#if breadcrumbData}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${breadcrumbData}<\/script>`}
	{/if}
</svelte:head>
