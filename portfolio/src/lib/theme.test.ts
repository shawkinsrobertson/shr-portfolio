import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	STORAGE_KEY,
	THEMES,
	applyTheme,
	enabledThemes,
	isEnabledTheme,
	readStoredTheme,
	resolveTheme,
	writeStoredTheme,
} from './theme';

afterEach(() => {
	vi.restoreAllMocks();
	localStorage.clear();
	document.documentElement.removeAttribute('data-theme');
	document.head.innerHTML = '';
});

describe('theme registry', () => {
	it('lists the four themes with light and dark always enabled', () => {
		expect(THEMES.map((t) => t.id)).toEqual(['light', 'dark', 'opossum', 'glass']);
		expect(THEMES.find((t) => t.id === 'light')?.enabled).toBe(true);
		expect(THEMES.find((t) => t.id === 'dark')?.enabled).toBe(true);
	});

	it('only offers enabled themes in the picker', () => {
		expect(enabledThemes().every((t) => t.enabled)).toBe(true);
	});

	it('rejects unknown, empty, and non-string values', () => {
		for (const bad of ['', 'neon', '__proto__', null, undefined, 3, {}]) {
			expect(isEnabledTheme(bad)).toBe(false);
		}
	});

	it('rejects a theme that exists but is disabled', () => {
		const disabled = THEMES.find((t) => !t.enabled);
		if (disabled) expect(isEnabledTheme(disabled.id)).toBe(false);
	});
});

describe('resolveTheme', () => {
	it('uses a valid stored theme over the OS preference', () => {
		expect(resolveTheme('dark', false)).toBe('dark');
		expect(resolveTheme('light', true)).toBe('light');
	});

	it('follows the OS when nothing is stored', () => {
		expect(resolveTheme(null, true)).toBe('dark');
		expect(resolveTheme(null, false)).toBe('light');
	});

	it('ignores an invalid stored value and follows the OS', () => {
		expect(resolveTheme('neon', true)).toBe('dark');
		expect(resolveTheme('neon', false)).toBe('light');
	});

	it('falls back to light or dark when the stored theme is disabled', () => {
		const disabled = THEMES.find((t) => !t.enabled);
		if (disabled) expect(resolveTheme(disabled.id, true)).toBe('dark');
	});
});

describe('storage', () => {
	it('round-trips a valid theme', () => {
		writeStoredTheme('dark');
		expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
		expect(readStoredTheme()).toBe('dark');
	});

	it('returns null when nothing is stored', () => {
		expect(readStoredTheme()).toBeNull();
	});

	it('does not throw when storage reads throw', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(readStoredTheme()).toBeNull();
	});

	it('does not throw when storage writes throw', () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('quota');
		});
		expect(() => writeStoredTheme('dark')).not.toThrow();
	});
});

describe('applyTheme', () => {
	beforeEach(() => {
		document.head.innerHTML = '<meta name="theme-color" content="#000000">';
	});

	it('sets data-theme on the root element', () => {
		applyTheme('dark');
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('updates the theme-color meta to match the theme', () => {
		applyTheme('dark');
		const dark = document.querySelector('meta[name="theme-color"]')?.getAttribute('content');
		applyTheme('light');
		const light = document.querySelector('meta[name="theme-color"]')?.getAttribute('content');
		expect(dark).toBe('#232323');
		expect(light).toBe('#FBFBFB');
	});

	it('does not throw when the meta tag is missing', () => {
		document.head.innerHTML = '';
		expect(() => applyTheme('light')).not.toThrow();
	});
});
