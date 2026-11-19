import { isValidElement } from 'react';
import feature01 from '../assets/project-img/feature-01.png';
import feature02 from '../assets/project-img/feature-02.png';
import feature03 from '../assets/project-img/feature-03.png';
import feature04 from '../assets/project-img/feature-04.png';
import feature05 from '../assets/project-img/feature-05.png';
import feature06 from '../assets/project-img/feature-06.png';

export const caseStudies = [
	{
		id: 1,
		agentic: false,
		title: 'Do Shit',
		tagline: 'A vanilla JS to-do application',
		description: 'Responsive web application that utilizes CRUD and local storage to allow users to create and organize tasks, lists, and projects.',
		stack: ['HTML', 'CSS', 'JavaScript'],
		role: 'Solo Developer',
		achievement: '',
		platform: 'Web',
		imageUrl: feature01,
		longForm: {
			platform: 'Web',
			implementation: `I'm responsible for planning, design, and building. This is my first hand coded application.`,
			currentStatus: 'v1 complete',
			whatItIs: 'Responsive web application that utilizes CRUD and local storage to allow users to create and organize tasks, lists, and projects.',
			whatItSolves: '',
			howItDoesIt: '',
			features: ['Dedicated project and list creation', 'Search across projects, tasks, and lists', 'Sort A-Z and due date: first-last', 'Subtasks'],
			whatIDid: [],
			knownBugs: [],
			whatIsNext: [],
			lessonsLearned: '',
		},
	},
	{
		id: 2,
		agentic: false,
		title: '',
		tagline: '',
		description: '',
		stack: [],
		role: '',
		achievement: '',
		platform: '',
		imageUrl: '',
		longForm: {
			platform: '',
			implementation: '',
			currentStatus: '',
			whatItIs: '',
			whatItSolves: '',
			howItDoesIt: '',
			features: [],
			whatIDid: [],
			knownBugs: [],
			whatIsNext: [],
			lessonsLearned: '',
		},
	},
	{
		id: 3,
		agentic: false,
		title: '',
		tagline: '',
		description: '',
		stack: [],
		role: '',
		achievement: '',
		platform: '',
		imageUrl: '',
		longForm: {
			platform: '',
			implementation: '',
			currentStatus: '',
			whatItIs: '',
			whatItSolves: '',
			howItDoesIt: '',
			features: [],
			whatIDid: [],
			knownBugs: [],
			whatIsNext: [],
			lessonsLearned: '',
		},
	},
	{
		id: 4,
		agentic: true,
		title: 'Shelby',
		tagline: 'A modern diabetes assistant for MDI',
		description: 'An AI-integrated treatment logger and prediction engine for type 1 diabetes designed for MDI users. Built on oref0, the open-source algorithm closed-loop pump systems already trust, modified for fixed basal injections.',
		stack: ['react native', 'TypeScript', 'n8n', 'Claude API', 'Nightscout', 'XDrip+'],
		role: 'Agentic SDLC',
		achievement: 'Top 100 at Kanz AI Hackathon July 2026',
		platform: 'Cross-Platform mobile (React/Expo)',
		imageUrl: feature02,
		longForm: {
			whatItIs: 'An open-source diabetes treatment application designed to offer flexible, continuous treatment between pump use and multiple daily injections.',
			whatItSolves: 'Roughly a third of people with Type 1 diabetes use multiple daily injections (MDI) rather than pumps. Most predictive treatment tools are built for insulin pumps, creating a gap in care for those who do not use them or who wish to switch between the two treatment methods.',
			howItDoesIt: <>
				tl;dr: Shelby uses a modified closed-loop pump algorithm, Oref0, and adapts it for those who inject basal insulin.
				<br /><br />
				The original Oref0 algorithm calculates and executes changes to an insulin pump's basal rate based on blood glucose data received from a continuous glucose monitor (CGM) to keep glucose levels within the normal range of 70-180mg/dl (3.9–10.0 mmol/L).
				<br /><br />
				People treating diabetes with injections will inject a fixed dose of basal insulin that cannot be changed, so any prediction engine for MDI will need to fork to account for a fixed basal rate, suggesting carbs instead of changes in basal rate.
				<br /><br />
				Shelby forks the algorithm by creating a <code>profile.mdiMode</code> that takes a user's basal insulin dosage and creates a steady <code>profile.current_basal</code> to compute <code>insulinReq</code>. This profile then feeds calculations the fixed basal rate and calculates <code>carbsSuggested</code> from <code>excessInsulin</code> instead of a basal rate change.
			</>,
			features: ['Unified treatment logging (carbs, multiple insulin types, activity)', 
						'Connect bluetooth glucose meters (bluetooth pens such as InPen coming soon)', 
						'CGM ingestion from Juggluco/XDrip+/XDrip4iOS/NightScout',
						'Pump status from NightScout (IOB, COB, loop status, temp targets)',
						'Ambulatory glucose profile, TIR, mean/median glucose, standard deviation, and estimated A1c%',
						'Android/Apple Health Kit sync pulls activity and nutrition logs from other apps',
						'AI assistant for patterns and insights and discussion topics with care team'],
			whatIDid: [
				<><strong>CGM ingestion via local inter-app broadcast</strong> (requires juggluco or XDrip+ app install) instead of follower account allows for offline, continuous monitoring. This method is already used by open-source AID systems. This allows Shelby to work fully offline for MDI users.<br /><strong>Trade Off</strong>: Requires the installation of a companion open-source CGM app which can cause friction and increase cognitive load for users.</>,
				<><strong>Used a flat basal insulin calculation when modifying</strong> the algorithm instead of using more precise calculations for varying types of basal insulins and their activity curves. I left this for a v2 round of development because it will require more research and consultation with clinical experts.<br /><strong>Trade Off</strong>: This kind of oversimplification can lead to over/under suggestions with treatment which can be literally life or death for users trusting this app to offer sound suggestions. The primary reason this app is not in the app store.</>,
			],
			knownBugs: '',
			whatIsNext: [
				'Continued UI refinements: CGM graph scaling and contrast',
				'Build out data export and future clinician sync/integration (perhaps Tidepool or own platform).'
			],
			lessonsLearned: '',
			implementation: 'Product concept and UI design, review and testing. Built with Claude Code. This was a project for the Kanz AI Hackathon July 2026. Scored in the top 100 out of 3,500 project submissions.',
			currentStatus: 'Prototype/Proof of concept/Research and testing',
		},
	},
	{
		id: 5,
		agentic: true,
		title: 'SimpleSet',
		tagline: 'Turning static workout plans into trackable goals',
		description: 'Create your own or import an existing plan from a document, spreadsheet, PDF, or Google Drive, and simpleSet turns it into a day-by-day log with PRs, streaks, and progress tracking.',
		stack: ['React', 'TypeScript', 'Supabase'],
		role: 'Agentic SDLC',
		achievement: '',
		imageUrl: feature03,
		longForm: {
			platform: 'Mobile and Desktop via PWA architecture',
			implementation: 'Agentic SDLC',
			currentStatus: '',
			whatItIs: 'SimpleSet is a progressive web application that parses static workout plans in .pdf, .docx, .csv, .xlsx, and .html formats and turns them into a trackable interface with PRs, completion streaks, and per-exercise metrics.',
			whatItSolves: 'SimpleSet takes the tedious effort out of transferring a workout plan bought online into a training app. It also provides a platform-agnostic interface for tracking plans and programs that do not natively provide tracking, without charging a monthly subscription.',
			howItDoesIt: 'Users import a plan from a supported document format or Google Drive, review and edit its structure, then track workouts, completion, and exercise progress over time.',
			features: [
				'Document parser and OCR capabilities for images and image-based PDFs',
				'Review, edit, reorder, group, and duplicate exercises and days before saving a plan',
				'Workout tracker supporting supersets, circuits, and work:rest timers and intervals',
				'Notes on individual exercises and workouts',
				'Heatmap showing completion across 30, 60, and 90 days',
				'Progress stats on individual exercises',
			],
			whatIDid: [
				<><strong>Supabase function for LLM parsing and OCR:</strong> Kept the project lightweight while supporting robust parsing of image-based PDFs. Supabase auth provides a premium account tier with a limit of 10 LLM parsing calls per user per day. The function extracts text from PDFs or converts image-based PDFs to bytes before sending them to the LLM, reducing data load for calls.</>,
				<><strong>Google Drive integration:</strong> Enabled users to update major revisions to imported plans. Plans imported from Drive can be synced to newer versions of the same file by comparing and updating local storage.</>,
			],
			knownBugs: [
				'When duplicating days across weeks, number fields on mobile require highlighting and deleting the placeholder before entering a new number.',
				'Circuit exercises currently use the rest interval from the preceding exercise.',
				'Exercise timers need sound.',
			],
			whatIsNext: [
				'Update the UI and improve desktop responsiveness for navigation elements.',
				'Add an option to keep the screen awake while the app is active.',
			],
			lessonsLearned: '',
		},
	},
	{
		id: 6,
		agentic: false,
		title: 'Scream Recorder',
		tagline: 'Making the Void a sharing space',
		description: 'Record and share the screams of your life with friends on a community board. Like, comment, and sync screams with your Google calendar so you can remember them in context.',
		stack: ['react native', 'TypeScript'],
		role: 'Solo Developer',
		achievement: '',
		imageUrl: feature04,
		longForm: {
			platform: '',
			implementation: '',
			currentStatus: '',
			whatItIs: '',
			whatItSolves: '',
			howItDoesIt: '',
			features: '',
			whatIDid: '',
			knownBugs: '',
			whatIsNext: '',
			lessonsLearned: '',
		},
	},
	{
		id: 7,
		agentic: true,
		title: 'Scavenger Hunt',
		tagline: 'Create, navigate, and track a scavenger hunt',
		description: 'A mobile app that takes a user through a customized scavenger hunt. Originally built as a birthday gift, the app sports a 16-bit inspired retro theme.',
		stack: [],
		role: 'Agentic SDLC',
		achievement: '',
		imageUrl: feature05,
		longForm: {
			platform: '',
			implementation: '',
			currentStatus: '',
			whatItIs: '',
			whatItSolves: '',
			howItDoesIt: '',
			features: '',
			whatIDid: '',
			knownBugs: '',
			whatIsNext: '',
			lessonsLearned: '',
		},
	},
	{
		id: 8,
		agentic: true,
		title: 'No Guts No Glory',
		tagline: 'A daily tracking and monitoring tool for gastritis',
		description: 'Over 2 million people in the U.S. suffer from gastritis. No Guts No Glory lets users define, weight, and track stressors, symptoms, and recovery factors.',
		stack: [],
		role: 'Agentic SDLC',
		achievement: '',
		imageUrl: feature06,
		longForm: {
			platform: 'Mobile (Android)',
			implementation: 'ChatGPT (previous user logging history and planning), Claude Code',
			currentStatus: '',
			whatItIs: 'No Guts No Glory is a personalized gastritis symptom and risk trend tracking mobile application made for a loved one who eschews wearables and wanted a quick way to assess flare-up risk based on known stressors, recovery factors, and symptoms. It is customizable and intended for general trends only, not medical guidance.',
			whatItSolves: 'Provides a user-friendly daily tracker and trends for gastritis stressors and recovery factors.',
			howItDoesIt: 'Users weight stress and recovery factors on a 1–10 scale. The recovery total is capped at a 30% reduction in overall stress load per day. The calculated load is rolled into a 72-hour average and tracked against a user-set target (approximately 50% of total possible load). The rolling average is plotted across weeks on a Trends tab, and data can be exported for a clinician as observed stressors and trends to inform management.',
			features: [
				'List of common stressors, recovery factors, and symptoms, with options to add custom entries and adjust the overall stress/load target',
				'Fully customizable weights for stressors and recovery factors',
				'Quick-tap interface for daily logging',
				'Rolling 72-hour load average with long-term trends tab',
				'PDF export report of rolling load averages and most common stressors',
			],
			whatIDid: [
				<><strong>Customizable inputs:</strong> Gastritis stress and recovery factors are highly individual and can change over time. Weights and values (stressors, recovery factors, and symptoms) can be edited after onboarding, and users can adjust their stress target as their experience and relationship to their condition changes.</>,
				<><strong>Quick, efficient tracking flow:</strong> Designed tracking to be a light lift amid the many demands of health tracking. Daily notifications surface common stressors for logging in a few taps without opening the app. In-app logging is similarly quick: tapping a stressor once registers “mild,” and one or two additional taps change it to “moderate” or “severe” (or back to “mild”). Missed logs appear at the top of the logbook as buttons for easy catch-up.</>,
			],
			knownBugs: '',
			whatIsNext: [
				'Allow users to edit past completed logs.',
				'Add more comprehensive, detailed export reports and the ability to email or share them directly (currently reports can only be downloaded).',
			],
			lessonsLearned: '',
		},
	},
];

export function getCaseStudySlug(title: string) {
	return title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function hasLongFormContent(study: (typeof caseStudies)[number]) {
	const hasContent = (value: unknown): boolean => {
		if (typeof value === 'string') {
			return value.trim() !== '';
		}

		if (Array.isArray(value)) {
			return value.some(hasContent);
		}

		return isValidElement(value);
	};

	return Object.values(study.longForm).some(hasContent);
}