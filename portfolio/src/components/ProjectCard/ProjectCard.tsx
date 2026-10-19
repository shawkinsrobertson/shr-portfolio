import './ProjectCard.css'

export interface ProjectCardProps {
    title: string
    tagline: string
    description: string
    stack?: string[]
    role: string
    href?: string
    imageUrl?: string
    achievement?: string
}

export function ProjectCard({title, tagline, description, stack, role, achievement, imageUrl}: ProjectCardProps) {
    return (
        <article className='project-card'>
            <div className='card-head'>
                {imageUrl && <img src={imageUrl} alt="" />}
                <div className='title-and-tag'>
                    <h3>{title}</h3> 
                    <p className='tagline'>{tagline}</p>
                </div>
                 
            </div>
            
            <p>{description}</p>
            {stack && stack.length > 0 && (
      <ul>{stack.map(tag => <li key={tag}>{tag}</li>)}</ul>
  )}
            <p className='role'>{role}</p>
            {achievement && <p className='achievement'>{achievement}</p>}
        </article>
    )
}