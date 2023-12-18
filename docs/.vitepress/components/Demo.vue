<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  /** 用例源码 */
  source?: string;
}>(), {
  source: '',
});

const MAIN_FILE_NAME = 'App.vue';

// 将用例源码按照 Playground 的规则转换为 Base64 编码
const sourceHash = computed(() => {
  const originCode = {
    [MAIN_FILE_NAME]: decodeURIComponent(props.source),
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(originCode))));
});

// 跳转到 Playground，将 Base64 编码作为 hash 参数，Playground 页面就能展示对应的用例源码
function toPlayground() {
  window.open(
    `${window.location.origin}/playground.html#${sourceHash.value}`,
    '_blank',
  );
}

const isCodeShow = ref(false);
</script>

<template>
  <div class="demo">
    <div class="demo-render">
      <slot name="demo" />
    </div>
    <div class="demo-operators">
      <i class="i-op-code-screen" title="在 Playground 中编辑" @click="toPlayground" />
      <i class="i-op-code" title="查看源代码" @click="isCodeShow = !isCodeShow" />
    </div>
    <div v-if="isCodeShow" class="demo-code">
      <slot name="code" />
      <div class="pb-16px text-center" @click="isCodeShow = false">
        <a href="javascript:;" class="cursor-pointer c-info! no-underline!">隐藏源代码</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo {
  border: 1px solid rgb(var(--op-color-bd_light));
  border-radius: 4px;
}

.demo-render {
  padding: 20px;
}

.demo-operators {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  font-size: 18px;
  color: rgb(var(--op-color-secondary));
  border-top: 1px solid rgb(var(--op-color-bd_light));

  i {
    cursor: pointer;

    + i {
      margin-left: 16px;
    }
  }
}
</style>
