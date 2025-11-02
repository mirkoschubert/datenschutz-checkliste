import type { Language } from '$lib/types/gdpr';

class LanguageState {
	current = $state<Language>('en');

	constructor() {
		if (typeof window !== 'undefined') {
			this.loadFromStorage();
		}
	}

	toggle() {
		this.current = this.current === 'en' ? 'de' : 'en';
		this.saveToStorage();
	}

	setLanguage(lang: Language) {
		this.current = lang;
		this.saveToStorage();
	}

	private saveToStorage() {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('gdpr_language', this.current);
	}

	private loadFromStorage() {
		if (typeof localStorage === 'undefined') return;

		const savedLang = localStorage.getItem('gdpr_language');
		if (savedLang === 'en' || savedLang === 'de') {
			this.current = savedLang;
		} else {
			// Detect browser language
			const browserLang = navigator.language.toLowerCase();
			if (browserLang.startsWith('de')) {
				this.current = 'de';
			}
		}
	}
}

export const language = new LanguageState();
