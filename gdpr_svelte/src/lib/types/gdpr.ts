export interface ChecklistItem {
	id: string;
	title: string;
	description: string;
	required: boolean;
	weight: number;
	legalBasis: string[];
	implementation: string[];
}

export interface Category {
	id: string;
	title: string;
	icon: string;
	description: string;
	items: ChecklistItem[];
}

export interface GDPRData {
	version?: string;
	lastUpdated?: string;
	title?: string;
	subtitle?: string;
	categories: Category[];
}

export interface AssessmentResponse {
	[itemId: string]: boolean;
}

export interface ScoringConfig {
	weights: {
		required: number;
		optional: number;
	};
	thresholds: {
		excellent: number;
		good: number;
		moderate: number;
		poor: number;
	};
	labels: {
		[lang: string]: {
			[level: string]: string;
		};
	};
	descriptions: {
		[lang: string]: {
			[level: string]: string;
		};
	};
}

export interface AssessmentExport {
	version: string;
	timestamp: string;
	language: Language;
	responses: AssessmentResponse;
	ignoredItems: string[];
	scores: {
		completed: number;
		total: number;
		currentScore: number;
		maxScore: number;
		percentage: number;
	};
}

export type Language = 'en' | 'de';
export type Theme = 'light' | 'dark';
export type NavigationSection = 'assessment' | 'overview' | 'export';
export type ComplianceLevel = 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
