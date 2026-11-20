import './Footer.css'
import { useState } from 'react';
import { bioStats } from '../../data/BioStats';

export function Footer() {
    const [year] = useState(() => new Date().getFullYear());

    return (
        <footer className='footer'>
            <p>© {year} {bioStats.name}</p>
            <ul aria-label="Contact">
                <li><a href={`mailto:${bioStats.email}`}>Email</a></li>
                <li>
                    <a href={bioStats.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn<span className="visually-hidden"> (opens in new tab)</span>
                    </a>
                </li>
                <li>
                    <a href={bioStats.github} target="_blank" rel="noopener noreferrer">
                        GitHub<span className="visually-hidden"> (opens in new tab)</span>
                    </a>
                </li>
            </ul>
        </footer>
    )
}
