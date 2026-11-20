import { useCallback, useEffect, useState } from 'react';
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

export function useTheme() {
	const [theme, setThemeState] = useState<ThemeId>(currentTheme);

	const show = useCallback((id: ThemeId) => {
		setThemeState(id);
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
