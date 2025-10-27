# GDPR Compliance Checker - Svelte 5 Edition

A modern, interactive web application for assessing and improving GDPR (General Data Protection Regulation) compliance. Built with **Svelte 5** using the new Runes API for superior reactivity and performance.

## ✨ Features

- 📋 **Comprehensive Checklist**: 9 GDPR compliance categories with detailed requirements
- 🎯 **Progress Tracking**: Real-time assessment progress and compliance scoring
- 💾 **Data Persistence**: Automatic save to local storage
- 📤 **Export/Import**: Save assessments as JSON or generate PDF reports
- 🌐 **Multilingual**: Full support for English and German
- 🌓 **Dark Mode**: Beautiful light and dark themes
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast**: Built with Svelte 5 for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
gdpr_svelte/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── assessment/      # Assessment-related components
│   │   │   ├── export/          # Export/Import functionality
│   │   │   ├── layout/          # Layout components
│   │   │   └── ui/              # Reusable UI primitives
│   │   ├── data/
│   │   │   ├── gdpr-data.ts     # Data module
│   │   │   ├── en.json          # English GDPR data
│   │   │   └── de.json          # German GDPR data
│   │   ├── stores/              # Svelte 5 Runes stores
│   │   │   ├── assessment.svelte.ts
│   │   │   ├── theme.svelte.ts
│   │   │   └── language.svelte.ts
│   │   └── types/
│   │       └── gdpr.ts          # TypeScript type definitions
│   ├── routes/
│   │   ├── +layout.svelte       # Root layout
│   │   ├── +layout.ts           # Layout config
│   │   └── +page.svelte         # Main page
│   └── app.css                  # Global styles
├── package.json
├── svelte.config.js
└── README.md
```

## 🛠️ Technologies

- **Svelte 5**: Latest version with Runes API for reactive state
- **SvelteKit**: Full-stack framework with static adapter
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **jsPDF**: PDF generation
- **Inter Font**: Modern, accessible typography

## 📊 GDPR Compliance Categories

1. Legal Basis and Consent Management
2. Data Mapping and Inventory
3. Data Subject Rights (DSR)
4. Data Protection Impact Assessment (DPIA)
5. Security and Breach Management
6. Data Processing Agreements
7. Privacy Notices and Transparency
8. Data Retention and Deletion
9. International Data Transfers

## 🎨 Key Features

### Assessment System

- Interactive checklist with expandable categories
- Real-time progress tracking
- Weighted scoring (required vs optional items)
- Compliance level indicators
- Priority recommendations

### Data Management

- Auto-save to local storage
- JSON export/import
- PDF report generation
- Reset functionality

### UI/UX

- Modern, clean design
- Smooth animations
- Dark/light theme toggle
- Responsive layout
- Keyboard accessible

## 🌐 Deployment

Build output is a static site that can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting

Build command: `npm run build`  
Output directory: `build/`

## ⚖️ Legal Notice

This tool provides guidance only. For legal compliance advice, consult a qualified legal professional.

---

**Built with ❤️ using Svelte 5**
