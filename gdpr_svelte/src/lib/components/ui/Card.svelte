<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		padding?: 'none' | 'sm' | 'md' | 'lg';
		interactive?: boolean;
		onclick?: () => void;
		class?: string;
		children: Snippet;
	}

	let {
		title,
		padding = 'md',
		interactive = false,
		onclick,
		class: className = '',
		children
	}: Props = $props();
</script>

<div
	class="card padding-{padding} {interactive ? 'interactive' : ''} {className}"
	onclick={interactive ? onclick : undefined}
	onkeydown={interactive
		? (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onclick?.();
				}
			}
		: undefined}
	role={interactive ? 'button' : undefined}
	tabindex={interactive ? '0' : undefined}
>
	{#if title}
		<h3 class="card-title">{title}</h3>
	{/if}
	{@render children()}
</div>

<style>
	.card {
		background: var(--color-card-bg);
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-sm);
		transition: all 0.2s ease;
	}

	.card-title {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.interactive {
		cursor: pointer;
	}

	.interactive:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
		border-color: var(--color-primary);
	}

	.interactive:active {
		transform: translateY(0);
	}

	/* Padding variants */
	.padding-none {
		padding: 0;
	}

	.padding-sm {
		padding: 1rem;
	}

	.padding-md {
		padding: 1.5rem;
	}

	.padding-lg {
		padding: 2rem;
	}
</style>
