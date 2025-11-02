import type { ChecklistItem, AssessmentResponse, Language, ComplianceLevel } from '$lib/types/gdpr';
import { gdprData, scoringConfig } from '$lib/data/gdpr-data';

class AssessmentState {
	responses = $state<AssessmentResponse>({});
	ignoredItems = $state<Set<string>>(new Set());
	currentLang = $state<Language>('en');

	constructor() {
		if (typeof window !== 'undefined') {
			this.loadFromStorage();
		}
	}

	get data() {
		return gdprData[this.currentLang];
	}

	get allItems(): ChecklistItem[] {
		const items: ChecklistItem[] = [];
		this.data.categories.forEach((cat) => {
			items.push(...cat.items);
		});
		return items;
	}

	get totalItems(): number {
		return this.allItems.filter((item) => !this.ignoredItems.has(item.id)).length;
	}

	get completedItems(): number {
		return Object.keys(this.responses).filter((id) => !this.ignoredItems.has(id)).length;
	}

	get progressPercentage(): number {
		return this.totalItems > 0 ? (this.completedItems / this.totalItems) * 100 : 0;
	}

	get currentScore(): number {
		let score = 0;
		this.allItems.forEach((item) => {
			if (this.responses[item.id] && !this.ignoredItems.has(item.id)) {
				const weight = item.required
					? item.weight * scoringConfig.weights.required
					: item.weight * scoringConfig.weights.optional;
				score += weight;
			}
		});
		return score;
	}

	get maxScore(): number {
		let max = 0;
		this.allItems.forEach((item) => {
			if (!this.ignoredItems.has(item.id)) {
				const weight = item.required
					? item.weight * scoringConfig.weights.required
					: item.weight * scoringConfig.weights.optional;
				max += weight;
			}
		});
		return max;
	}

	get scorePercentage(): number {
		return this.maxScore > 0 ? (this.currentScore / this.maxScore) * 100 : 0;
	}

	get complianceLevel(): ComplianceLevel {
		const score = this.scorePercentage;

		if (score >= scoringConfig.thresholds.excellent) return 'excellent';
		if (score >= scoringConfig.thresholds.good) return 'good';
		if (score >= scoringConfig.thresholds.moderate) return 'moderate';
		if (score >= scoringConfig.thresholds.poor) return 'poor';
		return 'critical';
	}

	toggleItem(itemId: string) {
		if (this.ignoredItems.has(itemId)) return;

		if (this.responses[itemId]) {
			delete this.responses[itemId];
		} else {
			this.responses[itemId] = true;
		}

		this.saveToStorage();
	}

	ignoreItem(itemId: string) {
		this.ignoredItems.add(itemId);
		delete this.responses[itemId];
		this.saveToStorage();
	}

	unignoreItem(itemId: string) {
		this.ignoredItems.delete(itemId);
		this.saveToStorage();
	}

	setLanguage(lang: Language) {
		this.currentLang = lang;
		this.saveToStorage();
	}

	resetAssessment() {
		this.responses = {};
		this.ignoredItems = new Set();
		this.saveToStorage();
	}

	getCategoryScores() {
		return this.data.categories.map((category) => {
			const completedCount = category.items.filter((item) => this.responses[item.id]).length;
			const totalCount = category.items.length;
			const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

			let level: 'low' | 'medium' | 'high' = 'low';
			if (percentage >= 80) level = 'high';
			else if (percentage >= 60) level = 'medium';

			return {
				id: category.id,
				title: category.title,
				completed: completedCount,
				total: totalCount,
				percentage: Math.round(percentage),
				level: level
			};
		});
	}

	getRecommendations() {
		const recommendations: Array<{
			title: string;
			category: string;
			description: string;
			priority: number;
		}> = [];

		this.data.categories.forEach((category) => {
			category.items.forEach((item) => {
				if (!this.responses[item.id] && item.required) {
					recommendations.push({
						title: item.title,
						category: category.title,
						description: item.description.substring(0, 150) + '...',
						priority: item.weight
					});
				}
			});
		});

		// Sort by priority (weight) descending
		recommendations.sort((a, b) => b.priority - a.priority);

		// Return top 5 recommendations
		return recommendations.slice(0, 5);
	}

	exportData() {
		return {
			version: '1.0',
			timestamp: new Date().toISOString(),
			language: this.currentLang,
			responses: this.responses,
			ignoredItems: [...this.ignoredItems],
			scores: {
				completed: this.completedItems,
				total: this.totalItems,
				currentScore: this.currentScore,
				maxScore: this.maxScore,
				percentage: this.scorePercentage
			}
		};
	}

	importData(data: any): boolean {
		try {
			if (data.version && data.responses) {
				this.responses = data.responses;

				if (data.ignoredItems) {
					this.ignoredItems = new Set(data.ignoredItems);
				}

				if (data.language) {
					this.setLanguage(data.language);
				}

				this.saveToStorage();
				return true;
			}
		} catch (error) {
			console.error('Error importing data:', error);
		}
		return false;
	}

	private saveToStorage() {
		if (typeof localStorage === 'undefined') return;

		localStorage.setItem('gdpr_responses', JSON.stringify(this.responses));
		localStorage.setItem('gdpr_ignored', JSON.stringify([...this.ignoredItems]));
		localStorage.setItem('gdpr_language', this.currentLang);
	}

	private loadFromStorage() {
		if (typeof localStorage === 'undefined') return;

		// Load language
		const savedLang = localStorage.getItem('gdpr_language');
		if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
			this.currentLang = savedLang;
		}

		// Load responses
		const savedResponses = localStorage.getItem('gdpr_responses');
		if (savedResponses) {
			try {
				this.responses = JSON.parse(savedResponses);
			} catch (e) {
				console.error('Error loading responses:', e);
			}
		}

		// Load ignored items
		const savedIgnored = localStorage.getItem('gdpr_ignored');
		if (savedIgnored) {
			try {
				this.ignoredItems = new Set(JSON.parse(savedIgnored));
			} catch (e) {
				console.error('Error loading ignored items:', e);
			}
		}
	}
}

export const assessment = new AssessmentState();
