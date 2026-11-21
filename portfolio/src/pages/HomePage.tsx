import { Hero } from '../components/Hero/Hero'
import { ProjectCard } from '../components/ProjectCard/ProjectCard'
import { getPublishedProjects, projectPath } from '../lib/projects'
import './HomePage.css'



export function HomePage() {
    const projects = getPublishedProjects();

    return (
        <>
        <section id="hero">
	<Hero 
		name='Seamus Robertson'
		title='Front-End Developer'
		tagline='Building clever, silly, beautiful, accessible shit.' />
	</section>
    <section id="projects-handcode">
        <h2>Hand Coded</h2>
        <div className='case-study-cards'>
          {projects
          .filter(project => !project.agentic)
          .map((project) =>(
            <ProjectCard className='case-study-card'
               key={project.slug}
               title={project.title}
               tagline={project.tagline}
               description={project.description}
               stack={project.stack}
               role={project.role}
               href={projectPath(project.slug)}
               achievement={project.achievement}  />
          ))}
        </div>
      </section>
      <section id='projects-agentic'>
        <h2>Agentic</h2>
        <div className='case-study-cards'>
          {projects
          .filter(project => project.agentic)
          .map((project) =>(
            <ProjectCard className='case-study-card'
               key={project.slug}
               title={project.title}
               tagline={project.tagline}
               description={project.description}
               stack={project.stack}
               role={project.role}
               href={projectPath(project.slug)}
               achievement={project.achievement}  />
          ))}
        </div>
      </section>
      </>
    )};
