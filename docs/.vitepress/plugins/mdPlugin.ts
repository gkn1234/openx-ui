import type MarkdownIt from 'markdown-it';
import { mdDemoPlugin } from './mdDemoPlugin';
import { mdScriptSetupPlugin } from './mdScriptSetupPlugin';

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdDemoPlugin);
  md.use(mdScriptSetupPlugin);
};
