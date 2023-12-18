import {
  StaticRule,
  StaticShortcut,
  DynamicRule,
  DynamicShortcut,
} from 'unocss';

declare module 'unocss' {
  interface RuleMeta {
    notInSafelist?: boolean;
  }
}

export type SafeListInput = StaticRule | StaticShortcut | DynamicRule | DynamicShortcut;

export function toSafeList(inputs: SafeListInput[]) {
  const result: string[] = [];
  inputs.forEach((input) => {
    const [name,, meta] = input;
    if (typeof name === 'string' && !meta?.notInSafelist) {
      result.push(name);
    }
  });
  return result;
}
