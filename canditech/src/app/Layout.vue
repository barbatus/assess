<template>
  <nav class="fixed top-0 z-50 w-full border-b border-base-300">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-end">
        <div class="flex items-center ml-3">
          <slot name="nav-menu" />
        </div>
      </div>
    </div>
  </nav>

  <div class="p-5 pt-16 sm:pt-12">
    <slot></slot>
  </div>
</template>
