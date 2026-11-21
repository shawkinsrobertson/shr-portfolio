import './Nav.css'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { LuChevronDown } from 'react-icons/lu'
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher'
import { getPublishedProjects, projectPath } from '../../lib/projects'

export function Nav() {
    const { pathname } = useLocation();
    // Remember where the list was opened: it closes on its own when the route changes.
    const [openedAt, setOpenedAt] = useState<string | null>(null);
    const open = openedAt === pathname;
    const headerRef = useRef<HTMLElement>(null);
    const itemRef = useRef<HTMLLIElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listId = useId();

    // Publish the real header height (it grows when the project list opens in-flow on a phone)
    // so sticky-header scroll padding keeps focused content from hiding behind it (WCAG 2.4.11).
    useLayoutEffect(() => {
        const header = headerRef.current;
        if (!header) return;
        const publish = () => {
            const height = header.offsetHeight;
            if (height > 0) document.documentElement.style.setProperty('--header-h', `${height}px`);
        };
        publish();
        const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(publish);
        observer?.observe(header);
        return () => observer?.disconnect();
    }, []);

    useEffect(() => {
        if (!open) return;
        const closeOnOutsidePress = (event: PointerEvent) => {
            if (!itemRef.current?.contains(event.target as Node)) setOpenedAt(null);
        };
        document.addEventListener('pointerdown', closeOnOutsidePress);
        return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
    }, [open]);

    const closeOnEscape = (event: React.KeyboardEvent) => {
        if (event.key !== 'Escape' || !open) return;
        setOpenedAt(null);
        buttonRef.current?.focus();
    };

    // Tabbing out of the list closes it. Only a real focus target counts: some browsers
    // report null when a button is clicked, and the click handler already covers that.
    const closeWhenFocusLeaves = (event: React.FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (next && !itemRef.current?.contains(next)) setOpenedAt(null);
    };

    return (
        <header className='site-header' ref={headerRef}>
            <nav aria-label="Primary">
                <ul className='nav-links'>
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li className='project-nav-item' ref={itemRef} onKeyDown={closeOnEscape} onBlur={closeWhenFocusLeaves}>
                        <button
                            ref={buttonRef}
                            type="button"
                            className='project-nav-button'
                            aria-expanded={open}
                            aria-controls={listId}
                            onClick={() => setOpenedAt(open ? null : pathname)}
                        >
                            Projects <LuChevronDown aria-hidden="true" />
                        </button>
                        <ul id={listId} className='project-list' hidden={!open}>
                            {getPublishedProjects().map((project) => (
                                <li key={project.slug}>
                                    <NavLink to={projectPath(project.slug)}>{project.title}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li><NavLink to="/bio">Bio</NavLink></li>
                </ul>
                <ThemeSwitcher />
            </nav>
        </header>
    )
}
