# AGENTS.md — SHRM Exam Flashcards & Endless Quiz

## Mandatory Skill Discovery
Before modifying code, styles, quiz/flashcard content, data files, or deployment settings in this repository, **always scan `.agent/skills/` and read the relevant skill file(s)** matching your task. Follow the conventions, verification commands, and constraints documented in those skills.

---

## Project Overview & Ground Rules
- **Architecture**: Zero-build, zero-dependency vanilla HTML/CSS/ES6+ single-page app (`index.html`) that must run identically over HTTP/HTTPS (GitHub Pages) and local `file://` (double-clicking `index.html`).
- **Relative Paths Only**: Use relative asset references without leading slashes (e.g., `favicon.svg`, `data/cards.js`, `data/quiz.js`). Never commit machine-specific absolute paths (`C:\...`, `D:\...`).
- **Dual Data Packaging**: Browser code loads `data/cards.js` (`ALL_CARDS`) and `data/quiz.js` (`QUIZ_DATA`) via `<script>` tags; `data/cards.json` and `data/quiz.json` are exact 2-space-indented UTF-8 JSON mirrors for tooling and QA. Keep `.js` and `.json` files synchronized.
- **No Secrets**: This is a pure client-side static repository. Never hardcode API keys, tokens, passwords, or private endpoints in source files, scripts, or skills.
- **Pre-Commit Verification**: Run both verification scripts from the repository root before committing:
  - `node .agent/scripts/verify-app.js`
  - `node .agent/scripts/validate-quiz.js`

---

## Skills Index (`.agent/skills/`)

| Skill | Path | Trigger / When to Load |
|---|---|---|
| `shrm-coding-standards` | [`.agent/skills/00_shrm-coding-standards.md`](.agent/skills/00_shrm-coding-standards.md) | Editing `index.html` JavaScript logic, state management, LocalStorage keys, DOM escaping, or running app runtime tests. |
| `shrm-visual-design` | [`.agent/skills/01_shrm-visual-design.md`](.agent/skills/01_shrm-visual-design.md) | Modifying CSS custom properties, Light/Dark themes, responsive mobile/desktop breakpoints, card headers, or quiz option styling in `index.html`. |
| `shrm-bask-framework` | [`.agent/skills/02_shrm-bask-framework.md`](.agent/skills/02_shrm-bask-framework.md) | Classifying content into SHRM BASK clusters/22 domains, checking HR theories, or writing exam explanations. |
| `shrm-sjt-engineering` | [`.agent/skills/03_shrm-sjt-engineering.md`](.agent/skills/03_shrm-sjt-engineering.md) | Authoring new SJT items, auditing 4 distractor trap patterns, checking option-length parity, or aligning EN/VI terminology. |
| `shrm-flashcard-pedagogy` | [`.agent/skills/04_shrm-flashcard-pedagogy.md`](.agent/skills/04_shrm-flashcard-pedagogy.md) | Updating flashcard active-recall workflow, domain/starred filters, or `US`/`VI` toggle behavior in `index.html`. |
| `shrm-data-pipeline` | [`.agent/skills/05_shrm-data-pipeline.md`](.agent/skills/05_shrm-data-pipeline.md) | Editing `data/cards.*` or `data/quiz.*`, running `scripts/fix_quiz.js`, formatting data, or executing QA validation scripts. |
| `shrm-git-deployment` | [`.agent/skills/06_shrm-git-deployment.md`](.agent/skills/06_shrm-git-deployment.md) | Preparing commits, updating `?v=` cache-busting strings, verifying `.gitignore`, or deploying to GitHub Pages. |
