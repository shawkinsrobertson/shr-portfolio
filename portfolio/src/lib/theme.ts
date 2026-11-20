export const STORAGE_KEY = 'theme';

// `enabled` is the cut-line switch (SPEC D16): flip a theme on once it passes contrast + axe.
export const THEMES = [
	{ id: 'light', label: 'Light', enabled: true, color: '#FBFBFB' },
	{ id: 'dark', label: 'Dark', enabled: true, color: '#232323' },
	{ id: 'opossum', label: 'Opossum', enabled: false, color: '#505200' },
	{ id: 'glass', label: 'Glass', enabled: false, color: '#00052F' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];
export type EnabledThemeId = 'light' | 'dark';

export const enabledThemes = () => THEMES.filter((theme) => theme.enabled);

export function isEnabledTheme(value: unknown): value is ThemeId {
	return typeof value === 'string' && enabledThemes().some((theme) => theme.id === value);
}

export function resolveTheme(stored: string | null, prefersDark: boolean): ThemeId {
	if (isEnabledTheme(stored)) return stored;
	return prefersDark ? 'dark' : 'light';
}

export function readStoredTheme(): string | null {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

export function writeStoredTheme(id: ThemeId) {
	try {
		localStorage.setItem(STORAGE_KEY, id);
	} catch {
		// Storage can be blocked (private mode); the theme still applies for this visit.
	}
}

export function applyTheme(id: ThemeId) {
	document.documentElement.dataset.theme = id;
	const color = THEMES.find((theme) => theme.id === id)?.color;
	if (color) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}
