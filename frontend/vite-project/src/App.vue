<script setup lang="ts">
import { ref, Ref } from "vue";
import { getCard, CardsArraySchema, signup, login, createGame } from "./index";



type Card = {
  id: number
  color: string
  shape: string
  number: number
  filler: string
}

const cards = ref<Card[]>([]);


const fetchCards = async () => {
  const response = await getCard();
  console.log()

  if (!response.success) {
    alert(response.status);
    return;
  }

  if (response.status >= 500) {
    return;
  }

  if (!response) return;

  const products = response.data;
  const result = CardsArraySchema.safeParse(products);

  if (!result.success) {
    alert("Oops");
    return;
  }

  cards.value = result.data;
};

const name = ref("")
const password = ref("")

type SuccessType = boolean | null 
let Signupsuccess: Ref<SuccessType | null> = ref(null)
let Loginsuccess: Ref<SuccessType | null> = ref(null)

const handleSignup = async () => {
  const response = await signup(name.value, password.value)
  if (response.status === 200) {
    Signupsuccess.value = true
  } else {
    Signupsuccess.value = false
  }
}

const handleLogin = async () => {
  const response = await login(name.value, password.value) 
  if (response.success){
    Loginsuccess.value = true
    localStorage.setItem('token',response.data.token)
  } else {
    Loginsuccess.value   = false
  }
}

const handleCreate = async () => {
   const response = await createGame()
   console.log(response)
}

const logout = async () => {
  localStorage.removeItem('token')
  Loginsuccess.value = null
}


</script>

<template>
  <main v-if="!Loginsuccess" class="flex justify-center py-16">
    <section class="card card-body max-w-[400px] bg-secondary ">
      <img src="./assets/set.png">
      <input v-model="name" class="input input-bordered mt-5 "type="text" placeholder="Name" >
      <input v-model="password" class="input input-bordered" type="password" placeholder="Password">
      <button @click="handleLogin" class="btn btn-success mt-5 ">Login</button>
      <button @click="handleSignup" class="btn btn-success">Sign up</button>
    </section>
    <section v-if="Signupsuccess === true" class="alert flex justify-between alert-success max-w-96">
      Success!
      <button @click="Signupsuccess = null" class="btn btn-ghost">Close</button>
    </section>
    <section v-if="Signupsuccess === false" class="alert flex justify-between alert-error max-w-96">
      Error!
      <button @click="Signupsuccess = null" class="btn btn-ghost" >Close</button>
    </section>
    <section v-if="Loginsuccess === false">
      Error!
      <button @click="Loginsuccess = null" class="btn btn-ghost" >Close</button>
    </section>
  </main>


  <main v-if="Loginsuccess" class="flex justify-center py-16">
    <section class="alert alert-success flex justify-between max-w-[300px]">
      You are logged in!
    </section>
    <button @click="handleCreate()" class="btn btn-ghost">Start Game</button>
    <button @click="logout()" class="btn btn-ghost">Logout</button>
  </main>
</template>

