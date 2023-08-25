import { DEFAULT_PREFIX } from '../../utils';

/** 将样式对象转换为 shortcut 类名 */
export function stylesToShortcuts<
  T extends Record<string, any> = Record<string, any>,
>(styles: T, variant: string = '') {
  const variantStr = variant ? `${variant}:` : '';
  let result = '';
  Object.entries(styles).forEach(([key, value]) => {
    result += `${variantStr}[${key}:${value}] `;
  });
  return result;
}

/** 集合大量的类名作为 shortcut */
export function classesToShortcuts(classes: string[], variant: string = '') {
  const variantStr = variant ? `${variant}:` : '';
  let result = '';
  classes.forEach((className) => {
    result += `${variantStr}${className} `;
  });
  return result;
}

/** 将 css 变量转换为 shortcut 类名 */
export function cssVarToShortcuts<
  T extends Record<string, any> = Record<string, any>,
>(cssVars: T, variant: string = '', prefix: string = DEFAULT_PREFIX) {
  const variantStr = variant ? `${variant}:` : '';
  let result = '';
  Object.entries(cssVars).forEach(([key, value]) => {
    result += `${variantStr}[--${prefix}${key}:${value}] `;
  });
  return result;
}
