import { Link } from 'react-router';

export function NotFoundPage() {
	return (
		<section className="not-found">
			<meta name="robots" content="noindex" />
			<h1>Page not found</h1>
			<p>That page doesn't exist, or it hasn't been published yet.</p>
			<p>
				<Link className="btn" to="/">Go home</Link>
			</p>
		</section>
	);
}
