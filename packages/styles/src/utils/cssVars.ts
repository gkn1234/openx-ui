import { toRgba, generateRgbColorLevels } from './colors';

export type DefaultPrefix = 'op-';
/** 默认情况下，生成 CSS 变量时增加的前缀 */
export const DEFAULT_PREFIX: DefaultPrefix = 'op-';

/**
 * 生成 CSS 变量对象的选项
 * @typeParam K 需要生成色阶的键名
 * @typeParam P CSS 变量前缀
 */
export interface GenerateCssVarsOptions<
  K = string,
  P extends string = DefaultPrefix,
> {
  /**
   * 指定的键名所对应的 CSS 变量将会额外生成色阶变量。
   *
   * 例如 color-primary 将会生成 color-primary-light-[1-9] 以及 color-primary-dark-[1-9] 系列浅色与深色的变量。
   */
  colorLevelsEnabledKeys?: K[];

  /** 生成色阶变量的阶数 */
  colorLevels?: number;

  /** CSS 变量前缀 */
  prefix?: P;
}

/**
 * CSS 变量对象的类型
 * @typeParam T 原始对象的类型
 * @typeParam {@link GenerateCssVarsOptions}
 */
export type CssVarsObject<
  T extends Record<string, any> = Record<string, any>,
  K extends keyof T = keyof T,
  P extends string = DefaultPrefix,
> = {
  [Key in `--${P}${string & keyof T}`]: any;
} & {
  [Key in `--${P}${string & K}-light-${number}`]: any;
} & {
  [Key in `--${P}${string & K}-dark-${number}`]: any;
};

/**
 * 生成 CSS 变量对象
 * @typeParam {@link CssVarsObject}
 * @param origin 原始主题变量对象
 * @param options 选项 {@link GenerateCssVarsOptions}
 */
export function generateCssVars<
  T extends Record<string, any> = Record<string, any>,
  K extends keyof T = keyof T,
  P extends string = DefaultPrefix,
>(
  origin: T,
  options?: GenerateCssVarsOptions<K, P>,
): CssVarsObject<T, K, P> {
  const {
    prefix = DEFAULT_PREFIX,
    colorLevelsEnabledKeys = [],
    colorLevels = 9,
  } = options || {};

  const result: Record<string, any> = {};
  Object.entries(origin).forEach(([key, value]) => {
    const cssKey = `--${prefix}${key}`;
    const valueToRgba = toRgba(value);

    // 颜色 CSS 变量用 rgb 字符串(255,255,255)的方式表示，非颜色 CSS 变量不做转化。
    const finalValue = valueToRgba ? valueToRgba.rgbTxt : value;
    result[cssKey] = finalValue;

    // 对指定键值的变量生成色阶
    if (valueToRgba && colorLevelsEnabledKeys.includes(key as K)) {
      const rgbLevels = generateRgbColorLevels(valueToRgba, colorLevels);
      rgbLevels.light.forEach((light, index) => {
        const dark = rgbLevels.dark[index];
        result[`${cssKey}-light-${index + 1}`] = light.rgbTxt;
        result[`${cssKey}-dark-${index + 1}`] = dark.rgbTxt;
      });
    }
  });

  return result as CssVarsObject<T, K, P>;
}

/**
 * 将 css 变量对象转换为 css 样式字符串
 * @param cssVars CSS 变量对象
 * @param selector 应用样式的选择器
 */
export function cssVarsToString(cssVars: Record<string, any>, selector: string = ':root') {
  let result = `${selector}{`;
  Object.entries(cssVars).forEach(([key, value]) => {
    result += `${key}: ${value};`;
  });
  result += '}';
  return result;
}

/** 获取 css 变量字符串 var(xxxxx) */
export function getCssVar<
  T extends Record<string, any> = Record<string, any>,
>(name: keyof T, prefix: string = DEFAULT_PREFIX) {
  return `var(--${prefix}${name as string})`;
}

/** 将颜色 css 变量转换为有效颜色：255,255,255 => rgba(255,255,255,1) */
export function cssVarToRgba<
  T extends Record<string, any> = Record<string, any>,
>(name: keyof T, alpha: number = 1, prefix: string = DEFAULT_PREFIX) {
  return `rgba(${getCssVar(name, prefix)},${alpha})`;
}
