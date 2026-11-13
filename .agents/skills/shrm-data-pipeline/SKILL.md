---
name: shrm-data-pipeline
description: Data extraction, OCR normalization, JS/JSON mirror synchronization, 2-space formatting, and automated quality-assurance scripts for data/cards.js, data/quiz.js, and scripts/fix_quiz.js. Use whenever editing card/quiz data banks, running QA checks, or formatting data files.
---

# SHRM Data Pipeline & Quality Assurance

## 1. Data Assets & Dual Packaging
Data is stored in two synchronized formats under `data/`:

| File | Format | Purpose |
|---|---|---|
| `data/cards.js` | `const ALL_CARDS = [...];` | Browser script loaded by `index.html` without CORS errors on `file://` |
| `data/cards.json` | `[...]` | Pretty-printed JSON mirror (2-space indent) for CLI scripts and tooling |
| `data/quiz.js` | `const QUIZ_DATA = [...];` | Browser script loaded by `index.html` |
| `data/quiz.json` | `[...]` | Pretty-printed JSON mirror (2-space indent) for QA verification scripts |

**Formatting Rule**: Always serialize both `.js` and `.json` files using 2-space indentation (`JSON.stringify(data, null, 2)`) and UTF-8 encoding to preserve Vietnamese diacritics cleanly in diffs.

---

## 2. Text Sanitization & OCR Standards
When ingesting new questions or cards from source materials:
1. Rejoin words broken across line breaks (`imple-\nmentation` → `implementation`).
2. Standardize curly quotes and dashes (`—`).
3. Strip PDF page headers, footers, and question-bank watermarks (`Question X of Y`).
4. Ensure strict UTF-8 output so Vietnamese tones remain intact.

---

## 3. Maintenance Script (`scripts/fix_quiz.js`)
Run from `<PROJECT_ROOT>` when applying quality passes or updates to quiz banks:

```bash
node scripts/fix_quiz.js
```

It loads `data/quiz.js`, runs normalization/balance checks, and writes formatted JSON to both `data/quiz.js` and `data/quiz.json`.

---

## 4. Automated Quality Assurance Scripts

### Validate Data Integrity & Bilingual Coverage
Checks `data/cards.json` and `data/quiz.json` for schema validity, 4 distinct options per item, valid `0..3` answer indices, cluster assignments, and complete Vietnamese translations:

```bash
node .agents/skills/shrm-data-pipeline/scripts/validate-quiz.js
```

### Audit Distractor Parity & Answer Balance
Inspects option length ratios (`min / max < 0.4` giveaways) and answer-key distribution across A, B, C, D:

```bash
python .agents/skills/shrm-data-pipeline/scripts/audit-distractors.py
```
