import { useParams } from 'react-router';
import { LuAward } from 'react-icons/lu';
import { getProject, getProjectBody, getProjectImageUrl } from '../../lib/projects';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { mdxComponents } from '../mdx/mdx-components';
import './LongformCard.css';

export const LongformCard = () => {
    const { slug } = useParams();
    const project = getProject(slug);
    const Body = project && getProjectBody(project.slug);

    // Unknown slugs and unpublished (draft or incomplete) projects look the same: not found.
    if (!project || !Body) {
        return <NotFoundPage />;
    }

    const imageUrl = project.image && getProjectImageUrl(project.image.file);

    return (
        <div className="longform-card">
            <div className="longform-card-header">
                <div className='longform-title-and-award'>
                    <h2 className='longform-title'>{project.title}</h2>
                    {project.achievement && <p className='longform-achieve'>{project.achievement} <LuAward className='ribbon'/></p>}
                </div>
                <p className='longform-descript'>{project.description}</p>
                <blockquote className='longform-callout'>
                    <div className='longform-stack-list'>
                        <div className='stack-group'>
                            <p className='longform-stack'><strong>Stack:</strong></p><p>{project.stack.join(', ')}</p>
                        </div>
                        <div className='stack-group'>
                            <p className='longform-platform'><strong>Platform:</strong></p><p>{project.platform}</p>
                        </div>
                        {project.status && (
                            <div className='stack-group'>
                                <p className='longform-status'><strong>Current Status:</strong></p><p>{project.status}</p>
                            </div>
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
                </blockquote>
            </div>
            <hr/>
            <div className="longform-card-body">
                {/* The body is a module-level import, so its identity is stable across renders. */}
                {/* oxlint-disable-next-line react/static-components */}
                <Body components={mdxComponents} />
            </div>
        </div>
    );
};
