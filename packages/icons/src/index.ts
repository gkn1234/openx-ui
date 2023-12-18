import { resolve, join } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import {
  importDirectory,
  cleanupSVG,
  runSVGO,
  parseColors,
  isEmptyColor,
} from '@iconify/tools';
import { getIconsCSS } from '@iconify/utils';

/**
 * 写文件，当文件路径为字符串时，会用 mkdir 建好上级目录，避免目录不存在的错误
 * @param file 文件路径
 * @param data 写入内容
 * @param options 写文件配置
 */
const outputFile: typeof writeFile = async (file, data, options) => {
  if (typeof file === 'string') {
    const dir = join(file, '..');
    if (dir && dir !== '.' && dir !== '..') {
      // 当前路径，无需向上寻找
      await mkdir(join(file, '..'), { recursive: true });
    }
  }
  await writeFile(file, data, options);
};

function absCwd(...paths: string[]) {
  return resolve(process.cwd(), ...paths).replace(/\\/g, '/');
}

export interface GenerateIconifyOptions {
  /** svg 图标所在的目录 */
  iconsDir?: string;

  /** iconify 前缀 */
  prefix?: string;

  /** 生成的图标 css 文件的路径，为空代表不生成 css 文件 */
  cssOutput?: string;

  /** css icon 样式选择器的生成规则 */
  cssIconSelector?: string;

  /** css icon 基础样式选择器的生成规则 */
  cssCommonSelector?: string;

  /** 生成的 iconify 规范的 json 文件的路径 */
  jsonOutput?: string;
}

/** 指定一系列 svg 图标，生成 iconify 规范的 json 文件以及对应的图标 css 文件 */
export async function generateIconify(options: GenerateIconifyOptions = {}) {
  const {
    iconsDir = 'icons',
    prefix = 'op',
    cssIconSelector = `.i-${prefix}-{name}`,
    cssCommonSelector = '',
    cssOutput = '',
    jsonOutput = absCwd(iconsDir, 'icons.json'),
  } = options;

  const { log } = console;

  // Import icons
  const iconSet = await importDirectory(iconsDir, { prefix });

  const names: string[] = [];
  // Validate, clean up, fix palette and optimise
  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon') {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      await cleanupSVG(svg);

      // Assume icon is monotone: replace color with currentColor, add if missing
      // If icon is not monotone, remove this code
      await parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (_attr, colorStr, color) => (!color || isEmptyColor(color) ? colorStr : 'currentColor'),
      });

      // Optimise
      await runSVGO(svg);
    } catch (err) {
      // Invalid icon
      log(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);

    names.push(name);
  });

  const exportedJson = iconSet.export();
  // Export as IconifyJSON
  const exported = `${JSON.stringify(exportedJson, null, 2)}\n`;

  // Save json to file
  await outputFile(jsonOutput, exported, 'utf8');
  log(`Saved JSON (${exported.length} bytes)`);

  if (cssOutput) {
    // Get CSS
    // https://iconify.design/docs/libraries/utils/get-icons-css.html#simple-selector
    const css = getIconsCSS(exportedJson, names, {
      iconSelector: cssIconSelector,
      commonSelector: cssCommonSelector,
    });

    // Save css to file
    await outputFile(cssOutput, css, 'utf8');
    log(`Saved CSS (${css.length} bytes)`);
  }
}
