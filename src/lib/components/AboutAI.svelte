<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import { Sparkles, Send, Volume2, Plus, ChevronDown, Share2, AlertCircle } from 'lucide-svelte';

	let aboutContent = $state('');
	let displayedContent = $state('');
	let loading = $state(true);
	let selectedModel = $state('xyphx 1.0 thinking');
	let showModels = $state(false);
	let container: HTMLElement | null = $state(null);
	let hasStartedTyping = $state(false);
	let hasFinishedTyping = $state(false);
	
	let userMessage = $state('who am i?');
	let inputText = $state('');
	let isReading = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let showLimitWarning = $state(false);

	const models = [
		'xyphx 1.0 fast',
		'xyphx 1.0 thinking',
		'xyphx 1.0 max'
	];

	async function typeEffect(text: string) {
		if (hasStartedTyping || !text || hasFinishedTyping) return;
		hasStartedTyping = true;
		displayedContent = '';
		
		const chunks = text.split(/(\s+)/);
		let currentText = '';
		
		for (const chunk of chunks) {
			currentText += chunk;
			displayedContent = currentText;
			await new Promise(resolve => setTimeout(resolve, Math.random() * 10 + 5));
		}
		hasFinishedTyping = true;
	}

	function handleSend() {
		if (!inputText.trim()) return;
		showLimitWarning = true;
		inputText = '';
		setTimeout(() => showLimitWarning = false, 10000);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSend();
		}
	}

	function toggleReading() {
		if (isReading) {
			window.speechSynthesis.cancel();
			isReading = false;
			return;
		}

		const utterance = new SpeechSynthesisUtterance(aboutContent);
		utterance.onend = () => isReading = false;
		isReading = true;
		window.speechSynthesis.speak(utterance);
	}

	function handleShare() {
		if (navigator.share) {
			navigator.share({
				title: 'CallMeSidhu Portfolio',
				text: "Check out Sidharth's portfolio!",
				url: window.location.href
			}).catch(console.error);
		} else {
			navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		}
	}

	function triggerFileUpload() {
		fileInput?.click();
	}

	function handleFileChange() {
		showLimitWarning = true;
		setTimeout(() => showLimitWarning = false, 10000);
	}

	onMount(async () => {
		try {
			const docRef = doc(db, 'about', 'zPae0pmZUUI8p6dmga76');
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				aboutContent = docSnap.data().content;
			}
		} catch (err) {
			console.error('Error fetching about content:', err);
		} finally {
			loading = false;
		}

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && aboutContent && !hasStartedTyping) {
				typeEffect(aboutContent);
				observer.disconnect();
			}
		}, { threshold: 0.1 });

		if (container) observer.observe(container);

		return () => {
			observer.disconnect();
			window.speechSynthesis.cancel();
		};
	});

	$effect(() => {
		if (!loading && aboutContent && container && !hasStartedTyping) {
			const rect = container.getBoundingClientRect();
			const isInView = rect.top < window.innerHeight && rect.bottom > 0;
			if (isInView) {
				typeEffect(aboutContent);
			}
		}
	});

	function toggleModels() {
		showModels = !showModels;
	}

	function selectModel(model: string) {
		selectedModel = model;
		showModels = false;
	}
</script>

<input 
	type="file" 
	bind:this={fileInput} 
	class="hidden" 
	onchange={handleFileChange}
	accept="image/*"
/>

<div bind:this={container} class="mx-auto max-w-4xl px-3 sm:px-4 pb-16 sm:pb-20">
	<!-- Mobile: natural column flow; sm+: fixed 550px card -->
	<div class="relative flex flex-col gap-5 sm:gap-8 sm:h-[550px]">

		<!-- User Message -->
		<div class="flex justify-end shrink-0">
			<div class="rounded-2xl bg-[#2A292D] px-4 py-2.5 sm:px-6 sm:py-3 text-white shadow-lg border border-white/5 max-w-[88%] sm:max-w-[80%]">
				<p class="text-sm font-medium">{userMessage}</p>
			</div>
		</div>

		<!-- AI Response -->
		<div class="flex flex-col flex-1 min-h-0">
			<div class="flex gap-3 sm:gap-4 h-full items-start">
				<!-- Avatar -->
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B58A6C] text-white shrink-0 mt-0.5">
					<Sparkles size={16} />
				</div>

				<!-- Content -->
				<div class="flex-1 flex flex-col min-h-0 pt-1">
					<!-- Scrollable text: capped on mobile, full-height on sm+ -->
					<div class="overflow-y-auto pr-2 sm:pr-4 custom-scrollbar flex-1 max-h-[240px] sm:max-h-none">
						{#if loading}
							<div class="space-y-3">
								<div class="h-4 w-3/4 animate-pulse rounded bg-white/5"></div>
								<div class="h-4 w-full animate-pulse rounded bg-white/5"></div>
								<div class="h-4 w-5/6 animate-pulse rounded bg-white/5"></div>
							</div>
						{:else}
							<div class="prose prose-invert max-w-none text-white/90 leading-relaxed text-sm">
								{@html (hasFinishedTyping ? aboutContent : displayedContent || '').replace(/\n/g, '<br>')}
								{#if hasStartedTyping && !hasFinishedTyping}
									<span class="inline-block w-2 h-4 ml-1 bg-[#B58A6C] animate-pulse"></span>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Action icons -->
					<div class="flex items-center gap-4 text-white/40 mt-5 shrink-0">
						<button onclick={triggerFileUpload} class="hover:text-white transition-colors" title="Upload File">
							<Plus size={17} />
						</button>
						<button onclick={handleShare} class="hover:text-white transition-colors" title="Share Page">
							<Share2 size={17} />
						</button>
						<button
							onclick={toggleReading}
							class="transition-colors {isReading ? 'text-[#B58A6C] animate-pulse' : 'hover:text-white'}"
							title="Read Aloud"
						>
							<Volume2 size={17} />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Chat Input -->
		<div class="relative shrink-0">
			{#if showLimitWarning}
				<div class="absolute bottom-full left-0 right-0 mb-3 flex justify-center z-10">
					<div class="flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-red-400 shadow-xl backdrop-blur-md">
						<AlertCircle size={15} />
						<div class="text-xs">
							<span class="font-bold">Daily Limit Reached!</span>
							<span class="opacity-80 hidden sm:inline"> Upgrade to Pro to continue.</span>
						</div>
					</div>
				</div>
			{/if}

			<div class="flex items-center gap-2 sm:gap-3 rounded-3xl border border-white/10 bg-[#1A191D] p-2 sm:p-3 shadow-2xl transition-all focus-within:border-[#B58A6C]/30">
				<!-- Attach -->
				<button
					onclick={triggerFileUpload}
					class="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 transition-all shrink-0"
				>
					<Plus size={18} />
				</button>

				<!-- Text field -->
				<input
					type="text"
					bind:value={inputText}
					onkeydown={handleKeyDown}
					placeholder="Write a message..."
					class="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20"
				/>

				<!-- Right group -->
				<div class="flex items-center gap-1.5 shrink-0">
					<!-- Model selector -->
					<div class="relative">
						<button
							onclick={toggleModels}
							class="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10 transition-all sm:px-4 sm:py-2 sm:gap-2"
						>
							<span class="capitalize hidden sm:inline">{selectedModel}</span>
							<span class="capitalize sm:hidden text-[10px]">{selectedModel.split(' ').pop()}</span>
							<ChevronDown size={12} class="text-white/30" />
						</button>

						{#if showModels}
							<div class="absolute bottom-full right-0 mb-3 w-52 sm:w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#2A292D] p-1 shadow-2xl z-50">
								<div class="px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Select Model</div>
								{#each models as model}
									<button
										onclick={() => selectModel(model)}
										class="w-full rounded-xl px-3 py-2 text-left text-xs transition-all {selectedModel === model ? 'bg-[#B58A6C] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}"
									>
										<span class="capitalize">{model}</span>
									</button>
								{/each}
								<div class="mt-1 border-t border-white/5 p-2">
									<div class="flex items-center gap-2 rounded-lg bg-orange-500/10 px-2 py-2 text-[10px] text-orange-400">
										<Sparkles size={12} />
										<span>Upgrade to Pro for Unlimited credits</span>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Send -->
					<button
						onclick={handleSend}
						class="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full {inputText ? 'bg-[#B58A6C] text-white' : 'bg-white/5 text-white/40'} hover:scale-105 transition-all"
					>
						<Send size={17} />
					</button>
				</div>
			</div>

			<p class="mt-3 text-center text-[9px] sm:text-[10px] text-white/20 uppercase tracking-widest">
				Xyphx AI is an experimental model. Please double-check responses.
			</p>
		</div>
	</div>
</div>

<style>
	:global(.prose br) {
		margin-bottom: 0.5rem;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(181, 138, 108, 0.2);
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(181, 138, 108, 0.4);
	}

	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: rgba(181, 138, 108, 0.2) transparent;
	}
</style>
