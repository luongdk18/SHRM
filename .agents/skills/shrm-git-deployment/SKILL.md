---
name: shrm-git-deployment
description: Zero-build static deployment workflow (GitHub Pages and offline file://), relative path resolution, cache-busting versioning, pre-commit checks, and commit conventions for the SHRM repository. Use before committing, pushing, or modifying script includes/assets.
---

# SHRM Git Workflow & Static Deployment

## 1. Zero-Build Static Hosting
This repository deploys directly from `main` without bundlers or build pipelines:
- **GitHub Pages**: Serves `index.html`, `favicon.svg`, `data/cards.js`, and `data/quiz.js` directly from repository root.
- **Offline Desktop (`file://`)**: Double-clicking `index.html` loads local `.js` banks directly without CORS errors.

---

## 2. Relative Path & Cache-Busting Rules
1. **Always use relative paths** without leading slashes so repository subpaths (`/SHRM/`) work properly:
   ```html
   <link rel="icon" type="image/svg+xml" href="favicon.svg" />
   <script src="data/cards.js?v=20261015e"></script>
   <script src="data/quiz.js?v=20261015e"></script>
   ```
2. **Bump `?v=` query strings** in `index.html` whenever `data/cards.js` or `data/quiz.js` changes significantly so returning browsers refresh cached payloads cleanly.
3. **Maintain `.gitignore` safely**: Keep `/skills/` (root-only slash) or scratch directories excluded if temporary, while keeping `.agents/skills/` **unignored** and tracked in Git.

---

## 3. Pre-Commit Verification Checklist
Before staging or pushing changes:

1. **App Runtime & Render Check**:
   ```bash
   node .agents/skills/shrm-coding-standards/scripts/verify-app.js
   ```
2. **Data & Mirror Validation**:
   ```bash
   node .agents/skills/shrm-data-pipeline/scripts/validate-quiz.js
   ```
3. **Working Tree Audit**:
   ```bash
   git status
   ```
   Confirm no raw PDFs, temporary scratch outputs, or secrets are staged.

---

## 4. Commit Conventions
Use conventional prefixes:
- `feat:` New features, card/question expansions, or UX capabilities
- `fix:` Bug fixes, translation fixes, or CSS corrections
- `style:` Formatting changes (`quiz.js` indentation, UI styling)
- `refactor:` Code restructuring without changing external behavior
- `docs:` Documentation, README, or `.agents/skills/` updates
