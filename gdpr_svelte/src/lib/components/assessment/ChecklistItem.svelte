<script lang="ts">
	import type { ChecklistItem as ChecklistItemType } from '$lib/types/gdpr';
	import { assessment } from '$lib/stores/assessment.svelte';

	interface Props {
		item: ChecklistItemType;
	}

	let { item }: Props = $props();

	let isCompleted = $derived(!!assessment.responses[item.id]);
	let isIgnored = $derived(assessment.ignoredItems.has(item.id));

	function toggleItem() {
		assessment.toggleItem(item.id);
	}

	function ignoreItem(e: Event) {
		e.stopPropagation();
		if (confirm('Are you sure you want to ignore this item?')) {
			assessment.ignoreItem(item.id);
		}
	}

	function unignoreItem(e: Event) {
		e.stopPropagation();
		assessment.unignoreItem(item.id);
	}
</script>

<div
	class="checklist-item {isCompleted ? 'completed' : ''} {isIgnored ? 'ignored' : ''}"
	onclick={toggleItem}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleItem();
		}
	}}
	role="checkbox"
	aria-checked={isCompleted}
	tabindex="0"
>
	<div class="item-header">
		<div class="checkbox">
			{#if isCompleted}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M13.3333 4L6 11.3333L2.66667 8"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
		</div>
		<div class="item-content">
			<div class="item-title-row">
				<h4 class="item-title">
					{item.title}
					{#if item.required}
						<span class="required-badge">Required</span>
					{/if}
				</h4>
				{#if !isIgnored}
					<button class="ignore-btn" onclick={ignoreItem} title="Ignore this item">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path
								d="M2 2L14 14M14 2L2 14"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				{:else}
					<button class="unignore-btn" onclick={unignoreItem} title="Unignore this item">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path
								d="M8 2V14M2 8H14"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				{/if}
			</div>
			<p class="item-description">{item.description}</p>
			{#if item.explanation && item.explanation.length > 0}
				<details class="item-details">
					<summary>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="details-icon">
							<path
								d="M4 6l4 4 4-4"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						Detailed Information
					</summary>
					<div class="details-content">
						<ul class="explanation-list">
							{#each item.explanation as point}
								<li>{point}</li>
							{/each}
						</ul>
						
						{#if item.legalBasis && item.legalBasis.length > 0}
							<div class="legal-info">
								<strong>Legal Basis:</strong>
								<ul class="legal-list">
									{#each item.legalBasis as basis}
										<li>{basis}</li>
									{/each}
								</ul>
							</div>
						{/if}
						
						{#if item.legitimationReason && item.legitimationReason.length > 0}
							<div class="legal-info">
								<strong>Legitimation:</strong>
								<ul class="legal-list">
									{#each item.legitimationReason as reason}
										<li>{reason}</li>
									{/each}
								</ul>
							</div>
						{/if}
						
						{#if item.implementation && item.implementation.length > 0}
							<div class="implementation-info">
								<strong>Implementation Tips:</strong>
								<ul class="implementation-list">
									{#each item.implementation as tip}
										<li>{tip}</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</details>
			{/if}
		</div>
	</div>
</div>

<style>
	.checklist-item {
		background: var(--color-card-bg);
		border: 2px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.checklist-item:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-sm);
		transform: translateX(4px);
	}

	.checklist-item.completed {
		border-color: var(--color-success);
		background: var(--color-success-light);
	}

	.checklist-item.ignored {
		opacity: 0.5;
		cursor: default;
	}

	.checklist-item.ignored:hover {
		transform: none;
	}

	.item-header {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.checkbox {
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		border: 2px solid var(--color-border);
		border-radius: 0.375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg);
		transition: all 0.2s ease;
	}

	.completed .checkbox {
		background: var(--color-success);
		border-color: var(--color-success);
		color: white;
	}

	.item-content {
		flex: 1;
		min-width: 0;
	}

	.item-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.item-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
	}

	.required-badge {
		display: inline-block;
		background: var(--color-danger);
		color: white;
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.item-description {
		margin: 0.5rem 0 0 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.item-details {
		margin-top: 0.75rem;
		border-top: 1px solid var(--color-border);
		padding-top: 0.75rem;
	}

	.item-details summary {
		color: var(--color-primary);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		user-select: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.item-details summary:hover {
		background: var(--color-bg-secondary);
	}

	.item-details[open] summary {
		margin-bottom: 0.75rem;
	}

	.details-icon {
		transition: transform 0.2s ease;
	}

	.item-details[open] .details-icon {
		transform: rotate(180deg);
	}

	.details-content {
		padding: 0.5rem 1rem;
		background: var(--color-bg-secondary);
		border-radius: 0.5rem;
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

	.explanation-list,
	.legal-list,
	.implementation-list {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		list-style: disc;
	}

	.explanation-list li,
	.legal-list li,
	.implementation-list li {
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.legal-info,
	.implementation-info {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--color-border);
	}

	.legal-info strong,
	.implementation-info strong {
		display: block;
		color: var(--color-text);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.legal-list {
		list-style: none;
		padding-left: 1rem;
	}

	.legal-list li {
		position: relative;
		padding-left: 1rem;
	}

	.legal-list li::before {
		content: '§';
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-weight: 600;
	}

	.implementation-list {
		list-style: none;
		padding-left: 1rem;
	}

	.implementation-list li {
		position: relative;
		padding-left: 1.5rem;
	}

	.implementation-list li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--color-success);
		font-weight: 600;
	}

	.ignore-btn,
	.unignore-btn {
		background: none;
		border: none;
		padding: 0.25rem;
		cursor: pointer;
		color: var(--color-text-secondary);
		display: flex;
		align-items: center;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.ignore-btn:hover {
		background: var(--color-danger-light);
		color: var(--color-danger);
	}

	.unignore-btn:hover {
		background: var(--color-success-light);
		color: var(--color-success);
	}
</style>
