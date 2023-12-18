import type MarkdownIt from 'markdown-it';
import mdContainer from 'markdown-it-container';
import type Token from 'markdown-it/lib/token';
import type Renderer from 'markdown-it/lib/renderer';
import { basename, dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ): string
}

export function mdDemoPlugin(md: MarkdownIt) {
  md.use(mdContainer, 'demo', <ContainerOpts>{
    validate(params) {
      return Boolean(params.trim().match(/^demo\s*(.*)$/));
    },

    render(tokens, idx, options, env, self) {
      const token = tokens[idx];

      // 不考虑 :::demo 的嵌套情况，碰到深层嵌套直接放弃渲染
      if (token.level > 0) return '';

      // :::demo 开启标签时触发
      if (token.nesting === 1) {
        // 获取到 :::demo 内部的路径
        let sourceFilePath = getInnerPathFromContainerToken(tokens, idx);
        // @ 开头代表以 docs 目录为基准定位
        if (sourceFilePath.startsWith('@')) {
          sourceFilePath = sourceFilePath.replace('@', process.cwd());
        }
        // 转换为绝对路径
        sourceFilePath = resolve(dirname(env.path), sourceFilePath);

        // 根据文件路径获取组件名称
        const [componentName, ext = 'vue'] = basename(sourceFilePath).split('.', 2);

        // 读取用例组件源码
        const sourceCode = readFileSync(sourceFilePath, 'utf-8');

        // 将用例组件源码渲染成对应的 Html，准备插入 <Demo> 组件的 code 插槽
        const sourceCodeHtml = self.rules.fence?.(
          // 将源码拼接成 markdown 的代码块形式
          // 调用 md.parse() 将代码块转换成对应的 Token
          // 调用代码块渲染的 Renderer —— renderer.rules.fence()，生成源码展示 Html
          md.parse(`\`\`\`${ext}\n${sourceCode}\n\`\`\``, env),
          0,
          options,
          env,
          self,
        );

        // 拼接 <Demo> 组件的使用代码
        const txt = `<Demo source="${encodeURIComponent(sourceCode)}">
          <template #demo><${componentName} /></template>
          <template #code>${sourceCodeHtml}</template>
        `;
        return txt;
      }
      // 读取到 :::demo 闭合的 Token 时，输出闭合 </Demo> 标签
      return '</Demo>';
    },
  });
}

/** 当读取到 :::demo 开启的 Token 时，解析出内部的用例组件文件路径 */
export function getInnerPathFromContainerToken(
  tokens: Token[],
  idx: number,
) {
  const innerPathToken = tokens[idx + 2];
  return innerPathToken.content.trim();
}
