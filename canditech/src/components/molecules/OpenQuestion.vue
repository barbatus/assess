<script setup lang="ts">
import { PencilIcon } from "@heroicons/vue/24/solid";
import Card from "components/atoms/Card.vue";
import { Question } from "./MultiQuestion.vue";

interface Props {
  question: Question;
}

const props = defineProps<Props>();

const emit = defineEmits<{ (e: "edit"): void }>();
</script>
<template>
  <Card class="w-fit max-w-96 h-48 relative">
    <div class="absolute right-3 top-3 cursor-pointer" @click="emit('edit')">
      <PencilIcon class="w-4 h-4 text-base-content" />
    </div>
    <h6 class="mb-2 text-lg tracking-tight text-base-content">
      {{ props.question.instructions }}
    </h6>
    <div class="text-base-content">
      <div class="form-control">
        <textarea
          class="textarea textarea-bordered textarea-primary w-full max-w-xs"
          placeholder="Type answer here"
        ></textarea>
      </div>
    </div>
  </Card>
</template>
