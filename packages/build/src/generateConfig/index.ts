import { mergeConfig, UserConfig } from 'vite';
import { PackageJson } from 'type-fest';
import { readJsonFile, absCwd } from '../utils';
import { getOptions, GenerateConfigOptions } from './options';
import { getPlugins } from './plugins';
import { getExternal } from './external';
import { getLib } from './lib';

/**
 * 生成 Vite 构建配置
 * @param customOptions 自定义构建选项
 * @param viteConfig 自定义 vite 配置
 */
export async function generateConfig(
  customOptions?: GenerateConfigOptions,
  viteConfig?: UserConfig,
) {
  /** 获取配置选项 */
  const options = getOptions(customOptions);

  // 获取每个子包的 package.json 对象
  const packageJson = await readJsonFile<PackageJson>(absCwd('package.json'));

  // 生成产物相关配置 build.lib
  const libOptions = getLib(packageJson, options);

  // 生成依赖外部化相关配置 build.rollupOptions.external
  const external = getExternal(packageJson, options);

  // 插件相关，获取构建配置的 plugins 字段
  const plugins = getPlugins(packageJson, options);

  // 拼接各项配置
  const result: UserConfig = {
    plugins,
    build: {
      ...libOptions,
      rollupOptions: {
        external,
      },
    },
  };

  // 与自定义 Vite 配置深度合并，生成最终配置
  return mergeConfig(result, viteConfig || {}) as UserConfig;
}

// 导出其他模块
export * from './plugins';
export * from './options';
export * from './lib';
export * from './external';
export * from './pluginMoveDts';
export * from './pluginSetPackageJson';
