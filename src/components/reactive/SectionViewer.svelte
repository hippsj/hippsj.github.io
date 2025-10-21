<script lang="ts">
    import WheelMenu from "./WheelMenu.svelte";

    import type { CollectionEntry } from "astro:content";
	export let sections: CollectionEntry<'sections'>[];
    let selectedSection: CollectionEntry<'sections'> | undefined = sections && sections.length > 0 ? sections[0] : undefined;
    let isTransitioning = false;

    function handleSelect(section: CollectionEntry<'sections'>) {
        if (section.id === selectedSection?.id) return;
        isTransitioning = true;
        setTimeout(() => {
            selectedSection = section;
            isTransitioning = false;
        }, 180);
    }

    $: sectionHtml = selectedSection && selectedSection.rendered ? selectedSection.rendered.html : '';
</script>

<div class="flex flex-row w-full items-center min-h-screen">
    <WheelMenu items={sections} onSelect={handleSelect} />
        
    {#if sections && sections.length > 0}
        <div class="flex-1 h-lvh primary-400 flex items-center justify-center">
            <article class="prose-xl prose-img:rounded-4xl prose-img:max-w-90 prose-img:m-12 text-black font-medium w-full p-9 h-full flex items-center justify-center transition-opacity duration-300 {isTransitioning ? 'opacity-0' : 'opacity-100'}">
                <div class="w-full">
                    {@html sectionHtml}
                </div>
            </article>
        </div>
    {:else}
        <div class="flex-1 h-lvh flex items-center justify-center text-gray-500">
            I'm working on adding more content here. Please check back soon!
        </div>
    {/if}
</div>