<script setup lang="ts">
import { defineProps, withDefaults, ref, watch } from "vue";
import { onClickOutside } from '@vueuse/core';

interface Props {
  open: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  open: true,
});

let open = ref(false);
watch(
  () => props.open,
  (value) => {
    open.value = value;
  },
);

const emit = defineEmits(["close"]);
const modalRef = ref<HTMLElement | null>(null);

onClickOutside(modalRef, () => {
  emit("close");
});
</script>
<template>
  <div>
    <input
      type="checkbox"
      id="main-modal"
      class="modal-toggle"
      v-model="open"
      @change="emit('close')"
    />
    <div class="modal modal-bottom sm:modal-middle">
      <div class="modal-box relative" ref="modalRef">
        <template v-if="props.title">
          <label
            for="main-modal"
            class="btn btn-sm btn-circle absolute right-2 top-2"
            >✕</label
          >
          <h3 class="text-lg font-bold">{{ props.title }}</h3>
        </template>
        <p class="py-4"><slot /></p>
      </div>
    </div>
  </div>
</template>
