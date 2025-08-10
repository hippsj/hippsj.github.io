<script lang="ts">
    import WheelMenu from "./WheelMenu.svelte";

    import type { CollectionEntry } from "astro:content";
	export let sections: CollectionEntry<'sections'>[];
    let selectedSection: CollectionEntry<'sections'> = sections[0];

    function handleSelect(section: CollectionEntry<'sections'>) {
        selectedSection = section;
    }

    $: sectionHtml = selectedSection.rendered?.html || '';
</script>

<div class="flex flex-row w-full">
    <WheelMenu items={sections} onSelect={handleSelect} />
    <div class="flex-1 h-lvh primary-400">
        <article class="prose-xl text-black font-medium w-full p-8">
            {@html sectionHtml}
        </article>
    </div>
</div>