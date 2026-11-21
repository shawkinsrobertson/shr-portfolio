import { readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrast, over, parseTokens, resolve, toRgba } from './contrast';

const theme = (name: string) =>
	readFileSync(resolvePath(process.cwd(), `src/styles/themes/${name}.css`), 'utf8');

const TEXT = 4.5; // WCAG 1.4.3 (normal text)
const NON_TEXT = 3; // WCAG 1.4.11 (focus rings, UI component boundaries)

// [foreground token, background token, minimum ratio, what it is]
type Pair = [string, string, number, string];

const pairs: Pair[] = [
	['--text-primary', '--bg', TEXT, 'body and heading text'],
	['--text-secondary', '--bg', TEXT, 'muted text'],
	['--accent-text', '--bg', TEXT, 'links and accent-colored text'],
	['--focus', '--bg', NON_TEXT, 'focus ring'],
	['--accent-contrast', '--accent-fill', TEXT, 'label on an accent-filled button'],
	['--accent-contrast', '--accent-fill-hover', TEXT, 'label on a hovered accent-filled button'],
	['--accent-text', '--accent-bg', TEXT, 'accent text on its tinted pill (blended over --bg)'],
	['--award-contrast', '--award', TEXT, 'label on the gold award chip'],
];

const themes = { light: theme('light'), dark: theme('dark') };

describe.each(Object.entries(themes))('%s theme contrast', (_name, css) => {
	const tokens = parseTokens(css);
	const color = (name: string) => toRgba(resolve(tokens, name));
	const bg = color('--bg');

	it.each(pairs)('%s on %s is at least %d:1 (%s)', (fg, background, min) => {
		const back = over(color(background), bg);
		const ratio = contrast(over(color(fg), back), back);

		expect(ratio).toBeGreaterThanOrEqual(min);
	});
});

describe.each(Object.entries(themes))('%s theme accent', (_name, css) => {
	const tokens = parseTokens(css);

	it('uses one accent color for fills, text, rings, and borders (no second shade)', () => {
		const accent = resolve(tokens, '--accent');

		for (const name of ['--accent-fill', '--accent-text', '--focus', '--accent-border']) {
			expect(resolve(tokens, name), name).toBe(accent);
		}
	});

	it('tints the accent background with that same accent color', () => {
		const { r, g, b } = toRgba(resolve(tokens, '--accent'));
		const tint = toRgba(resolve(tokens, '--accent-bg'));

		expect([tint.r, tint.g, tint.b]).toEqual([r, g, b]);
	});
});

describe('contrast helper', () => {
	it('matches known WCAG values', () => {
		expect(contrast(toRgba('#000000'), toRgba('#ffffff'))).toBeCloseTo(21, 1);
		expect(contrast(toRgba('#00052F'), toRgba('#FBFBFB'))).toBeCloseTo(19.1, 1);
		expect(contrast(toRgba('#8D8D8D'), toRgba('#FBFBFB'))).toBeCloseTo(3.21, 1);
	});
});
