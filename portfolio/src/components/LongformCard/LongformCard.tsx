import {caseStudies} from '../../data/CaseStudies';


export const LongformCard = ({studyId}: {studyId: number}) => {
    const study = caseStudies.find((s) => s.id === studyId);

    if (!study) {
        return <div>Case study not found</div>;
    }

    return (
        <div className="longform-card">
            <div className="longform-card-header">
                <h2>{study.title}</h2>
                <p>{study.tagline}</p>
                <p>{study.description}</p>
                <p><strong>Stack:</strong> {study.stack.join(', ')}</p>
                <p><strong>Role:</strong> {study.role}</p>
                {study.achievement && <p><strong>Achievement:</strong> {study.achievement}</p>}
            </div>
            <hr />
            <div className="longform-card-body">
                <section className='problem'>
                    <h3>Problem</h3>
                    <p>{study.longForm.problem}</p>
                </section>
                <section className='solution'>
                    <h3>Solution</h3>
                    <p>{study.longForm.solution}</p>
                </section>
                <section className='process'>
                    <h3>Process</h3>
                    <p>{study.longForm.process}</p>
                </section>
                <section className='results'>
                    <h3>Results</h3>
                    <p>{study.longForm.results}</p>
                </section>
                <section className='lessonsLearned'>
                    <h3>Lessons Learned</h3>
                    <p>{study.longForm.lessonsLearned}</p>
                </section>
            </div>
        </div>
    );
};