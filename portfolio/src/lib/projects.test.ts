import { describe, expect, it } from 'vitest';
import {
	getProject,
	getPublishedProjects,
	meetsPublishBar,
	projectPath,
	selectPublished,
	validateFrontmatter,
	type Project,
} from './projects';

const complete: Project = {
	slug: 'sample-app',
	title: 'Sample App',
	tagline: 'A sample',
	description: 'Describes the sample.',
	agentic: false,
	stack: ['React'],
	role: 'Solo Developer',
	platform: 'Web',
	order: 10,
	draft: false,
	image: { file: 'feature-01.png', alt: 'The sample app home screen', width: 3200, height: 1800 },
};

describe('validateFrontmatter', () => {
	it('accepts a complete project', () => {
		expect(validateFrontmatter(complete)).toEqual([]);
	});

	it('accepts a draft with empty text fields (it just will not publish)', () => {
		expect(validateFrontmatter({ ...complete, draft: true, tagline: '', stack: [], platform: '' })).toEqual([]);
	});

	it.each([
		['slug', 'Not Kebab'],
		['slug', ''],
		['title', 3],
		['agentic', 'no'],
		['stack', 'React'],
		['order', '1'],
		['draft', undefined],
		['image', { file: 'x.png' }],
		['links', { repo: 'javascript:alert(1)' }],
	])('rejects a bad %s (%j)', (field, value) => {
		const problems = validateFrontmatter({ ...complete, [field]: value });

		expect(problems.some((p) => p.includes(field))).toBe(true);
	});

	it('rejects non-objects', () => {
		expect(validateFrontmatter(null)).not.toEqual([]);
		expect(validateFrontmatter('text')).not.toEqual([]);
	});
});

describe('meetsPublishBar (D3: incomplete studies stay hidden)', () => {
	it('passes a complete project', () => {
		expect(meetsPublishBar(complete)).toBe(true);
	});

	it.each([
		['title', { title: '' }],
		['tagline', { tagline: '   ' }],
		['description', { description: '' }],
		['stack', { stack: [] }],
		['role', { role: '' }],
		['platform', { platform: '' }],
		['image', { image: undefined }],
		['image alt', { image: { file: 'a.png', alt: '', width: 1, height: 1 } }],
	])('fails without a %s', (_name, override) => {
		expect(meetsPublishBar({ ...complete, ...override })).toBe(false);
	});
});

describe('selectPublished', () => {
	const incomplete: Project = { ...complete, slug: 'unfinished', stack: [] };
	const draft: Project = { ...complete, slug: 'a-draft', draft: true };
	const early: Project = { ...complete, slug: 'early', order: 1 };

	it('drops drafts and non-draft projects that miss the publish bar', () => {
		expect(selectPublished([complete, incomplete, draft]).map((p) => p.slug)).toEqual(['sample-app']);
	});

	it('sorts by order, lowest first', () => {
		expect(selectPublished([complete, early]).map((p) => p.slug)).toEqual(['early', 'sample-app']);
	});
});

describe('the real content', () => {
	it('publishes only complete, non-draft projects in order', () => {
		const published = getPublishedProjects();

		expect(published.length).toBeGreaterThan(0);
		expect(published.every((p) => !p.draft && meetsPublishBar(p))).toBe(true);
		expect(published.map((p) => p.order)).toEqual([...published.map((p) => p.order)].sort((a, b) => a - b));
	});

	it('finds a published project by slug', () => {
		expect(getProject('todo-app')?.title).toBe('Do Shit');
	});

	it('does not find unknown or draft slugs', () => {
		expect(getProject('does-not-exist')).toBeUndefined();
		expect(getProject('scream-recorder')).toBeUndefined();
	});

	it('builds project paths', () => {
		expect(projectPath('todo-app')).toBe('/projects/todo-app');
	});
});
