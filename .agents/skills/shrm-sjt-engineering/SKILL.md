---
name: shrm-sjt-engineering
description: Psychometric design, 4 distractor trap patterns, option-length parity rules, and bilingual terminology alignment for SHRM Situational Judgment Test (SJT) items. Use when creating new quiz questions, auditing distractors, or refining explanations in data/quiz.js or scripts/fix_quiz.js.
---

# SHRM SJT Engineering & Psychometrics

## 1. Purpose of SHRM SJT Items
Situational Judgment Tests (SJTs) evaluate **strategic judgment, sequential prioritization, policy consistency, and stakeholder navigation** under workplace ambiguity — not rote memorization.

---

## 2. Anatomy of an Authentic SJT Item
Every SJT item in `data/quiz.js` contains 5 structured components:
1. **Organizational Context**: Company stage, operational pressures, or workforce structure.
2. **Key Actors & Stakes**: Specific competing parties (e.g., hiring manager vs. compliance, CHRO vs. HRBP).
3. **Core Dilemma**: Tension between speed/managerial preference and policy, equity, or legal compliance.
4. **Strategic Prompt**:
   - `"What should HR do FIRST?"` → Tests investigation/triage sequence.
   - `"What is the BEST strategic action?"` → Tests root-cause systemic resolution.
5. **Four High-Plausibility Choices (`options[0..3]`)**: Every distractor must sound defensible to an untrained line manager while failing one strict SHRM BASK principle.

---

## 3. The Four Psychometric Distractor Traps
Never include cartoonishly bad choices (e.g., *"Ignore the complaint"*, *"Immediately terminate without review"*). Build distractors using these four patterns:

| Trap Type | Mechanism | Example Error |
|---|---|---|
| **1. Sequence Trap** | Legitimate action performed out of order | Confronting an accused supervisor before interviewing confidential witnesses |
| **2. Common Sense Trap** | Practical managerial intuition violating HR law/ethics | Approving pay deductions for off-camera remote workers via handbook update |
| **3. Escalation Trap** | Over-escalating prematurely or under-escalating | Bypassing the CEO straight to the Board without a business case first |
| **4. Symptomatic / Band-Aid Trap** | Fixing surface emotion while leaving structural flaw | Paying a one-time spot bonus for systemic salary compression |

---

## 4. Anti-Guessing & Quality Controls

### Option Length Parity
Avoid making the correct answer noticeably longer or more detailed than distractors:
- **Hard failure threshold**: `min(optionLengths) / max(optionLengths) < 0.40`
- **Target parity**: `>= 0.65` across all four choices, with matching grammatical phrasing.

### Answer Distribution & Shuffling
- Static `answer` indices across the bank must remain balanced (~20%–30% each across A, B, C, D).
- At runtime, `index.html` applies `prepareQuestionChoices(q)` (Fisher-Yates shuffle) so learners evaluate content rather than option position.

---

## 5. Bilingual Terminology Reference
When authoring or updating bilingual fields (`scenarioVi`, `questionVi`, `optionsVi`, `explanationVi`), verify exact SHRM HR terminology against `.agents/skills/shrm-sjt-engineering/references/bilingual-glossary.md` to avoid literal mistranslations.
