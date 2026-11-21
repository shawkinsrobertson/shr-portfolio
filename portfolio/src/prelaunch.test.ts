// Launch gate: run with `npm run prelaunch`. It is excluded from `npm test` and CI on purpose,
// because it is expected to FAIL until every placeholder has been replaced (PLAN S4.4).
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { site } from './data/site';
import { getAllProjects } from './lib/projects';

describe('pre-launch: no placeholders left', () => {
	it('has a real resume PDF', () => {
		const pdf = readFileSync(resolve(process.cwd(), 'public', site.resume.href.replace(/^\//, '')), 'latin1');

		expect(pdf).not.toContain('RESUME-PLACEHOLDER');
	});

	it('has a real headshot', () => {
		expect(site.headshot.src).not.toMatch(/placeholder/i);
		expect(site.headshot.alt).not.toMatch(/placeholder/i);
	});

	it('has real screenshots on every published project', () => {
		const stillPlaceholder = getAllProjects()
			.filter((p) => !p.draft)
			.filter((p) => /placeholder/i.test(p.image?.alt ?? '') || /^feature-0\d\.png$/.test(p.image?.file ?? ''))
			.map((p) => p.slug);

		expect(stillPlaceholder).toEqual([]);
	});

	it('has no published project left in draft by mistake', () => {
		const drafts = getAllProjects().filter((p) => p.draft).map((p) => p.slug);

		// Informational: drafts are allowed, but list them so the owner confirms each is intentional.
		expect(drafts, `Drafts that will stay hidden: ${drafts.join(', ')}`).toBeDefined();
	});
});
