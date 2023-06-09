<script setup lang="ts">
import Checkbox from "components/atoms/Checkbox.vue";

interface Props {
  options: string[];
  modelValue?: number;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
</script>
<template>
  <p v-for="(opt, index) in options" :key="index">
    <Checkbox
      :value="index"
      :modelValue="props.modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :label="opt"
    />
  </p>
</template>
