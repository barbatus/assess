<script setup lang="ts">
import { ref } from "vue";

import Button from "components/atoms/Button.vue";
import MultiQuestion from "components/molecules/MultiQuestion.vue";
import InputQuestion from "components/molecules/InputQuestion.vue";
import OpenQuestion from "components/molecules/OpenQuestion.vue";
import QuestionEditor from "components/organism/QuestionEditor.vue";
import Loader from "components/atoms/Loader.vue";

import { useAssessment, Question } from "../../state/useAssessment";

const {
  assessment,
  currentSection,
  currentInd,
  nextSection,
  prevSection,
  updateQuestion,
  isLoading,
} = useAssessment();
const questionInd = ref(0);

type ReadonlySection = NonNullable<typeof currentSection.value>;
type ReadonlyQuestion = ReadonlySection["questions"][number];
const editQuestion = ref<ReadonlyQuestion | null>();
const handleEditQuestion = (question: ReadonlyQuestion, ind: number) => {
  editQuestion.value = question;
  questionInd.value = ind;
};
const handleSave = (question: Question) => {
  updateQuestion(questionInd.value, question);
  editQuestion.value = undefined;
};
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-if="assessment">
    <header class="flex flex-wrap p-4">
      <h4 class="text-2xl mb-4 mt-4 text-primary-content font-bold mr-8">
        {{ assessment.title }}
      </h4>
      <div class="flex">
        <Button type="link" @click="prevSection">Prev</Button>
        <ul class="steps">
          <li
            v-for="(section, index) in assessment.sections"
            :class="['step', { 'step-primary': index === currentInd }]"
          >
            <span class="text-sm">
              {{ section.section_title }}
            </span>
          </li>
        </ul>
        <Button type="link" @click="nextSection">Next</Button>
      </div>
    </header>
    <div v-if="currentSection" class="border border-base-300 p-4 rounded-md">
      <h6 class="text-base-content text-lg font-bold mb-2">
        {{ currentSection.section_title }}
      </h6>
      <div
        class="lg:grid lg:grid-cols-[repeat(auto-fill,_minmax(min-content,_24rem))] flex gap-4 flex-wrap"
      >
        <template
          v-for="(que, index) in currentSection.questions"
          class="flex-grow"
        >
          <MultiQuestion
            class="flex-grow lg:h-full"
            v-if="que.type === 'multiple'"
            :question="que"
            @edit="handleEditQuestion({ ...que }, index)"
          />
          <InputQuestion
            class="flex-grow lg:h-full"
            v-else-if="que.type === 'value'"
            :question="que"
            @edit="handleEditQuestion(que, index)"
          />
          <OpenQuestion
            class="flex-grow lg:h-full"
            v-else
            :question="que"
            @edit="handleEditQuestion(que, index)"
          />
        </template>
      </div>
    </div>
  </div>
  <QuestionEditor
    v-model="editQuestion"
    @close="editQuestion = null"
    @save="handleSave"
  />

  <!-- <h2 class="min-h-12 flex justify-center items-center w-full">
    User Settings
  </h2> -->
  <!-- <Modal :open="modalOpen" title="First Modal" @close="toggleModal">
    <article class="prose">
      You've been selected for a chance to get one year of subscription to use
      Wikipedia for free!
    </article>
  </Modal> -->
  <!-- <div class="content">
    <Button type="link" @close="toggleModal" @click="toggleModal">Main</Button>
    <CheckboxGroup class="mb-4" />

    <Form>
      <Row label="Dropdown1">
        <Dropdown
          v-model="ddv"
          :options="[
            { label: 'Some dropdown item1', value: 'val1' },
            { label: 'Some dropdown item2', value: 'val2' },
          ]"
        />
      </Row>
      <Row label="Dropdown2">
        <Dropdown
          v-model="ddv"
          :options="[
            { label: 'Some dropdown item1', value: 'val1' },
            { label: 'Some dropdown item2', value: 'val2' },
          ]"
        />
      </Row>
    </Form>
  </div> -->
</template>
<style>
h2 {
  grid-area: header;
}
.content {
  grid-area: content;
}
</style>
