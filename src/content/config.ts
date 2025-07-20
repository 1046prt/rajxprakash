import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    excerpt: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
