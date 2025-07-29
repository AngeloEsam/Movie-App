import { z } from 'zod';

export const mediaSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["Movie", "TV Show"]),
  director: z.string().min(1),
  budget: z.number().nonnegative(),
  location: z.string(),
  duration: z.number().positive(),
  year: z.number().int().min(1900),
});
