<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';

	interface Props {
		showDetails?: boolean;
	}

	let { showDetails = true }: Props = $props();

	let progress = $derived(assessment.progressPercentage);
	let score = $derived(assessment.scorePercentage);
	let level = $derived(assessment.complianceLevel);

	const levelColors = {
		excellent: 'var(--color-success)',
		good: '#10b981',
		moderate: '#f59e0b',
		poor: '#f97316',
		critical: 'var(--color-danger)'
	};

	const levelLabels = {
		excellent: 'Excellent',
		good: 'Good',
		moderate: 'Moderate',
		poor: 'Poor',
		critical: 'Critical'
	};
</script>

<div class="progress-container">
	<div class="progress-header">
		<div class="progress-info">
			<h3 class="progress-title">Overall Progress</h3>
			{#if showDetails}
				<p class="progress-subtitle">
					{assessment.completedItems} of {assessment.totalItems} items completed
				</p>
			{/if}
		</div>
		<div class="progress-percentage">{Math.round(progress)}%</div>
	</div>

	<div class="progress-bar">
		<div class="progress-fill" style="width: {progress}%"></div>
	</div>

	{#if showDetails}
		<div class="compliance-level">
			<div class="level-badge" style="background: {levelColors[level]}">
				{levelLabels[level]} Compliance
			</div>
			<div class="score-text">
				Score: {Math.round(score)}% ({Math.round(assessment.currentScore)}/{Math.round(
					assessment.maxScore
				)} points)
			</div>
		</div>
	{/if}
</div>

<style>
	.progress-container {
		background: var(--color-card-bg);
		border-radius: 1rem;
		padding: 1.5rem;
		border: 1px solid var(--color-border);
	}

	.progress-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.progress-info {
		flex: 1;
	}

	.progress-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.progress-subtitle {
		margin: 0.25rem 0 0 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.progress-percentage {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1;
	}

	.progress-bar {
		width: 100%;
		height: 1rem;
		background: var(--color-bg-secondary);
		border-radius: 0.5rem;
		overflow: hidden;
		position: relative;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), var(--color-success));
		transition: width 0.5s ease;
		border-radius: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	.progress-fill::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.3),
			transparent
		);
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.compliance-level {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 1rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.level-badge {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		color: white;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.score-text {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-weight: 500;
	}
</style>
