<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-section">
				<h3>GDPR Compliance Checker</h3>
				<p>
					A comprehensive tool to assess and improve your organization's GDPR compliance status.
				</p>
			</div>

			<div class="footer-section">
				<h4>Resources</h4>
				<ul>
					<li>
						<a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer">GDPR Official Site</a
						>
					</li>
					<li>
						<a
							href="https://commission.europa.eu/law/law-topic/data-protection_en"
							target="_blank"
							rel="noopener noreferrer">EU Data Protection</a
						>
					</li>
					<li>
						<a
							href="https://www.dataprivacyframework.gov/"
							target="_blank"
							rel="noopener noreferrer">Data Privacy Framework</a
						>
					</li>
				</ul>
			</div>

			<div class="footer-section">
				<h4>About</h4>
				<p class="disclaimer">
					This tool provides guidance only. For legal compliance advice, please consult with a
					qualified legal professional.
				</p>
			</div>
		</div>

		<div class="footer-bottom">
			<p>© {currentYear} GDPR Compliance Checker. Open Source.</p>
			<p>
				Made with <span class="heart">♥</span> for data privacy
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-card-bg);
		border-top: 1px solid var(--color-border);
		margin-top: 4rem;
		padding: 3rem 0 1.5rem 0;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.footer-section h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.footer-section h4 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.footer-section p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.footer-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.footer-section li {
		margin-bottom: 0.5rem;
	}

	.footer-section a {
		color: var(--color-primary);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease;
	}

	.footer-section a:hover {
		color: var(--color-primary-dark);
		text-decoration: underline;
	}

	.disclaimer {
		font-size: 0.75rem;
		font-style: italic;
	}

	.footer-bottom {
		border-top: 1px solid var(--color-border);
		padding-top: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.footer-bottom p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.heart {
		color: var(--color-danger);
		animation: heartbeat 1.5s ease-in-out infinite;
	}

	@keyframes heartbeat {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	@media (max-width: 640px) {
		.footer-content {
			grid-template-columns: 1fr;
		}

		.footer-bottom {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
