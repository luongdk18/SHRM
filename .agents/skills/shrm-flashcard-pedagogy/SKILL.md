---
name: shrm-flashcard-pedagogy
description: Active recall loop, domain/cluster filtering, starred review decks, US employment law filtering, and bilingual VI/EN learning UX for the SHRM flashcard mode. Use when updating flashcard workflow, domain filtering, review lists, or study session behavior in index.html.
---

# SHRM Active Recall & Flashcard Pedagogy

## 1. Pedagogical Foundation
The flashcard system applies cognitive learning principles:
- **Testing Effect**: Requiring mental retrieval from definition + workplace context before showing the term strengthens memory encoding.
- **Dual Coding**: Pairing abstract definitions with concrete workplace scenarios (`scenario` / `scenarioVi`) and exam recognition clues (`tip` / `tipVi`).
- **Focused Spaced Revision**: Learners can star difficult cards (`★`) into an isolated review filter (`starred`) persisted in `localStorage`.

---

## 2. Four-Step Flashcard Study Loop

1. **Stimulus Presentation (Front)**:
   - `#card-prompt` renders `.card-domain-badge` (color-coded by cluster) alongside the bookmark button (`#study-star-btn`).
   - `#card-def` shows English definition; `#card-def-vi` shows Vietnamese translation when `VI on` is active.
   - `#card-scenario` displays bilingual or English-only workplace context.
2. **Mental Retrieval**: Learner recalls the target SHRM concept before revealing.
3. **Reveal & Validation (`doFlip()`)**:
   - Opens `#answer-reveal` in-place showing `#card-term` and `#card-tip` (exam triggers and distractor warnings).
4. **Self-Evaluation**:
   - **Still learning**: Keeps card in active `deck`, hides answer, and calls `scrollCardToTop()`.
   - **Got it**: Moves card from `deck` to `done`, saves progress in `sessions[filterKey()]`, and renders the next card.

---

## 3. Filtering & Study Modes

### Filter Scopes
- **All Domains** (`all`): All 392 cards (or excluding U.S. Employment Law when `US off`).
- **Starred / Review List** (`starred`): Cards bookmarked via `toggleCardStar()`.
- **Cluster Filters** (`cluster`): Competencies, People, Organization, or Workplace.
- **Specific Domain** (`domain`): Any of the 22 SHRM BASK domains.

Each filter maintains an isolated session `{ deck, done }` in `shrm-flashcards-progress-v1` so switching topics preserves progress in every category.

---

## 4. Learner Control Toggles (Header Only)
- **`US off` / `US on` (`toggleHideUsLaw()`)**: Filters out `U.S. Employment Law & Regulations` (default `off` for global SHRM candidates).
- **`VI on` / `VI off` (`toggleVietnamese()`)**: Single master toggle in the top header controlling bilingual labels, definitions, scenarios, tips, quiz questions, and the About/Help modal. When `VI off`, UI and content stay 100% English.
- **Reshuffle & Reset**: `reshuffle()` randomizes only uncompleted `deck` cards; `resetProgress()` restores the active filter after user confirmation.
