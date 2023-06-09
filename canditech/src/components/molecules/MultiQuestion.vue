<script setup lang="ts">
import { ref, watch } from "vue";
import { PencilIcon } from "@heroicons/vue/24/solid";

import Card from "components/atoms/Card.vue";
import CheckboxGroup from "./CheckboxGroup.vue";

export type Question = {
  instructions: string;
  options?: string[];
  answer?: number;
};

interface Props {
  question: Question;
}

const props = defineProps<Props>();

const answer = ref<number | undefined>(props.question.answer);

watch(
  () => props.question.answer,
  (val: number | undefined) => {
    answer.value = val;
  },
);

const emit = defineEmits<{ (e: "edit"): void }>();
</script>
<template>
  <Card class="w-fit md:w-96 max-w-96 relative">
    <div class="absolute right-3 top-3 cursor-pointer" @click="emit('edit')">
      <PencilIcon class="w-4 h-4 text-base-content" />
    </div>
    <h6 class="mb-2 text-lg tracking-tight text-base-content">
      {{ props.question.instructions }}
    </h6>
    <div class="text-base-content">
      <CheckboxGroup :options="props.question.options || []" v-model="answer" />
    </div>
  </Card>
</template>
