<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { assessment } from '$lib/stores/assessment.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	function toggleTheme() {
		theme.toggle();
	}

	function toggleLanguage() {
		const newLang = assessment.currentLang === 'en' ? 'de' : 'en';
		assessment.setLanguage(newLang);
	}
</script>

<header class="header">
	<div class="container">
		<div class="header-content">
			<div class="logo">
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
					<rect width="32" height="32" rx="8" fill="var(--color-primary)" />
					<path
						d="M16 8v16M10 14h12"
						stroke="white"
						stroke-width="2.5"
						stroke-linecap="round"
					/>
				</svg>
				<div class="logo-text">
					<h1>GDPR Compliance</h1>
					<p>Data Privacy Checker</p>
				</div>
			</div>

			<nav class="nav">
				<Button variant="ghost" size="sm" onclick={toggleLanguage}>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path
							d="M10 18a8 8 0 100-16 8 8 0 000 16z"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M2 10h16M10 2a15.3 15.3 0 014 8 15.3 15.3 0 01-4 8 15.3 15.3 0 01-4-8 15.3 15.3 0 014-8z"
							stroke="currentColor"
							stroke-width="1.5"
						/>
					</svg>
					{assessment.currentLang.toUpperCase()}
				</Button>

				<Button variant="ghost" size="sm" onclick={toggleTheme}>
					{#if theme.current === 'light'}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path
								d="M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
								stroke="currentColor"
								stroke-width="1.5"
							/>
							<path
								d="M10 1v2m0 14v2M1 10h2m14 0h2m-3.343-6.657L14.25 4.75m-8.5 10.5l-1.407 1.407m10.814 0l-1.407-1.407M5.75 4.75L4.343 3.343"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
						</svg>
					{:else}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path
								d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
								stroke="currentColor"
								stroke-width="1.5"
							/>
						</svg>
					{/if}
				</Button>
			</nav>
		</div>
	</div>
</header>

<style>
	.header {
		background: var(--color-card-bg);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(10px);
		background: var(--color-bg-translucent);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 0;
		gap: 1rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo-text h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
		line-height: 1.2;
	}

	.logo-text p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		line-height: 1;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	@media (max-width: 640px) {
		.logo-text h1 {
			font-size: 1rem;
		}

		.logo-text p {
			display: none;
		}
	}
</style>
