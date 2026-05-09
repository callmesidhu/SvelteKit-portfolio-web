<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Icons from './Icons.svelte';
	import { fade, scale, slide, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { open = $bindable(false) } = $props();

	type Message = {
		id: string;
		role: 'ai' | 'user';
		text: string;
	};

	let messages = $state<Message[]>([]);
	let step = $state(0);
	let isTyping = $state(false);
	let inputValue = $state('');
	let container: HTMLElement | null = $state(null);
	const botAvatar = "https://scontent.fcok10-1.fna.fbcdn.net/v/t39.30808-1/301889657_487543196711459_1978820073548572472_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=Dnt-X4xysAUQ7kNvwH8wtnV&_nc_oc=AdqjZa-36NzFcrEy4px5nCczQsSfpWW2h1sa0en-K4tR5UODotCS16F2vKtU6rtd_Qg&_nc_zt=24&_nc_ht=scontent.fcok10-1.fna&_nc_gid=tBbeerYIJ1NkGqx-qkIh9w&_nc_ss=7b289&oh=00_Af4hr4E0UztQl5LGRkZfVUa06rpsA0dT3uGRGQkbD7FTlg&oe=6A04E30C";

	const steps = [
		{ 
			question: "Hi there! 👋 I'm Luttappi. What's your name?",
			field: 'name'
		},
		{ 
			question: "Nice to meet you, {name}! Why would you like to talk to callmesidhu?",
			field: 'reason'
		},
		{ 
			question: "Got it. Could you share your phone number so he can reach out?",
			field: 'phone'
		},
		{ 
			question: "And finally, what's your email address?",
			field: 'email'
		},
		{ 
			question: "Thank you! callmesidhu has received your details and will reach you soon. Have a great day!",
			field: 'done'
		}
	];

	let userData = $state({
		name: '',
		reason: '',
		phone: '',
		email: ''
	});

	async function addMessage(role: 'ai' | 'user', text: string) {
		if (role === 'ai') {
			isTyping = true;
			await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
			isTyping = false;
		}
		messages = [...messages, { id: crypto.randomUUID(), role, text }];
		await tick();
		if (container) container.scrollTop = container.scrollHeight;
	}

	async function nextStep() {
		if (step >= steps.length - 1) return;

		// If user sent something
		if (inputValue.trim()) {
			const currentField = steps[step].field as keyof typeof userData;
			userData[currentField] = inputValue;
			const text = inputValue;
			inputValue = '';
			await addMessage('user', text);
			
			step++;
			const nextQ = steps[step].question.replace('{name}', userData.name);
			await addMessage('ai', nextQ);
		}
	}

	onMount(async () => {
		if (messages.length === 0) {
			await addMessage('ai', steps[0].question);
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') nextStep();
	}

	function closeChat() {
		open = false;
	}
</script>

{#if open}
	<div 
		class="fixed bottom-24 right-4 z-[100] w-[calc(100vw-32px)] max-w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0B] shadow-2xl backdrop-blur-xl sm:bottom-28 sm:right-8"
		transition:fly={{ y: 20, duration: 400, easing: quintOut }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-white/5 bg-white/5 px-5 py-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#B58A6C] overflow-hidden border-2 border-white/10 shadow-lg">
					<img src={botAvatar} alt="Luttappi" class="h-full w-full object-cover" />
				</div>
				<div>
					<h3 class="text-sm font-bold text-white">Luttappi</h3>
					<div class="flex items-center gap-1.5">
						<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
						<span class="text-[10px] font-medium text-white/40 uppercase tracking-wider">Online</span>
					</div>
				</div>
			</div>
			<button 
				onclick={closeChat}
				class="rounded-full p-1.5 text-white/20 hover:bg-white/5 hover:text-white transition-colors"
			>
				<Icons name="ChevronDown" size={20} />
			</button>
		</div>

		<!-- Messages -->
		<div 
			bind:this={container}
			class="custom-scrollbar flex h-[380px] flex-col gap-4 overflow-y-auto p-5"
		>
			{#each messages as msg (msg.id)}
				<div 
					class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start gap-2.5'}"
					in:fly={{ y: 10, duration: 300, delay: 0 }}
				>
					{#if msg.role === 'ai'}
						<div class="h-7 w-7 rounded-full overflow-hidden shrink-0 mt-1 shadow-md border border-white/10">
							<img src={botAvatar} alt="Luttappi" class="h-full w-full object-cover" />
						</div>
					{/if}
					<div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm {msg.role === 'user' ? 'bg-[#B58A6C] text-white rounded-tr-none shadow-lg' : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none'}">
						{msg.text}
					</div>
				</div>
			{/each}

			{#if isTyping}
				<div class="flex justify-start gap-2.5" in:fade>
					<div class="h-7 w-7 rounded-full overflow-hidden shrink-0 mt-1 shadow-md border border-white/10">
						<img src={botAvatar} alt="Luttappi" class="h-full w-full object-cover" />
					</div>
					<div class="flex items-center gap-1.5 rounded-2xl bg-white/5 px-4 py-3 border border-white/5 rounded-tl-none">
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-white/20"></span>
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-white/20 [animation-delay:0.2s]"></span>
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-white/20 [animation-delay:0.4s]"></span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Input -->
		{#if step < steps.length - 1}
			<div class="border-t border-white/5 bg-white/[0.02] p-4">
				<div class="relative flex items-center gap-2">
					<input 
						type="text" 
						bind:value={inputValue}
						onkeydown={handleKeydown}
						placeholder="Type your message..."
						class="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/20 focus:border-[#B58A6C]/50 focus:outline-none transition-all"
					/>
					<button 
						onclick={nextStep}
						disabled={!inputValue.trim()}
						class="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#B58A6C] text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
					>
						<Icons name="ArrowUpRight" size={18} />
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
</style>
