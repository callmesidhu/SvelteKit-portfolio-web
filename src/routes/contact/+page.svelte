<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="Contact | CallMeSidhu"
	description="Get in touch with S Sidharth (CallMeSidhu). Available for freelance opportunities, full stack development projects, and technical consulting."
	canonical="https://callmesidhu.xyphx.com/contact"
	breadcrumbs={[
		{ name: 'Home', item: 'https://callmesidhu.xyphx.com' },
		{ name: 'Contact', item: 'https://callmesidhu.xyphx.com/contact' }
	]}
/>

<div class="flex min-h-screen flex-col bg-black">
	<Navbar />
	<main class="flex flex-grow items-center justify-center">
		<Contact />
	</main>
</div>
