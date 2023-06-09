import { computed, watch, reactive, readonly, toRefs, toRaw } from 'vue';
import { StorageSerializers, useStorage } from '@vueuse/core';
import { useQuery } from "@tanstack/vue-query";

export type Question = {
  type: "multiple" | "value" | "open_text";
  instructions: string;
  options?: string[];
  answer?: string | number;
};

type Assessment = {
  title: string;
  created_at: string;
  sections: {
    section_title: string;
    questions: Question[];
  }[];
}

const assessment: Assessment = {
    "title": "Data Analyst Assessment",
    "created_at": "2020-07-11",
    "sections": [
        {
            "section_title": "Quantitative Thinking",
            "questions": [
                {
                    "type": "multiple",
                    "instructions": "One pipe fills 2 pools in 4 hours. How many hours will it take for 3 pipes to fill 6 pools?",
                    "options": ["8", "5", "4", "6"],
                    "answer": 2
                },
                {
                    "type": "value",
                    "instructions": "If the ratio between female to male users on an app is 9:2 and there are 1,026 female users, how many male users use the app?",
                    "answer": "228"
                },
                {
                    "type": "multiple",
                    "instructions": "60% of Jon’s salary equals 40% of Fred’s salary. If Jon’s salary is $120,000 a year, what is Fred’s yearly salary?",
                    "options": ["180k", "120k", "160k", "80K"],
                    "answer": 0
                },
                {
                    "type": "value",
                    "instructions": "How much is 1 + 1?",
                    "answer": "2"
                }
            ]
        },
        {
            "section_title": "Personal Questions",
            "questions": [
                {
                    "type": "open_text",
                    "instructions": "Why do you think you are a good fit to our company?"
                },
                {
                    "type": "multiple",
                    "instructions": "Would you like to work in our company?",
                    "options": ["No", "Yes"],
                    "answer": 1
                }
            ]
        }
    ]
};

export const useAssessment = () => {
  const store = useStorage<Assessment>('assessment', null, undefined, { serializer: StorageSerializers.object });
  const { data, isFetching } = useQuery<Assessment>({ queryKey: ["assessment"], queryFn: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(assessment);
      }, 2000);
    });
  }, staleTime: Infinity, enabled: !store.value });

  const state = reactive({
    currentInd: 0,
  });

  watch(data, (newData) => {
    store.value = toRaw(newData);
  });

  const updateQuestion = (questionInd: number, question: Question) => {
    if (!store.value) return;
    const currentSection = store.value.sections[state.currentInd];
    if (questionInd < 0 || questionInd >= currentSection.questions.length) throw new Error("Invalid section or question");
    store.value.sections[state.currentInd].questions[questionInd] = question;
  };

  const nextSection = () => {
    if (!store.value|| state.currentInd >= store.value.sections.length) return;
    state.currentInd++;
  };

  const prevSection = () => {
    if (!store.value || state.currentInd <= 0) return;
    state.currentInd--;
  };

  return {
    ...toRefs(readonly(state)),
    assessment: readonly(store),
    currentSection: readonly(computed(() => store.value?.sections[state.currentInd])),
    updateQuestion,
    prevSection,
    nextSection,
    isLoading: isFetching,
  };
};
