<script setup lang="ts">
import { defineProps, computed, ref, defineExpose } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import { onClickOutside } from "@vueuse/core";
import Modal from "./Modal.vue";

type Option = {
  label: string;
  value: string;
};

interface Props {
  modelValue?: string;
  options: Option[];
}

const props = defineProps<Props>();

const title = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)?.label;
});

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const menuRef = ref<HTMLElement>();
onClickOutside(menuRef, () => toggleOpen(false));

const handleItemClick = (opt: Option) => {
  emit("update:modelValue", opt.value);
  toggleOpen(false);
};

const open = ref(false);
const toggleOpen = (value: boolean) => {
  open.value = value;
};

defineExpose({
  Option,
});
</script>
<template>
  <div
    :class="[
      'dropdown dropdown-bottom no-focus-open',
      { 'dropdown-open': open },
    ]"
  >
    <label class="input-group">
      <input
        type="text"
        readonly
        :value="title"
        class="input input-bordered input-sm md:input-md max-w-xs"
        @click="toggleOpen(!open)"
      />
      <button
        class="btn btn-active btn-ghost btn-sm md:btn-md"
        @click="toggleOpen(!open)"
        type="button"
      >
        <ChevronDownIcon class="h-6 w-6 scale-75" />
      </button>
    </label>
    <ul
      ref="menuRef"
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box max-w-52 w-fi hidden md:block"
    >
      <li v-for="opt in props.options" :key="opt.value">
        <a
          @click.prevent="handleItemClick(opt)"
          :class="{ active: opt.value === props.modelValue }"
        >
          {{ opt.label }}
        </a>
      </li>
    </ul>
    <Modal class="md:hidden" :open="open">
      <ul class="menu rounded-box p-2">
        <li v-for="opt in props.options" :key="opt.value">
          <a
            @click.prevent="handleItemClick(opt)"
            :class="{ active: opt.value === props.modelValue }"
          >
            {{ opt.label }}
          </a>
        </li>
      </ul>
    </Modal>
  </div>
</template>
<style>
.no-focus-open.dropdown:focus-within .dropdown-content {
  visibility: hidden;
}

.no-focus-open.dropdown.dropdown-open .dropdown-content {
  visibility: visible;
}
</style>
