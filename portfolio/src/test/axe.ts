import { configureAxe } from 'vitest-axe';

// jsdom cannot compute colors, so contrast is covered by the token tests instead.
export const axe = configureAxe({
	rules: { 'color-contrast': { enabled: false } },
});
