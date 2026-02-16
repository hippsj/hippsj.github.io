import { defineCollection, z } from 'astro:content';

const sections = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(999),
    published: z.boolean().default(false),
  }),
});

export const collections = {
  sections,
};
