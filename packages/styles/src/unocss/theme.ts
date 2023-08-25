import { UserConfig } from 'unocss';
import { Theme } from 'unocss/preset-mini';
import { themeVars, themeColorLevelsEnabledKeys } from '../vars';
import { generateCssVars, cssVarsToString } from '../utils';

/** 主题部分预设 */
export const themeConfig: UserConfig<Theme> = {
  preflights: [
    {
      // 在生成的 css 样式文件中填入所有主题变量的定义
      getCSS: () => cssVarsToString(
        generateCssVars(themeVars, {
          colorLevelsEnabledKeys: themeColorLevelsEnabledKeys,
          colorLevels: 9,
        }),
      ),
    },
  ],
};
