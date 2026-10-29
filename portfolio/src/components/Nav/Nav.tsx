import './Nav.css'
import {ThemeToggle} from '../ThemeToggle/ThemeToggle'

type NavLink = { label: string; href: string }

export function Nav({ links }: { links: NavLink[] }) {
    return (
        <header>
            <nav>
                <ul className='nav-links'>
                    {links.map((link) => (
                        <a href={link.href}>
                            <li>{link.label}</li>
                        </a>
                    ))}
                </ul>
                <ThemeToggle />
            </nav>
        </header>
    )
}