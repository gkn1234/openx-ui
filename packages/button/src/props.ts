/** @module Button */
import { InferVueDefaults } from '@openxui/shared';

export type ButtonType = '' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

/** 按钮组件的属性 */
export interface ButtonProps {
  /**
   * 按钮的类型
   * @default ''
   */
  type?: ButtonType;

  /**
   * 按钮是否为朴素样式
   * @default false
   */
  plain?: boolean | undefined;

  /**
   * 按钮是否不可用
   * @default false
   */
  disabled?: boolean;
}

export function defaultButtonProps() {
  return {
    type: '',
    plain: false,
    disabled: false,
  } satisfies Required<InferVueDefaults<ButtonProps>>;
}

/** 按钮组件的插槽信息 */
export interface ButtonSlots {
  default(props: {
    /** 按钮的类型 */
    type: ButtonType
  }): any;
}
