import { Hero } from '../components/Hero/Hero'
import { ProjectCard } from '../components/ProjectCard/ProjectCard'
import { caseStudies, getCaseStudySlug, hasLongFormContent } from '../data/CaseStudies'



export function HomePage() {
    return (
        <>
        <section id="hero">
	<Hero 
		name='Seamus Robertson'
		title='Front-End Developer'
		tagline='Building clever, silly, beautiful, accessible shit.' />
	</section>
    <section id="projects">
          {caseStudies
          .filter(hasLongFormContent)
          .map((study: (typeof caseStudies)[number]) =>(
            <ProjectCard
               key={study.id}
               title={study.title}
               tagline={study.tagline}
               description={study.description}
               stack={study.stack}
               role={study.role}
               href={`/pages/${getCaseStudySlug(study.title)}`}
               achievement={study.achievement}  />
          ))}
      </section>
      </>
    )};