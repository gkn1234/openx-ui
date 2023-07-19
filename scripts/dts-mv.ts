import { join } from 'node:path';
import { readdir, cp } from 'node:fs/promises';

/** 以根目录为基础解析路径 */
const fromRoot = (...paths: string[]) => join(__dirname, '..', ...paths);

/** 包的 d.ts 产物目录 */
const PKGS_DTS_DIR = fromRoot('dist/packages');

/** 包的目录 */
const PKGS_DIR = fromRoot('packages');

/** 单个包的 d.ts 产物相对目录 */
const PKG_DTS_RELATIVE_DIR = 'dist';

/** 包的代码入口相对目录 */
const PKG_ENTRY_RELATIVE_DIR = 'src';

async function main() {
  const pkgs = await match();
  const tasks = pkgs.map(resolve);
  await Promise.all(tasks);
}

/** 寻找所有需要移动 dts 的包 */
async function match() {
  const res = await readdir(PKGS_DTS_DIR, { withFileTypes: true });
  return res.filter((item) => item.isDirectory()).map((item) => item.name);
}

/** 
 * 处理单个包的 dts 移动
 * @param pkgName 包名
 */
async function resolve(pkgName: string) {
  try {
    const sourceDir = join(PKGS_DTS_DIR, pkgName, PKG_ENTRY_RELATIVE_DIR);
    const targetDir = join(PKGS_DIR, pkgName, PKG_DTS_RELATIVE_DIR);
    const sourceFiles = await readdir(sourceDir);
    const cpTasks = sourceFiles.map((file) => {
      const source = join(sourceDir, file);
      const target = join(targetDir, file);
      console.log(`[${pkgName}]: moving: ${source} => ${target}`);
      return cp(source, target, {
        force: true,
        recursive: true,
      })
    })
    await Promise.all(cpTasks);
    console.log(`[${pkgName}]: moved successfully!`);  
  } catch (e) {
    console.log(`[${pkgName}]: failed to move!`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
})