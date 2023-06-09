<script setup lang="ts">
interface Props {
  instructions: string;
  options?: string[];
  type: "multiple" | "value" | "open_text";
  answer: number | string;
}

const props = defineProps<Props>();
</script>
<template>
  {{ props.instructions }}
</template>
