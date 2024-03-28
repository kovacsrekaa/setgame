<script setup lang="ts">
import { ref } from "vue";
import { getCard, CardSchema } from "./index";

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

  if (!response.success) {
    alert(response.status);
    return;
  }

  if (response.status >= 500) {
    return;
  }

  if (!response) return;

  const products = response.data;
  const result = CardSchema.array().safeParse(products);

  if (!result.success) {
    alert("Oops");
    return;
  }

  cards.value = result.data;
};
</script>

<template>
  <div>
    <button @click="fetchCards">Fetch Cards</button>
    <div v-if="cards.length > 0">
      <div v-for="card in cards" :key="card.id" class="card">
        <div class="card-id">{{ card.id }}</div>
        <div class="card-color">{{ card.color }}</div>
        <div class="card-shape">{{ card.shape }}</div>
        <div class="card-number">{{ card.number }}</div>
        <div class="card-filler">{{ card.filler }}</div>
      </div>
    </div>
    <div v-else>
      No cards available.
    </div>
  </div>
</template>

