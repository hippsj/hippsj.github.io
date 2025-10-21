<script lang="ts">
	import { tick } from 'svelte';
	import type { CollectionEntry } from "astro:content";
	import * as user from '../../data/user.json';

	export let items: CollectionEntry<'sections'>[];
	export let onSelect: (item: CollectionEntry<'sections'>) => void;
	let selectedItem: CollectionEntry<'sections'> = items[0];
	let closestItem: CollectionEntry<'sections'> | null = selectedItem;
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

	function getClosestItemToCenter(): { item: CollectionEntry<'sections'> | null; button: HTMLButtonElement | null } {
		if (!scrollContainer) return { item: null, button: null };

		const containerRect = scrollContainer.getBoundingClientRect();
		const centerY = containerRect.top + containerRect.height / 2;

		const buttons = scrollContainer.querySelectorAll('button');
		let closestItem: CollectionEntry<'sections'> | null = null;
		let closestButton: HTMLButtonElement | null = null;
		let closestDistance = Infinity;

		buttons.forEach((btn, index) => {
			const rect = btn.getBoundingClientRect();
			const itemCenter = rect.top + rect.height / 2;
			const distance = Math.abs(centerY - itemCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestItem = items[index];
				closestButton = btn as HTMLButtonElement;
			}
		});

		return { item: closestItem, button: closestButton };
	}

	let scrollTimeout: ReturnType<typeof setTimeout>;
	function handleScroll() {
		const { item: closest } = getClosestItemToCenter();
		closestItem = closest;

		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			const { item, button } = getClosestItemToCenter();

			if (item && item.id !== selectedItem.id && button) {
				selectedItem = item;
				onSelect(selectedItem);
			}

			const selectedButton = scrollContainer.querySelector(`button[id="${selectedItem.id}"]`) as HTMLButtonElement;
			if (selectedButton) centerElementInView(selectedButton);
		}, 300);
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

	.button {
		transform: rotateX(var(--rotate, 0deg)) translateX(var(--translate, 0));
		font-size: var(--font-size, 3rem);
		opacity: var(--opacity, 1);
		transition: transform 0.2s ease, font-size 0.2s ease, opacity 0.2s ease;
	}

	.button:hover {
		transform: rotateX(var(--rotate, 0deg)) translateX(-0.5rem);
	}
</style>

<div class="h-full w-100 max-w-100 min-w-100"></div>

<div class="fixed top-0 left-0 flex flex-col justify-between p-8 text-right text-primary-foreground bg-primary h-dvh max-w-100 w-100">
	<a href="/"><h1 class="text-xl hover:-translate-x-2 transition-all">{user.userName}</h1></a>

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
					id={item.id}
					class="transition-all text-5xl cursor-pointer button text-right"
					style="--rotate: {mapValueExponential(Math.abs(index - selectedIndex), 0, items.length, 0, 30, 1)}deg; --translate: {item.id === closestItem?.id && item.id !== selectedItem.id ? '-0.5rem' : '0'}; --font-size: {mapValueExponential(Math.abs(index - selectedIndex), 0, items.length, 2.3, 1.6, 8)}rem; --opacity: {mapValueExponential(Math.abs(index - selectedIndex), 0, items.length, 1, 0, 0.4 * items.length)};"
				>
					{item.data.title}
				</button>
			{/each}
		</div>

		<div class="h-1/2 shrink-0 pointer-events-none"></div>
	</div>
 
	<footer class="pt-4">
		<div class="flex gap-4 pb-2 justify-end text-right">
			{#each user.userSocials as social}
				<a href={social.url} target="_blank" rel="noopener noreferrer" class="text-xl hover:-translate-x-2 transition-all" aria-label={social.title}>{social.title}</a>
			{/each}
		</div>
			<a href='mailto:{user.userEmail}'><div class="text-xl hover:-translate-x-2 transition-all">{user.userEmail}</div></a>
			<!-- <p class="text-xs opacity-40">Site design & development by Kadir Lofca.</p> -->
		
	</footer>
</div>
