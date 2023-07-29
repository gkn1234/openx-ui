module.exports = {
  // 对于 js、ts 脚本文件，应用 eslint
  '**/*.{js,jsx,tsx,ts}': [
    'eslint --fix',
  ],
  // 对于 css scss 文件，应用 stylelint
  '**/*.{scss,css}': [
    'stylelint --fix',
  ],
  // Vue 文件由于同时包含模板、样式、脚本，因此 eslint、stylelint 都要使用
  '**/*.vue': [
    'eslint --fix',
    'stylelint --fix',
  ],
  // 对于其他类型的文件，用 prettier 修复格式
  '**/*.{html,json,md}': [
    'prettier --write',
  ],
};
