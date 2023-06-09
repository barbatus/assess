<script setup lang="ts">
import { defineProps, withDefaults, computed } from "vue";

interface Props {
  type?: "primary" | "secondary" | "accent" | "default" | "link";
  link?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  link: false,
  type: "default",
});

const theme = computed(() => ({
  [`${props.type}`]: true,
}));
</script>
<template>
  <button type="button" :class="['btn', theme]"><slot /></button>
</template>
<style>
.primary {
  @apply btn-primary;
}
.link {
  @apply btn-link text-xs md:text-sm;
}
.secondary {
  @apply btn-secondary;
}
</style>
