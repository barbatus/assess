<script setup>
import { ref } from "vue";
import { Bars3Icon } from "@heroicons/vue/24/solid";

const open = ref(false);

const onToggleSide = () => {
  open.value = !open.value;
};
</script>
<template>
  <nav class="fixed top-0 z-50 w-full border-b border-base-300">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div>
          <button
            aria-controls="sidebar"
            type="button"
            class="sidebar-btn"
            @click="onToggleSide"
          >
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
        <div class="flex items-center ml-3">
          <slot name="nav-menu" />
        </div>
      </div>
    </div>
  </nav>

  <aside :class="{ 'max-sm:-translate-x-full': !open }" aria-label="Sidebar">
    <div class="h-full px-2 py-4 overflow-y-auto bg-base-200">
      <slot name="sidebar-menu"></slot>
    </div>
  </aside>

  <div class="p-5 sm:ml-64 pt-16 sm:pt-12">
    <slot></slot>
  </div>
</template>
<style>
aside {
  @apply fixed top-0 left-0 z-40 w-64 h-screen pt-16 sm:pt-12 transition-transform sm:translate-x-0;
}

.sidebar-btn {
  @apply inline-flex items-center p-2 text-sm rounded-lg sm:hidden hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-base-200;
}
</style>
