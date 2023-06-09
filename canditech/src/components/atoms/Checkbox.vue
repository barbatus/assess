<script setup lang="ts">
import { ref, defineProps, watch } from "vue";

interface Props {
  label: string;
  value: number;
  editable?: boolean;
  modelValue?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value?: number): void;
  (e: "labelChange", value: string): void;
}>();

const modelValue = ref<(number | undefined)[]>([props.modelValue]);
watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = [val];
  },
);
</script>
<template>
  <label class="cursor-pointer label justify-start">
    <input
      type="checkbox"
      v-model="modelValue"
      @change="emit('update:modelValue', modelValue[modelValue.length - 1])"
      :value="props.value"
      class="checkbox checkbox-primary mr-4"
    />
    <input
      v-if="editable"
      class="input input-bordered input-secondary w-32 input-sm"
      :value="props.label"
      @input="emit('labelChange', $event.target.value)"
    />
    <span v-else class="label-text">{{ props.label }}</span>
  </label>
</template>
