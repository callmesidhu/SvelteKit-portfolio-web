<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import { Sparkles, Send, Mic, Plus, ChevronDown } from 'lucide-svelte';

	let aboutContent = $state('');
	let loading = $state(true);
	let selectedModel = $state('xyphx 1.0 thinking');
	let showModels = $state(false);

	const models = [
		'xyphx 1.0 fast',
		'xyphx 1.0 thinking',
		'xyphx 1.0 max',
		'sonnet 4.5',
		'gpt 5.1',
		'gemini 3.5'
	];

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
	});

	function toggleModels() {
		showModels = !showModels;
	}

	function selectModel(model: string) {
		selectedModel = model;
		showModels = false;
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-20">
	<div class="relative flex flex-col space-y-8">
		<!-- User Message -->
		<div class="flex justify-end">
			<div class="rounded-2xl bg-[#2A292D] px-6 py-3 text-white shadow-lg border border-white/5">
				<p class="text-sm font-medium">who am i</p>
			</div>
		</div>

		<!-- AI Response -->
		<div class="flex flex-col space-y-4">
			<div class="flex items-start gap-4">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B58A6C] text-white">
					<Sparkles size={16} />
				</div>
				<div class="flex-1 space-y-6 pt-1">
					{#if loading}
						<div class="space-y-3">
							<div class="h-4 w-3/4 animate-pulse rounded bg-white/5"></div>
							<div class="h-4 w-full animate-pulse rounded bg-white/5"></div>
							<div class="h-4 w-5/6 animate-pulse rounded bg-white/5"></div>
						</div>
					{:else}
						<div class="prose prose-invert max-w-none text-white/90 leading-relaxed">
							{@html aboutContent.replace(/\n/g, '<br>')}
						</div>
					{/if}

					<!-- Action Icons -->
					<div class="flex items-center gap-4 text-white/40">
						<button class="hover:text-white transition-colors"><Plus size={18} /></button>
						<button class="hover:text-white transition-colors"><Send size={18} /></button>
						<button class="hover:text-white transition-colors"><Mic size={18} /></button>
					</div>
				</div>
			</div>
		</div>

		<!-- Chat Input Area (Visual Only) -->
		<div class="relative mt-12 px-2">
			<div class="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#1A191D] p-3 shadow-2xl transition-all focus-within:border-[#B58A6C]/30">
				<button class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 transition-all">
					<Plus size={20} />
				</button>
				
				<div class="flex-1 px-2 text-white/30 text-sm">
					Write a message...
				</div>

				<div class="flex items-center gap-2">
					<!-- Model Selector -->
					<div class="relative">
						<button 
							onclick={toggleModels}
							class="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 transition-all"
						>
							<span class="capitalize">{selectedModel}</span>
							<ChevronDown size={14} class="text-white/30" />
						</button>

						{#if showModels}
							<div class="absolute bottom-full right-0 mb-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#2A292D] p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
								<div class="px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Select Model</div>
								{#each models as model}
									<button 
										onclick={() => selectModel(model)}
										class="w-full rounded-xl px-3 py-2 text-left text-xs transition-all {selectedModel === model ? 'bg-[#B58A6C] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}"
									>
										<span class="capitalize">{model}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<button class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white transition-colors">
						<Mic size={20} />
					</button>
				</div>
			</div>
			
			<p class="mt-4 text-center text-[10px] text-white/20 uppercase tracking-widest">
				Xyphx AI is an experimental model and can make mistakes. Please double-check responses.
			</p>
		</div>
	</div>
</div>

<style>
	:global(.prose br) {
		margin-bottom: 0.5rem;
	}
</style>
