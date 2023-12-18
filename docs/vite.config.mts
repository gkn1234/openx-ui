import { defineConfig } from 'vite';
import { join } from 'node:path';
import unocss from 'unocss/vite';

export default defineConfig({
  plugins: [
    // 应用组件库的 unocss 预设，配置文件在根目录的 uno.config.ts
    // 集成 UnoCss 方便我们编写组件用例，或者实现 VitePress 专用组件
    unocss(),
  ],
  resolve: {
    alias: [
      {
        // 将 @openxui/xxx 内部依赖定位到源码路径
        find: /^@openxui\/(.+)$/,
        replacement: join(__dirname, '..', 'packages', '$1', 'src'),
      },
    ],
  },
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
  ssr: {
    noExternal: ['@vue/repl'],
  },
});
