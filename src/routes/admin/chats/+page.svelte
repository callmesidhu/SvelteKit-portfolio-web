<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
	import {
		MessageSquare,
		Trash2,
		Calendar,
		Mail,
		Phone,
		User,
		FileText,
		Inbox
	} from 'lucide-svelte';

	interface ChatSubmission {
		docId: string;
		name: string;
		email: string;
		phone: string;
		reason: string;
		createdAt: any;
	}

	let items = $state<ChatSubmission[]>([]);
	let loading = $state(true);
	let selectedItem = $state<ChatSubmission | null>(null);

	const fetchItems = async () => {
		loading = true;
		try {
			const q = query(collection(db, 'chat_submissions'), orderBy('createdAt', 'desc'));
			const querySnapshot = await getDocs(q);
			items = querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }) as ChatSubmission);
		} catch (error) {
			console.error('Error fetching chat submissions:', error);
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		fetchItems();
	});

	const handleDelete = async (docId: string, event: Event) => {
		event.stopPropagation();
		if (!confirm('Delete this submission permanently?')) return;
		try {
			await deleteDoc(doc(db, 'chat_submissions', docId));
			items = items.filter((i) => i.docId !== docId);
			if (selectedItem?.docId === docId) {
				selectedItem = null;
			}
		} catch (error) {
			console.error('Error deleting submission:', error);
		}
	};

	function formatDate(timestamp: any) {
		if (!timestamp) return '...';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Chat Submissions | Admin Panel</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8">
	<header>
		<h1 class="flex items-center gap-3 text-3xl font-bold text-admin-charcoal">
			<MessageSquare class="text-admin-clay" />
			Chat Submissions
		</h1>
		<p class="mt-2 text-admin-charcoal/70">
			View and manage contact submissions from the Luttappi chat bot.
		</p>
	</header>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Submissions List -->
		<div
			class="rounded-2xl border border-admin-stone bg-admin-coolgray p-6 shadow-2xl lg:col-span-2"
		>
			<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-admin-charcoal">
				<Inbox size={18} class="text-admin-clay" />
				All Submissions ({items.length})
			</h3>

			{#if loading}
				<div class="space-y-4">
					{#each Array(3) as _}
						<div
							class="h-20 animate-pulse rounded-xl border border-admin-stone bg-admin-offwhite/50"
						></div>
					{/each}
				</div>
			{:else if items.length === 0}
				<div class="py-16 text-center">
					<MessageSquare class="mx-auto mb-4 text-admin-charcoal/20" size={48} />
					<p class="text-admin-charcoal/50">No chat submissions found.</p>
				</div>
			{:else}
				<div class="max-h-[600px] space-y-3 overflow-y-auto pr-1">
					{#each items as item (item.docId)}
						<div
							role="button"
							tabindex="0"
							onclick={() => (selectedItem = item)}
							onkeydown={(e) => e.key === 'Enter' && (selectedItem = item)}
							class="flex w-full cursor-pointer flex-col justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] sm:flex-row sm:items-center {selectedItem?.docId ===
							item.docId
								? 'border-admin-clay bg-admin-clay/10'
								: 'border-admin-stone bg-admin-offwhite/80 hover:bg-admin-offwhite'}"
						>
							<div class="min-w-0 flex-1 space-y-1">
								<div class="flex items-center gap-2">
									<h4 class="truncate font-bold text-admin-charcoal">{item.name}</h4>
									<span
										class="rounded-full bg-admin-stone/30 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-admin-charcoal/50"
									>
										{formatDate(item.createdAt)}
									</span>
								</div>
								<p class="flex items-center gap-1 truncate text-xs text-admin-charcoal/70">
									<Mail size={12} />
									{item.email}
								</p>
								<p class="mt-1 truncate text-xs text-admin-charcoal/60 italic">
									"{item.reason}"
								</p>
							</div>
							<div class="flex shrink-0 items-center justify-end">
								<button
									onclick={(e) => handleDelete(item.docId, e)}
									class="rounded-lg p-2 text-admin-charcoal/40 transition-colors hover:bg-red-500/10 hover:text-red-600"
									aria-label="Delete submission"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Details View -->
		<div class="rounded-2xl border border-admin-stone bg-admin-coolgray p-6 shadow-2xl">
			<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-admin-charcoal">
				<FileText size={18} class="text-admin-clay" />
				Submission Details
			</h3>

			{#if selectedItem}
				<div class="space-y-6">
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<div class="mt-1 text-admin-clay"><User size={16} /></div>
							<div>
								<p class="text-[10px] font-bold tracking-wider text-admin-charcoal/40 uppercase">
									Name
								</p>
								<p class="text-sm font-bold text-admin-charcoal">{selectedItem.name}</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="mt-1 text-admin-clay"><Mail size={16} /></div>
							<div>
								<p class="text-[10px] font-bold tracking-wider text-admin-charcoal/40 uppercase">
									Email
								</p>
								<a
									href="mailto:{selectedItem.email}"
									class="text-sm font-semibold break-all text-admin-clay hover:underline"
									>{selectedItem.email}</a
								>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="mt-1 text-admin-clay"><Phone size={16} /></div>
							<div>
								<p class="text-[10px] font-bold tracking-wider text-admin-charcoal/40 uppercase">
									Phone
								</p>
								<a
									href="tel:{selectedItem.phone}"
									class="text-sm font-semibold break-all text-admin-clay hover:underline"
									>{selectedItem.phone || 'Not provided'}</a
								>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="mt-1 text-admin-clay"><Calendar size={16} /></div>
							<div>
								<p class="text-[10px] font-bold tracking-wider text-admin-charcoal/40 uppercase">
									Submitted At
								</p>
								<p class="text-sm font-medium text-admin-charcoal">
									{formatDate(selectedItem.createdAt)}
								</p>
							</div>
						</div>
					</div>

					<div class="space-y-2 border-t border-admin-stone pt-4">
						<p
							class="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-charcoal/40 uppercase"
						>
							<FileText size={10} /> Message / Reason
						</p>
						<div
							class="max-h-[250px] overflow-y-auto rounded-xl border border-admin-stone bg-admin-offwhite/50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-admin-charcoal/90"
						>
							{selectedItem.reason}
						</div>
					</div>

					<button
						onclick={(e) => handleDelete(selectedItem!.docId, e)}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition-all hover:bg-red-700"
					>
						<Trash2 size={18} />
						Delete Submission
					</button>
				</div>
			{:else}
				<div class="py-20 text-center">
					<Inbox class="mx-auto mb-4 text-admin-charcoal/20" size={40} />
					<p class="text-sm text-admin-charcoal/50">
						Select a submission from the list to view full details.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
