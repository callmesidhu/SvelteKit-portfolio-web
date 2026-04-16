<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import { Eye, Users, MousePointer2, TrendingUp } from 'lucide-svelte';

	let count = $state<number | null>(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			const docRef = doc(db, 'dashboard', 'visitors');
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				count = docSnap.data().count;
			}
		} catch (err) {
			console.error('Error fetching visitor count:', err);
		} finally {
			loading = false;
		}
	});

	const stats = $derived([
		{
			name: 'Total Visitors',
			value: count !== null ? count.toLocaleString() : '...',
			icon: Eye,
			color: 'text-blue-400',
			bg: 'bg-blue-400/10'
		},
		{
			name: 'Unique Sessions',
			value: '1,234',
			icon: Users,
			color: 'text-emerald-400',
			bg: 'bg-emerald-400/10'
		},
		{
			name: 'Click Rate',
			value: '12.5%',
			icon: MousePointer2,
			color: 'text-amber-400',
			bg: 'bg-amber-400/10'
		},
		{
			name: 'Growth',
			value: '+18%',
			icon: TrendingUp,
			color: 'text-violet-400',
			bg: 'bg-violet-400/10'
		}
	]);
</script>

<div class="space-y-8">
	<header>
		<h1 class="text-3xl font-bold text-white">Dashboard Overview</h1>
		<p class="mt-2 text-gray-400">Real-time statistics for your portfolio</p>
	</header>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat (stat.name)}
			<div
				class="rounded-2xl border border-violet-900/20 bg-[#121212] p-6 shadow-xl transition-all duration-300 hover:border-violet-600/30"
			>
				<div class="mb-4 flex items-center justify-between">
					<div class="h-12 w-12 {stat.bg} {stat.color} flex items-center justify-center rounded-xl">
						<stat.icon size={24} />
					</div>
					<span
						class="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400"
						>Active</span
					>
				</div>
				<div class="space-y-1">
					<p class="text-sm font-medium text-gray-400">{stat.name}</p>
					<h2 class="text-3xl font-bold text-white">{stat.value}</h2>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div class="rounded-2xl border border-violet-900/20 bg-[#121212] p-8">
			<h3 class="mb-6 text-xl font-bold">Recent Activity</h3>
			<div class="space-y-6">
				{#each Array(4) as _, i (i)}
					<div class="flex items-start gap-4">
						<div class="mt-2 h-2 w-2 rounded-full bg-violet-600"></div>
						<div>
							<p class="text-sm text-gray-300">
								Someone from New York viewed your <span class="text-violet-400">Project AI</span>
							</p>
							<p class="mt-1 text-xs text-gray-500">{i + 1} hour ago</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div
			class="flex flex-col justify-center rounded-2xl border border-violet-600/20 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 p-8"
		>
			<h3 class="mb-4 text-2xl font-bold">Portfolio Performance</h3>
			<p class="mb-6 leading-relaxed text-gray-400">
				Your portfolio is performing better than <span class="font-bold text-white">85%</span> of other
				creators this month. Keep updating your projects to maintain visibility.
			</p>
			<button
				class="self-start rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition-all hover:bg-violet-700"
			>
				View Full Report
			</button>
		</div>
	</div>
</div>
