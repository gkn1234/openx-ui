/** 基础颜色主题变量 */
export const themeColors = {
  'color-primary': '#c7000b',
  'color-success': '#50d4ab',
  'color-warning': '#fbb175',
  'color-danger': '#f66f6a',
  'color-info': '#526ecc',
  'color-transparent': 'transparent',
  'color-black': '#000',
  'color-white': '#fff',

  // 背景色
  'color-page': '#f5f5f6',
  'color-card': '#fff',

  // 文字主色
  'color-header': '#252b3a',
  'color-regular': '#575d6c',
  'color-secondary': '#8a8e99',
  'color-placeholder': '#abb0b8',
  'color-disabled': '#c0c4cc',
  'color-reverse': '#fff',

  // 边框主色
  'color-bd_darker': '#cdd0d6',
  'color-bd_dark': '#d4d7de',
  'color-bd_base': '#dcdfe6',
  'color-bd_light': '#dfe1e6',
  'color-bd_lighter': '#ebeff5',
  'color-bd_lightest': '#f2f6fc',
};

/**
 * 需要生成色阶的颜色
 *
 * 例如 color-primary 将会生成 color-primary-light-[1-9] 以及 color-primary-dark-[1-9] 系列浅色与深色的变量。
 */
export const themeColorLevelsEnabledKeys: (keyof typeof themeColors)[] = [
  'color-primary',
  'color-success',
  'color-warning',
  'color-danger',
  'color-info',
];

/** 基础边距主题变量 */
export const themeSpacing = {
  'spacing-xs': '8px',
  'spacing-sm': '12px',
  'spacing-md': '16px',
  'spacing-lg': '24px',
  'spacing-xl': '32px',
};

/** 基础主题变量 */
export const themeVars = {
  ...themeColors,
  ...themeSpacing,
};

/** 基础主题变量类型 */
export type ThemeCssVarsConfig = Partial<typeof themeVars>;
