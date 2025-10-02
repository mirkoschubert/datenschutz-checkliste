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
            exportPdfBtn.addEventListener('click', () => this.exportDirectPDF());
        }
        
        // Check PDF library availability
        this.checkPDFLibrary();

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

    checkPDFLibrary() {
        // Check if jsPDF is loaded, if not try to load it dynamically
        if (!window.jsPDF && !window.jspdf) {
            console.log('jsPDF not found, checking if script is loaded...');
            
            // Wait a bit for scripts to load, then check again
            setTimeout(() => {
                if (!window.jsPDF && !window.jspdf) {
                    console.warn('jsPDF library not loaded. PDF export may not work.');
                    
                    // Try to load jsPDF dynamically as fallback
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                    script.onload = () => {
                        console.log('jsPDF loaded dynamically');
                    };
                    script.onerror = () => {
                        console.error('Failed to load jsPDF dynamically');
                    };
                    document.head.appendChild(script);
                }
            }, 1000);
        } else {
            console.log('jsPDF library is available');
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

    exportDirectPDF() {
        console.log('Starting direct PDF export...');

        // Check if jsPDF is available
        if (!window.jsPDF && !window.jspdf) {
            this.showNotification('PDF library not loaded. Please refresh the page.', 'error');
            console.error('jsPDF library not found. Make sure the script is loaded.');
            return;
        }

        try {
            // Try different possible jsPDF references
            let jsPDF;
            
            if (window.jspdf && window.jspdf.jsPDF) {
                jsPDF = window.jspdf.jsPDF;
                console.log('Using window.jspdf.jsPDF');
            } else if (window.jsPDF) {
                jsPDF = window.jsPDF;
                console.log('Using window.jsPDF');
            } else {
                throw new Error('jsPDF library not found');
            }
            
            const doc = new jsPDF();
            
            // Get assessment data from localStorage and checklist structure
            const assessmentData = this.getAssessmentData();
            const currentLang = localStorage.getItem('gdpr_language') || 'en';
            
            console.log('Assessment data loaded:', assessmentData.length, 'items');
            
            // Calculate statistics
            const totalItems = assessmentData.length;
            const completedItems = assessmentData.filter(item => item.completed).length;
            const ignoredItems = assessmentData.filter(item => item.ignored).length;
            const pendingItems = assessmentData.filter(item => !item.completed && !item.ignored).length;
            const score = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            
            // Set up document header
            doc.setFontSize(20);
            doc.text('GDPR Compliance Assessment Report', 20, 30);
            
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
            doc.text(`Language: ${currentLang.toUpperCase()}`, 20, 55);
            
            // Overall Score
            doc.setFontSize(16);
            doc.text('Overall Compliance Score', 20, 75);
            doc.setFontSize(24);
            
            // Color based on score
            if (score >= 80) {
                doc.setTextColor(40, 167, 69); // Green
            } else if (score >= 60) {
                doc.setTextColor(255, 193, 7); // Yellow
            } else {
                doc.setTextColor(220, 53, 69); // Red
            }
            doc.text(`${score}%`, 20, 95);
            doc.setTextColor(0, 0, 0); // Reset to black
            
            // Summary statistics
            let yPos = 115;
            doc.setFontSize(14);
            doc.text('Summary Statistics:', 20, yPos);
            yPos += 15;
            
            doc.setFontSize(11);
            doc.text(`Total Items: ${totalItems}`, 25, yPos);
            yPos += 8;
            doc.text(`Completed: ${completedItems}`, 25, yPos);
            yPos += 8;
            doc.text(`Ignored: ${ignoredItems}`, 25, yPos);
            yPos += 8;
            doc.text(`Pending: ${pendingItems}`, 25, yPos);
            yPos += 20;
            
            // Group items by category for breakdown
            const categoryMap = new Map();
            assessmentData.forEach(item => {
                if (!categoryMap.has(item.category)) {
                    categoryMap.set(item.category, {
                        total: 0,
                        completed: 0,
                        ignored: 0
                    });
                }
                const cat = categoryMap.get(item.category);
                cat.total++;
                if (item.completed) cat.completed++;
                if (item.ignored) cat.ignored++;
            });
            
            // Category Breakdown
            doc.setFontSize(14);
            doc.text('Category Breakdown:', 20, yPos);
            yPos += 15;
            
            doc.setFontSize(11);
            for (const [categoryName, stats] of categoryMap) {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                const categoryScore = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                doc.text(`${categoryName}: ${categoryScore}% (${stats.completed}/${stats.total} completed)`, 25, yPos);
                yPos += 10;
            }
            
            // Pending Items (recommendations)
            const pendingItemsList = assessmentData.filter(item => !item.completed && !item.ignored);
            if (pendingItemsList.length > 0) {
                yPos += 10;
                if (yPos > 240) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(14);
                doc.text('Priority Recommendations:', 20, yPos);
                yPos += 15;
                
                doc.setFontSize(11);
                // Show top 10 pending items, prioritize required ones
                const prioritizedPending = pendingItemsList
                    .sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0))
                    .slice(0, 10);
                
                prioritizedPending.forEach((item, index) => {
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = 20;
                    }
                    
                    const prefix = item.required ? '[Required]' : '[Optional]';
                    const title = `${prefix} ${item.title}`;
                    const lines = doc.splitTextToSize(`${index + 1}. ${title}`, 170);
                    doc.text(lines, 25, yPos);
                    yPos += lines.length * 6 + 3;
                });
            }
            
            // Save the PDF
            const timestamp = new Date().toISOString().split('T')[0];
            doc.save(`gdpr-assessment-${timestamp}.pdf`);
            
            this.showNotification('PDF report generated successfully!', 'success');
            console.log('PDF export completed successfully');
        } catch (error) {
            console.error('Direct PDF export error:', error);
            
            // Fallback to browser print dialog
            if (confirm('PDF generation failed. Would you like to use your browser\'s print function instead?\n\nClick OK to open print dialog, or Cancel to try again later.')) {
                this.fallbackToPrint();
            } else {
                this.showNotification('PDF export failed. Try refreshing the page.', 'error');
            }
        }
    }

    exportPDF() {
        // Fallback method for browser printing
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

    getAssessmentData() {
        // Get current language
        const currentLang = localStorage.getItem('gdpr_language') || 'en';
        
        // Get saved responses and ignored items from localStorage
        const savedResponses = JSON.parse(localStorage.getItem('gdpr_responses') || '{}');
        const savedIgnored = JSON.parse(localStorage.getItem('gdpr_ignored') || '[]');
        const ignoredSet = new Set(savedIgnored);
        
        // Get the data for current language from gdprData
        const data = window.gdprData[currentLang];
        if (!data) {
            console.error('No data found for language:', currentLang);
            return [];
        }
        
        // Create flat array of all items with their status
        const assessmentData = [];
        
        data.categories.forEach(category => {
            category.items.forEach(item => {
                assessmentData.push({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: category.title,
                    required: item.required,
                    completed: !!savedResponses[item.id],
                    ignored: ignoredSet.has(item.id),
                    weight: item.weight || 1
                });
            });
        });
        
        return assessmentData;
    }

    fallbackToPrint() {
        console.log('Using browser print fallback...');
        
        // Create a printable version of the assessment
        const printWindow = window.open('', '_blank');
        const assessmentData = this.getAssessmentData();
        
        const printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>GDPR Assessment Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        .item { margin: 15px 0; padding: 10px; border-left: 3px solid #007bff; }
        .item-completed { border-left-color: #28a745; background: #f8fff9; }
        .item-ignored { border-left-color: #ffc107; background: #fffbf0; }
        .item-pending { border-left-color: #dc3545; background: #fff5f5; }
        .status { font-weight: bold; padding: 2px 8px; border-radius: 3px; font-size: 0.9em; }
        .status-completed { background: #d4edda; color: #155724; }
        .status-ignored { background: #fff3cd; color: #856404; }
        .status-pending { background: #f8d7da; color: #721c24; }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>GDPR Compliance Assessment Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Items:</strong> ${assessmentData.length}</p>
        <p><strong>Completed:</strong> ${assessmentData.filter(item => item.completed).length}</p>
        <p><strong>Ignored:</strong> ${assessmentData.filter(item => item.ignored).length}</p>
        <p><strong>Pending:</strong> ${assessmentData.filter(item => !item.completed && !item.ignored).length}</p>
    </div>
    
    <div class="section">
        <h2>Assessment Details</h2>
        ${assessmentData.map((item, index) => {
            let statusClass = 'pending';
            let statusText = 'Pending';
            
            if (item.completed) {
                statusClass = 'completed';
                statusText = 'Completed';
            } else if (item.ignored) {
                statusClass = 'ignored';
                statusText = 'Ignored';
            }
            
            return `
                <div class="item item-${statusClass}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <strong>${index + 1}. ${item.text}</strong>
                        </div>
                        <span class="status status-${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('')}
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Report</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
    </div>
</body>
</html>`;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Auto-trigger print dialog after a short delay
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}