import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllProjects, meetsPublishBar, validateFrontmatter } from '../lib/projects';

const dir = resolve(process.cwd(), 'src/content/projects');
const files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));
const source = (file: string) => readFileSync(resolve(dir, file), 'utf8');

// Everything after the YAML frontmatter block.
const body = (file: string) => source(file).replace(/^---\n[\s\S]*?\n---\n?/, '');
const headingLevels = (file: string) =>
	[...body(file).matchAll(/^(#{1,6})\s+\S/gm)].map((m) => m[1].length);

const all = getAllProjects();

describe('project content', () => {
	it('has a content file for every project and vice versa', () => {
		expect(all.map((p) => `${p.slug}.mdx`).sort()).toEqual([...files].sort());
	});

	it('has unique slugs', () => {
		expect(new Set(all.map((p) => p.slug)).size).toBe(all.length);
	});

	describe.each(all)('$slug', (project) => {
		it('has valid frontmatter', () => {
			expect(validateFrontmatter(project)).toEqual([]);
		});

		it('is named after its slug', () => {
			expect(files).toContain(`${project.slug}.mdx`);
		});

		it('points at an image file that exists', () => {
			if (!project.image) return;
			expect(existsSync(resolve(process.cwd(), 'src/content/projects/case-study-img', project.image.file))).toBe(true);
		});

		it('only links to https URLs', () => {
			for (const url of Object.values(project.links ?? {})) expect(url).toMatch(/^https:\/\//);
		});

		it('uses Markdown links and images, not raw HTML that skips the safe component mapping', () => {
			// MDX only maps elements it generates from Markdown. A hand-written <a>, <img>, <script>, or
			// <iframe> would bypass SafeLink/Figure (and their alt-text and link-scheme rules).
			expect(body(`${project.slug}.mdx`)).not.toMatch(/<\s*(a|img|script|iframe|object|embed)[\s>/]/i);
		});

		it('starts headings at ### and never skips a level', () => {
			const levels = headingLevels(`${project.slug}.mdx`);
			if (levels.length === 0) return;

			expect(levels[0]).toBe(3);
			levels.slice(1).forEach((level, i) => {
				expect(level - levels[i], `h${levels[i]} followed by h${level}`).toBeLessThanOrEqual(1);
			});
		});

		it('has at least one section when published', () => {
			if (project.draft) return;
			expect(meetsPublishBar(project)).toBe(true);
			expect(headingLevels(`${project.slug}.mdx`).length).toBeGreaterThan(0);
		});
	});
});
