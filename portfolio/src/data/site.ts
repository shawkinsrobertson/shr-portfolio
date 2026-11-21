import headshotUrl from '../assets/headshot-placeholder.svg';

export interface SiteData {
	name: string;
	title: string;
	location: string;
	email: string;
	linkedin: string;
	github: string;
	/** Leave unset until the Substack exists; it only appears once this is a valid https URL. */
	substack?: string;
	business: string;
	personal: string;
	resume: { href: string };
	headshot: { src: string; alt: string; width: number; height: number };
}

/** The URL if it is a well-formed https URL, otherwise undefined. Used for any link that may not be ready. */
export const httpsUrl = (url?: string) => (url && /^https:\/\/[^\s/]\S*$/.test(url) ? url : undefined);

export const site: SiteData = {
	name: 'Seamus Robertson',
	title: 'Front-End Developer',
	location: 'Seattle, WA',
	email: 'shrobertson@proton.me',
	linkedin: 'https://www.linkedin.com/in/seamushrobertson/',
	github: 'https://github.com/shawkinsrobertson',
	substack: undefined,
	business: `I'm a front end web developer with a background in healthcare driven to create elegant, accessible products that foster human relationships. I'm currently building AI-integrated health tools for managing diabetes and the every day.`,
	personal: `I believe in we're all a little stronger and a little wiser than we think. I've spent the last decade in healthcare breaking down overly-complicated ideas into invitations for people to learn more about themselves and the last twenty years hacking Type 1 Diabetes, most recently with open-source AID systems. I'm at home in the Pacific Northwest and am happiest hiking in the rain with a thermos of coffee.`,
	// TODO (PLAN S1.5): replace public/resume/seamus-robertson-resume.pdf with the real, metadata-stripped PDF.
	resume: { href: '/resume/seamus-robertson-resume.pdf' },
	// TODO (PLAN S1.5): replace the placeholder with a real, EXIF-stripped photo and update the alt text.
	headshot: {
		src: headshotUrl,
		alt: 'Placeholder for a portrait of Seamus Robertson',
		width: 400,
		height: 400,
	},
};
