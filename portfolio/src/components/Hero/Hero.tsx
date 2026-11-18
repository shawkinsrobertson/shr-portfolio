import './Hero.css'

export interface HeroProps {
    name: string
    title: string
    tagline: string
    ctaHref?: string 
}


export function Hero({name, title, tagline, ctaHref}: HeroProps) {
    return (<div className='hero'>
        <h1 className='name'>{name}</h1>
        <h3 className='title'>{title}</h3>
        <p className='tagline'>{tagline}</p>
        <div className='cta-btns'>
            <a className="liquid-glass" href='mailto:shrobertson@proton.me'>email me</a>
            {ctaHref && <a className="liquid-glass" href={ctaHref}>download my resume</a>}
        </div>
    </div>
    )
}