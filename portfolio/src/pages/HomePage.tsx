import { Hero } from '../components/Hero/Hero'
import { ProjectCard } from '../components/ProjectCard/ProjectCard'
import { caseStudies, getCaseStudySlug, hasLongFormContent } from '../data/CaseStudies'
import './HomePage.css'



export function HomePage() {
    return (
        <>
        <section id="hero">
	<Hero 
		name='Seamus Robertson'
		title='Front-End Developer'
		tagline='Building clever, silly, beautiful, accessible shit.' />
	</section>
    <section id="projects-handcode">
        <h3>Hand Coded</h3>
        <div className='case-study-cards'>
          {caseStudies
          .filter(study => hasLongFormContent(study) && study.agentic === false)
          .map((study: (typeof caseStudies)[number]) =>(
            <ProjectCard className='case-study-card'
               key={study.id}
               title={study.title}
               tagline={study.tagline}
               description={study.description}
               stack={study.stack}
               role={study.role}
               href={`/projects/${getCaseStudySlug(study.title)}`}
               achievement={study.achievement}  />
          ))}
        </div>
      </section>
      <section id='projects-agentic'>
        <h3>Agentic</h3>
        <div className='case-study-cards'>
          {caseStudies
          .filter(study => hasLongFormContent(study) && study.agentic === true)
          .map((study: (typeof caseStudies)[number]) =>(
            <ProjectCard className='case-study-card'
               key={study.id}
               title={study.title}
               tagline={study.tagline}
               description={study.description}
               stack={study.stack}
               role={study.role}
               href={`/projects/${getCaseStudySlug(study.title)}`}
               achievement={study.achievement}  />
          ))}
        </div>
      </section>
      </>
    )};