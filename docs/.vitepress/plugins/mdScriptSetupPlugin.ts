import type MarkdownIt from 'markdown-it';
import { basename } from 'node:path';
import { getInnerPathFromContainerToken } from './mdDemoPlugin';

export function mdScriptSetupPlugin(md: MarkdownIt) {
  // markdown-it 插件一般都是通过重写 render 函数实现，这里先暂存原本的 render 方法。
  const defaultRender = md.renderer.render;
  const defaultHtmlBlockRender = md.renderer.rules.html_block;

  // <script setup> 检验正则
  const reg = /^<script\s(.+\s)?setup(\s.*)?>([\s\S]*)<\/script>/;

  md.renderer.render = (tokens, options, env, ...rests: any[]) => {
    const [
      renderScriptSetup = true,
    ] = rests;

    if (!renderScriptSetup) {
      return defaultRender(tokens, options, env);
    }

    let match: RegExpMatchArray | null = null;

    const demoImports: string[] = [];
    // 遍历所有 Token
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      // 匹配 md 文件中原有的 <script setup>
      const scriptSetupMatch = token.content.trim().match(reg);
      if (scriptSetupMatch && !match) {
        match = scriptSetupMatch;
      }

      if (
        token.type !== 'container_demo_open' ||
        token.nesting !== 1 ||
        token.level > 0
      ) continue;

      // 对于 :::demo 块，读取文件路径，生成 import 语句。
      const sourceFilePath = getInnerPathFromContainerToken(tokens, i);
      const componentName = basename(sourceFilePath).split('.')[0];
      demoImports.push(`import ${componentName} from '${sourceFilePath}';`);
    }

    const [
      ,
      setupPre = '',
      setupPost = '',
      code = '',
    ] = match || [];

    // 拼接生成 <script setup> 代码
    const scriptSetupCode = `<script ${setupPre}setup${setupPost}>
    ${demoImports.join('\n')}
    ${code}
    </script>`;

    return defaultRender(
      // 将 <script setup> 模块提到 Token 列表的头部进行渲染
      [...md.parse(scriptSetupCode, env), ...tokens],
      options,
      env,
    );
  };

  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    // 因为经处理后的 <script setup> 已被提到队首，所以其他 <script setup> 将不被渲染
    if (reg.test(tokens[idx].content) && idx !== 0) {
      return '';
    }
    return defaultHtmlBlockRender?.(tokens, idx, options, env, self) || '';
  };
}
