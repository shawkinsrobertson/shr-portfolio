import { describe, expect, it } from 'vitest';
import { caseStudies, getCaseStudySlug } from './CaseStudies';

describe('getCaseStudySlug', () => {
	it('derives a kebab-case slug from the title', () => {
		expect(getCaseStudySlug('No Guts No Glory')).toBe('no-guts-no-glory');
	});

	it('uses a neutral URL for Do Shit while the title stays as written', () => {
		expect(getCaseStudySlug('Do Shit')).toBe('todo-app');
		expect(caseStudies.find((s) => s.id === 1)?.title).toBe('Do Shit');
	});

	it('gives every titled study a unique slug', () => {
		const slugs = caseStudies.filter((s) => s.title).map((s) => getCaseStudySlug(s.title));

		expect(new Set(slugs).size).toBe(slugs.length);
	});
});
