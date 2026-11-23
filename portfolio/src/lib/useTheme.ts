import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
	STORAGE_KEY,
	applyTheme,
	isEnabledTheme,
	readStoredTheme,
	resolveTheme,
	writeStoredTheme,
	type ThemeId,
} from './theme';

const prefersDarkQuery = () => window.matchMedia?.('(prefers-color-scheme: dark)');

// theme-init.js already applied a theme before first paint, so start from that.
function currentTheme(): ThemeId {
	const applied = document.documentElement.dataset.theme;
	if (isEnabledTheme(applied)) return applied;
	return resolveTheme(readStoredTheme(), prefersDarkQuery()?.matches ?? false);
}

// The applied theme lives on <html data-theme>, so every component that calls useTheme reads the same
// value. (Separate useState copies would not see each other's changes, e.g. the picker and the bio page.)
function subscribe(onChange: () => void) {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	return () => observer.disconnect();
}

export function useTheme() {
	const theme = useSyncExternalStore(subscribe, currentTheme);

	const show = useCallback((id: ThemeId) => {
		applyTheme(id);
	}, []);

	const setTheme = useCallback(
		(id: ThemeId) => {
			show(id);
			writeStoredTheme(id);
		},
		[show],
	);

	useEffect(() => {
		const mq = prefersDarkQuery();

		// The OS only decides while the visitor has not chosen a theme.
		const onOsChange = () => {
			if (isEnabledTheme(readStoredTheme())) return;
			show(resolveTheme(null, mq?.matches ?? false));
		};
		// Another tab changed the theme.
		const onStorage = (event: StorageEvent) => {
			if (event.key !== STORAGE_KEY) return;
			show(resolveTheme(event.newValue, mq?.matches ?? false));
		};

		mq?.addEventListener('change', onOsChange);
		window.addEventListener('storage', onStorage);
		return () => {
			mq?.removeEventListener('change', onOsChange);
			window.removeEventListener('storage', onStorage);
		};
	}, [show]);

	return { theme, setTheme };
}
