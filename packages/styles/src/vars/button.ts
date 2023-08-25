import { getCssVar, cssVarToRgba } from '../utils';
import { ThemeCssVarsConfig } from './theme';

/** 按钮组件的主题变量定义 */
export const buttonVars = {
  'button-color': cssVarToRgba<ThemeCssVarsConfig>('color-regular'),
  'button-bg-color': cssVarToRgba<ThemeCssVarsConfig>('color-card'),
  'button-border-color': cssVarToRgba<ThemeCssVarsConfig>('color-bd_base'),
  'button-hover-color': cssVarToRgba<ThemeCssVarsConfig>('color-primary'),
  'button-hover-bg-color': cssVarToRgba('color-primary-light-9'),
  'button-hover-border-color': cssVarToRgba('color-primary-light-7'),
  'button-active-color': cssVarToRgba<ThemeCssVarsConfig>('color-primary'),
  'button-active-bg-color': cssVarToRgba('color-primary-light-9'),
  'button-active-border-color': cssVarToRgba<ThemeCssVarsConfig>('color-primary'),
  'button-disabled-color': cssVarToRgba<ThemeCssVarsConfig>('color-placeholder'),
  'button-disabled-bg-color': cssVarToRgba<ThemeCssVarsConfig>('color-card'),
  'button-disabled-border-color': cssVarToRgba<ThemeCssVarsConfig>('color-bd_light'),
  'button-padding-x': getCssVar<ThemeCssVarsConfig>('spacing-md'),
  'button-padding-y': getCssVar<ThemeCssVarsConfig>('spacing-xs'),
};

/** 按钮组件主题变量类型 */
export type ButtonCssVarsConfig = Partial<typeof buttonVars>;
