<script setup>
import Card from "./Card.vue";
</script>
<template>
  <Card class="w-full">
    <form>
      <slot />
    </form>
  </Card>
</template>
