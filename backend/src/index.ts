import express from "express"
import cors from "cors"
import { z } from "zod"
import fs from "fs/promises"
import { UserSchema, CardSchema} from "./model"
import { save, load } from "./util/db"

const app = express()

app.use(cors())
app.use(express.json())


/* type Set = {
  id: number
  color: string
  shape: string
  number: number
  filler: string
} */



app.get("/api/sets", async (req, res) => {
  /* const result = SetQueryParams.safeParse(req.query)
  if (!result.success)
    return res.sendStatus(400) */
  
  const setdatabase = await load("setdatabase", CardSchema.array())
  if (!setdatabase)
  return res.sendStatus(500)
  res.json(setdatabase)

})

const SignupRequestSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(3),
})

app.post("/api/signup", async (req, res) => {
  const result = SignupRequestSchema.safeParse(req.body)
  if (!result.success)
    return res.sendStatus(400)
  const { name, password } = result.data

  const users = await load("users", UserSchema.array())
  if (!users)
    return res.sendStatus(500)

  const userExists = users.some(user => user.name === name)
  if (userExists)
    return res.sendStatus(409)

  const id = Math.random()
  
  users.push({ id, name, password })

  const isCreated = await save("users", users, UserSchema.array())
  if (!isCreated)
    return res.sendStatus(500)
  
  return res.json({ id })
})

app.listen(3500)
