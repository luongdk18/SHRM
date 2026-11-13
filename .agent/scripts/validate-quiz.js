/**
 * Validates data/cards.json, data/quiz.json, and JS mirror parity.
 *
 * Usage (from repository root):
 *   node .agent/scripts/validate-quiz.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const QUIZ_JSON = path.join(ROOT, 'data', 'quiz.json');
const QUIZ_JS = path.join(ROOT, 'data', 'quiz.js');
const CARDS_JSON = path.join(ROOT, 'data', 'cards.json');
const CARDS_JS = path.join(ROOT, 'data', 'cards.js');

let issues = 0;

function checkMirrorParity(jsPath, jsonPath, prefix) {
  const jsText = fs.readFileSync(jsPath, 'utf8').replace(/\r\n/g, '\n');
  const jsonText = fs.readFileSync(jsonPath, 'utf8').replace(/\r\n/g, '\n').trim();
  const stripped = jsText.slice(prefix.length).replace(/;\s*$/, '').trim();
  if (stripped !== jsonText) {
    console.error(`FAIL: Mirror mismatch between ${path.relative(ROOT, jsPath)} and ${path.relative(ROOT, jsonPath)}`);
    issues++;
  }
}

try {
  const quizData = JSON.parse(fs.readFileSync(QUIZ_JSON, 'utf8'));
  const cardsData = JSON.parse(fs.readFileSync(CARDS_JSON, 'utf8'));

  const sjtCount = quizData.filter((q) => q.type === 'sjt').length;
  const knowledgeCount = quizData.filter((q) => q.type === 'knowledge').length;
  console.log(`Loaded quiz.json: ${quizData.length} total (${sjtCount} SJT, ${knowledgeCount} Knowledge)`);
  console.log(`Loaded cards.json: ${cardsData.length} flashcards`);

  checkMirrorParity(QUIZ_JS, QUIZ_JSON, 'const QUIZ_DATA = ');
  checkMirrorParity(CARDS_JS, CARDS_JSON, 'const ALL_CARDS = ');

  quizData.forEach((q) => {
    if (!q.id || !q.question || !q.questionVi) {
      console.error('BAD missing question fields:', q.id);
      issues++;
    }
    if (!Array.isArray(q.options) || q.options.length !== 4 || new Set(q.options).size < 4) {
      console.error('BAD options:', q.id);
      issues++;
    }
    if (!Array.isArray(q.optionsVi) || q.optionsVi.length !== 4) {
      console.error('BAD optionsVi:', q.id);
      issues++;
    }
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) {
      console.error('BAD answer index:', q.id);
      issues++;
    }
    if (!q.explanation || !q.explanationVi) {
      console.error('BAD missing explanation:', q.id);
      issues++;
    }
    if (q.type === 'sjt' && (!q.scenario || !q.scenarioVi)) {
      console.error('BAD missing SJT scenario:', q.id);
      issues++;
    }
  });

  cardsData.forEach((c, idx) => {
    if (!c.term || !c.def || !c.defVi || !c.domain || !c.cluster) {
      console.error(`BAD card at index ${idx}:`, c.term);
      issues++;
    }
  });

  if (issues > 0) {
    console.error(`Validation failed with ${issues} issue(s).`);
    process.exit(1);
  }
  console.log('ALL DATA & MIRROR CHECKS PASSED!');
} catch (err) {
  console.error('Validation error:', err.message);
  process.exit(1);
}
