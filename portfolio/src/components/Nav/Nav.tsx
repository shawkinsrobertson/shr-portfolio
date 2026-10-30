import './Nav.css'
import {ThemeToggle} from '../ThemeToggle/ThemeToggle'
import { Link } from 'react-router'



export function Nav() {
    return (
        <header>
            <nav>
                <ul className='nav-links'>
                    <li><Link to="/">Home</Link></li>
                    <li className='project-nav-item'><Link to="#">Projects</Link>
                        <ul className='project-list'>
                            <li><Link to="/pages/shelby">Shelby</Link></li>
                            <li><Link to="/pages/simpleset">SimpleSet</Link></li>
                            <li><Link to="/pages/nogutsnoglory">No Guts No Glory</Link></li>
                            <li><Link to="/pages/scavengerhunt">Scavenger Hunt</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/pages/bio">Bio</Link></li>
                </ul>
                <ThemeToggle />
            </nav>
        </header>
    )
}


