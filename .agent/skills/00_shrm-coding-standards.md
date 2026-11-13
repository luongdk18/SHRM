---
name: shrm-coding-standards
description: Architecture, state management, LocalStorage schema, DOM security, and runtime verification standards for the SHRM Exam Flashcards & Endless Quiz single-page app. Use whenever editing index.html JavaScript logic, adding features, modifying browser storage, or running application tests.
---

# SHRM Web App Architecture & Coding Standards

## 1. Overview & Philosophy
The **SHRM Study Platform** is a zero-dependency, client-side single-page application (SPA) built with vanilla HTML, CSS, and ES6+ JavaScript. It requires no bundler, compiler, or backend server, enabling instant loading from both `file://` local execution and static hosts such as GitHub Pages.

### Core Tenets
1. **Zero Runtime Dependencies**: No React, Vue, jQuery, or third-party JS libraries. Keep all logic in clean vanilla JS inside `index.html`.
2. **Instant Paint & Zero FOUC**: Theme initialization runs synchronously in `<head>` before body paint.
3. **Decoupled Data Architecture**: Large study banks (`data/cards.js` and `data/quiz.js`) are loaded via classic `<script>` tags with `?v=...` cache-busting parameters so `file://` usage works without CORS failures.
4. **Resilient State Persistence**: All study progress, starred queues, domain analytics, theme, and language/jurisdiction toggles persist in `window.localStorage` wrapped in `try/catch` guards.
5. **Defensive DOM Rendering**: Dynamic string interpolation must sanitize text via `escapeHtml()` to prevent XSS or broken markup.

---

## 2. Project Directory Structure

```text
.
├── index.html                  # Primary UI, CSS design tokens, and SPA controller
├── favicon.svg                 # Application brand icon
├── README.md                   # User and contributor documentation
├── data/
│   ├── cards.js                # 392 flashcards assigned to ALL_CARDS
│   ├── cards.json              # 2-space pretty-printed JSON mirror of cards
│   ├── quiz.js                 # 307 SJT & Knowledge items assigned to QUIZ_DATA
│   └── quiz.json               # 2-space pretty-printed JSON mirror of quiz items
├── scripts/
│   └── fix_quiz.js             # Maintenance and quality-pass script for quiz banks
└── .agent/
    ├── scripts/                # QA verification scripts and references
    └── skills/                 # Self-contained agent skills
```

---

## 3. Data Schemas

### Flashcard Schema (`data/cards.js`)
```json
{
  "cluster": "People",
  "domain": "Total Rewards",
  "term": "Job Evaluation",
  "def": "Systematic process of determining the relative worth of jobs within an organization.",
  "defVi": "Quy trình có hệ thống nhằm xác định giá trị tương đối của các vị trí công việc trong tổ chức.",
  "scenario": "An HR director uses a point-factor method to evaluate positions across departments...",
  "scenarioVi": "Một giám đốc HR sử dụng phương pháp điểm-yếu tố để đánh giá các vị trí...",
  "tip": "Recognize point-factor, ranking, and classification methods.",
  "tipVi": "Nhận diện phương pháp point-factor, ranking và classification."
}
```

### Quiz Item Schema (`data/quiz.js`)
```json
{
  "id": "HARD_SJT_01",
  "type": "sjt",
  "scenario": "...",
  "scenarioVi": "...",
  "question": "What is the FIRST step HR should take in responding to this allegation?",
  "questionVi": "Bước ĐẦU TIÊN HR nên thực hiện để phản hồi cáo buộc này là gì?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "optionsVi": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
  "answer": 1,
  "explanation": "...",
  "explanationVi": "...",
  "cluster": "Workplace"
}
```
- `type`: `'sjt'` or `'knowledge'`
- `answer`: 0-based index (`0` = A, `1` = B, `2` = C, `3` = D)
- `cluster`: `'People'`, `'Organization'`, `'Workplace'`, or `'Competencies'`

---

## 4. State Management & Key Algorithms

### Application State (`index.html`)
- `appMode`: `'study' | 'quiz'`
- Study state: `deck`, `done`, `flipped`, `filter` (`all`, `cluster`, `domain`, `starred`), `sessions`, `starredCards` (`Set`)
- Quiz state (`quiz`): `queue`, `pool`, `index`, `correct`, `answered`, `current`, `currentChoices`, `selected`, `locked`, `showVi`, `filterType` (`'all' | 'sjt' | 'review'`)
- Global toggles: `hideUsLaw` (default `true`), `showVietnamese` (default `true`)

### Fisher-Yates & Runtime Option Shuffling
Both flashcard decks and quiz answer choices are shuffled using Fisher-Yates. In quiz mode, `prepareQuestionChoices(q)` maps displayed positions `[0..3]` to original option indices stored in `quiz.currentChoices`, preventing positional answer memorization.

### Endless Queue & Domain Stats
When `quiz.queue` empties, it reshuffles `quiz.pool` automatically. Answering a question updates `quizStats` (`{ People, Organization, Workplace }`) and automatically adds incorrect items into `quizReview`.

---

## 5. LocalStorage Persistence Keys

| Key | Format | Purpose |
|---|---|---|
| `shrm-flashcards-theme` | `'light' \| 'dark'` | Active UI color theme |
| `shrm-flashcards-progress-v1` | JSON string | Per-filter flashcard `deck` and `done` state |
| `shrm-flashcards-hide-us-law` | `'1' \| '0'` | Hides U.S. Employment Law domain (`'1'` by default) |
| `shrm-flashcards-show-vi` | `'1' \| '0'` | Enables bilingual Vietnamese UI & translations (`'1'` by default) |
| `shrm-flashcards-starred-v1` | JSON array | Bookmarked/difficult flashcard IDs |
| `shrm-quiz-review-v1` | JSON array | Missed or manually starred quiz question IDs |
| `shrm-quiz-domain-stats-v1` | JSON object | Per-cluster `{ correct, total }` quiz accuracy |
| `shrm-quiz-stats-collapsed` | `'1' \| '0'` | Collapsible state of the bottom domain stats panel |

---

## 6. Verification & DOM Guidelines
- Always guard optional DOM elements (e.g., `#card-tag`, `#quiz-bottom-panel`) before mutating properties after layout updates.
- Escape dynamic card/quiz strings using `escapeHtml()`.
- Manage scroll position smoothly with `scrollCardToTop()` on card advance and `scrollCardToBottom()` on reveal/answer.
- Before committing changes to `index.html`, run the headless verification script from `<PROJECT_ROOT>`:

```bash
node .agent/scripts/verify-app.js
```
