<script setup>
import { UserIcon } from "@heroicons/vue/24/solid";
</script>
<template>
  <div
    class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto"
  >
    <div class="flex items-center md:order-2">
      <button
        type="button"
        class="flex text-sm rounded-full focus:ring-4 focus:ring-base-300"
        aria-expanded="false"
      >
        <span class="sr-only">Open user menu</span>
        <UserIcon class="w-6 h-6 p-1 bg-base-300 rounded-full" />
      </button>
    </div>
    <div
      class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 mr-8"
    >
      <ul class="flex p-0 mt-0 flex-row space-x-8">
        <li>
          <a href="/" class="block p-0 text-primary" aria-current="page">
            Home
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
