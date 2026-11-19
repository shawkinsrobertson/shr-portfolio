import './Nav.css'
import {ThemeToggle} from '../ThemeToggle/ThemeToggle'
import { Link } from 'react-router'
import { caseStudies, getCaseStudySlug, hasLongFormContent } from '../../data/CaseStudies'



export function Nav() {
    return (
        <header>
            <nav>
                <ul className='nav-links'>
                    <li><Link to="/">Home</Link></li>
                    <li className='project-nav-item'><Link to="#">Projects</Link>
                        <ul className='project-list'>
                            {caseStudies.filter(hasLongFormContent).map((study) => (
                                <li key={study.id}>
                                    <Link to={`/pages/${getCaseStudySlug(study.title)}`}>{study.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li><Link to="/pages/bio">Bio</Link></li>
                </ul>
                <ThemeToggle />
            </nav>
        </header>
    )
}


