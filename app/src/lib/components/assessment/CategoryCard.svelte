<script lang="ts">
	import type { Category } from '$lib/types/gdpr';
	import { assessment } from '$lib/stores/assessment.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import ChecklistItem from './ChecklistItem.svelte';

	interface Props {
		category: Category;
		defaultExpanded?: boolean;
	}

	let { category, defaultExpanded = false }: Props = $props();

	let isExpanded = $state(defaultExpanded);

	let completedCount = $derived(
		category.items.filter((item) => assessment.responses[item.id]).length
	);
	let totalCount = $derived(category.items.length);
	let percentage = $derived(totalCount > 0 ? (completedCount / totalCount) * 100 : 0);

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}
</script>

<Card padding="md">
	<button class="category-header" onclick={toggleExpanded}>
		<div class="category-info">
			<h3 class="category-title">
				{category.title}
				<span class="category-count">({completedCount}/{totalCount})</span>
			</h3>
			<p class="category-description">{category.description}</p>
		</div>
		<div class="expand-icon" class:expanded={isExpanded}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M6 9l6 6 6-6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	</button>

	<div class="progress-bar">
		<div class="progress-fill" style="width: {percentage}%"></div>
	</div>

	{#if isExpanded}
		<div class="category-items">
			{#each category.items as item (item.id)}
				<ChecklistItem {item} />
			{/each}
		</div>
	{/if}
</Card>

<style>
	.category-header {
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.category-info {
		flex: 1;
	}

	.category-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.category-count {
		font-size: 1rem;
		color: var(--color-text-secondary);
		font-weight: 400;
	}

	.category-description {
		margin: 0.5rem 0 0 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.expand-icon {
		flex-shrink: 0;
		color: var(--color-text-secondary);
		transition: transform 0.2s ease;
	}

	.expand-icon.expanded {
		transform: rotate(180deg);
	}

	.progress-bar {
		width: 100%;
		height: 0.5rem;
		background: var(--color-bg-secondary);
		border-radius: 0.25rem;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), var(--color-success));
		transition: width 0.3s ease;
	}

	.category-items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}
</style>
