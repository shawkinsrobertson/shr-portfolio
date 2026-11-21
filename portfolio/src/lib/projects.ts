import type { ComponentType } from 'react';
import type { MDXProps } from 'mdx/types';

export interface ProjectImage {
	file: string;
	alt: string;
	width: number;
	height: number;
}

// Mirrors the YAML frontmatter at the top of each src/content/projects/<slug>.mdx file.
export interface Project {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	agentic: boolean;
	stack: string[];
	role: string;
	platform: string;
	status?: string;
	achievement?: string;
	order: number;
	draft: boolean;
	links?: { repo?: string; live?: string };
	image?: ProjectImage;
}

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HTTPS_URL = /^https:\/\/\S+$/;
const filled = (value: string | undefined) => typeof value === 'string' && value.trim() !== '';

/** Structural check of a project's frontmatter. Returns the problems found (empty means valid). */
export function validateFrontmatter(raw: unknown): string[] {
	if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return ['frontmatter must be an object'];
	const r = raw as Record<string, unknown>;
	const problems: string[] = [];

	if (typeof r.slug !== 'string' || !KEBAB.test(r.slug)) problems.push('slug must be kebab-case');
	for (const field of ['title', 'tagline', 'description', 'role', 'platform']) {
		if (typeof r[field] !== 'string') problems.push(`${field} must be a string`);
	}
	for (const field of ['status', 'achievement']) {
		if (r[field] !== undefined && typeof r[field] !== 'string') problems.push(`${field} must be a string`);
	}
	if (typeof r.agentic !== 'boolean') problems.push('agentic must be true or false');
	if (typeof r.draft !== 'boolean') problems.push('draft must be true or false');
	if (typeof r.order !== 'number' || !Number.isFinite(r.order)) problems.push('order must be a number');
	if (!Array.isArray(r.stack) || r.stack.some((item) => typeof item !== 'string')) {
		problems.push('stack must be a list of strings');
	}

	if (r.image !== undefined) {
		const image = r.image as Record<string, unknown> | null;
		const ok =
			typeof image === 'object' &&
			image !== null &&
			typeof image.file === 'string' &&
			image.file !== '' &&
			typeof image.alt === 'string' &&
			Number.isInteger(image.width) &&
			(image.width as number) > 0 &&
			Number.isInteger(image.height) &&
			(image.height as number) > 0;
		if (!ok) problems.push('image needs file, alt, and positive integer width and height');
	}

	if (r.links !== undefined) {
		const links = r.links as Record<string, unknown> | null;
		const ok =
			typeof links === 'object' &&
			links !== null &&
			Object.entries(links).every(
				([key, url]) => (key === 'repo' || key === 'live') && typeof url === 'string' && HTTPS_URL.test(url),
			);
		if (!ok) problems.push('links may only hold https URLs for repo and live');
	}

	return problems;
}

/** The publish bar (SPEC 8.3): a project with any of these missing stays hidden even if `draft` is false. */
export function meetsPublishBar(project: Project): boolean {
	return (
		filled(project.title) &&
		filled(project.tagline) &&
		filled(project.description) &&
		project.stack.length > 0 &&
		filled(project.role) &&
		filled(project.platform) &&
		filled(project.image?.alt)
	);
}

export function selectPublished(projects: Project[]): Project[] {
	return projects.filter((p) => !p.draft && meetsPublishBar(p)).sort((a, b) => a.order - b.order);
}

// Loaded eagerly: each module carries both its frontmatter (for cards and nav) and its body.
// Splitting the bodies out needs the frontmatter extracted at build time instead (PLAN S3.6).
const modules = import.meta.glob<{ frontmatter: unknown; default: ComponentType<MDXProps> }>('../content/projects/*.mdx', {
	eager: true,
});
const imageUrls = import.meta.glob<string>('../assets/project-img/*', { eager: true, query: '?url', import: 'default' });

/** Every project whose frontmatter is structurally valid, drafts included. */
export function getAllProjects(): Project[] {
	return Object.values(modules)
		.map((module) => module.frontmatter)
		.filter((raw) => validateFrontmatter(raw).length === 0) as Project[];
}

export const getPublishedProjects = () => selectPublished(getAllProjects());

/** A published project by slug. Unknown and draft slugs return undefined, so callers show the 404 page. */
export const getProject = (slug: string | undefined) => getPublishedProjects().find((p) => p.slug === slug);

/** The published projects either side of `slug`, in display order. Both are undefined for an unpublished slug. */
export function getAdjacentProjects(slug: string): { prev?: Project; next?: Project } {
	const published = getPublishedProjects();
	const index = published.findIndex((p) => p.slug === slug);
	if (index === -1) return {};
	return { prev: published[index - 1], next: published[index + 1] };
}

export const projectPath = (slug: string) => `/projects/${slug}`;

export const getProjectImageUrl = (file: string) => imageUrls[`../assets/project-img/${file}`];

/** The project's MDX body as a component. */
export const getProjectBody = (slug: string) => modules[`../content/projects/${slug}.mdx`]?.default;
