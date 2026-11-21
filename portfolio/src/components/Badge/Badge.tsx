import './Badge.css';
import { LuBot, LuCodeXml } from 'react-icons/lu';

export type BadgeKind = 'hand-coded' | 'agentic';

const BADGES = {
	'hand-coded': { label: 'Hand-coded', Icon: LuCodeXml },
	agentic: { label: 'Agentic', Icon: LuBot },
} as const;

// Hand-coded is an outlined pill and agentic is a filled one, and each has its own icon and text,
// so the two are told apart by more than color.
export function Badge({ kind }: { kind: BadgeKind }) {
	const { label, Icon } = BADGES[kind];

	return (
		<span className={`badge badge-${kind}`}>
			<Icon aria-hidden="true" />
			{label}
		</span>
	);
}
