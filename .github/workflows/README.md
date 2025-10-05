# GitHub Pages Deployment Workflow

This GitHub Actions workflow automatically deploys the GDPR Compliance Checker to GitHub Pages.

## What it does

1. **Triggers on:**
   - Push to `master` branch
   - Manual workflow dispatch (can be run manually from GitHub Actions tab)

2. **Build Process:**
   - Creates a `_site` directory for deployment
   - Copies all content from `docs/` (main documentation site)
   - Copies `webapp/` folder into `_site/webapp/` (interactive tool)
   - Uploads the combined structure as a Pages artifact

3. **Deploy Process:**
   - Deploys the artifact to GitHub Pages
   - Makes the site available at: `https://pankajydv07.github.io/datenschutz-checkliste/`

## Site Structure After Deployment

```
https://pankajydv07.github.io/datenschutz-checkliste/
├── index.html                    (main docs site)
├── webapp/
│   ├── index.html               (interactive tool)
│   ├── js/
│   ├── styles/
│   └── ...
└── ...
```

## How to Use

### Automatic Deployment
Simply push your changes to the `master` branch:
```bash
git add .
git commit -m "Your commit message"
git push origin master
```

The workflow will automatically run and deploy your changes within 2-3 minutes.

### Manual Deployment
1. Go to the repository on GitHub
2. Click "Actions" tab
3. Select "Deploy to GitHub Pages" workflow
4. Click "Run workflow" button
5. Select the `master` branch
6. Click "Run workflow"

## Permissions Required

The workflow uses the following permissions:
- `contents: read` - To read repository content
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For authentication

## Troubleshooting

### Workflow fails with "permission denied"
1. Go to Settings → Actions → General
2. Under "Workflow permissions", ensure:
   - "Read and write permissions" is selected
   - "Allow GitHub Actions to create and approve pull requests" is checked

### 404 Error on webapp
1. Check the workflow run logs
2. Verify that `webapp/` folder exists in the repository
3. Ensure the link in `docs/index.html` points to `webapp/index.html` (not `../webapp/index.html`)

### Changes not reflecting on site
1. Wait 2-3 minutes after workflow completes
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache if needed

## Monitoring

Check deployment status:
- **Actions tab:** See real-time workflow execution
- **Environments:** View deployment history under repository Settings → Environments → github-pages
- **Pages settings:** Settings → Pages shows the current deployment status

## Local Testing

To test the site structure locally before deploying:
```bash
# Create the same structure
mkdir -p _site
cp -r docs/* _site/
cp -r webapp _site/webapp

# Serve locally (requires Python)
cd _site
python -m http.server 8080

# Open http://localhost:8080 in your browser
```

## Notes

- The workflow preserves both the documentation site and interactive tool
- No manual file copying required - everything is automated
- Changes to either `docs/` or `webapp/` trigger a full rebuild
- Old deployments are automatically replaced
