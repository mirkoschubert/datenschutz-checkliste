<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { jsPDF } from 'jspdf';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen = $bindable(), onClose }: Props = $props();

	function exportJSON() {
		const data = assessment.exportData();
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `gdpr-assessment-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
		onClose();
	}

	function exportPDF() {
		const doc = new jsPDF();
		const data = assessment.data;
		let y = 20;

		// Title
		doc.setFontSize(20);
		doc.text('GDPR Compliance Assessment', 20, y);
		y += 15;

		// Metadata
		doc.setFontSize(10);
		doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);
		y += 6;
		doc.text(`Language: ${assessment.currentLang.toUpperCase()}`, 20, y);
		y += 10;

		// Summary
		doc.setFontSize(14);
		doc.text('Summary', 20, y);
		y += 8;

		doc.setFontSize(10);
		doc.text(
			`Progress: ${Math.round(assessment.progressPercentage)}% (${assessment.completedItems}/${assessment.totalItems} items)`,
			20,
			y
		);
		y += 6;
		doc.text(
			`Compliance Score: ${Math.round(assessment.scorePercentage)}% - ${assessment.complianceLevel.toUpperCase()}`,
			20,
			y
		);
		y += 15;

		// Categories
		data.categories.forEach((category) => {
			if (y > 270) {
				doc.addPage();
				y = 20;
			}

			doc.setFontSize(12);
			doc.text(category.title, 20, y);
			y += 7;

			const completedCount = category.items.filter((item) => assessment.responses[item.id]).length;
			doc.setFontSize(9);
			doc.text(`${completedCount}/${category.items.length} completed`, 25, y);
			y += 10;

			category.items.forEach((item) => {
				if (y > 270) {
					doc.addPage();
					y = 20;
				}

				const isCompleted = assessment.responses[item.id];
				doc.setFontSize(9);
				doc.text(isCompleted ? '☑' : '☐', 25, y);
				doc.text(item.title, 32, y, { maxWidth: 160 });
				y += 6;
			});

			y += 5;
		});

		doc.save(`gdpr-assessment-${new Date().toISOString().split('T')[0]}.pdf`);
		onClose();
	}

	let fileInput: HTMLInputElement;

	function handleImportClick() {
		fileInput?.click();
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string);
				if (assessment.importData(data)) {
					alert('Assessment data imported successfully!');
					onClose();
				} else {
					alert('Failed to import data. Please check the file format.');
				}
			} catch (error) {
				alert('Invalid file format.');
			}
		};
		reader.readAsText(file);
	}
</script>

<Modal {isOpen} {onClose} title="Export & Import" size="md">
	<div class="export-section">
		<h3>Export Assessment</h3>
		<p>Download your assessment progress to save or share.</p>

		<div class="button-grid">
			<Button variant="primary" onclick={exportJSON}>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
						d="M10 14V6m0 8l-3-3m3 3l3-3M3 17h14"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Export JSON
			</Button>

			<Button variant="secondary" onclick={exportPDF}>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
						d="M9 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L13 1.586A2 2 0 0011.586 1H9z"
						stroke="currentColor"
						stroke-width="1.5"
					/>
					<path d="M12 2v4h4" stroke="currentColor" stroke-width="1.5" />
				</svg>
				Export PDF
			</Button>
		</div>
	</div>

	<div class="divider"></div>

	<div class="import-section">
		<h3>Import Assessment</h3>
		<p>Load a previously saved assessment from a JSON file.</p>

		<input
			type="file"
			accept=".json"
			bind:this={fileInput}
			onchange={handleFileChange}
			style="display: none"
		/>

		<Button variant="secondary" onclick={handleImportClick}>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M10 6v8m0-8l-3 3m3-3l3 3M3 3h14"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Import from JSON
		</Button>
	</div>
</Modal>

<style>
	.export-section,
	.import-section {
		margin-bottom: 1.5rem;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text);
	}

	p {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.button-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.divider {
		height: 1px;
		background: var(--color-border);
		margin: 2rem 0;
	}
</style>
