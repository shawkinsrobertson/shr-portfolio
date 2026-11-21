import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseTokens } from './contrast';

const css = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

describe('base typography', () => {
	it('sets the root line-height as a unitless number', () => {
		// A percentage (145%) is inherited as a fixed pixel length, so a 48px heading that wraps gets
		// 26px lines and its lines overlap. A unitless number scales with each element's own font size.
		const lineHeight = css.match(/font:\s*[\d.]+px\/([^\s;]+)/)?.[1];

		expect(lineHeight).toMatch(/^[\d.]+$/);
	});
});

describe('shape and spacing tokens', () => {
	// parseTokens reads flat blocks, so drop the nested @media rule inside :root first.
	const tokens = parseTokens(css.replace(/@media[^{]*\{[^{}]*\}/g, ''));

	it('keeps buttons to a 12px radius at most (not a pill)', () => {
		expect(parseFloat(tokens['--radius-button'])).toBeLessThanOrEqual(12);
		expect(tokens['--radius-button']).toMatch(/px$/);
	});

	it('defines a medium gap between page sections', () => {
		expect(tokens['--space-section']).toBeDefined();
	});
});
