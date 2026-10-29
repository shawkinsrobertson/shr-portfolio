import './ThemeToggle.css'
import {useState} from 'react';
import { LuMoon, LuSun } from "react-icons/lu";

export function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <>
        <div className="theme-toggle">
            <label className="switch">
                <button onClick={toggleTheme}>{theme === 'dark' ? <LuMoon /> : <LuSun />}</button>
            </label>
        </div>
        </>
    )
}