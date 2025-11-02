<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		onclick?: () => void;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		onclick,
		type = 'button',
		class: className = '',
		children
	}: Props = $props();
</script>

<button
	{type}
	{disabled}
	onclick={onclick}
	class="btn btn-{variant} btn-{size} {className}"
>
	{@render children()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.btn-md {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
	}

	.btn-lg {
		padding: 1rem 2rem;
		font-size: 1.125rem;
	}

	/* Variants */
	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-dark);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
	}

	.btn-secondary {
		background: var(--color-bg-secondary);
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-bg-tertiary);
		transform: translateY(-1px);
	}

	.btn-danger {
		background: var(--color-danger);
		color: white;
	}

	.btn-danger:hover:not(:disabled) {
		background: var(--color-danger-dark);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
	}

	.btn-ghost {
		background: transparent;
		color: var(--color-text);
	}

	.btn-ghost:hover:not(:disabled) {
		background: var(--color-bg-secondary);
	}
</style>
