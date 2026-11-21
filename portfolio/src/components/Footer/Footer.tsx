import './Footer.css'
import { useState } from 'react';
import { site } from '../../data/site';

export function Footer() {
    const [year] = useState(() => new Date().getFullYear());

    return (
        <footer className='footer'>
            <p>© {year} {site.name}</p>
            <ul aria-label="Contact">
                <li><a href={`mailto:${site.email}`}>Email</a></li>
                <li><a href={site.resume.href} download>Resume (PDF)</a></li>
                <li>
                    <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn <span className="visually-hidden">(opens in new tab)</span>
                    </a>
                </li>
                <li>
                    <a href={site.github} target="_blank" rel="noopener noreferrer">
                        GitHub <span className="visually-hidden">(opens in new tab)</span>
                    </a>
                </li>
            </ul>
        </footer>
    )
}
