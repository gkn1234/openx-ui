import { ThemeCssVarsConfig } from './theme';
import { ButtonCssVarsConfig } from './button';

// 引入其他组件的主题变量类型
// import { ComponentCssVarConfig } from './other-component';

/** 导出组件库主题样式的整体类型 */
export interface OpenxuiCssVarsConfig extends
  ThemeCssVarsConfig,
  ButtonCssVarsConfig {
  [key: string]: string | undefined;
}

export * from './theme';
export * from './button';
