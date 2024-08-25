import { z } from 'zod'

//identifier is other name for email or username
export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

