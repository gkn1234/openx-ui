import { defineConfig } from 'vite';
import { generateVueConfig } from '../build/build.config';

export default defineConfig(({ mode }) => generateVueConfig({ mode: mode as any }));
