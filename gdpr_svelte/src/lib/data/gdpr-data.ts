import type { GDPRData, ScoringConfig } from '$lib/types/gdpr';
import enData from './en.json';
import deData from './de.json';

export const gdprData: Record<'en' | 'de', GDPRData> = {
	en: enData as GDPRData,
	de: deData as GDPRData
};

export const scoringConfig: ScoringConfig = {
	weights: {
		required: 1.0,
		optional: 0.5
	},
	thresholds: {
		excellent: 90,
		good: 75,
		moderate: 60,
		poor: 40
	},
	labels: {
		en: {
			excellent: 'Excellent Compliance',
			good: 'Good Compliance',
			moderate: 'Moderate Compliance',
			poor: 'Poor Compliance',
			critical: 'Critical Issues'
		},
		de: {
			excellent: 'Ausgezeichnete Konformität',
			good: 'Gute Konformität',
			moderate: 'Moderate Konformität',
			poor: 'Schlechte Konformität',
			critical: 'Kritische Probleme'
		}
	},
	descriptions: {
		en: {
			excellent: 'Your website demonstrates excellent GDPR compliance across all categories.',
			good: 'Your website shows good GDPR compliance with minor areas for improvement.',
			moderate: 'Your website has moderate compliance but requires attention in several areas.',
			poor: 'Your website has significant compliance gaps that need immediate attention.',
			critical: 'Your website has critical compliance issues requiring urgent action.'
		},
		de: {
			excellent: 'Ihre Website zeigt ausgezeichnete DSGVO-Konformität in allen Bereichen.',
			good: 'Ihre Website zeigt gute DSGVO-Konformität mit geringfügigen Verbesserungsmöglichkeiten.',
			moderate:
				'Ihre Website hat moderate Konformität, benötigt aber Aufmerksamkeit in mehreren Bereichen.',
			poor: 'Ihre Website hat erhebliche Konformitätslücken, die sofortige Aufmerksamkeit erfordern.',
			critical: 'Ihre Website hat kritische Konformitätsprobleme, die dringendes Handeln erfordern.'
		}
	}
};
