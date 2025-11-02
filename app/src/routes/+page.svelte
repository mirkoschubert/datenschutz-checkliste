<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ProgressBar from '$lib/components/assessment/ProgressBar.svelte';
	import CategoryCard from '$lib/components/assessment/CategoryCard.svelte';
	import ExportModal from '$lib/components/export/ExportModal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let showExportModal = $state(false);
	let showRecommendations = $state(false);

	function handleReset() {
		if (
			confirm(
				'Are you sure you want to reset all responses? This action cannot be undone.'
			)
		) {
			assessment.resetAssessment();
		}
	}

	let categoryScores = $derived(assessment.getCategoryScores());
	let recommendations = $derived(assessment.getRecommendations());
</script>

<svelte:head>
	<title>GDPR Compliance Checker</title>
	<meta
		name="description"
		content="Comprehensive GDPR compliance assessment tool for organizations"
	/>
</svelte:head>

<div class="app">
	<Header />

	<main class="main">
		<div class="container">
			<!-- Hero Section -->
			<section class="hero">
				<h1 class="hero-title">GDPR Compliance Assessment</h1>
				<p class="hero-subtitle">
					Evaluate your organization's data privacy practices and improve GDPR compliance
				</p>
			</section>

			<!-- Progress Section -->
			<section class="progress-section">
				<ProgressBar showDetails={true} />
			</section>

			<!-- Actions Section -->
			<section class="actions-section">
				<Button variant="primary" onclick={() => (showExportModal = true)}>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Export & Import
				</Button>

				<Button variant="danger" onclick={handleReset}>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Reset Assessment
				</Button>
			</section>

			<!-- Recommendations Section -->
			{#if recommendations.length > 0}
				<section class="recommendations-section">
					<Card padding="lg">
						<div
							class="recommendations-header"
							role="button"
							tabindex="0"
							onclick={() => (showRecommendations = !showRecommendations)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									showRecommendations = !showRecommendations;
								}
							}}
						>
							<h2 class="section-title">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										d="M13 10V3L4 14h7v7l9-11h-7z"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								Priority Recommendations
								<span class="rec-count">({recommendations.length})</span>
							</h2>
							<button
								class="expand-toggle"
								type="button"
								aria-label={showRecommendations ? 'Collapse recommendations' : 'Expand recommendations'}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									style="transform: rotate({showRecommendations ? 180 : 0}deg)"
								>
									<path
										d="M5 7.5l5 5 5-5"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						</div>
						
						{#if showRecommendations}
							<div class="recommendations-content">
								<p class="section-description">
									Focus on these required items to improve your compliance score
								</p>

								<div class="recommendations-grid">
									{#each recommendations as rec}
										<div class="recommendation-card">
											<div class="rec-header">
												<h4 class="rec-title">{rec.title}</h4>
												<span class="rec-category">{rec.category}</span>
											</div>
											<p class="rec-description">{rec.description}</p>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</Card>
				</section>
			{/if}

			<!-- Category Overview -->
			<section class="overview-section">
				<h2 class="section-title">Category Overview</h2>
				<div class="category-grid">
					{#each categoryScores as score}
						<Card padding="md">
							<div class="category-score">
								<h3 class="category-score-title">{score.title}</h3>
								<div class="score-bar">
									<div
										class="score-fill level-{score.level}"
										style="width: {score.percentage}%"
									></div>
								</div>
								<p class="score-text">
									{score.completed}/{score.total} completed ({score.percentage}%)
								</p>
							</div>
						</Card>
					{/each}
				</div>
			</section>

			<!-- Categories Section -->
			<section class="categories-section">
				<h2 class="section-title">Checklist Categories</h2>
				<p class="section-description">
					Click on each category to expand and review individual compliance items
				</p>

				<div class="categories-list">
					{#each assessment.data.categories as category (category.id)}
						<CategoryCard {category} defaultExpanded={false} />
					{/each}
				</div>
			</section>
		</div>
	</main>

	<Footer />

	<ExportModal bind:isOpen={showExportModal} onClose={() => (showExportModal = false)} />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--color-bg);
	}

	.main {
		flex: 1;
		padding: 2rem 0;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
	}

	.hero-title {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--color-text);
		background: linear-gradient(135deg, var(--color-primary), var(--color-success));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		margin: 1rem auto 0;
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		max-width: 600px;
	}

	.progress-section {
		margin-bottom: 2rem;
	}

	.actions-section {
		display: flex;
		gap: 1rem;
		margin-bottom: 3rem;
		flex-wrap: wrap;
	}

	.section-title {
		margin: 0 0 0.5rem 0;
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.section-description {
		margin: 0 0 1.5rem 0;
		font-size: 1rem;
		color: var(--color-text-secondary);
	}

	.recommendations-section {
		margin-bottom: 3rem;
	}

	.recommendations-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		user-select: none;
		padding: 0.5rem;
		margin: -0.5rem;
		border-radius: 0.5rem;
		transition: background-color 0.2s ease;
	}

	.recommendations-header:hover {
		background: var(--color-bg-secondary);
	}

	.recommendations-header .section-title {
		margin: 0;
		flex: 1;
	}

	.rec-count {
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		margin-left: 0.5rem;
	}

	.expand-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 0.25rem;
		color: var(--color-text-secondary);
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.expand-toggle:hover {
		background: var(--color-bg);
		color: var(--color-primary);
	}

	.expand-toggle svg {
		transition: transform 0.3s ease;
	}

	.recommendations-content {
		margin-top: 1rem;
		animation: slideDown 0.3s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.recommendations-grid {
		display: grid;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.recommendation-card {
		background: var(--color-bg-secondary);
		padding: 1rem;
		border-radius: 0.5rem;
		border-left: 4px solid var(--color-danger);
	}

	.rec-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.rec-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		flex: 1;
	}

	.rec-category {
		background: var(--color-primary);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.rec-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.overview-section {
		margin-bottom: 3rem;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.category-score {
		text-align: center;
	}

	.category-score-title {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.score-bar {
		width: 100%;
		height: 0.5rem;
		background: var(--color-bg-secondary);
		border-radius: 0.25rem;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.score-fill {
		height: 100%;
		transition: width 0.3s ease;
	}

	.score-fill.level-low {
		background: var(--color-danger);
	}

	.score-fill.level-medium {
		background: #f59e0b;
	}

	.score-fill.level-high {
		background: var(--color-success);
	}

	.score-text {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.categories-section {
		margin-bottom: 3rem;
	}

	.categories-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2rem;
		}

		.hero-subtitle {
			font-size: 1rem;
		}

		.category-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
