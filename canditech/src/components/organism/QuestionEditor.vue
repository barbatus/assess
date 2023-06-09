<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "components/molecules/Modal.vue";
import Form from "components/atoms/Form.vue";
import Row from "components/atoms/Row.vue";
import Button from "components/atoms/Button.vue";
import Checkbox from "components/atoms/Checkbox.vue";
import Dropdown from "components/molecules/Dropdown.vue";
import { TrashIcon } from "@heroicons/vue/24/solid";

import { Question } from "../../state/useAssessment";

interface Props {
  modelValue?: Question;
}

const props = defineProps<Props>();

const modalOpen = ref(false);
const questionRef = ref<Question>();
watch(
  () => props.modelValue,
  (question) => {
    modalOpen.value = Boolean(question);
    if (question) {
      questionRef.value = {
        ...question,
        options: question.options ? [...question.options] : [],
      };
    }
  },
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update:modelValue", value: Question): void;
  (e: "save", value: Question): void;
}>();

const handleRemoveOption = (ind: number) => {
  if (questionRef.value?.options?.length) {
    questionRef.value.options.splice(ind, 1);
  }
  if (questionRef.value?.answer === ind) {
    questionRef.value.answer = undefined;
  }
};

const handleTypeChange = () => {
  if (!questionRef.value) return;
  questionRef.value.answer = undefined;
  questionRef.value.options = undefined;
  if (questionRef.value.type === "multiple") {
    questionRef.value.options = [];
  }
};
</script>
<template>
  <Modal
    :open="modalOpen"
    title="Edit Question"
    @close="
      modalOpen = false;
      emit('close');
    "
  >
    <template v-if="questionRef">
      <Form class="mb-4">
        <Row label="Type">
          <Dropdown
            v-model="questionRef.type"
            :options="['multiple', 'value', 'open_text'].map((opt: string) => ({ label: opt, value: opt }))"
            @update:modelValue="handleTypeChange"
          />
        </Row>
        <Row label="Instructions">
          <input
            type="text"
            v-model="questionRef.instructions"
            @input="emit('update:modelValue', questionRef)"
            class="input input-bordered input-primary w-full max-w-xs"
          />
        </Row>
        <Row v-if="questionRef.type === 'multiple'" label="Options">
          <p
            v-for="(opt, index) in questionRef.options"
            class="flex items-center"
          >
            <Checkbox
              :label="opt"
              v-model="questionRef.answer"
              :value="index"
              class="mr-4"
              :editable="true"
              @labelChange="(label: string) => questionRef!.options![index] = label"
            />
            <TrashIcon
              class="w-4 h-4 cursor-pointer"
              @click="handleRemoveOption(index)"
            />
          </p>
        </Row>
        <Row v-else-if="questionRef.type === 'value'" label="Answer">
          <input
            type="text"
            v-model="questionRef.answer"
            @input="emit('update:modelValue', questionRef)"
            class="input input-bordered input-primary w-full max-w-xs"
          />
        </Row>
      </Form>
      <div class="modal-acttion flex justify-end">
        <Button class="btn-sm" @click="emit('save', questionRef)">Save</Button>
      </div>
    </template>
  </Modal>
</template>
