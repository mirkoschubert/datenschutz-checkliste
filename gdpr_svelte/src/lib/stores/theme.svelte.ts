export type Theme = 'light' | 'dark';

class ThemeState {
	current = $state<Theme>('light');

	constructor() {
		if (typeof window !== 'undefined') {
			this.loadFromStorage();
			this.applyTheme();
		}
	}

	toggle() {
		this.current = this.current === 'light' ? 'dark' : 'light';
		this.applyTheme();
		this.saveToStorage();
	}

	setTheme(theme: Theme) {
		this.current = theme;
		this.applyTheme();
		this.saveToStorage();
	}

	private applyTheme() {
		if (typeof document === 'undefined') return;
		document.documentElement.setAttribute('data-theme', this.current);
	}

	private saveToStorage() {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('gdpr_theme', this.current);
	}

	private loadFromStorage() {
		if (typeof localStorage === 'undefined') return;

		const savedTheme = localStorage.getItem('gdpr_theme');
		if (savedTheme === 'light' || savedTheme === 'dark') {
			this.current = savedTheme;
		} else {
			// Check system preference
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.current = 'dark';
			}
		}
	}
}

export const theme = new ThemeState();
