import { Hero } from '../components/Hero/Hero'
import { ProjectCard } from '../components/ProjectCard/ProjectCard'
import { caseStudies } from '../data/CaseStudies'



export function HomePage() {
    return (
        <>
        <section id="hero">
	<Hero 
		name='Seamus Robertson'
		title='Front-End Developer'
		tagline='I build software that makes life easier.'
		ctaHref='/resume.pdf'/>
	</section>
    <section id="projects">
          {caseStudies.map((study: (typeof caseStudies)[number]) =>(
            <ProjectCard
               key={study.id}
               title={study.title}
               tagline={study.tagline}
               description={study.description}
               stack={study.stack}
               role={study.role}
               //href={}
               achievement={study.achievement}  />
          ))}
      </section>
      </>
    )};