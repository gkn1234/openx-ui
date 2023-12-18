import { PluginOption } from 'vite';
import { generateIconify } from './src';
import { generateConfig } from '../build/scripts';
import { absCwd, relCwd } from '../build/src';

/** 本包产物相对本包根目录的路径 */
const OUT_REL = 'dist';

/** icons 图标集合相对路径 */
const ICONS_REL = 'icons';

/** 生成的产物文件名称 */
const FILE_NAME = 'icons';

export default generateConfig({
  outDir: OUT_REL,
  // 在 package.json 的 exports 字段声明样式文件的人口
  onSetPkg: (pkg, options) => {
    const exports: Record<string, string> = {
      [`./${FILE_NAME}.css`]: relCwd(absCwd(options.outDir, `${FILE_NAME}.css`), false),
      [`./${FILE_NAME}.json`]: relCwd(absCwd(options.outDir, `${FILE_NAME}.json`), false),
    };
    Object.assign(
      pkg.exports as Record<string, any>,
      exports,
    );
  },
}, {
  plugins: [
    pluginGenerateIconify(),
  ],
});

function pluginGenerateIconify(): PluginOption {
  return {
    name: 'generate-iconify',
    // 只在构建模式下执行
    apply: 'build',
    async closeBundle() {
      await generateIconify({
        iconsDir: absCwd(ICONS_REL),
        prefix: 'op',
        cssOutput: absCwd(OUT_REL, `${FILE_NAME}.css`),
        jsonOutput: absCwd(OUT_REL, `${FILE_NAME}.json`),
      });
    },
  };
}
