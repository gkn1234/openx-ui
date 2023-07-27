<script setup lang="ts">
// packages/input/src/input.vue
import { hello } from '@openxui/shared';

withDefaults(defineProps<{
  modelValue?: string;
}>(), {
  modelValue: '',
});

const emit = defineEmits<{
  (event: 'update:modelValue', val: string): void;
}>();

function inputHandler(e: any) {
  const { value } = e.target;
  emit('update:modelValue', value);
  hello(value);
}

</script>

<template>
  <input
    class="openx-input"
    type="text"
    :value="modelValue"
    @input="inputHandler"
  >
</template>
