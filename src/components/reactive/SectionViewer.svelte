<script lang="ts">
    import WheelMenu from "./WheelMenu.svelte";

    import type { CollectionEntry } from "astro:content";
	export let sections: CollectionEntry<'sections'>[];
    let selectedSection: CollectionEntry<'sections'> | undefined = sections && sections.length > 0 ? sections[0] : undefined;


    function handleSelect(section: CollectionEntry<'sections'>) {
        selectedSection = section;
    }

    $: sectionHtml = selectedSection && selectedSection.rendered ? selectedSection.rendered.html : '';
</script>

<div class="flex flex-row w-full">
    {#if sections && sections.length > 0}
        <WheelMenu items={sections} onSelect={handleSelect} />
        <div class="flex-1 h-lvh primary-400">
            <article class="prose-xl text-black font-medium w-full p-8">
                {@html sectionHtml}
            </article>
        </div>
    {:else}
        <div class="flex-1 h-lvh flex items-center justify-center text-gray-500">
            No sections available.
        </div>
    {/if}
</div>