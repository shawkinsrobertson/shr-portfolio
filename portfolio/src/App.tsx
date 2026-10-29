import { ProjectCard } from './components/ProjectCard/ProjectCard'
import './App.css'
import { Hero } from './components/Hero/Hero';
import { Nav } from './components/Nav/Nav';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';

const projects = [
	{
  id: 1,
	title: 'Shelby',
	tagline: 'A modern diabetes assistant for MDI',
	description: 'An AI-integrated treatment logger and prediction engine for type 1 diabetes designed for MDI users. Built on oref0, the open-source algorithm closed-loop pump systems already trust, modified for fixed basal injections.',
	stack: ['react native', 'TypeScript', 'n8n', 'Claude API', 'Nightscout', 'XDrip+'],
	role: 'Founder & Developer',
	achievement: 'Top 100 at Kanz AI Hackathon July 2026',
	imageUrl:'',
	},
	{
  id: 2,
	title: 'SimpleSet',
	tagline: 'Turning static workout plans into trackable goals',
	description: 'Create your own or import an existing plan from a document, spreadsheet, PDF, or Google Drive, and simpleSet turns it into a day-by-day log with PRs, streaks, and progress tracking.',
	stack: ['vite'],
	role: 'Solo Developer',
	achievement: '',
	imageUrl:'',
	},
	{
  id: 3,
	title: 'Scream Recorder',
	tagline: 'Making the Void a sharing space',
	description: 'Record and share the screams of your life with friends on a community board. Like, comment, and sync screams with your Google calendar so you can remember them in context.',
	stack: ['react native', 'TypeScript'],
	role: 'Solo Developer',
	achievement: '',
	imageUrl:'',
	},
	{
  id: 4, 
	title: 'Scavenger Hunt',
	tagline: 'Create, navigate, and track a scavenger hunt',
	description: 'A mobile app that takes a user through a customized scavenger hunt. Originally built as a birthday gift, the app sports a 16-bit inspired retro theme.',
	stack: [],
	role: 'Solo Developer',
	achievement: '',
	imageUrl:'',
	},
	{
  id: 5, 
	title: 'No Guts No Glory',
	tagline: 'A daily tracking and monitoring tool for gastritis',
	description: 'Over 2 million people in the U.S. suffer from gastritis. No Guts No Glory lets users define, weight, and track stressors, symptoms, and recovery factors.',
	stack: [],
	role: 'Solo Developer',
	achievement: '',
	imageUrl:'',
	},
];

const links = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Bio', href: '#bio' },
];

function App() {
  return (
    <>
	<Nav links={links} />
	<section id="hero">
	<Hero 
		name='Seamus Robertson'
		title='Software Engineer'
		tagline='I build software that makes life easier.'
		ctaHref='/resume.pdf'/>
	</section>
      <section id="projects">
          {projects.map((project) =>(
            <ProjectCard
               key={project.id}
               title={project.title}
               tagline={project.tagline}
               description={project.description}
               stack={project.stack}
               role={project.role}
               //href={}
               achievement={project.achievement}  />
          ))}
      </section>
       
    </>
  )
}

export default App
