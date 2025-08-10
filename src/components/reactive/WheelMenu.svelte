<script lang="ts">
	import { tick } from 'svelte';
	import type { CollectionEntry } from "astro:content";
	
	export let items: CollectionEntry<'sections'>[];
	export let onSelect: (item: CollectionEntry<'sections'>) => void;
	let selectedItem: CollectionEntry<'sections'> = items[0];
	let scrollContainer: HTMLDivElement;

	$: selectedIndex = items.findIndex(i => i.id === selectedItem.id);

	function mapValueExponential(
		value: number,
		inputMin: number,
		inputMax: number,
		outputMin: number,
		outputMax: number,
		exponent = 2
	): number {
		const t = (value - inputMin) / (inputMax - inputMin);
		const curved = 1 - Math.pow(1 - t, exponent);
		return outputMin + (outputMax - outputMin) * curved;
	}

	async function centerElementInView(el: HTMLElement) {
		await tick();

		const container = scrollContainer;
		const containerRect = container.getBoundingClientRect();
		const elRect = el.getBoundingClientRect();

		const containerCenter = containerRect.top + containerRect.height / 2;
		const elCenter = elRect.top + elRect.height / 2;

		const distance = elCenter - containerCenter;

		const duration = 400;
		const start = container.scrollTop;
		const target = start + distance;

		let startTime: number | null = null;

		function animateScroll(timestamp: number) {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

			container.scrollTop = start + (target - start) * ease;

			if (progress < 1) {
				requestAnimationFrame(animateScroll);
			}
		}

		requestAnimationFrame(animateScroll);
	}

	function getClosestItemToCenter(): CollectionEntry<'sections'> | null {
		if (!scrollContainer) return null;

		const containerRect = scrollContainer.getBoundingClientRect();
		const centerY = containerRect.top + containerRect.height / 2;

		const buttons = scrollContainer.querySelectorAll('button');
		let closestItem: CollectionEntry<'sections'> | null = null;
		let closestDistance = Infinity;

		buttons.forEach((btn, index) => {
			const rect = btn.getBoundingClientRect();
			const itemCenter = rect.top + rect.height / 2;
			const distance = Math.abs(centerY - itemCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestItem = items[index];
			}
		});

		return closestItem;
	}

	let scrollTimeout: ReturnType<typeof setTimeout>;
	function handleScroll() {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			const closest = getClosestItemToCenter();
			if (closest && closest.id !== selectedItem.id) {
				selectedItem = closest;
				onSelect(selectedItem);
			}
		}, 1);
	}
</script>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
</style>

<div class="flex flex-col justify-between p-8 text-right text-primary-foreground bg-primary h-dvh">
	<h1 class="text-xl hover:-translate-x-2">Name Lastname</h1>

	<div
		bind:this={scrollContainer}
		on:scroll={handleScroll}
		class="relative h-full overflow-y-scroll scrollbar-hide"
	>
		<div class="h-1/2 shrink-0 pointer-events-none"></div>

		<div class="flex flex-col items-end gap-6">
			{#each items as item, index}
				<button
					on:click={(e) => {
						selectedItem = item;
						centerElementInView(e.currentTarget);
						onSelect(item);
					}}
					class="transition-all text-5xl cursor-pointer sm:hover:-translate-x-2"
					style={
						"opacity: " +
						mapValueExponential(Math.abs(index - selectedIndex), 0, items.length, 1, 0, 0.4 * items.length) +
						"; transform: rotateX(" +
						mapValueExponential(Math.abs(index - selectedIndex), 0, items.length, 0, 30, 1) +
						"deg);" +
						"font-size: " +
						mapValueExponential(Math.abs(index - selectedIndex), 0, items.length, 3, 2, 8) +
						"rem;"
					}
				>
					{item.data.title}
				</button>
			{/each}
		</div>

		<div class="h-1/2 shrink-0 pointer-events-none"></div>
	</div>
 
	<footer class="pt-4">
		<a class="text-xl hover:-translate-x-2" href="mailto:user@email.com">user@email.com</a>
		<p class="text-sm opacity-60">Site design & development by Kadir Lofca.</p>
	</footer>
</div>
