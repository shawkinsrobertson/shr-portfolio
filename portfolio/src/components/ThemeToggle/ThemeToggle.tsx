import './ThemeToggle.css'
import {useState} from 'react';
import { LuMoon, LuSun } from "react-icons/lu";
import {
    applyTheme,
    isEnabledTheme,
    readStoredTheme,
    resolveTheme,
    writeStoredTheme,
    type ThemeId,
} from '../../lib/theme';

// The page already has a theme by now (theme-init.js ran before first paint), so start from that.
function currentTheme(): ThemeId {
    const applied = document.documentElement.dataset.theme;
    if (isEnabledTheme(applied)) return applied;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return resolveTheme(readStoredTheme(), prefersDark);
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<ThemeId>(currentTheme);
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const toggleTheme = () => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
        writeStoredTheme(nextTheme);
    };

    return (
        <>
        <div className="theme-toggle">
            <label className="switch">
                <button className="liquid-glass" onClick={toggleTheme} aria-label={`Switch to ${nextTheme} theme`}>{theme === 'dark' ? <LuMoon /> : <LuSun />}</button>
            </label>
        </div>
        </>
    )
}
