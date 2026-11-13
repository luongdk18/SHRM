# AGENTS.md — SHRM Exam Flashcards & Endless Quiz

## Mandatory Skill Discovery
Before modifying code, styles, quiz/flashcard content, data files, or deployment settings in this repository, **always scan `.agents/skills/` and read the relevant `SKILL.md` file(s)** matching your task. Follow the conventions, verification commands, and constraints documented in those skills.

---

## Project Overview & Ground Rules
- **Architecture**: Zero-build, zero-dependency vanilla HTML/CSS/ES6+ single-page app (`index.html`) that must run identically over HTTP/HTTPS (GitHub Pages) and local `file://` (double-clicking `index.html`).
- **Relative Paths Only**: Use relative asset references without leading slashes (e.g., `favicon.svg`, `data/cards.js`, `data/quiz.js`). Never commit machine-specific absolute paths (`C:\...`, `D:\...`).
- **Dual Data Packaging**: Browser code loads `data/cards.js` (`ALL_CARDS`) and `data/quiz.js` (`QUIZ_DATA`) via `<script>` tags; `data/cards.json` and `data/quiz.json` are exact 2-space-indented UTF-8 JSON mirrors for tooling and QA. Keep `.js` and `.json` files synchronized.
- **No Secrets**: This is a pure client-side static repository. Never hardcode API keys, tokens, passwords, or private endpoints in source files, scripts, or skills.
- **Pre-Commit Verification**: Run both verification scripts from the repository root before committing:
  - `node .agents/skills/shrm-coding-standards/scripts/verify-app.js`
  - `node .agents/skills/shrm-data-pipeline/scripts/validate-quiz.js`

---

## Skills Index (`.agents/skills/`)

| Skill | Path | Trigger / When to Load |
|---|---|---|
| `shrm-coding-standards` | [`.agents/skills/shrm-coding-standards/SKILL.md`](.agents/skills/shrm-coding-standards/SKILL.md) | Editing `index.html` JavaScript logic, state management, LocalStorage keys, DOM escaping, or running app runtime tests. |
| `shrm-visual-design` | [`.agents/skills/shrm-visual-design/SKILL.md`](.agents/skills/shrm-visual-design/SKILL.md) | Modifying CSS custom properties, Light/Dark themes, responsive mobile/desktop breakpoints, card headers, or quiz option styling in `index.html`. |
| `shrm-bask-framework` | [`.agents/skills/shrm-bask-framework/SKILL.md`](.agents/skills/shrm-bask-framework/SKILL.md) | Classifying content into SHRM BASK clusters/22 domains, checking HR theories, or writing exam explanations. |
| `shrm-sjt-engineering` | [`.agents/skills/shrm-sjt-engineering/SKILL.md`](.agents/skills/shrm-sjt-engineering/SKILL.md) | Authoring new SJT items, auditing 4 distractor trap patterns, checking option-length parity, or aligning EN/VI terminology. |
| `shrm-flashcard-pedagogy` | [`.agents/skills/shrm-flashcard-pedagogy/SKILL.md`](.agents/skills/shrm-flashcard-pedagogy/SKILL.md) | Updating flashcard active-recall workflow, domain/starred filters, or `US`/`VI` toggle behavior in `index.html`. |
| `shrm-data-pipeline` | [`.agents/skills/shrm-data-pipeline/SKILL.md`](.agents/skills/shrm-data-pipeline/SKILL.md) | Editing `data/cards.*` or `data/quiz.*`, running `scripts/fix_quiz.js`, formatting data, or executing QA validation scripts. |
| `shrm-git-deployment` | [`.agents/skills/shrm-git-deployment/SKILL.md`](.agents/skills/shrm-git-deployment/SKILL.md) | Preparing commits, updating `?v=` cache-busting strings, verifying `.gitignore`, or deploying to GitHub Pages. |
