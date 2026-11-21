import './ProjectCard.css'
import { Link } from 'react-router'
import { Badge } from '../Badge/Badge'

export interface ProjectCardProps {
    className?: string
    title: string
    tagline: string
    description: string
    stack?: string[]
    role: string
    href: string
    agentic: boolean
    achievement?: string
}

// The title is the only link and a ::after on it stretches over the whole card, so the card is one big
// click target but a screen reader hears just the title as the link name (not the whole card's text).
export function ProjectCard({className, title, tagline, description, stack, role, achievement, agentic, href}: ProjectCardProps) {
    return (
        <article className={`project-card ${className ?? ''}`}>
            <div className='card-content'>
                <div className='title-and-tag'>
                    <h3><Link className='project-card-link' to={href}>{title}</Link></h3>
                    <p className='project-card-tagline'>{tagline}</p>
                </div>
                <div><Badge kind={agentic ? 'agentic' : 'hand-coded'} /></div>
                <p>{description}</p>
                {stack && stack.length > 0 && (
                    <ul className='project-card-stack' aria-label="Tech stack">
                        {stack.map(tag => <li key={tag}>{tag}</li>)}
                    </ul>
                )}
                <p className='project-card-role'>{role}</p>
                {achievement && <p className='project-card-achievement'>{achievement}</p>}
            </div>
        </article>
    )
}
