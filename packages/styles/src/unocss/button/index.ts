import { UserConfig } from 'unocss';
import { buttonVars } from '../../vars';
import {
  cssVarsToString,
  generateCssVars,
} from '../../utils';
// import { toSafeList } from '../utils';
// import { buttonShortcuts } from './shortcuts';
// import { buttonRules } from './rules';

export const buttonConfig: UserConfig = {
  /*
  rules: buttonRules,
  shortcuts: buttonShortcuts,
  safelist: [
    ...toSafeList(buttonRules),
    ...toSafeList(buttonShortcuts),
  ],
  */
  preflights: [
    {
      getCSS: () => cssVarsToString(
        generateCssVars(buttonVars),
      ),
    },
  ],
};
