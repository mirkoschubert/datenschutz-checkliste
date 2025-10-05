// Assessment functionality for the GDPR compliance checker
class GDPRAssessment {
    constructor() {
        this.currentLang = 'en';
        this.responses = {};
        this.ignoredItems = new Set();
        this.totalItems = 0;
        this.completedItems = 0;
        this.currentScore = 0;
        this.maxScore = 0;
        
        this.init();
    }

    init() {
        this.loadSavedData();
        this.renderCategories();
        this.updateProgress();
        this.setupLanguageDropdown();
    }

    loadSavedData() {
        // Get language from localStorage or default to English
        this.currentLang = localStorage.getItem('gdpr_language') || 'en';
        
        // Load saved responses and ignored items
        const savedResponses = localStorage.getItem('gdpr_responses');
        if (savedResponses) {
            this.responses = JSON.parse(savedResponses);
        }
        
        const savedIgnored = localStorage.getItem('gdpr_ignored');
        if (savedIgnored) {
            this.ignoredItems = new Set(JSON.parse(savedIgnored));
        }
        
        this.updateLanguageDisplay();
    }

    saveData() {
        localStorage.setItem('gdpr_language', this.currentLang);
        localStorage.setItem('gdpr_responses', JSON.stringify(this.responses));
        localStorage.setItem('gdpr_ignored', JSON.stringify([...this.ignoredItems]));
    }

    setupLanguageDropdown() {
        const dropdown = document.getElementById('languageToggle');
        const menu = document.getElementById('languageMenu');
        
        if (!dropdown || !menu) return;

        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
            menu.classList.remove('active');
        });

        // Language selection
        menu.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
                dropdown.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }

    updateLanguageDisplay() {
        const currentLangSpan = document.querySelector('.current-lang');
        if (currentLangSpan) {
            const langMap = {
                'en': '🇬🇧 English',
                'de': '🇩🇪 Deutsch'
            };
            currentLangSpan.textContent = langMap[this.currentLang] || '🇬🇧 English';
        }

        // Update active state in dropdown
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.updateLanguageDisplay();
        this.renderCategories();
        this.updateProgress();
        this.saveData();
    }

    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        if (!container) return;

        const data = gdprData[this.currentLang];
        if (!data) return;

        container.innerHTML = '';

        data.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            container.appendChild(categoryElement);
        });

        this.calculateTotalItems();
    }

    createCategoryElement(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.dataset.categoryId = category.id;

        // Calculate category progress
        const categoryItems = category.items;
        const completedCount = categoryItems.filter(item => this.responses[item.id]).length;
        const totalCount = categoryItems.length;
        const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        categoryDiv.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${category.id}')">
                <div class="category-title">
                    <i class="${category.icon} category-icon"></i>
                    ${category.title}
                </div>
                <div class="category-info">
                    <span class="category-progress">${completedCount}/${totalCount} completed</span>
                    <button class="category-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
            <div class="category-content" id="category-${category.id}">
                ${this.createCategoryItems(category.items)}
            </div>
        `;

        return categoryDiv;
    }

    createCategoryItems(items) {
        return items.map(item => `
            <div class="checklist-item ${this.responses[item.id] ? 'completed' : ''} ${this.ignoredItems.has(item.id) ? 'ignored' : ''}" 
                 data-item-id="${item.id}">
                <div class="item-checkbox-area" onclick="handleItemCheckboxClick('${item.id}', event)">
                    <input type="checkbox" 
                           class="item-checkbox" 
                           id="checkbox-${item.id}"
                           ${this.responses[item.id] ? 'checked' : ''}
                           ${this.ignoredItems.has(item.id) ? 'disabled' : ''}
                           onchange="handleItemCheckboxChange('${item.id}')"
                           onclick="event.stopPropagation()">
                </div>
                <div class="item-content">
                    <div class="item-title">${item.title}</div>
                    <div class="item-description">${item.description}</div>
                    <div class="item-actions">
                        <button class="item-info-btn" onclick="showItemDetails('${item.id}')">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        <button class="item-ignore-btn ${this.ignoredItems.has(item.id) ? 'active' : ''}" 
                                onclick="handleItemIgnore('${item.id}')">
                            <i class="fas fa-eye-slash"></i> 
                            ${this.ignoredItems.has(item.id) ? 'Unignore' : 'Ignore'}
                        </button>
                        ${item.required ? '<span class="item-required">Required</span>' : '<span class="item-optional">Optional</span>'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleCategory(categoryId) {
        const content = document.getElementById(`category-${categoryId}`);
        const toggle = content.parentElement.querySelector('.category-toggle i');
        
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
            toggle.style.transform = 'rotate(0deg)';
        } else {
            content.classList.add('expanded');
            toggle.style.transform = 'rotate(180deg)';
        }
    }

    handleCheckboxClick(itemId) {
        // Don't allow checking if item is ignored
        if (this.ignoredItems.has(itemId)) return;

        const checkbox = document.getElementById(`checkbox-${itemId}`);
        if (!checkbox) return;

        // Toggle the checkbox state
        checkbox.checked = !checkbox.checked;
        
        // Update the response state
        this.updateItemResponse(itemId, checkbox.checked);
    }

    handleCheckboxChange(itemId) {
        // Don't allow checking if item is ignored
        if (this.ignoredItems.has(itemId)) return;

        const checkbox = document.getElementById(`checkbox-${itemId}`);
        if (!checkbox) return;

        // Use the current checkbox state
        this.updateItemResponse(itemId, checkbox.checked);
    }

    updateItemResponse(itemId, isChecked) {
        if (isChecked) {
            this.responses[itemId] = true;
        } else {
            delete this.responses[itemId];
        }

        // Update item visual state
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.toggle('completed', isChecked);
        }

        // Update progress and save
        this.updateProgress();
        this.saveData();
    }

    toggleIgnoreItem(itemId) {
        if (this.ignoredItems.has(itemId)) {
            // Unignore item
            this.ignoredItems.delete(itemId);
        } else {
            // Ignore item - also uncheck if checked
            this.ignoredItems.add(itemId);
            if (this.responses[itemId]) {
                delete this.responses[itemId];
            }
        }

        // Re-render to update UI
        this.renderCategories();
        this.updateProgress();
        this.saveData();
    }

    showItemDetails(itemId) {
        // Find the item data
        const data = gdprData[this.currentLang];
        let itemData = null;
        
        for (const category of data.categories) {
            const item = category.items.find(i => i.id === itemId);
            if (item) {
                itemData = item;
                break;
            }
        }

        if (!itemData) return;

        // Create modal content
        const modal = this.createItemModal(itemData);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
    }

    createItemModal(item) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal(modal);
        };

        const legalBasisHtml = item.legalBasis ? `
            <div class="modal-section">
                <h4>Legal Basis:</h4>
                <ul>
                    ${item.legalBasis.map(basis => `<li>${basis}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        const implementationHtml = item.implementation ? `
            <div class="modal-section">
                <h4>Implementation Tips:</h4>
                <ul>
                    ${item.implementation.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${item.title}</h3>
                    <button class="modal-close" onclick="gdprAssessment.closeModal(this.closest('.modal-overlay'))">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-description">${item.description}</p>
                    ${legalBasisHtml}
                    ${implementationHtml}
                    <div class="modal-meta">
                        <span class="item-type ${item.required ? 'required' : 'optional'}">
                            ${item.required ? 'Required' : 'Optional'}
                        </span>
                        <span class="item-weight">Weight: ${item.weight}</span>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }

    showItemDetails(itemId) {
        const item = this.findItemById(itemId);
        if (!item) return;

        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalLegal = document.getElementById('modalLegal');
        const modalImplementation = document.getElementById('modalImplementation');

        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;

        // Legal basis section
        modalLegal.innerHTML = `
            <h4>Legal Basis</h4>
            <ul>
                ${item.legalBasis.map(basis => `<li>${basis}</li>`).join('')}
            </ul>
        `;

        // Implementation tips
        modalImplementation.innerHTML = `
            <h4>Implementation Tips</h4>
            <ul>
                ${item.implementation.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;

        modal.classList.add('active');
        
        // Focus management for accessibility
        modal.querySelector('.modal-close').focus();
    }

    closeModal() {
        const modal = document.getElementById('itemModal');
        modal.classList.remove('active');
    }

    findItemById(itemId) {
        const data = gdprData[this.currentLang];
        if (!data) return null;

        for (const category of data.categories) {
            const item = category.items.find(item => item.id === itemId);
            if (item) return item;
        }
        return null;
    }

    calculateTotalItems() {
        const data = gdprData[this.currentLang];
        if (!data) return;

        this.totalItems = 0;
        this.maxScore = 0;

        data.categories.forEach(category => {
            category.items.forEach(item => {
                // Only count non-ignored items
                if (!this.ignoredItems.has(item.id)) {
                    this.totalItems++;
                    const weight = item.required ? item.weight * scoringConfig.weights.required : item.weight * scoringConfig.weights.optional;
                    this.maxScore += weight;
                }
            });
        });
    }

    updateProgress() {
        // Recalculate totals to account for ignored items
        this.calculateTotalItems();
        
        this.completedItems = Object.keys(this.responses).filter(id => !this.ignoredItems.has(id)).length;
        const progressPercentage = this.totalItems > 0 ? (this.completedItems / this.totalItems) * 100 : 0;
        
        // Calculate weighted score
        this.currentScore = 0;
        const data = gdprData[this.currentLang];
        
        if (data) {
            data.categories.forEach(category => {
                category.items.forEach(item => {
                    if (this.responses[item.id]) {
                        const weight = item.required ? item.weight * scoringConfig.weights.required : item.weight * scoringConfig.weights.optional;
                        this.currentScore += weight;
                    }
                });
            });
        }

        const scorePercentage = this.maxScore > 0 ? (this.currentScore / this.maxScore) * 100 : 0;

        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressScore = document.getElementById('progressScore');

        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
        }

        if (progressScore) {
            progressScore.textContent = `Score: ${Math.round(scorePercentage)}/100`;
        }

        // Update category progress
        this.updateCategoryProgress();
    }

    updateCategoryProgress() {
        const data = gdprData[this.currentLang];
        if (!data) return;

        data.categories.forEach(category => {
            const categoryElement = document.querySelector(`[data-category-id="${category.id}"]`);
            if (categoryElement) {
                const completedCount = category.items.filter(item => this.responses[item.id]).length;
                const totalCount = category.items.length;
                
                const progressElement = categoryElement.querySelector('.category-progress');
                if (progressElement) {
                    progressElement.textContent = `${completedCount}/${totalCount} completed`;
                }
            }
        });
    }

    saveResponses() {
        localStorage.setItem('gdpr_responses', JSON.stringify(this.responses));
        localStorage.setItem('gdpr_last_updated', new Date().toISOString());
    }

    loadSavedResponses() {
        const saved = localStorage.getItem('gdpr_responses');
        if (saved) {
            try {
                this.responses = JSON.parse(saved);
                this.updateProgress();
                
                // Update checkboxes
                Object.keys(this.responses).forEach(itemId => {
                    const checkbox = document.getElementById(`checkbox-${itemId}`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                    
                    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
                    if (itemElement) {
                        itemElement.classList.add('completed');
                    }
                });
            } catch (error) {
                console.error('Error loading saved responses:', error);
            }
        }
    }

    resetAssessment() {
        if (confirm('Are you sure you want to reset all responses? This action cannot be undone.')) {
            this.responses = {};
            localStorage.removeItem('gdpr_responses');
            localStorage.removeItem('gdpr_last_updated');
            
            // Update UI
            document.querySelectorAll('.item-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            document.querySelectorAll('.checklist-item').forEach(item => {
                item.classList.remove('completed');
            });
            
            this.updateProgress();
            
            if (window.overviewManager) {
                window.overviewManager.updateOverview();
            }
        }
    }

    exportData() {
        const exportData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            language: this.currentLang,
            responses: this.responses,
            scores: {
                completed: this.completedItems,
                total: this.totalItems,
                currentScore: this.currentScore,
                maxScore: this.maxScore,
                percentage: this.maxScore > 0 ? (this.currentScore / this.maxScore) * 100 : 0
            }
        };

        return exportData;
    }

    importData(importData) {
        try {
            if (importData.version && importData.responses) {
                this.responses = importData.responses;
                
                if (importData.language) {
                    this.setLanguage(importData.language);
                }
                
                this.saveResponses();
                this.renderCategories();
                this.updateProgress();
                
                if (window.overviewManager) {
                    window.overviewManager.updateOverview();
                }
                
                return true;
            }
        } catch (error) {
            console.error('Error importing data:', error);
        }
        return false;
    }

    getComplianceLevel() {
        const scorePercentage = this.maxScore > 0 ? (this.currentScore / this.maxScore) * 100 : 0;
        
        if (scorePercentage >= scoringConfig.thresholds.excellent) return 'excellent';
        if (scorePercentage >= scoringConfig.thresholds.good) return 'good';
        if (scorePercentage >= scoringConfig.thresholds.moderate) return 'moderate';
        if (scorePercentage >= scoringConfig.thresholds.poor) return 'poor';
        return 'critical';
    }

    getCategoryScores() {
        const data = gdprData[this.currentLang];
        if (!data) return [];

        return data.categories.map(category => {
            const completedCount = category.items.filter(item => this.responses[item.id]).length;
            const totalCount = category.items.length;
            const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            
            let level = 'low';
            if (percentage >= 80) level = 'high';
            else if (percentage >= 60) level = 'medium';
            
            return {
                id: category.id,
                title: category.title,
                completed: completedCount,
                total: totalCount,
                percentage: Math.round(percentage),
                level: level
            };
        });
    }

    getRecommendations() {
        const data = gdprData[this.currentLang];
        if (!data) return [];

        const recommendations = [];
        
        data.categories.forEach(category => {
            category.items.forEach(item => {
                if (!this.responses[item.id] && item.required) {
                    recommendations.push({
                        title: item.title,
                        category: category.title,
                        description: `${item.description.substring(0, 100)}...`,
                        priority: item.weight
                    });
                }
            });
        });

        // Sort by priority (weight) descending
        recommendations.sort((a, b) => b.priority - a.priority);
        
        // Return top 5 recommendations
        return recommendations.slice(0, 5);
    }
}

// Global functions for event handling
function toggleCategory(categoryId) {
    if (window.assessmentManager) {
        window.assessmentManager.toggleCategory(categoryId);
    }
}

function handleCheckboxChange(itemId, isChecked) {
    if (window.assessmentManager) {
        window.assessmentManager.handleCheckboxChange(itemId, isChecked);
    }
}

function showItemDetails(itemId) {
    if (window.assessmentManager) {
        window.assessmentManager.showItemDetails(itemId);
    }
}

function closeModal() {
    if (window.assessmentManager) {
        window.assessmentManager.closeModal();
    }
}

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Close modal on backdrop click
document.addEventListener('click', function(event) {
    const modal = document.getElementById('itemModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GDPRAssessment;
}