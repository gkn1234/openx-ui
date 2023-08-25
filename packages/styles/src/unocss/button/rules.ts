// @unocss-include
import { Rule } from 'unocss';
import { Theme } from 'unocss/preset-mini';
import { CSSProperties } from 'vue';
import { getCssVar } from '../../utils';
import { ButtonCssVarsConfig } from '../../vars';

export const buttonRules: Rule<Theme>[] = [
  [
    'op-button-base',
    <CSSProperties>{
      'box-sizing': 'border-box',
      'white-space': 'nowrap',
      'user-select': 'none',
      cursor: 'pointer',
      outline: 'none',
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      'font-weight': 'normal',
      'font-size': '14px',
      'text-align': 'center',
      'line-height': '1',
      color: getCssVar<ButtonCssVarsConfig>('button-color'),
      'background-color': getCssVar<ButtonCssVarsConfig>('button-bg-color'),
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': getCssVar<ButtonCssVarsConfig>('button-border-color'),
      'border-radius': '4px',
      padding: `${getCssVar<ButtonCssVarsConfig>('button-padding-y')} ${getCssVar<ButtonCssVarsConfig>('button-padding-x')}`,
    } as any,
    {
      notInSafelist: true,
    },
  ],
];
