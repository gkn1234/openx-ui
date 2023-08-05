const { defineConfig } = require('eslint-define-config');
const path = require('path');

module.exports = defineConfig({
  // 指定此配置为根级配置，eslint 不会继续向上层寻找
  root: true,

  // 将浏览器 API、ES API 和 Node API 看做全局变量，不会被特定的规则(如 no-undef)限制。
  env: {
    browser: true,
    es2022: true,
    node: true,
  },

  // 设置自定义全局变量，不会被特定的规则(如 no-undef)限制。
  globals: {
    // 假如我们希望 jquery 的全局变量不被限制，就按照如下方式声明。
    // $: 'readonly',
  },

  // 集成 Airbnb 规则集以及 vue 相关规则
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:vue/vue3-recommended',
  ],

  // 指定 vue 解析器
  parser: 'vue-eslint-parser',
  parserOptions: {
    // 配置 TypeScript 解析器
    parser: '@typescript-eslint/parser',

    // 通过 tsconfig 文件确定解析范围，这里需要绝对路径，否则子模块中 eslint 会出现异常
    project: path.resolve(__dirname, 'tsconfig.eslint.json'),

    // 支持的 ecmaVersion 版本
    ecmaVersion: 13,

    // 我们主要使用 esm，设置为 module
    sourceType: 'module',

    // TypeScript 解析器也要负责 vue 文件的 <script>
    extraFileExtensions: ['.vue'],
  },

  // 在已有规则及基础上微调修改
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',

    // vue 允许单单词组件名
    'vue/multi-word-component-names': 'off',

    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
      },
    ],

    'operator-linebreak': ['error', 'after'],
    'class-methods-use-this': 'off',

    // 允许使用 ++
    'no-plusplus': 'off',

    'no-spaced-func': 'off',

    // 换行符不作约束
    'linebreak-style': 'off',
  },

  // 文件级别的重写
  overrides: [
    // 对于 vite 和 vitest 的配置文件，不对 console.log 进行错误提示
    {
      files: [
        '**/vite.config.*',
        '**/vitest.config.*',
        'scripts/**',
      ],
      rules: {
        'import/no-relative-packages': 'off',
        'no-console': 'off',
      },
    },
  ],
});
