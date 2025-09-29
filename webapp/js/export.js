// Export and import functionality
class ExportManager {
    constructor(assessmentManager, overviewManager) {
        this.assessmentManager = assessmentManager;
        this.overviewManager = overviewManager;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Export JSON button
        const exportJsonBtn = document.getElementById('exportJson');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this.exportJSON());
        }

        // Export PDF button  
        const exportPdfBtn = document.getElementById('exportPdf');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportPDF());
        }

        // Import button
        const importBtn = document.getElementById('importBtn');
        const importFile = document.getElementById('importFile');
        
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => this.importJSON(e));
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAssessment());
        }
    }

    exportJSON() {
        if (!this.assessmentManager) return;

        try {
            const exportData = this.assessmentManager.exportData();
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `gdpr-assessment-${this.formatDate(new Date())}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            this.showNotification('Assessment exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Error exporting assessment', 'error');
        }
    }

    exportPDF() {
        if (!this.overviewManager) return;

        try {
            // Generate HTML report
            const htmlReport = this.overviewManager.generateHTMLReport();
            
            // Create a new window to display the report for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlReport);
            printWindow.document.close();
            
            // Wait for content to load, then trigger print dialog
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 100);
            };
            
            this.showNotification('Report opened for printing/PDF export', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            this.showNotification('Error generating PDF report', 'error');
        }
    }

    importJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            this.showNotification('Please select a valid JSON file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (this.validateImportData(importData)) {
                    const success = this.assessmentManager.importData(importData);
                    
                    if (success) {
                        this.showNotification('Assessment imported successfully!', 'success');
                    } else {
                        this.showNotification('Error importing assessment data', 'error');
                    }
                } else {
                    this.showNotification('Invalid assessment file format', 'error');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('Error reading assessment file', 'error');
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    validateImportData(data) {
        // Check for required properties
        if (!data || typeof data !== 'object') return false;
        if (!data.version || !data.responses) return false;
        if (typeof data.responses !== 'object') return false;
        
        return true;
    }

    resetAssessment() {
        if (this.assessmentManager) {
            this.assessmentManager.resetAssessment();
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hours}-${minutes}`;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if not already present
        this.addNotificationStyles();
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Add entrance animation
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                min-width: 300px;
                max-width: 400px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            .notification-show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }
            
            .notification-success {
                border-left: 4px solid #27ae60;
            }
            
            .notification-success .fa-check-circle {
                color: #27ae60;
            }
            
            .notification-error {
                border-left: 4px solid #e74c3c;
            }
            
            .notification-error .fa-exclamation-circle {
                color: #e74c3c;
            }
            
            .notification-warning {
                border-left: 4px solid #f39c12;
            }
            
            .notification-warning .fa-exclamation-triangle {
                color: #f39c12;
            }
            
            .notification-info {
                border-left: 4px solid #3498db;
            }
            
            .notification-info .fa-info-circle {
                color: #3498db;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Utility method to generate shareable report link
    generateShareableLink() {
        if (!this.assessmentManager) return null;
        
        try {
            const exportData = this.assessmentManager.exportData();
            const compressed = this.compressData(exportData);
            
            // In a real implementation, you might upload to a server and get a short URL
            // For now, we'll use URL parameters (limited by URL length)
            const baseUrl = window.location.origin + window.location.pathname;
            const shareUrl = `${baseUrl}?data=${encodeURIComponent(compressed)}`;
            
            if (shareUrl.length > 2000) {
                this.showNotification('Assessment too large to share via URL', 'warning');
                return null;
            }
            
            return shareUrl;
        } catch (error) {
            console.error('Error generating shareable link:', error);
            return null;
        }
    }

    compressData(data) {
        // Simple compression - in a real app you might use a proper compression library
        return btoa(JSON.stringify(data));
    }

    decompressData(compressed) {
        try {
            return JSON.parse(atob(compressed));
        } catch (error) {
            console.error('Error decompressing data:', error);
            return null;
        }
    }

    // Check for shared data in URL parameters
    checkForSharedData() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get('data');
        
        if (sharedData) {
            const decompressed = this.decompressData(sharedData);
            if (decompressed && this.validateImportData(decompressed)) {
                // Ask user if they want to load the shared assessment
                const loadShared = confirm('This link contains a GDPR assessment. Would you like to load it?');
                if (loadShared) {
                    const success = this.assessmentManager.importData(decompressed);
                    if (success) {
                        this.showNotification('Shared assessment loaded successfully!', 'success');
                        // Clean up URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                }
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}