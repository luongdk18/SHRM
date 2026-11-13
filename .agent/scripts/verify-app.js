/**
 * Headless runtime verification suite for the SHRM Study Platform.
 * Evaluates data/cards.js, data/quiz.js, and inline scripts from index.html
 * inside a mocked browser VM sandbox to verify state, persistence, and rendering.
 *
 * Usage (from repository root):
 *   node .agent/scripts/verify-app.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectDir = path.resolve(__dirname, '../..');
const htmlContent = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');

// 1. Extract inline scripts
const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
let match;
let jsCode = '';
while ((match = scriptRegex.exec(htmlContent)) !== null) {
  jsCode += match[1] + '\n';
}

console.log('Total extracted JS length:', jsCode.length);

// 2. Mock browser globals
const localStorageStore = {};
const mockLocalStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(localStorageStore, k) ? localStorageStore[k] : null),
  setItem: (k, v) => { localStorageStore[k] = String(v); },
  removeItem: (k) => { delete localStorageStore[k]; },
  clear: () => { for (const k in localStorageStore) delete localStorageStore[k]; }
};

const domElements = {};
function createMockEl(id) {
  return {
    id,
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {}
    },
    style: {},
    setAttribute: () => {},
    getAttribute: () => null,
    appendChild: () => {},
    scrollTo: () => {},
    innerHTML: '',
    textContent: '',
    children: []
  };
}

const mockDocument = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => 'dark'
  },
  getElementById: (id) => {
    if (!domElements[id]) domElements[id] = createMockEl(id);
    return domElements[id];
  },
  querySelectorAll: () => [],
  addEventListener: () => {}
};

// 3. Load external data banks
const cardsCode = fs.readFileSync(path.join(projectDir, 'data', 'cards.js'), 'utf8');
const quizCode = fs.readFileSync(path.join(projectDir, 'data', 'quiz.js'), 'utf8');

const sandbox = {
  window: {},
  document: mockDocument,
  localStorage: mockLocalStorage,
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  console,
  confirm: () => true,
  alert: () => {},
  Date,
  Math,
  JSON,
  Set,
  Map,
  Array,
  Object,
  parseInt,
  parseFloat,
  String,
  Boolean,
  requestAnimationFrame: (cb) => cb()
};
sandbox.window = sandbox;

try {
  vm.createContext(sandbox);
  vm.runInContext(cardsCode, sandbox);
  vm.runInContext(quizCode, sandbox);
  vm.runInContext(jsCode, sandbox);

  const allCards = vm.runInContext('ALL_CARDS', sandbox);
  console.log('cards.js evaluated successfully. ALL_CARDS count:', allCards.length);
  const quizData = vm.runInContext('QUIZ_DATA', sandbox);
  console.log('quiz.js evaluated successfully. QUIZ_DATA count:', quizData.length);

  const testResults = vm.runInContext(`
    (function() {
      const card = deck[0];
      const initialStarred = isCardStarred(card);
      toggleCardStar();
      const afterStarred = isCardStarred(card);
      const starredPoolLen = ALL_CARDS.filter(isCardStarred).length;

      const initialQuizReview = isQuizReviewed('q1');
      toggleQuizReview('q1');
      const afterQuizReview = isQuizReviewed('q1');

      recordQuizAttempt('People', true);
      recordQuizAttempt('People', false);
      const pStats = Object.assign({}, quizStats.People);

      // Test Quiz mode bottom panel and filter cycling
      setAppMode('quiz');
      const quizPanelDisplay = document.getElementById('quiz-bottom-panel').style.display;
      const initialQuizFilter = quiz.filterType;
      onFilterChipClick();
      const nextQuizFilter = quiz.filterType;
      onFilterChipClick();
      const reviewQuizFilter = quiz.filterType;

      // Test Flashcard mode hides bottom panel
      setAppMode('study');
      const studyPanelDisplay = document.getElementById('quiz-bottom-panel').style.display;

      // Test renderStudy front and back
      flipped = false;
      renderStudy();
      const frontPromptClass = document.getElementById('card-prompt').className;
      const frontDef = document.getElementById('card-def').textContent;
      doFlip();
      const backTerm = document.getElementById('card-term').textContent;

      // Test renderQuiz and answer
      setAppMode('quiz');
      setQuizFilterType('all');
      renderQuiz();
      const quizCardHtml = document.getElementById('card-wrap').innerHTML;
      answerQuiz(0);
      const answeredQuizCardHtml = document.getElementById('card-wrap').innerHTML;

      // Test toggle Vietnamese across modes
      toggleVietnamese();
      renderStudy();
      setAppMode('quiz');
      renderQuiz();

      return {
        initialStarred,
        afterStarred,
        starredPoolLen,
        initialQuizReview,
        afterQuizReview,
        pStats,
        quizPanelDisplay,
        initialQuizFilter,
        nextQuizFilter,
        reviewQuizFilter,
        studyPanelDisplay,
        frontPromptClass,
        frontDefExists: !!frontDef,
        backTermExists: !!backTerm,
        quizCardRendered: quizCardHtml.includes('quiz-header-row') && quizCardHtml.includes('Q'),
        answeredCardRendered: answeredQuizCardHtml.includes('quiz-expl-box')
      };
    })()
  `, sandbox);

  console.log('Test results:', testResults);
  if (!testResults.quizCardRendered || !testResults.answeredCardRendered || !testResults.frontDefExists || !testResults.backTermExists) {
    throw new Error('One or more rendering checks failed.');
  }
  console.log('ALL VERIFICATION CHECKS PASSED!');
} catch (e) {
  console.error('Execution error:', e);
  process.exit(1);
}
