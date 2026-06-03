<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Icons from './Icons.svelte';
	import { fade, scale, slide, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import botAvatar from '$lib/assets/luttappi.png';
	import { db } from '$lib/firebase';
	import { collection, addDoc } from 'firebase/firestore';
	import { getVisitorLocation } from '$lib/analytics';

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

	const steps = [
		{
			question: "Hi there! 👋 I'm Luttappi. What's your name?",
			field: 'name'
		},
		{
			question: 'Nice to meet you, {name}! Why would you like to talk to callmesidhu?',
			field: 'reason'
		},
		{
			question: 'Got it. Could you share your phone number so he can reach out?',
			field: 'phone'
		},
		{
			question: "And finally, what's your email address?",
			field: 'email'
		},
		{
			question:
				'Thank you! callmesidhu has received your details and will reach you soon. Have a great day!',
			field: 'done'
		}
	];

	let userData = $state({
		name: '',
		reason: '',
		phone: '',
		email: ''
	});

	async function scrollMessagesToBottom() {
		await tick();
		if (container) container.scrollTop = container.scrollHeight;
	}

	async function addMessage(role: 'ai' | 'user', text: string) {
		if (role === 'ai') {
			isTyping = true;
			await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
			isTyping = false;
		}
		messages = [...messages, { id: crypto.randomUUID(), role, text }];
		await scrollMessagesToBottom();
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

			// Save to Firestore when all details are collected (email is step 3, step 4 is done)
			if (step === 4) {
				try {
					await addDoc(collection(db, 'chat_submissions'), {
						name: userData.name,
						reason: userData.reason,
						phone: userData.phone,
						email: userData.email,
						createdAt: new Date()
					});

					const location = await getVisitorLocation();
					const description =
						location === 'Someone'
							? `Visitor ${userData.name} submitted contact details via Luttappi`
							: `Visitor ${userData.name} from ${location} submitted contact details via Luttappi`;

					// Also log chat submission activity
					await addDoc(collection(db, 'activity_logs'), {
						type: 'chat_submission',
						description,
						createdAt: new Date()
					});
				} catch (err) {
					console.error('Error saving chat submission to Firestore:', err);
				}
			}

			const nextQ = steps[step].question.replace('{name}', userData.name);
			await addMessage('ai', nextQ);
		}
	}

	onMount(async () => {
		if (messages.length === 0) {
			await addMessage('ai', steps[0].question);
		}
	});

	$effect(() => {
		if (open && container) {
			scrollMessagesToBottom();
		}
	});

	let hasLoggedOpen = false;
	$effect(() => {
		if (open) {
			if (!hasLoggedOpen) {
				hasLoggedOpen = true;
				const logChatOpen = async () => {
					try {
						const { addDoc, collection } = await import('firebase/firestore');
						const location = await getVisitorLocation();
						const description =
							location === 'Someone'
								? 'Visitor opened Luttappi chat bot'
								: `Visitor from ${location} opened Luttappi chat bot`;

						await addDoc(collection(db, 'activity_logs'), {
							type: 'chat_open',
							description,
							createdAt: new Date()
						});
					} catch (e) {
						console.error('Error logging chat open:', e);
					}
				};
				logChatOpen();
			}
		} else {
			hasLoggedOpen = false;
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
		class="fixed top-22 right-2 bottom-auto z-[100] w-[calc(100vw-32px)] max-w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0B] shadow-2xl backdrop-blur-xl md:top-auto md:right-4 md:bottom-4"
		transition:fly={{ y: 20, duration: 400, easing: quintOut }}
	>
		<!-- Header -->
		<div
			class="+border-b flex items-center
		justify-between border-white/5 bg-white/5 px-5 py-4"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-[#B58A6C] shadow-lg"
				>
					<img src={botAvatar} alt="Luttappi" class="h-full w-full object-cover" />
				</div>
				<div>
					<h3 class="text-sm font-bold text-white">Luttappi</h3>
					<div class="flex items-center gap-1.5">
						<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
						<span class="text-[10px] font-medium tracking-wider text-white/40 uppercase"
							>Online</span
						>
					</div>
				</div>
			</div>
			<button
				onclick={closeChat}
				class="rounded-full p-1.5 text-white/20 transition-colors hover:bg-white/5 hover:text-white"
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
						<div
							class="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-md"
						>
							<img src={botAvatar} alt="Luttappi" class="h-full w-full object-cover" />
						</div>
					{/if}
					<div
						class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm {msg.role === 'user'
							? 'rounded-tr-none bg-[#B58A6C] text-white shadow-lg'
							: 'rounded-tl-none border border-white/5 bg-white/5 text-white/90'}"
					>
						{msg.text}
					</div>
				</div>
			{/each}

			{#if isTyping}
				<div class="flex justify-start gap-2.5" in:fade>
					<div
						class="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-md"
					>
						<img src={botAvatar} alt="Luttappi" class="h-full w-full object-cover" />
					</div>
					<div
						class="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-white/5 bg-white/5 px-4 py-3"
					>
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-white/20"></span>
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-white/20 [animation-delay:0.2s]"
						></span>
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-white/20 [animation-delay:0.4s]"
						></span>
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
						class="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pr-12 pl-4 text-sm text-white transition-all placeholder:text-white/20 focus:border-[#B58A6C]/50 focus:outline-none"
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
