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
    <section id="projects">
        <h2>Selected projects</h2>
        <ul className='case-study-cards' aria-label="Projects">
          {projects.map((project) =>(
            <li key={project.slug}>
              <ProjectCard
                thumbnail={project.thumbnail}
                title={project.title}
                tagline={project.tagline}
                description={project.description}
                stack={project.stack}
                role={project.role}
                href={projectPath(project.slug)}
                 agentic={project.agentic}
                 achievement={project.achievement}  />
            </li>
          ))}
        </ul>
      </section>
      </>
    )};
