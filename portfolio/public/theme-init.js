// Runs before first paint (blocking, same-origin so the CSP needs no inline allowance).
// Keep the allow-list in sync with `enabled` themes in src/lib/theme.ts; theme-init.test.ts enforces it.
(function () {
	var enabled = ['light', 'dark'];
	var stored = null;
	try {
		stored = localStorage.getItem('theme');
	} catch {}
	var theme = enabled.indexOf(stored) !== -1
		? stored
		: window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	document.documentElement.setAttribute('data-theme', theme);
})();
