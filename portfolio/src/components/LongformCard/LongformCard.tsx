import {caseStudies} from '../../data/CaseStudies';
import { getCaseStudySlug } from '../../data/CaseStudies';
import { useParams } from 'react-router';
import './LongformCard.css';
import { LuAward } from "react-icons/lu";



export const LongformCard = () => {
    const { slug } = useParams();
    const study = caseStudies.find((s) => getCaseStudySlug(s.title) === slug);

    if (!study) {
        return <div>Case study not found</div>;
    }

    const longFormSections = [
         { key: 'whatItIs', label: 'What It Is' },
        { key: 'whatItSolves', label: 'What It Solves' },
        { key: 'howItDoesIt', label: 'How It Does It' },
        { key: 'features', label: 'Features' },
        { key: 'whatIDid', label: 'What I Did' },
        { key: 'implementation', label: 'Build Process' },
        { key: 'knownBugs', label: 'Known Bugs' },
        { key: 'whatIsNext', label: 'What Is Next' },
        { key: 'lessonsLearned', label: 'Lessons Learned' },
    ] as const;

    return (
        <div className="longform-card">
            <div className="longform-card-header">
                <div className='longform-title-and-award'>
                    <h2 className='longform-title'>{study.title}</h2>
                    {study.achievement && <p className='longform-achieve'>{study.achievement} <LuAward className='ribbon'/></p>}
                </div>
                <p className='longform-descript'>{study.description}</p>
                <blockquote className='longform-callout'>
                    <div className='longform-stack-list'>
                        <div className='stack-group'>
                            <p className='longform-stack'><strong>Stack:</strong></p><p>{study.stack.join(', ')}</p>
                        </div>
                        <div className='stack-group'>
                            <p className='longform-platform'><strong>Platform:</strong></p><p>{study.platform}</p>
                        </div>
                        <div className='stack-group'>
                            <p className='longform-status'><strong>Current Status:</strong></p><p>{study.longForm.currentStatus}</p>
                        </div>
                    </div>
                    <div className='longform-stats-image'>
                        {study.imageUrl && <img className='longform-image' src={study.imageUrl} alt="" />}
                    </div>
                </blockquote> 
            </div>
             <hr/>
            <div className="longform-card-body">
                {longFormSections.map(({ key, label }) => {
                    const value = study.longForm[key];

                    if (key === 'features' || key === 'knownBugs' || key === 'whatIsNext') {
                        if (!value || (Array.isArray(value) && value.length === 0)) {
                            return null;
                        }

                        return (
                            <section key={key} className={key}>
                                <h3>{label}</h3>
                                <ul>
                                    {Array.isArray(value) ? value.map((item, index) => <li key={index}>{item}</li>) : <li>{value}</li>}
                                </ul>
                            </section>
                        );
                    } else if (value) {
                        return (
                            <section key={key} className={key}>
                                <h3>{label}</h3>
                                {Array.isArray(value) ? value.map((p, index) => <p key={index}>{p}</p>) : <p>{value}</p>}
                        </section>
                            );
                        }
                    return null;
                })}
            </div>
        </div>
    );
};