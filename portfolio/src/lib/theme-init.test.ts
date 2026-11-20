import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY, THEMES, resolveTheme } from './theme';

const script = readFileSync(resolve(process.cwd(), 'public/theme-init.js'), 'utf8');

function runInit(prefersDark: boolean) {
	window.matchMedia = ((query: string) => ({
		matches: query.includes('dark') ? prefersDark : false,
		media: query,
	})) as typeof window.matchMedia;
	new Function(script)();
}

afterEach(() => {
	vi.restoreAllMocks();
	localStorage.clear();
	document.documentElement.removeAttribute('data-theme');
});

describe('theme-init.js (runs before first paint)', () => {
	it('follows the OS when nothing is stored', () => {
		runInit(true);
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('applies a stored theme over the OS preference', () => {
		localStorage.setItem(STORAGE_KEY, 'light');
		runInit(true);
		expect(document.documentElement.dataset.theme).toBe('light');
	});

	it('ignores an invalid stored value', () => {
		localStorage.setItem(STORAGE_KEY, '"><script>');
		runInit(false);
		expect(document.documentElement.dataset.theme).toBe('light');
	});

	it('does not throw when storage is unavailable', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(() => runInit(true)).not.toThrow();
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('agrees with resolveTheme for every theme and OS preference', () => {
		for (const { id } of THEMES) {
			for (const prefersDark of [true, false]) {
				localStorage.setItem(STORAGE_KEY, id);
				document.documentElement.removeAttribute('data-theme');
				runInit(prefersDark);
				expect(document.documentElement.dataset.theme, `${id} / dark=${prefersDark}`).toBe(
					resolveTheme(id, prefersDark),
				);
			}
		}
	});
});
