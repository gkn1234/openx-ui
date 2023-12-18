<script setup lang="ts">
import {
  ref,
  watch,
  watchEffect,
  reactive,
  onMounted,
} from 'vue';
import { Repl, ReplStore, File } from '@vue/repl';
import '@vue/repl/style.css';
import { APP_WRAPPER_CODE } from './Playground';

let Monaco: any;
const isMounted = ref(false);
// 为了适配服务端渲染，组件本身，以及 Monaco 编辑器只在挂载完成后渲染
onMounted(() => {
  import('@vue/repl/monaco-editor').then((res) => {
    Monaco = res.default;
    isMounted.value = true;
  });
});

// repl组件需要store管理状态
const store = new ReplStore({
  serializedState: window.location.hash.slice(1),
});

// @vue/repl 的内容变化时，及时同步到 url 参数中
watchEffect(() => window.history.replaceState({}, '', store.serialize()));

store.state.mainFile = 'src/AppWrapper.vue';
store.addFile(new File('src/AppWrapper.vue', APP_WRAPPER_CODE, true));

const previewOptions = reactive({});

const tsVersions = ref<string[]>([]);

/** 获取所有 TypeScript 版本 */
async function fetchTsVersions() {
  const res = await fetch('https://data.jsdelivr.com/v1/package/npm/typescript');
  const { versions } = (await res.json()) as { versions: string[] };
  tsVersions.value = versions.filter((v) => !v.includes('dev') && !v.includes('insiders'));
}
fetchTsVersions();

// vue 版本切换相关
const vueVersion = ref('latest');
const vueVersions = ref<string[]>([]);

/** 获取所有 Vue 版本 */
async function fetchVueVersions() {
  const res = await fetch('https://data.jsdelivr.com/v1/package/npm/vue');
  const { versions } = (await res.json()) as { versions: string[] };
  // if the latest version is a pre-release, list all current pre-releases
  // otherwise filter out pre-releases
  let isInPreRelease = versions[0].includes('-');
  const filteredVersions: string[] = [];
  for (let i = 0; i < versions.length; i++) {
    const v = versions[i];
    if (v.includes('-')) {
      if (isInPreRelease) {
        filteredVersions.push(v);
      }
    } else {
      filteredVersions.push(v);
      isInPreRelease = false;
    }
    if (v === '3.0.10') {
      break;
    }
  }
  vueVersions.value = filteredVersions;
}
fetchVueVersions();

const isVueLoading = ref(false);

watch(vueVersion, (v) => {
  setVueVersion(v);
});

function setVueVersion(v: string) {
  if (isVueLoading.value) return;

  isVueLoading.value = true;

  store.setVueVersion(v).finally(() => {
    isVueLoading.value = false;
  });
}

const uiVersion = ref('latest');
const uiVersions = ref<string[]>([]);
/** 获取所有的组件库版本 */
async function fetchUiVersions() {
  const res = await fetch('https://data.jsdelivr.com/v1/package/npm/@openxui/ui');
  const { versions } = (await res.json()) as { versions: string[] };
  uiVersions.value = versions;
}
fetchUiVersions();

watch(uiVersion, (v) => {
  setUiVersion(v);
}, { immediate: true });

/** 设置组件库的版本 */
function setUiVersion(version: string) {
  // 加载组件库的全量 js 资源
  store.setImportMap({
    imports: {
      '@openxui/ui': `https://fastly.jsdelivr.net/npm/@openxui/ui@${version}/dist/openxui-ui.full.min.mjs`,
    },
  });
  // 加载组件库的全量样式
  previewOptions.headHTML = `<link rel="stylesheet" href="https://fastly.jsdelivr.net/npm/@openxui/ui@${version}/dist/style/index.css">`;
}

</script>

<template>
  <div v-if="isMounted">
    <Repl
      :store="store"
      :editor="Monaco"
      :auto-resize="true"
      :clear-console="false"
      :preview-options="previewOptions"
    />

    <Teleport to=".VPNavBarSearch">
      <div class="flex items-center text-14px">
        <label class="playground-label">OpenxUI: </label>
        <select v-model="uiVersion" class="playground-select">
          <option value="latest">
            latest
          </option>
          <option v-for="item in uiVersions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
        <label class="playground-label">Vue: </label>
        <select v-model="vueVersion" class="playground-select" :disabled="isVueLoading">
          <option value="latest">
            latest
          </option>
          <option v-for="item in vueVersions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
        <label class="playground-label">TypeScript: </label>
        <select v-model="store.state.typescriptVersion" class="playground-select">
          <option value="latest">
            latest
          </option>
          <option v-for="item in tsVersions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
:deep(.vue-repl) {
  height: calc(100vh - var(--vp-nav-height));
}

/* 新增样式 */
.playground-label {
  margin-left: 24px;
  font-weight: 700;
}

.playground-select {
  width: 120px;
  margin-left: 8px;
  appearance: auto;
  border: 1px solid rgb(var(--op-color-bd_base));
}
</style>
