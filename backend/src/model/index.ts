import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  password: z.string(),
})

export const CardSchema = z.object ({
  id: z.number(),
  color: z.string(),
  shape: z.string(), 
  number: z.number(),
  filler: z.string()
})

