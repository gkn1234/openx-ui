type NativeType = null | number | string | boolean | symbol | Function;
type InferDefault<P, T> = ((props: P) => T & {}) | (T extends NativeType ? T : never);

/** 推断出 props 默认值的类型 */
export type InferVueDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>;
};
