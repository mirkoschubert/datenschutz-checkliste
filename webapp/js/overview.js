// Overview functionality for displaying assessment results
class OverviewManager {
    constructor(assessmentManager) {
        this.assessmentManager = assessmentManager;
        this.init();
    }

    init() {
        this.updateOverview();
    }

    updateOverview() {
        this.updateScoreCard();
        this.updateCategoryBreakdown();
        this.updateRecommendations();
    }

    updateScoreCard() {
        const overallScoreElement = document.getElementById('overallScore');
        const scoreTitleElement = document.getElementById('scoreTitle');
        const scoreDescriptionElement = document.getElementById('scoreDescription');
        const scoreCircleElement = document.getElementById('scoreCircle');

        if (!this.assessmentManager || !overallScoreElement) return;

        const scorePercentage = this.assessmentManager.maxScore > 0 
            ? (this.assessmentManager.currentScore / this.assessmentManager.maxScore) * 100 
            : 0;
        
        const roundedScore = Math.round(scorePercentage);
        const complianceLevel = this.assessmentManager.getComplianceLevel();
        const labels = scoringConfig.labels[this.assessmentManager.currentLang];
        const descriptions = scoringConfig.descriptions[this.assessmentManager.currentLang];

        // Update score number
        overallScoreElement.textContent = roundedScore;

        // Update title and description
        if (scoreTitleElement && scoreDescriptionElement) {
            scoreTitleElement.textContent = labels[complianceLevel] || labels.critical;
            scoreDescriptionElement.textContent = descriptions[complianceLevel] || descriptions.critical;
        }

        // Update progress circle
        if (scoreCircleElement) {
            const circumference = 2 * Math.PI * 45; // radius is 45
            const offset = circumference - (scorePercentage / 100) * circumference;
            scoreCircleElement.style.strokeDashoffset = offset;
            
            // Update color based on score
            let color = '#e74c3c'; // red for critical
            if (scorePercentage >= scoringConfig.thresholds.excellent) color = '#27ae60'; // green
            else if (scorePercentage >= scoringConfig.thresholds.good) color = '#42b983'; // teal
            else if (scorePercentage >= scoringConfig.thresholds.moderate) color = '#f39c12'; // orange
            else if (scorePercentage >= scoringConfig.thresholds.poor) color = '#e67e22'; // dark orange
            
            scoreCircleElement.style.stroke = color;
        }
    }

    updateCategoryBreakdown() {
        const breakdownList = document.getElementById('breakdownList');
        if (!breakdownList || !this.assessmentManager) return;

        const categoryScores = this.assessmentManager.getCategoryScores();
        
        breakdownList.innerHTML = categoryScores.map(category => `
            <div class="breakdown-item">
                <div class="breakdown-info">
                    <div class="breakdown-name">${category.title}</div>
                    <div class="breakdown-details">${category.completed}/${category.total} items completed</div>
                </div>
                <div class="breakdown-score ${category.level}">
                    ${category.percentage}%
                </div>
            </div>
        `).join('');
    }

    updateRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        if (!recommendationsList || !this.assessmentManager) return;

        const recommendations = this.assessmentManager.getRecommendations();
        
        if (recommendations.length === 0) {
            recommendationsList.innerHTML = `
                <div class="recommendation-item">
                    <div class="recommendation-title">Great job!</div>
                    <div class="recommendation-description">
                        You've completed all required GDPR compliance items. Consider reviewing optional items to further enhance your compliance.
                    </div>
                </div>
            `;
            return;
        }

        recommendationsList.innerHTML = recommendations.map(recommendation => `
            <div class="recommendation-item">
                <div class="recommendation-title">
                    ${recommendation.title}
                    <span class="recommendation-category">(${recommendation.category})</span>
                </div>
                <div class="recommendation-description">${recommendation.description}</div>
                <div class="recommendation-priority">Priority: ${recommendation.priority}/10</div>
            </div>
        `).join('');
    }

    generateComplianceReport() {
        if (!this.assessmentManager) return null;

        const scorePercentage = this.assessmentManager.maxScore > 0 
            ? (this.assessmentManager.currentScore / this.assessmentManager.maxScore) * 100 
            : 0;

        const complianceLevel = this.assessmentManager.getComplianceLevel();
        const categoryScores = this.assessmentManager.getCategoryScores();
        const recommendations = this.assessmentManager.getRecommendations();
        const labels = scoringConfig.labels[this.assessmentManager.currentLang];
        const descriptions = scoringConfig.descriptions[this.assessmentManager.currentLang];

        return {
            timestamp: new Date().toISOString(),
            language: this.assessmentManager.currentLang,
            overallScore: {
                percentage: Math.round(scorePercentage),
                level: complianceLevel,
                title: labels[complianceLevel],
                description: descriptions[complianceLevel]
            },
            summary: {
                totalItems: this.assessmentManager.totalItems,
                completedItems: this.assessmentManager.completedItems,
                currentScore: this.assessmentManager.currentScore,
                maxScore: this.assessmentManager.maxScore
            },
            categories: categoryScores,
            recommendations: recommendations,
            detailedResponses: this.assessmentManager.responses
        };
    }

    generateHTMLReport() {
        const report = this.generateComplianceReport();
        if (!report) return '';

        const html = `
        <!DOCTYPE html>
        <html lang="${report.language}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GDPR Compliance Report</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
                .score-section { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center; }
                .score-number { font-size: 3rem; font-weight: bold; color: #42b983; }
                .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
                .category-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
                .category-score { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; }
                .high { background: #27ae60; }
                .medium { background: #f39c12; }
                .low { background: #e74c3c; }
                .recommendations { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }
                .recommendation { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #f39c12; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9rem; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>GDPR Compliance Report</h1>
                <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
                <p><strong>Disclaimer:</strong> This report provides general guidance and does not constitute legal advice. Always consult with a qualified lawyer for legal matters.</p>
            </div>

            <div class="score-section">
                <div class="score-number">${report.overallScore.percentage}</div>
                <h2>${report.overallScore.title}</h2>
                <p>${report.overallScore.description}</p>
                <p><strong>${report.summary.completedItems}/${report.summary.totalItems}</strong> compliance items completed</p>
            </div>

            <section>
                <h2>Category Breakdown</h2>
                <div class="category-grid">
                    ${report.categories.map(category => `
                        <div class="category-card">
                            <h3>${category.title}</h3>
                            <div class="category-score ${category.level}">${category.percentage}%</div>
                            <p>${category.completed}/${category.total} items completed</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            ${report.recommendations.length > 0 ? `
            <section class="recommendations">
                <h2>Priority Recommendations</h2>
                ${report.recommendations.map(rec => `
                    <div class="recommendation">
                        <h4>${rec.title}</h4>
                        <p><strong>Category:</strong> ${rec.category}</p>
                        <p>${rec.description}</p>
                        <p><strong>Priority:</strong> ${rec.priority}/10</p>
                    </div>
                `).join('')}
            </section>
            ` : `
            <section class="recommendations">
                <h2>Congratulations!</h2>
                <p>You have completed all required GDPR compliance items. Consider reviewing optional items to further enhance your compliance.</p>
            </section>
            `}

            <div class="footer">
                <p><strong>About this Report:</strong> This GDPR compliance assessment was generated using the open-source GDPR Compliance Checker tool. The assessment is based on current understanding of GDPR requirements but should not replace professional legal advice.</p>
                <p><strong>Next Steps:</strong> Review the recommendations above and consider implementing the suggested improvements. Regularly review and update your compliance measures as regulations and your website evolve.</p>
            </div>
        </body>
        </html>
        `;

        return html;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OverviewManager;
}