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

const themes = { light: theme('light'), dark: theme('dark'), opossum: theme('opossum'), glass: theme('glass') };

// Opossum's background is a gradient, so every pair is checked against BOTH stops (the worst case wins).
// Gradient themes list their opaque stops as --bg-start, --bg-mid (glass only), and --bg-end.
const backgroundsOf = (tokens: Record<string, string>) => {
	const stops = Object.keys(tokens).filter((name) => /^--bg-(start|mid|end)$/.test(name));
	return stops.length > 0 ? stops : ['--bg'];
};

describe.each(Object.entries(themes))('%s theme contrast', (_name, css) => {
	const tokens = parseTokens(css);
	const color = (name: string) => toRgba(resolve(tokens, name));

	it.each(pairs)('%s on %s is at least %d:1 (%s)', (fg, background, min) => {
		for (const stop of backgroundsOf(tokens)) {
			const bg = color(stop);
			const back = over(color(background === '--bg' ? stop : background), bg);
			const ratio = contrast(over(color(fg), back), back);

			expect(ratio, `${fg} on ${background} at ${stop}`).toBeGreaterThanOrEqual(min);
		}
	});
});

const singleAccentThemes = Object.entries(themes).filter(([name]) => name !== 'opossum' && name !== 'glass');

describe.each(singleAccentThemes)('%s theme accent', (_name, css) => {
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

describe('opossum accent (owner decision, option b)', () => {
	const tokens = parseTokens(themes.opossum);

	it('uses one accent for fills, rings, and borders', () => {
		const accent = resolve(tokens, '--accent');

		for (const name of ['--accent-fill', '--focus', '--accent-border']) {
			expect(resolve(tokens, name), name).toBe(accent);
		}
	});

	it('is the only theme whose small text uses a lighter tint of the accent', () => {
		expect(resolve(tokens, '--accent-text')).not.toBe(resolve(tokens, '--accent'));
	});

	it('tints the accent background with the fill accent', () => {
		const { r, g, b } = toRgba(resolve(tokens, '--accent'));
		const tint = toRgba(resolve(tokens, '--accent-bg'));

		expect([tint.r, tint.g, tint.b]).toEqual([r, g, b]);
	});
});

describe('glass theme (frosted surfaces)', () => {
	const css = themes.glass;
	const tokens = parseTokens(css);
	const color = (name: string) => toRgba(resolve(tokens, name));
	const stops = backgroundsOf(tokens);
	const textTokens = ['--text-primary', '--text-secondary', '--accent-text'];

	it('has three gradient stops to test against', () => {
		expect(stops).toEqual(['--bg-start', '--bg-mid', '--bg-end']);
	});

	// Text on a card: blur shows the page gradient, then the scrim, then the brightest allowed sheen.
	it.each(textTokens)('%s is at least 4.5:1 on the scrim and sheen over every gradient stop', (token) => {
		for (const stop of stops) {
			const surface = over(color('--glass-sheen-max'), over(color('--glass-scrim'), color(stop)));

			expect(contrast(over(color(token), surface), surface), `${token} over ${stop}`).toBeGreaterThanOrEqual(TEXT);
		}
	});

	it.each(textTokens)('%s is at least 4.5:1 on the opaque fallback surface', (token) => {
		const surface = color('--glass-opaque');

		expect(contrast(color(token), surface)).toBeGreaterThanOrEqual(TEXT);
	});

	it('keeps the accent fill (#0019D2) for buttons and the light tint for text, rings, and borders', () => {
		expect(resolve(tokens, '--accent-fill')).toBe(resolve(tokens, '--accent'));
		expect(resolve(tokens, '--accent-text')).not.toBe(resolve(tokens, '--accent'));
		for (const name of ['--focus', '--accent-border']) {
			expect(resolve(tokens, name), name).toBe(resolve(tokens, '--accent-text'));
		}
	});

	it('limits backdrop-filter to cards, the header, the nav, and the theme panel', () => {
		const selectors = [...css.matchAll(/([^{}]+)\{([^{}]*backdrop-filter:\s*var\(--glass-blur\)[^{}]*)\}/g)].map((m) => m[1]);

		expect(selectors.join(' ')).not.toMatch(/\b(body|html|main)\b/);
		expect(selectors.join(' ')).toContain('.project-card');
	});

	it('degrades to an opaque surface without backdrop-filter, with reduced transparency, and in forced colors', () => {
		expect(css).toMatch(/@supports not \(\(backdrop-filter: blur\(1px\)\)/);
		expect(css).toMatch(/@media \(prefers-reduced-transparency: reduce\)/);
		expect(css).toMatch(/@media \(forced-colors: active\)/);
	});
});

describe('contrast helper', () => {
	it('matches known WCAG values', () => {
		expect(contrast(toRgba('#000000'), toRgba('#ffffff'))).toBeCloseTo(21, 1);
		expect(contrast(toRgba('#00052F'), toRgba('#FBFBFB'))).toBeCloseTo(19.1, 1);
		expect(contrast(toRgba('#8D8D8D'), toRgba('#FBFBFB'))).toBeCloseTo(3.21, 1);
	});
});
