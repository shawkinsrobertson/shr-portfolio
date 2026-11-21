import './Hero.css'
import { site } from '../../data/site'

export interface HeroProps {
    name: string
    title: string
    tagline: string
}

export function Hero({name, title, tagline}: HeroProps) {
    return (<div className='hero'>
        <h1 className='name'>{name}</h1>
        <p className='title'>{title}</p>
        <p className='tagline'>{tagline}</p>
        <div className='cta-btns'>
            <a className="btn" href={site.resume.href} download>Download resume (PDF)</a>
            <a className="btn btn-secondary" href={`mailto:${site.email}`}>Email me</a>
        </div>
    </div>
    )
}
