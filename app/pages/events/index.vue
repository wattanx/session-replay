<script setup lang="ts">
const { data, status } = useLazyFetch("/api/replay");

const loading = computed(() => status.value === "pending");

const events = computed(() => data.value?.eventIds);
</script>

<template>
  <div class="min-h-screen p-4">
    <h1 class="py-4 text-2xl">Events</h1>
    <div v-if="loading">...loading</div>
    <div v-else>
      <ul>
        <li class="underline text-blue-500" v-for="id in events">
          <NuxtLink :to="`/events/${id}`">{{ id }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
