<script setup lang="ts">
import { ref, Ref } from "vue";
import { getCard, CardsArraySchema, signup } from "./index";
import { z } from "zod";

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

const username = ref("")
const password = ref("")

type SuccessType = boolean | null 
let success: Ref<SuccessType | null> = ref(null)

const handleSignup = async () => {
  const response = await signup(username.value, password.value)
  if (response.status === 200) {
    success.value = true
  } else {
    success.value = false
  }
}

</script>

<template>
  <main class="flex justify-center py-16">
    <section class="card card-body max-w-[400px] bg-secondary text-secondary-content">
      <input v-model="username" class="input input-bordered"type="text" placeholder="Name" >
      <input v-model="password" class="input input-bordered" type="password" placeholder="Password">
      <button @click="handleSignup" class="btn btn-success">Signup</button>
    </section>
    <section v-if="success === true" class="alert flex justify-between alert-success max-w-96">
      <button @click="success = null" class="btn btn-ghost">Success</button>
    </section>
    <section v-if="success === false" class="alert flex justify-between alert-success max-w-96">
      <button @click="success = null" class="btn btn-ghost" >Error</button>
    </section>
  </main>
</template>

