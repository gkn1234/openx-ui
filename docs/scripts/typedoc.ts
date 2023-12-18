import {
  Application,
  TSConfigReader,
  ReflectionKind,
  ProjectReflection,
} from 'typedoc';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { DefaultTheme } from 'vitepress';

/** 从整个工程的根目录计算路径 */
const fromRoot = (...paths: string[]) => join(
  __dirname,
  '..',
  '..',
  ...paths,
);

const tsConfigPath = fromRoot('tsconfig.src.json');

/** 文档输出目录 */
const OUT_DIR = join(__dirname, '..', 'api');

/** 章节导航配置所在目录 */
const CONFIGS_DIR = join(__dirname, '..', 'configs');

async function main() {
  const app = await Application.bootstrapWithPlugins({
    // 指定文件入口，支持 globs 匹配多文件。规定为所有组件包内的 src/props.ts 文件。
    entryPoints: [fromRoot('packages', '**', 'props.ts')],

    // tsconfig 配置
    tsconfig: tsConfigPath,

    // 启用 markdown 转化插件
    plugin: ['typedoc-plugin-markdown'],

    // 更多配置项参考：https://typedoc.org/options/
    disableSources: true,
    readme: 'none',
    skipErrorChecking: true,
  }, [
    new TSConfigReader(),
  ]);

  const project = await app.convert();

  if (project) {
    // 生成并输出产物
    await app.generateDocs(project, OUT_DIR);

    // 生成产物 json 文件
    const jsonDir = join(OUT_DIR, 'documentation.json');
    await app.generateJson(project, jsonDir);

    // 根据产物信息，动态生成 API 文档部分的章节导航
    await resolveConfig(jsonDir, join(CONFIGS_DIR, 'components.json'));
  }
}

main().catch(console.error);

/** 生成 sidebar 目录 config */
async function resolveConfig(
  documentJsonDir: string,
  componentsConfigJsonDir: string,
) {
  // 读取 TypeDoc 产物
  const buffer = await readFile(documentJsonDir, 'utf8');
  const data = JSON.parse(buffer.toString()) as ProjectReflection;
  if (!data.children || data.children.length <= 0) {
    return;
  }

  // 读取 components.json，使 API 文档的一、二级导航与组件说明文档保持一致
  const componentsConfig = await readComponentsConfig(componentsConfigJsonDir);

  data.children.forEach((module) => {
    if (module.kind !== ReflectionKind.Module) return;

    const moduleConfig = findComponentFromConfig(componentsConfig, module.name);
    if (!moduleConfig) return;

    moduleConfig.collapsed = true;
    moduleConfig.link = `/api/modules/${module.name}`;
    // 每个模块下的 interface、class 继续细分为三级导航
    moduleConfig.items = [];

    module.children?.forEach((sub) => {
      // 将三级导航的跳转路径与产物文件路径对应起来
      if (sub.kind === ReflectionKind.Class) {
        moduleConfig.items?.push({ text: sub.name, link: `/api/classes/${module.name}.${sub.name}` });
      } else if (sub.kind === ReflectionKind.Interface) {
        moduleConfig.items?.push({ text: sub.name, link: `/api/interfaces/${module.name}.${sub.name}` });
      }
    });
  });

  // 输出最终的导航对象
  await writeFile(join(CONFIGS_DIR, 'api.json'), JSON.stringify(componentsConfig, null, 2), 'utf8');
}

async function readComponentsConfig(jsonDir: string) {
  const buffer = await readFile(jsonDir, 'utf8');
  return JSON.parse(buffer.toString()) as DefaultTheme.SidebarItem[];
}

function findComponentFromConfig(config: DefaultTheme.SidebarItem[], name: string) {
  let itemIndex = -1;
  const targetCategory = config.find((category) => {
    if (!category.items || category.items.length <= 0) return false;
    itemIndex = category.items.findIndex((comp) => comp.text?.startsWith(name));
    return itemIndex >= 0;
  });
  return itemIndex >= 0 ?
    targetCategory?.items?.[itemIndex] || null :
    null;
}
