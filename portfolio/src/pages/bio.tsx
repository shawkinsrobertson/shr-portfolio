import './bio.css'
import {bioStats} from '../data/BioStats';


export const BioPage = () => {
    return (
        <div className="bio-page">
            <div className="bio-header">
                <div className='bio-headline-container'>
                    <div className='bio-img'>
                        <div className='bio-placeholder-image'></div>
                    </div>
                    <div className="bio-big-info">
                        <h1>{bioStats.name}</h1>
                        <div className="bio-title-location">
                            <h2>{bioStats.title}</h2>
                            <p>{bioStats.location}</p>
                    </div>
                    </div>
                </div>
                <div className="bio-links">
                    <p><a href={`mailto:${bioStats.email}`}><strong>Email</strong></a></p>
                    <p><a href={bioStats.substack} target="_blank" rel="noopener noreferrer"><strong>Substack</strong></a></p>
                    <p><a href={bioStats.linkedin} target="_blank" rel="noopener noreferrer"><strong>LinkedIn</strong></a></p>
                    <p><a href={bioStats.github} target="_blank" rel="noopener noreferrer"><strong>GitHub</strong></a></p>
                </div>
            </div>
            <section className="bio-business-content">
                <p>{bioStats.business}</p>
            </section>
            <section className="bio-personal-content">
                <p>{bioStats.personal}</p>
            </section>
        </div>
    )
};


