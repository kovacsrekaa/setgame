import { safeFetch } from "./safefetch";
import {z} from "zod"

export const CardSchema = z.object ({
  id: z.number(),
  color: z.string(),
  shape: z.string(), 
  number: z.number(),
  filler: z.string()
})


  export const getCard = async () => {
    return await safeFetch({
      path: '/api/sets',
      method: 'GET',
      data: {}
    }, CardSchema);
  }

