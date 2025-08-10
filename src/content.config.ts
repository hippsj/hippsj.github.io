import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const sections = defineCollection({
	// Load Markdown and MDX files in the `src/content/sections/` directory.
	loader: glob({ base: './src/content/sections', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		published: z.boolean().default(false),
		title: z.string(),
		description: z.string(),
		order: z.number().default(999),
	}),
});

export const collections = { sections };