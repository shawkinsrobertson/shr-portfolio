import type { ComponentType } from 'react';
import type { MDXProps } from 'mdx/types';
import { Link, useParams } from 'react-router';
import { LuAward } from 'react-icons/lu';
import { mdxComponents } from '../components/mdx/mdx-components';
import { SafeLink } from '../components/mdx/SafeLink';
import {
    getAdjacentProjects,
    getProject,
    getProjectBody,
    getProjectImageUrl,
    projectPath,
    type Project,
} from '../lib/projects';
import { NotFoundPage } from './NotFoundPage';
import './CaseStudyPage.css';

interface CaseStudyViewProps {
    project: Project;
    Body: ComponentType<MDXProps>;
    prev?: Project;
    next?: Project;
}

export function CaseStudyView({ project, Body, prev, next }: CaseStudyViewProps) {
    const imageUrl = project.image && getProjectImageUrl(project.image.file);
    const facts = [
        ['Stack', project.stack.join(', ')],
        ['Platform', project.platform],
        ['Role', project.role],
        ['Status', project.status],
    ].filter(([, value]) => value);

    return (
        <article className="longform-card">
            <div className="longform-card-header">
                <div className='longform-title-and-award'>
                    <h1 className='longform-title'>{project.title}</h1>
                    {project.achievement && <p className='longform-achieve'>{project.achievement} <LuAward className='ribbon' aria-hidden="true" /></p>}
                </div>
                <p className='longform-descript'>{project.description}</p>
                <div className='longform-callout'>
                    <div className='longform-stack-list'>
                        <dl className='longform-facts'>
                            {facts.map(([term, value]) => (
                                <div className='stack-group' key={term}>
                                    <dt>{term}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                        {project.links && (
                            <ul className='longform-links'>
                                {project.links.repo && <li><SafeLink href={project.links.repo}>Source code</SafeLink></li>}
                                {project.links.live && <li><SafeLink href={project.links.live}>Live site</SafeLink></li>}
                            </ul>
                        )}
                    </div>
                    <div className='longform-stats-image'>
                        {imageUrl && project.image && (
                            <img
                                className='longform-image'
                                src={imageUrl}
                                alt={project.image.alt}
                                width={project.image.width}
                                height={project.image.height}
                            />
                        )}
                    </div>
                </div>
            </div>
            <hr/>
            <div className="longform-card-body">
                <Body components={mdxComponents} />
            </div>
            <nav className="longform-pager" aria-label="More projects">
                <ul>
                    <li>{prev && <Link to={projectPath(prev.slug)}><span aria-hidden="true">← </span>Previous: {prev.title}</Link>}</li>
                    <li><Link to="/">All projects</Link></li>
                    <li>{next && <Link to={projectPath(next.slug)}>Next: {next.title}<span aria-hidden="true"> →</span></Link>}</li>
                </ul>
            </nav>
        </article>
    );
}

export function CaseStudyPage() {
    const { slug } = useParams();
    const project = getProject(slug);
    const Body = project && getProjectBody(project.slug);

    // Unknown slugs and unpublished (draft or incomplete) projects look the same: not found.
    if (!project || !Body) return <NotFoundPage />;

    const { prev, next } = getAdjacentProjects(project.slug);
    return <CaseStudyView project={project} Body={Body} prev={prev} next={next} />;
}
