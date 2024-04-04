import express from "express";
import cors from "cors";
import { z } from "zod";
import fs from "fs/promises";
import { UserSchema, CardSchema } from "./model";
import { save, load } from "./util/db";
import { hash, compare } from "./util/hash";
import jwt from "jsonwebtoken";

const app = express();
const appPassword = "asdfghtehbfdrseay";

app.use(cors());
app.use(express.json());

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

  const setdatabase = await load("setdatabase", CardSchema.array());
  if (!setdatabase) return res.sendStatus(500);
  res.json(setdatabase);
});

const SignupRequestSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(3),
});

app.post("/api/signup", async (req, res) => {
  const result = SignupRequestSchema.safeParse(req.body);
  if (!result.success) return res.sendStatus(400);
  const { name, password } = result.data;

  const users = await load("users", UserSchema.array());
  if (!users) return res.sendStatus(500);

  const userExists = users.some((user) => user.name === name);
  if (userExists) return res.sendStatus(409);

  const id = Math.random();
  const hashedPassword = await hash(password);
  users.push({ id, name, password: hashedPassword });

  const isCreated = await save("users", users, UserSchema.array());
  if (!isCreated) return res.sendStatus(500);

  return res.json({ id });
});

const LoginRequestSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(3),
});

// name -> id
app.post("/api/login", async (req, res) => {
  const result = LoginRequestSchema.safeParse(req.body);
  if (!result.success) return res.sendStatus(400);
  const { name, password } = result.data;

  const users = await load("users", UserSchema.array());
  if (!users) return res.sendStatus(500);

  const user = users.find((user) => user.name === name);
  if (!user) return res.sendStatus(401);

  const isCorrect = await compare(password, user.password);
  if (!isCorrect) return res.sendStatus(401);

  const token = jwt.sign({ name: user.name }, appPassword, { expiresIn: "1h" });

  return res.json({ token });
});

const Headers = z.object({
  auth: z.string()
})

app.post("/api/game", async (req, res) => {
  const result = Headers.safeParse(req.headers)
  if(!result.success)
  return res.sendStatus(401)
const {auth} = result.data

let tokenPayload 
try {
  tokenPayload = jwt.verify(auth, appPassword)
} catch (error) {
  return res.sendStatus(401)
}
  console.log(tokenPayload)
  console.log("was here")
  res.json({msg: "ok"})
})

app.listen(3500);
