// Main application initialization and coordination
class GDPRApp {
    constructor() {
        this.assessmentManager = null;
        this.overviewManager = null;
        this.exportManager = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            // Initialize managers
            this.assessmentManager = new GDPRAssessment();
            this.overviewManager = new OverviewManager(this.assessmentManager);
            this.exportManager = new ExportManager(this.assessmentManager, this.overviewManager);

            // Make managers globally available for event handlers
            window.gdprAssessment = this.assessmentManager;
            window.overviewManager = this.overviewManager;
            window.exportManager = this.exportManager;
            
            // Backwards compatibility
            window.assessmentManager = this.assessmentManager;

            // Setup global event listeners
            this.setupEventListeners();

            // Check for shared data in URL
            if (this.exportManager.checkForSharedData) {
                this.exportManager.checkForSharedData();
            }

            console.log('GDPR Compliance Checker initialized successfully');
        } catch (error) {
            console.error('Error initializing GDPR app:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Language switching
        this.setupLanguageSwitching();
        
        // Mobile navigation
        this.setupMobileNavigation();

        // Keyboard navigation
        this.setupKeyboardNavigation();

        // Window events
        this.setupWindowEvents();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.showSection(targetSection);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    setupLanguageSwitching() {
        // Language switching is now handled by the assessment manager
        // This method is kept for backwards compatibility
    }

    setupMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
                
                // Update icon
                const icon = navToggle.querySelector('i');
                if (navList.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });

            // Close mobile nav when clicking on a link
            navList.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    navList.classList.remove('active');
                    navToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        }
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save/export
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.exportManager.exportJSON();
            }
            
            // Ctrl/Cmd + O to import
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                document.getElementById('importFile').click();
            }
            
            // Ctrl/Cmd + R to reset (with confirmation)
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.assessmentManager.resetAssessment();
            }
        });
    }

    setupWindowEvents() {
        // Auto-save on page unload
        window.addEventListener('beforeunload', () => {
            if (this.assessmentManager) {
                this.assessmentManager.saveResponses();
            }
        });

        // Handle window resize for responsive adjustments
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Working offline - your progress is saved locally', 'info');
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            
            // Update overview when showing overview section
            if (sectionId === 'overview' && this.overviewManager) {
                this.overviewManager.updateOverview();
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    handleResize() {
        // Handle responsive adjustments if needed
        const width = window.innerWidth;
        
        if (width < 768) {
            // Mobile adjustments
            this.adjustForMobile();
        } else {
            // Desktop adjustments
            this.adjustForDesktop();
        }
    }

    adjustForMobile() {
        // Close mobile nav if open
        const navList = document.querySelector('.nav-list');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navList && navList.classList.contains('active')) {
            navList.classList.remove('active');
            if (navToggle) {
                navToggle.querySelector('i').className = 'fas fa-bars';
            }
        }
    }

    adjustForDesktop() {
        // Ensure desktop nav is visible
        const navList = document.querySelector('.nav-list');
        if (navList) {
            navList.classList.remove('active');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }

    showNotification(message, type = 'info') {
        if (this.exportManager) {
            this.exportManager.showNotification(message, type);
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global utility functions
function showAbout() {
    const aboutContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>About GDPR Compliance Checker</h3>
                <button class="modal-close" onclick="closeAbout()">&times;</button>
            </div>
            <div class="modal-body">
                <p>This interactive GDPR compliance checker is an open-source tool designed to help web developers and designers assess their websites' compliance with the General Data Protection Regulation (GDPR).</p>
                
                <h4>Features:</h4>
                <ul>
                    <li>Interactive checklist with detailed explanations</li>
                    <li>Real-time compliance scoring</li>
                    <li>Category-based assessment</li>
                    <li>Export/import functionality</li>
                    <li>Multilingual support (English/German)</li>
                    <li>Mobile-responsive design</li>
                </ul>
                
                <h4>Credits:</h4>
                <p>Based on the original GDPR checklist by Peter Haurand and Mirko Schubert.</p>
                <p>Enhanced with interactive features for Hacktoberfest 2025.</p>
                
                <h4>Contributing:</h4>
                <p>This is an open-source project. Contributions are welcome on GitHub!</p>
                
                <div class="about-links">
                    <a href="https://github.com/mirkoschubert/datenschutz-checkliste" target="_blank" class="btn btn-primary">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'aboutModal';
    modal.className = 'modal active';
    modal.innerHTML = aboutContent;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAbout();
        }
    });
}

function closeAbout() {
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.remove();
    }
}

function showLegal() {
    const legalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Legal Information</h3>
                <button class="modal-close" onclick="closeLegal()">&times;</button>
            </div>
            <div class="modal-body">
                <h4>Disclaimer</h4>
                <p><strong>This GDPR Compliance Checker cannot address individual cases and does not constitute legal advice.</strong> It is merely a collection of knowledge compiled from extensive research, experience, and best practices from various developers.</p>
                
                <p>We assume <strong>no liability</strong> and recommend consulting a qualified lawyer for legal questions in any case.</p>
                
                <h4>License</h4>
                <p>This project is released under the MIT License. See the GitHub repository for full license details.</p>
                
                <h4>Data Privacy</h4>
                <p>This tool runs entirely in your browser. Your assessment data is stored locally on your device and is not transmitted to any external servers unless you explicitly choose to export or share it.</p>
                
                <h4>Accuracy</h4>
                <p>While we strive to keep the information accurate and up-to-date, GDPR regulations and interpretations may change. Always verify current legal requirements with qualified legal professionals.</p>
                
                <h4>Contact</h4>
                <p>For questions about this tool, please visit our GitHub repository or create an issue.</p>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'legalModal';
    modal.className = 'modal active';
    modal.innerHTML = legalContent;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLegal();
        }
    });
}

function closeLegal() {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.remove();
    }
}

// Initialize the application
const app = new GDPRApp();

// Make app globally available for debugging
window.gdprApp = app;

// Global functions for backwards compatibility and event handlers
function toggleCategory(categoryId) {
    if (window.gdprAssessment && window.gdprAssessment.toggleCategory) {
        window.gdprAssessment.toggleCategory(categoryId);
    }
}

function handleItemCheckboxClick(itemId, event) {
    if (event && event.target.tagName === 'INPUT') {
        // If clicking directly on checkbox, let the onchange handle it
        return;
    }
    if (window.gdprAssessment && window.gdprAssessment.handleCheckboxClick) {
        window.gdprAssessment.handleCheckboxClick(itemId);
    }
}

function handleItemCheckboxChange(itemId) {
    if (window.gdprAssessment && window.gdprAssessment.handleCheckboxChange) {
        window.gdprAssessment.handleCheckboxChange(itemId);
    }
}

function handleItemCheckbox(itemId) {
    // Backwards compatibility
    handleItemCheckboxClick(itemId);
}

function handleCheckboxChange(itemId, isChecked) {
    // Backwards compatibility
    handleItemCheckboxChange(itemId);
}

function showItemDetails(itemId) {
    if (window.gdprAssessment && window.gdprAssessment.showItemDetails) {
        window.gdprAssessment.showItemDetails(itemId);
    }
}

function handleItemIgnore(itemId) {
    if (window.gdprAssessment && window.gdprAssessment.toggleIgnoreItem) {
        window.gdprAssessment.toggleIgnoreItem(itemId);
    }
}