import './ThemeSwitcher.css';
import { useEffect, useId, useRef, useState } from 'react';
import { LuGem, LuMoon, LuSun } from 'react-icons/lu';
import opossumUrl from '../../assets/opossum.png';
import { THEMES, enabledThemes, type ThemeId } from '../../lib/theme';
import { useTheme } from '../../lib/useTheme';

// The opossum line art is dark, so it sits on a light chip to stay visible on every theme's background.
// Decorative (alt=""): the visible theme name next to it is the accessible label.
const OpossumIcon = () => (
	<span className="opossum-icon">
		<img src={opossumUrl} alt="" width={24} height={24} />
	</span>
);

const ICONS: Record<ThemeId, React.ComponentType> = {
	light: LuSun,
	dark: LuMoon,
	opossum: OpossumIcon,
	glass: LuGem,
};

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const panelId = useId();
	const current = THEMES.find((t) => t.id === theme);
	const CurrentIcon = ICONS[theme];

	// Keyboard users land on the checked option, so arrow keys work straight away.
	useEffect(() => {
		if (open) rootRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const closeOnOutsidePress = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener('pointerdown', closeOnOutsidePress);
		return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
	}, [open]);

	const closeOnEscape = (event: React.KeyboardEvent) => {
		if (event.key !== 'Escape' || !open) return;
		setOpen(false);
		buttonRef.current?.focus();
	};

	return (
		<div className="theme-switcher" ref={rootRef} onKeyDown={closeOnEscape}>
			<button
				ref={buttonRef}
				type="button"
				className="theme-switcher-button"
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((value) => !value)}
			>
				<CurrentIcon />
				<span>Theme: {current?.label}</span>
			</button>
			<div id={panelId} className="theme-switcher-panel" hidden={!open}>
				<div role="radiogroup" aria-label="Theme">
					{enabledThemes().map(({ id, label }) => {
						const Icon = ICONS[id];
						return (
							<label key={id} className="theme-option">
								<input
									type="radio"
									name="theme"
									value={id}
									checked={theme === id}
									onChange={() => setTheme(id)}
									// Re-clicking the checked option fires no change event, but it is still a choice:
									// it stops the OS preference from overriding the visitor later.
									onClick={() => setTheme(id)}
								/>
								<Icon />
								{label}
							</label>
						);
					})}
				</div>
			</div>
		</div>
	);
}
