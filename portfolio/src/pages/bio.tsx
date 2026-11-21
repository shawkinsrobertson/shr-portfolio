import './bio.css'
import { SafeLink } from '../components/mdx/SafeLink';
import { httpsUrl, site, type SiteData } from '../data/site';


export const BioPage = ({ data = site }: { data?: SiteData }) => {
    const substack = httpsUrl(data.substack);

    return (
        <div className="bio-page">
            <div className="bio-header">
                <div className='bio-headline-container'>
                    <div className='bio-img'>
                        <img
                            className='bio-headshot'
                            src={data.headshot.src}
                            alt={data.headshot.alt}
                            width={data.headshot.width}
                            height={data.headshot.height}
                        />
                    </div>
                    <div className="bio-big-info">
                        <h1>{data.name}</h1>
                        <div className="bio-title-location">
                            <p className="bio-title">{data.title}</p>
                            <p>{data.location}</p>
                    </div>
                    </div>
                </div>
                <ul className="bio-links" aria-label="Contact">
                    <li><SafeLink href={`mailto:${data.email}`}>Email</SafeLink></li>
                    <li><SafeLink href={data.linkedin}>LinkedIn</SafeLink></li>
                    <li><SafeLink href={data.github}>GitHub</SafeLink></li>
                    {substack && <li><SafeLink href={substack}>Substack</SafeLink></li>}
                    <li><a href={data.resume.href} download>Resume <span className="visually-hidden">(PDF)</span></a></li>
                </ul>
            </div>
            <section className="bio-business-content" aria-labelledby="bio-work-heading">
                <h2 id="bio-work-heading" className="visually-hidden">Professional background</h2>
                <p>{data.business}</p>
            </section>
            <section className="bio-personal-content" aria-labelledby="bio-personal-heading">
                <h2 id="bio-personal-heading" className="visually-hidden">Personal</h2>
                <p>{data.personal}</p>
            </section>
        </div>
    )
};
