import inspect, { Options as InspectOptions } from 'vite-plugin-inspect';
import { visualizer, PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import vue, { Options as VueOptions } from '@vitejs/plugin-vue';
import replace, { RollupReplaceOptions } from '@rollup/plugin-replace';
import { PluginOption } from 'vite';
import { PackageJson } from 'type-fest';
import { isObjectLike } from '../utils';
import type { GenerateConfigOptions } from './options';
import { pluginSetPackageJson } from './pluginSetPackageJson';
import { pluginMoveDts } from './pluginMoveDts';

/** 预设插件相关配置选项 */
export interface GenerateConfigPluginsOptions {
  /**
   * 是否启用 @vitejs/plugin-vue 进行 vue 模板解析。配置规则如下，对于其他插件也适用。
   * - false / undefined 不启用该插件
   * - true 启用该插件，采用默认配置
   * - Options 启用该插件，应用具体配置
   * @default false
   */
  pluginVue?: boolean | VueOptions;

  /**
   * 是否启用 vite-plugin-inspect 进行产物分析。
   * @default false
   */
  pluginInspect?: boolean | InspectOptions;

  /**
   * 是否启用 rollup-plugin-visualizer 进行产物分析。
   * @default false
   */
  pluginVisualizer?: boolean | PluginVisualizerOptions;

  /**
   * 是否启用 @rollup/plugin-replace 进行产物内容替换。
   * @default false
   */
  pluginReplace?: boolean | RollupReplaceOptions;
}

/**
 * 获取预设插件配置
 * @param options 预设插件相关配置选项
 */
export function getPresetPlugins(options: GenerateConfigPluginsOptions = {}) {
  const result: PluginOption[] = [];

  result.push(
    getPresetPlugin(options, 'pluginVue', vue),
    getPresetPlugin(options, 'pluginInspect', inspect),
    getPresetPlugin(options, 'pluginVisualizer', visualizer),
    getPresetPlugin(options, 'pluginReplace', replace),
  );

  return result;
}

/**
 * 获取完整的插件配置
 * @param packageJson package.json 文件内容
 * @param options 构建选项
 */
export function getPlugins(
  packageJson: PackageJson = {},
  options: GenerateConfigOptions = {},
) {
  const { mode, dts } = options;

  const result = getPresetPlugins(options);

  if (mode === 'package') {
    // 常规构建的情况下，集成自定义插件，回写 package.json 的入口字段
    result.push(pluginSetPackageJson(packageJson, options));

    if (dts) {
      // 常规构建的情况下，集成自定义插件，移动 d.ts 产物
      result.push(pluginMoveDts(options));
    }
  }

  return result;
}

/**
 * 处理单个预设插件
 * @param options 预设插件相关配置选项
 * @param key 目标选项名称
 * @param plugin 对应的插件函数
 * @param defaultOptions 插件默认选项
 */
export function getPresetPlugin<K extends keyof GenerateConfigPluginsOptions>(
  options: GenerateConfigPluginsOptions,
  key: K,
  plugin: (...args: any[]) => PluginOption,
  defaultOptions?: GenerateConfigPluginsOptions[K],
) {
  const value = options[key];
  if (!value) {
    return null;
  }

  return plugin(
    isObjectLike(value) ? value : defaultOptions,
  );
}
