<script setup lang="ts">
defineProps<{
  option: {
    name: string
    cb: Function
  }[]
}>()
</script>

<template>
  <div class="w-full h-full flex flex-wrap gap-10px">
    <button v-for="item in option" :key="item.name" class="h-30px w-60px" @click="item.cb">
      {{ item.name }}
    </button>
  </div>
</template>

<style></style>
