import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vitest/config';

// `npm run prelaunch` runs only src/prelaunch.test.ts, which is meant to fail until every placeholder is replaced.
const prelaunch = process.env.PRELAUNCH === '1';

export default defineConfig({
  plugins: [
    // Exposes each project's YAML frontmatter as a named `frontmatter` export.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    react(),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: prelaunch ? ['src/prelaunch.test.ts'] : ['src/**/*.test.{ts,tsx}'],
    exclude: prelaunch ? ['node_modules/**'] : ['node_modules/**', 'src/prelaunch.test.ts'],
  },
});
