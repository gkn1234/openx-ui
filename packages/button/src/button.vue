<script setup lang="ts">
// packages/button/src/button.vue
import { computed } from 'vue';
import { defaultButtonProps, ButtonProps } from './button';

const props = withDefaults(
  defineProps<ButtonProps>(),
  defaultButtonProps(),
);

const classes = computed(() => {
  const result: string[] = [];
  if (props.type) {
    result.push(`op-button--${props.type}`);
  }

  if (props.plain) {
    result.push('op-button--plain');
  }

  if (props.disabled) {
    result.push('op-button--disabled');
  }

  return result;
});

</script>

<template>
  <button
    class="op-button"
    :class="classes"
  >
    <slot />
  </button>
</template>
