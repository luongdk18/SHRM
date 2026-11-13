---
name: shrm-visual-design
description: Visual design system, CSS custom properties, typography, Light/Dark themes, and compact mobile/desktop layout rules for the SHRM Study Platform. Use whenever modifying CSS styles, responsive breakpoints, card headers, quiz option styling, or UI components in index.html.
---

# SHRM Visual Design System & UI Architecture

## 1. Design Philosophy
The **SHRM Study Platform** is built as a distraction-free, content-first learning workspace:
- **Content-Maximized Layout**: Redundant headers, duplicate card toggles, and multi-row filter bars are collapsed so scenarios, questions, definitions, and all four answer options remain visible with minimal scrolling on both mobile and desktop viewports.
- **Typography Hierarchy**: `DM Serif Display` conveys editorial authority for headings and card terms; `DM Sans` optimizes scanning speed for long scenarios and answer options.
- **Readable Weight for Long Text**: Exam questions and scenarios use `font-weight: 400` (`500` max for question prompt) rather than heavy bolding, reducing visual fatigue during extended practice sessions.
- **Seamless Light/Dark Theming**: All colors use CSS custom properties under `html[data-theme="light"]` and `html[data-theme="dark"]`.

---

## 2. CSS Design Tokens (`index.html`)

### Light & Dark Palettes
- **Surfaces**: `--bg` (`#f0f2f7` light / `#0f1117` dark), `--surface` (`#ffffff` / `#1a1d27`), `--surface2` (`#e6e9f2` / `#22263a`)
- **Typography**: `--text`, `--text2`, `--text3`, `--def-vi` (violet highlight `#5b4cdb` light / `#c4b5fd` dark for Vietnamese translations)
- **Accents & Status**: `--accent` (`#6b5ef5` / `#7b6ef6`), `--green` (emerald), `--red` (crimson), `--amber` (`#d97706` / `#fbbf24` for stars & review state)
- **Semantic Boxes**:
  - Scenario boxes: `--scenario-bg`, `--scenario-border`, `--scenario-text`, `--scenario-label` (blue tint)
  - Exam tip boxes: `--tip-bg`, `--tip-border`, `--tip-text`, `--tip-label` (amber tint)
- **Cluster Accents**:
  - Competencies (`--cluster-c`: `#7c3aed`)
  - People (`--cluster-p`: `#059669`)
  - Organization (`--cluster-o`: `#2563eb`)
  - Workplace (`--cluster-w`: `#ea580c`)

---

## 3. Compact Layout Architecture

### Chrome & Navigation Efficiency
- **Header (`.header`)**: Single horizontal bar holding title and compact action buttons (`US`, Reset, Reshuffle, Theme, GitHub, `VI`, `?`). `.header-sub` is hidden to reclaim vertical height.
- **Toolbar Row (`.toolbar-row`)**: Combines `.filter-chip` (left) and `.pills-row` (right) on one single row.
- **Progress Hairline (`.progress-bar-wrap`)**: Sleek `2.5px` track directly beneath the toolbar row.
- **Bottom Analytics (`.quiz-bottom-panel`)**: Review filter chips (`.quiz-filter-row`) and collapsible `.quiz-stats-card` sit below the question card and `.controls` so study content stays at the top of the viewport.

### Card Headers (Single-Line Design)
- **Flashcard Header (`.study-card-header`)**: Left displays contextual `.card-domain-badge` (color-coded by cluster); right displays `.star-btn` (`★` / `☆`). No duplicate language buttons or filler prompt text inside cards.
- **Quiz Header (`.quiz-header-row`)**: Left displays `.quiz-meta-left` (`Q<n>`, `.quiz-cluster-badge`, and optional `.quiz-type-badge.sjt`); right displays `.star-btn`.

### Responsive Breakpoints (`index.html`)
- **Mobile (`< 768px`)**: `#app` max-width `480px`, `.card` padding `12px 14px 10px`, `.quiz-options` gap `6px`, `.quiz-opt` padding `8px 12px`, touch scroll momentum enabled (`-webkit-overflow-scrolling: touch`), bottom controls respect `env(safe-area-inset-bottom)`.
- **Desktop (`>= 768px`)**: `#app` max-width `1060px` (`1140px` at `>= 1200px`), compact `.header` padding (`14px 24px 8px`), `.card` padding (`16px 20px 14px`), `.quiz-opt` padding (`10px 14px`), keeping scenario + question + 4 options within typical laptop height without scrollbars.

---

## 4. Option & Feedback State Machine

1. **Default Option (`.quiz-opt`)**: `--surface2` background, subtle `--border`, scale feedback on press.
2. **Correct (`.quiz-opt.correct`)**: `--green-dim` fill, `--green-border`, `--green` text, `font-weight: 500`.
3. **Incorrect (`.quiz-opt.wrong`)**: `--red-dim` fill, `--red-border`, `--red` text.
4. **Unselected Dimmed (`.quiz-opt.dim`)**: `opacity: 0.55`.
5. **Explanation Box (`.quiz-expl-box.ok` / `.bad`)**: Renders English rationale, dashed `--def-vi` Vietnamese rationale when `VI on`, and auto-review notice / inline mastery button.
