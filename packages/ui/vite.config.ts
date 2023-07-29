import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'OpenxuiShared',
      fileName: 'openxui-shared',
    },

    minify: false,

    rollupOptions: {
      external: [
        /@openxui.*/,
        'vue',
      ],

      output: {
      },
    },
  },
});
