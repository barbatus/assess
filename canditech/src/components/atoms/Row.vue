<script setup lang="ts">
interface Props {
  label?: string;
}
const props = defineProps<Props>();
</script>
<template>
  <div class="form-control mb-2">
    <label class="label">
      <span class="label-text font-bold">{{ props.label }}</span>
    </label>
    <slot />
  </div>
</template>
