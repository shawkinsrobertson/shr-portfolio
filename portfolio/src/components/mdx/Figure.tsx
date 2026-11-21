import { getProjectImageUrl } from '../../lib/projects';

interface FigureProps {
	/** File name inside src/assets/project-img/. */
	file: string;
	/** Required: describes the image for people who cannot see it. */
	alt: string;
	width: number;
	height: number;
	caption?: string;
}

export function Figure({ file, alt, width, height, caption }: FigureProps) {
	// Alt text is not optional: an image without it is dropped (and reported) instead of published unlabeled.
	if (typeof alt !== 'string' || alt.trim() === '') {
		console.error(`Figure "${file}" needs alt text, so it was not rendered.`);
		return null;
	}
	const src = getProjectImageUrl(file);
	if (!src) {
		console.error(`Figure image "${file}" was not found in src/assets/project-img/.`);
		return null;
	}

	return (
		<figure className="figure">
			<img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
			{caption && <figcaption>{caption}</figcaption>}
		</figure>
	);
}
