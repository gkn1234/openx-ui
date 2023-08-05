import { PackageJson } from 'type-fest';
import { LibraryOptions, LibraryFormats, BuildOptions } from 'vite';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import {
  kebabCase,
  camelCase,
  absCwd,
  relCwd,
} from '../utils';
import { getOptions, GenerateConfigOptions } from './options';

/**
 * 获取 build.lib 产物相关配置
 * @param packageJson package.json 文件内容
 * @param options 构建选项
 */
export function getLib(
  packageJson: PackageJson = {},
  options: GenerateConfigOptions = {},
): Pick<BuildOptions, 'lib' | 'minify' | 'sourcemap' | 'outDir' | 'emptyOutDir'> {
  const {
    entry,
    outDir,
    mode,
    fileName,
  } = getOptions(options);

  // 文件名称，默认取 package.json 的 name 字段转换成 kebab-case：@openxui/build => openxui-build
  const finalName = fileName || kebabCase(packageJson.name || '');

  const libOptions: LibraryOptions = {
    entry,
    // 全量构建只生产 umd 产物
    formats: mode === 'package' ? ['es', 'umd'] : ['umd'],
    name: camelCase(finalName),
    fileName: (format) => {
      const formatName = format as LibraryFormats;
      return getOutFileName(finalName, formatName, mode);
    },
  };

  return {
    lib: libOptions,
    // full-min 模式下全量构建，需要混淆代码，生成 sourcemap 文件，且不清空产物目录
    minify: mode === 'full-min' ? 'esbuild' : false,
    sourcemap: mode === 'full-min',
    emptyOutDir: mode === 'package',
    outDir,
  };
}

/**
 * 获取产物文件名称
 * @param fileName 文件名称
 * @param format 产物格式
 * @param buildMode 构建模式
 */
export function getOutFileName(fileName: string, format: LibraryFormats, buildMode: GenerateConfigOptions['mode']) {
  const formatName = format as ('es' | 'umd');
  const ext = formatName === 'es' ? '.mjs' : '.umd.js';
  let tail: string;
  // 全量构建时，文件名后缀的区别
  if (buildMode === 'full') {
    tail = '.full.js';
  } else if (buildMode === 'full-min') {
    tail = '.full.min.js';
  } else {
    tail = ext;
  }
  return `${fileName}${tail}`;
}

interface EntryInfo {
  /** 子包源码入口文件的绝对路径 */
  abs: string;

  /** 子包源码入口文件相对于脚本执行位置的路径 */
  rel: string;

  /** 子包源码入口是不是文件 */
  isFile: boolean;
}

/**
 * 解析子包源码入口
 * @param entry 源码入口路径
 * @returns 子包源码入口信息，解析结果
 */
export function resolveEntry(entry: string): EntryInfo {
  /** 入口绝对路径 */
  const absEntry = absCwd(entry);

  /** 入口是否为文件 */
  const isEntryFile = statSync(absEntry).isFile();

  /** 入口文件夹绝对路径 */
  const absEntryFolder = isEntryFile ? join(absEntry, '..') : absEntry;

  return {
    abs: absEntry,
    rel: relCwd(absEntryFolder),
    isFile: isEntryFile,
  };
}
