import {
  defineConfig,
  ConfigEnv,
} from 'vite';
import { generateConfig, generateVueConfig } from '../build/scripts';
import { absCwd, relCwd } from '../build/src';

export default defineConfig(({ mode }: ConfigEnv) => {
  if (mode === 'unocss') {
    // UnoCSS 预设部分是纯 ts 模块，可以使用基础构建预设
    return generateConfig({
      entry: 'src/unoPreset.ts',
      // 指定产物名称
      fileName: 'preset',
      // 不实现 d.ts 的移动，下一轮构建(--mode theme)时再进行移动
      dts: '',
      // 指定 exports 字段，将构建产物的相对路径写入 packages.json 中的 exports['./preset']
      exports: './preset',
    });
  }

  return generateVueConfig({
    // 在 package.json 的 exports['./style.css'] 为样式文件的人口
    onSetPkg: (pkg, options) => {
      const exports: Record<string, string> = {
        './style.css': relCwd(absCwd(options.outDir, 'style.css'), false),
      };
      Object.assign(
        pkg.exports as Record<string, any>,
        exports,
      );
    },
    presetOpenxuiOptions: {
      // 基础主题样式的 CSS 由 UnoCSS 生成，需要正确指定 openxuiPreset 的模块。
      include: ['theme'],
    },
  }, {
    build: {
      // 紧接着上一轮构建(--mode unocss)，因此不用清空产物目录
      emptyOutDir: false,
    },
  });
});
