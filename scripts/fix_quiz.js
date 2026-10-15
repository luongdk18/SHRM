/**
 * SHRM Quiz quality pass:
 * - OCR / typography cleanup
 * - Harder, more SHRM-like distractors (no cartoon wrongs)
 * - Answer-key rebalance for AUTH / CREATIVE / HARD banks
 * - New high-difficulty items
 * - Ensure runtime option shuffle exists in index.html
 *
 * Data lives in data/quiz.js (and data/quiz.json mirror).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const QUIZ_JS = path.join(ROOT, 'data', 'quiz.js');
const QUIZ_JSON = path.join(ROOT, 'data', 'quiz.json');

function loadQuizData() {
  // Prefer external data file (post-split layout)
  if (fs.existsSync(QUIZ_JS)) {
    const t = fs.readFileSync(QUIZ_JS, 'utf8');
    const eq = t.indexOf('=');
    let json = t.slice(eq + 1).trim();
    if (json.endsWith(';')) json = json.slice(0, -1).trim();
    return JSON.parse(json);
  }
  // Fallback: legacy inline in index.html
  const html = fs.readFileSync(INDEX, 'utf8');
  const startMarker = 'const QUIZ_DATA = ';
  const start = html.indexOf(startMarker);
  if (start < 0) throw new Error('QUIZ_DATA not found in data/quiz.js or index.html');
  const after = html.slice(start + startMarker.length);
  let depth = 0, end = 0, started = false, inStr = false, esc = false;
  for (let i = 0; i < after.length; i++) {
    const c = after[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === '"') { inStr = false; continue; }
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '[') { depth++; started = true; }
    else if (c === ']') {
      depth--;
      if (started && depth === 0) { end = i + 1; break; }
    }
  }
  return JSON.parse(after.slice(0, end));
}

let data = loadQuizData();
console.log('Loaded', data.length, 'questions');

// ── helpers ──────────────────────────────────────────────────────────────
function cleanText(s) {
  if (s == null) return s;
  let t = String(s);
  t = t
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u00a0/g, ' ')
    .replace(/^[_`\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
  // OCR / scan artifacts
  const map = [
    [/riegotiations/gi, 'negotiations'],
    [/süggest/gi, 'suggest'],
    [/strüctured/gi, 'structured'],
    [/mariage/gi, 'manage'],
    [/\barid alignment\b/gi, 'and alignment'],
    [/\birivestigation\b/gi, 'investigation'],
    [/\bHallow\b/g, 'Hollow'],
    [/\bhallow\b/g, 'hollow'],
    [/\bAl\b/g, 'AI'], // when used as Artificial Intelligence typo
    [/\bInitatives\b/g, 'Initiatives'],
    [/\bIndividuais\b/g, 'Individuals'],
    [/\bImpacting\b/g, 'impacting'],
    [/\bImpact\b/g, 'impact'],
    [/^Firm\d+\s+/i, ''],
    [/^Question\s+\d+[:.]\d+\s+of\s+\d+\s+/i, ''],
    [/\s{2,}/g, ' '],
  ];
  for (const [re, rep] of map) t = t.replace(re, rep);
  return t;
}

function cleanQuestion(q) {
  q.question = cleanText(q.question);
  q.questionVi = cleanText(q.questionVi);
  q.scenario = cleanText(q.scenario);
  q.scenarioVi = cleanText(q.scenarioVi);
  q.explanation = cleanText(q.explanation);
  q.explanationVi = cleanText(q.explanationVi);
  if (Array.isArray(q.options)) q.options = q.options.map(cleanText);
  if (Array.isArray(q.optionsVi)) q.optionsVi = q.optionsVi.map(cleanText);
  return q;
}

/** Rotate options so correct answer lands on targetIndex (0-3). */
function setAnswerIndex(q, targetIndex) {
  const cur = q.answer;
  if (cur === targetIndex) return q;
  const order = [0, 1, 2, 3];
  // swap cur with targetIndex
  [order[cur], order[targetIndex]] = [order[targetIndex], order[cur]];
  // Actually we need permute so that item that was at `cur` moves to `targetIndex`
  // Simpler: build new arrays by placing correct at target and rotating rest
  const correctOpt = q.options[cur];
  const correctVi = q.optionsVi ? q.optionsVi[cur] : null;
  const others = q.options.map((o, i) => i).filter(i => i !== cur);
  const newOpts = [null, null, null, null];
  const newVi = q.optionsVi ? [null, null, null, null] : null;
  newOpts[targetIndex] = correctOpt;
  if (newVi) newVi[targetIndex] = correctVi;
  let oi = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIndex) continue;
    const src = others[oi++];
    newOpts[i] = q.options[src];
    if (newVi) newVi[i] = q.optionsVi[src];
  }
  q.options = newOpts;
  if (newVi) q.optionsVi = newVi;
  q.answer = targetIndex;
  return q;
}

function rebalanceGroup(idsOrPrefix, preferredPattern) {
  // preferredPattern: array of answer indices cycling, e.g. [0,1,2,3]
  const items = typeof idsOrPrefix === 'string'
    ? data.filter(q => q.id.startsWith(idsOrPrefix))
    : data.filter(q => idsOrPrefix.includes(q.id));
  items.forEach((q, i) => {
    const target = preferredPattern[i % preferredPattern.length];
    setAnswerIndex(q, target);
  });
  console.log('Rebalanced', items.length, 'items for', typeof idsOrPrefix === 'string' ? idsOrPrefix : 'list');
}

// ── 1. Global clean ──────────────────────────────────────────────────────
data.forEach(cleanQuestion);

// Special: PE_Q77 answer is weak (telecommuting ≠ knowledge worker). Fix content.
// Special AI typo: only replace Al when clearly AI (feature/artificial)
data.forEach(q => {
  if (q.question && /artificial intelligence \(Al\)/i.test(q.question)) {
    q.question = q.question.replace(/\(Al\)/g, '(AI)');
  }
  if (q.questionVi) q.questionVi = q.questionVi.replace(/\(Al\)/g, '(AI)');
});

// ── 2. Targeted rewrites (harder, SHRM-like) ─────────────────────────────
const rewrites = {
  PE_Q12: {
    options: [
      'Revise the code of ethics to ensure it is clearly written and accessible',
      'Ask management to openly discuss and visibly support the code of ethics',
      'Expand the ethics hotline and increase the frequency of compliance audits',
      'Implement a system for employees to reaffirm the code of ethics annually',
    ],
    optionsVi: [
      'Chỉnh sửa bộ quy tắc đạo đức để bảo đảm rõ ràng và dễ tiếp cận',
      'Đề nghị ban quản lý công khai thảo luận và thể hiện ủng hộ bộ quy tắc đạo đức',
      'Mở rộng đường dây nóng đạo đức và tăng tần suất kiểm toán tuân thủ',
      'Triển khai cơ chế để nhân viên tái xác nhận bộ quy tắc đạo đức hằng năm',
    ],
    answer: 1,
    explanation:
      'Ethics violations drop fastest when leaders set tone at the top: managers must openly discuss and model the code. Revising wording, more audits/hotlines, or annual reaffirmation help later but do not fix weak leadership endorsement — the usual first root cause.',
    explanationVi:
      'Vi phạm đạo đức giảm nhanh nhất khi lãnh đạo tạo "tone at the top": quản lý phải thảo luận công khai và làm gương theo quy tắc. Sửa văn bản, tăng kiểm toán/đường dây nóng, hay tái xác nhận hằng năm hữu ích ở bước sau, nhưng không khắc phục việc lãnh đạo chưa ủng hộ — nguyên nhân gốc thường gặp.',
  },

  PE_Q20: {
    options: [
      'Establish an intergenerational mentoring program that pairs legacy and newer employees',
      'Launch a skills-refresh curriculum for longer-tenured staff while keeping teams age-segregated by project',
      'Rebalance headcount through market-aligned voluntary early-retirement packages for legacy staff',
      'Require all employees to re-qualify for their roles through updated job analyses and reassessments',
    ],
    optionsVi: [
      'Thiết lập mentoring liên thế hệ ghép nhân viên lâu năm với nhân viên mới',
      'Triển khai chương trình cập nhật kỹ năng cho nhân viên lâu năm nhưng giữ tách đội theo độ tuổi theo dự án',
      'Cân đối nhân sự bằng gói nghỉ hưu sớm tự nguyện theo thị trường cho đội ngũ lâu năm',
      'Yêu cầu mọi nhân viên tái đạt chuẩn vai trò qua job analysis và đánh giá lại',
    ],
    answer: 0,
    explanation:
      'Demographic friction after growth is best addressed by integrating generations, not separating or exiting them. Intergenerational mentoring builds collaboration and knowledge transfer. Age-segregated training, early retirement, and mass re-qualification treat tenure as a deficit and often worsen morale and risk.',
    explanationVi:
      'Ma sát nhân khẩu sau tăng trưởng nên được xử lý bằng cách hòa nhập các thế hệ, không tách hay loại bỏ. Mentoring liên thế hệ tăng hợp tác và chuyển giao tri thức. Đào tạo tách theo tuổi, nghỉ hưu sớm và tái chuẩn hóa hàng loạt coi thâm niên là thiếu hụt, dễ làm tinh thần xấu hơn và tăng rủi ro.',
  },

  PE_Q23: {
    // Keep correct "listen" but make wrongs more plausible (all professional)
    options: [
      'Interview only the employees who are openly refusing the plan and document resistance for progressive discipline',
      'Hold a meeting with employees and listen to their concerns about the plan before reinforcing expectations',
      'Present a detailed benefits case for the plan and require written acknowledgment of compliance from each employee',
      'Ask the CFO to brief the team on financial urgency so employees accept the plan without further delay',
    ],
    optionsVi: [
      'Chỉ phỏng vấn nhân viên công khai từ chối kế hoạch và ghi nhận kháng cự để áp dụng kỷ luật lũy tiến',
      'Tổ chức họp với nhân viên, lắng nghe quan ngại về kế hoạch trước khi củng cố kỳ vọng',
      'Trình bày lợi ích chi tiết của kế hoạch và yêu cầu mỗi người ký xác nhận tuân thủ',
      'Nhờ CFO brief về áp lực tài chính để nhân viên chấp nhận kế hoạch, không trì hoãn thêm',
    ],
    answer: 1,
    explanation:
      'Change resistance is best addressed first by understanding concerns (listen), then responding. Jumping to discipline, forced acknowledgment, or executive pressure may create compliance theater without buy-in and can escalate conflict.',
    explanationVi:
      'Kháng cự thay đổi nên được xử lý trước bằng cách thấu hiểu quan ngại (lắng nghe), rồi mới phản hồi. Nhảy sang kỷ luật, ép ký xác nhận, hay gây áp lực từ lãnh đạo dễ tạo tuân thủ hình thức, thiếu cam kết và làm căng thẳng leo thang.',
  },

  PE_Q42: {
    options: [
      'Draft a multi-year culture transformation roadmap and announce it company-wide within two weeks',
      'Meet with leadership to clarify desired culture outcomes and diagnose current gaps with evidence',
      'Rewrite the corporate values statement so it better reflects the culture the company wants',
      'Roll out mandatory culture workshops for all managers while leadership finalizes priorities',
    ],
    optionsVi: [
      'Soạn lộ trình chuyển đổi văn hóa nhiều năm và công bố toàn công ty trong hai tuần',
      'Gặp lãnh đạo để làm rõ kết quả văn hóa mong muốn và chẩn đoán khoảng trống hiện tại bằng bằng chứng',
      'Viết lại tuyên bố giá trị công ty cho khớp văn hóa mong muốn',
      'Triển khai workshop văn hóa bắt buộc cho mọi quản lý trong lúc lãnh đạo hoàn thiện ưu tiên',
    ],
    answer: 1,
    explanation:
      'Culture work starts with alignment on goals and a fact-based gap diagnosis with leadership. Announcing roadmaps, rewriting values, or launching workshops before that diagnosis often solves the wrong problem and burns credibility.',
    explanationVi:
      'Việc văn hóa bắt đầu từ thống nhất mục tiêu và chẩn đoán khoảng trống dựa trên bằng chứng với lãnh đạo. Công bố lộ trình, viết lại giá trị hay mở workshop trước khi chẩn đoán thường giải sai vấn đề và làm mất uy tín.',
  },

  PE_Q77: {
    // Knowledge economy → knowledge workers; telecommuting is a weak distractor-as-correct
    question:
      'An economic shift from value created by manufacturing to value created by knowledge results in a noticeable increase in the use of which type of worker?',
    questionVi:
      'Sự chuyển dịch kinh tế từ giá trị tạo ra bởi sản xuất sang giá trị tạo ra bởi tri thức dẫn đến sự gia tăng rõ rệt việc sử dụng loại người lao động nào?',
    options: [
      'Contingent manufacturing laborers on short production cycles',
      'Part-time retail associates with seasonal demand patterns',
      'Temporary warehouse staff supporting logistics peaks',
      'Knowledge workers who apply expertise, analysis, and judgment',
    ],
    optionsVi: [
      'Lao động sản xuất thời vụ theo chu kỳ sản xuất ngắn',
      'Nhân viên bán lẻ bán thời gian theo nhu cầu mùa vụ',
      'Nhân sự kho tạm thời hỗ trợ đỉnh logistics',
      'Knowledge worker — người áp dụng chuyên môn, phân tích và phán đoán',
    ],
    answer: 3,
    explanation:
      'A knowledge economy increases demand for knowledge workers — people whose primary contribution is expertise, analysis, and judgment rather than physical production. Contingent, part-time, and temporary roles can exist in any economy and do not specifically define the manufacturing-to-knowledge shift.',
    explanationVi:
      'Kinh tế tri thức làm tăng nhu cầu knowledge worker — người đóng góp chủ yếu bằng chuyên môn, phân tích và phán đoán, không phải sản xuất vật lý. Vai trò thời vụ, bán thời gian, tạm thời có ở mọi nền kinh tế và không đặc trưng cho chuyển dịch từ sản xuất sang tri thức.',
  },

  PE_Q98: {
    options: ['Functional', 'Matrix', 'Divisional', 'Hollow'],
    optionsVi: [
      'Chức năng (functional)',
      'Ma trận (matrix)',
      'Theo bộ phận (divisional)',
      'Rỗng / hollow',
    ],
    answer: 1,
  },

  PE_Q104: {
    options: [
      'Mentoring paired with large-scale reorganization of reporting lines',
      'External recruiting paired with annual engagement surveys',
      'Compensation benchmarking paired with expanded benefits menus',
      'Coaching and structured development assignments for high-potential talent',
    ],
    optionsVi: [
      'Mentoring kèm tái cấu trúc quy mô lớn đường báo cáo',
      'Tuyển ngoài kèm khảo sát gắn kết hằng năm',
      'Benchmark đãi ngộ kèm mở rộng menu phúc lợi',
      'Coaching và assignment phát triển có cấu trúc cho nhân tài tiềm năng',
    ],
    answer: 3,
    explanation:
      'Succession strength comes from growing internal capability: coaching plus developmental assignments. Reorg, external hiring, and pay/benefits may support talent strategy but do not by themselves build a ready bench of successors.',
    explanationVi:
      'Sức mạnh succession đến từ phát triển năng lực nội bộ: coaching kèm assignment phát triển. Tái cấu trúc, tuyển ngoài và đãi ngộ/phúc lợi có thể hỗ trợ chiến lược nhân tài nhưng tự chúng không xây được "ghế dự bị" sẵn sàng kế nhiệm.',
  },

  PE_Q105: {
    options: [
      'Negotiating retention packages for the target company\'s top revenue producers before close',
      'Drafting the Day-1 all-hands communication plan for employees of both companies',
      'Accelerating IT systems cutover so the combined company realizes synergy targets faster',
      'Analyzing cultural compatibility and people-related risks of the company to be acquired',
    ],
    optionsVi: [
      'Đàm phán gói giữ chân top doanh số của công ty mục tiêu trước khi chốt deal',
      'Soạn kế hoạch truyền thông all-hands Ngày 1 cho nhân viên cả hai công ty',
      'Đẩy nhanh cutover hệ thống IT để công ty hợp nhất đạt synergy sớm hơn',
      'Phân tích tương thích văn hóa và rủi ro con người của công ty sẽ mua lại',
    ],
    answer: 3,
    explanation:
      'In M&A due diligence, HR\'s distinctive strategic contribution is cultural and people-risk analysis — a leading predictor of post-deal failure. Retention deals, Day-1 comms, and systems speed are important but are execution or later-stage activities, not the core strategic due-diligence role.',
    explanationVi:
      'Trong due diligence M&A, đóng góp chiến lược đặc thù của HR là phân tích văn hóa và rủi ro con người — yếu tố dự báo thất bại sau deal hàng đầu. Giữ chân, truyền thông Ngày 1 và tốc độ hệ thống quan trọng nhưng thuộc thực thi/giai đoạn sau, không phải vai trò due diligence chiến lược cốt lõi.',
  },

  PE_Q127: {
    question:
      "At which step in the development of an organization's corporate social responsibility (CSR) program is HR representation most critical?",
    questionVi:
      'Ở bước nào trong quá trình xây dựng chương trình trách nhiệm xã hội doanh nghiệp (CSR) thì sự tham gia của HR là quan trọng nhất?',
  },

  PE_Q129: {
    question:
      "Which element of a company's partnership with the local community is best for sustaining enduring relationships of respect, goodwill, and mutual benefit?",
    questionVi:
      'Yếu tố nào trong quan hệ đối tác của công ty với cộng đồng địa phương giúp duy trì mối quan hệ bền vững dựa trên tôn trọng, thiện chí và lợi ích chung?',
  },

  PE_Q131: {
    // Real CSR strategy typology used in SHRM materials
    options: ['Transformational', 'Transactional', 'Defensive', 'Compliance-focused'],
    optionsVi: [
      'Chuyển hóa (transformational)',
      'Giao dịch (transactional)',
      'Phòng thủ (defensive)',
      'Tập trung tuân thủ (compliance-focused)',
    ],
    answer: 0,
    explanation:
      'Collaborating with competitors to fund industry-level renewable research is a transformational sustainability strategy — changing the system, not just one firm\'s footprint. Transactional trades value for discrete benefits; defensive and compliance-focused strategies react to pressure or minimum legal requirements.',
    explanationVi:
      'Hợp tác với đối thủ để tài trợ nghiên cứu năng lượng tái tạo cấp ngành là chiến lược bền vững transformational — thay đổi hệ thống, không chỉ dấu chân một công ty. Transactional đổi giá trị lấy lợi ích rời rạc; defensive và compliance-focused phản ứng áp lực hoặc chỉ đạt mức pháp lý tối thiểu.',
  },

  BD_Q9: {
    options: [
      'Let employees know that illegal substance use is grounds for termination',
      'Inform employees that workplace communications are not private and activity may be monitored',
      'Establish an anonymous hotline and encourage reporting of safety violations',
      'Place video surveillance cameras in visible areas around the workplace',
    ],
    optionsVi: [
      'Thông báo cho nhân viên rằng sử dụng chất bất hợp pháp là căn cứ sa thải',
      'Thông báo rằng liên lạc tại nơi làm việc không riêng tư và hoạt động có thể bị giám sát',
      'Thiết lập đường dây nóng ẩn danh và khuyến khích báo cáo vi phạm an toàn',
      'Lắp camera giám sát ở các khu vực dễ thấy quanh nơi làm việc',
    ],
    answer: 1,
  },

  BD_Q42: {
    options: [
      'Use forced ranking against peers so each employee understands relative standing',
      'Listen openly and discuss both strengths and development needs with two-way dialogue',
      'Limit the discussion to quantitative KPIs to keep the review fully objective',
      'Focus the meeting on documenting deficiencies to strengthen any future disciplinary file',
    ],
    optionsVi: [
      'Dùng xếp hạng ép buộc so với đồng nghiệp để mỗi người hiểu vị thế tương đối',
      'Lắng nghe cởi mở và thảo luận cả điểm mạnh lẫn nhu cầu phát triển theo đối thoại hai chiều',
      'Giới hạn thảo luận ở KPI định lượng để buổi đánh giá hoàn toàn khách quan',
      'Tập trung ghi nhận thiếu sót để củng cố hồ sơ kỷ luật sau này',
    ],
    answer: 1,
    explanation:
      'Effective appraisal is a two-way developmental conversation: listen, recognize strengths, and jointly address gaps. Forced ranking, KPI-only, or documentation-for-discipline mindsets reduce trust and miss the purpose of performance management.',
    explanationVi:
      'Đánh giá hiệu quả là đối thoại phát triển hai chiều: lắng nghe, ghi nhận điểm mạnh và cùng xử lý khoảng trống. Xếp hạng ép buộc, chỉ KPI, hay tư duy "ghi hồ sơ để kỷ luật" làm giảm tin cậy và lệch mục tiêu quản trị hiệu suất.',
  },

  BD_Q78: {
    options: ['Consideration', 'Culture', 'Coaching', 'Communication'],
    optionsVi: [
      'Consideration (Cân nhắc)',
      'Culture (Văn hóa)',
      'Coaching (Huấn luyện)',
      'Communication (Giao tiếp)',
    ],
    answer: 1,
    explanation:
      'Bauer\'s Four Cs of onboarding are Compliance, Clarification, Culture, and Connection. Of the listed options, only Culture is one of the Four Cs. Communication and coaching support onboarding but are not named pillars; consideration is not part of the model.',
    explanationVi:
      'Four Cs onboarding của Bauer gồm Compliance, Clarification, Culture và Connection. Trong các phương án, chỉ Culture thuộc Four Cs. Communication và coaching hỗ trợ onboarding nhưng không phải trụ cột được đặt tên; consideration không thuộc mô hình.',
  },

  BD_Q80: {
    options: [
      'Stimulating, meaningful work',
      'Additional paid vacation days',
      'Quarterly incentive bonus',
      'Enhanced job security guarantees',
    ],
    optionsVi: [
      'Công việc kích thích, có ý nghĩa',
      'Thêm ngày phép có lương',
      'Thưởng khuyến khích theo quý',
      'Cam kết an ninh việc làm mạnh hơn',
    ],
    answer: 0,
    explanation:
      'Intrinsic motivators come from the work itself (challenge, meaning, mastery). Vacation, incentive pay, and job security are extrinsic — external rewards or conditions.',
    explanationVi:
      'Động lực nội tại đến từ bản thân công việc (thử thách, ý nghĩa, làm chủ). Phép năm, thưởng khuyến khích và an ninh việc làm là ngoại tại — phần thưởng/điều kiện bên ngoài.',
  },

  BD_Q103: {
    options: [
      'Full-time employees often become coaches and connectors who integrate gig workers into team norms',
      'Employers must extend full-time benefits packages to gig workers on the same team by default',
      'Communication problems arise mainly because gig workers and full-timers are from different generations',
      'Most full-time employees will formally request conversion to gig status within one year',
    ],
    optionsVi: [
      'Nhân viên toàn thời gian thường trở thành coach/connector hòa nhập gig worker vào chuẩn nhóm',
      'Người sử dụng lao động mặc định phải mở rộng gói phúc lợi full-time cho gig worker cùng nhóm',
      'Khó giao tiếp chủ yếu vì gig worker và full-time thuộc các thế hệ khác nhau',
      'Hầu hết nhân viên full-time sẽ chính thức xin chuyển sang gig trong một năm',
    ],
    answer: 0,
    explanation:
      'Mixed FT + gig teams typically require full-timers to coach and connect contingent contributors into workflows and culture. Benefits parity is not automatic; generational difference is not the core issue; mass conversion requests are not a likely consequence.',
    explanationVi:
      'Nhóm hỗn hợp FT + gig thường cần nhân viên chính thức coach và kết nối người đóng góp thời vụ vào quy trình và văn hóa. Đồng bộ phúc lợi không tự động; khác thế hệ không phải vấn đề cốt lõi; xin chuyển hàng loạt sang gig không phải hệ quả thường gặp.',
  },

  BD_Q108: {
    options: [
      'Whistleblower protection',
      'Progressive discipline',
      'At-will employment',
      'Constructive discharge',
    ],
    optionsVi: [
      'Bảo vệ người tố giác (whistleblower protection)',
      'Kỷ luật lũy tiến (progressive discipline)',
      'Việc làm at-will',
      'Sa thải mang tính xây dựng (constructive discharge)',
    ],
    answer: 0,
    explanation:
      'Whistleblower protection specifically shields employees who report violations from retaliation. Progressive discipline governs performance/conduct consequences; at-will describes termination flexibility; constructive discharge is a legal claim when conditions force resignation.',
    explanationVi:
      'Whistleblower protection bảo vệ người báo cáo vi phạm khỏi trả đũa. Kỷ luật lũy tiến điều chỉnh hậu quả hiệu suất/hành vi; at-will mô tả linh hoạt chấm dứt HĐLĐ; constructive discharge là khiếu nại pháp lý khi điều kiện buộc thôi việc.',
  },

  BD_Q130: {
    options: ['Agency theory', 'Resource-based theory', 'Stakeholder theory', 'Shareholder theory'],
    optionsVi: [
      'Thuyết đại diện (agency theory)',
      'Thuyết dựa trên nguồn lực (resource-based theory)',
      'Thuyết các bên liên quan (stakeholder theory)',
      'Thuyết cổ đông (shareholder theory)',
    ],
    answer: 2,
    explanation:
      'CSR rests on stakeholder theory: the firm is accountable to employees, customers, communities, and the environment — not only shareholders (shareholder theory). Agency and resource-based theories address other strategy/governance questions.',
    explanationVi:
      'CSR dựa trên stakeholder theory: doanh nghiệp chịu trách nhiệm với nhân viên, khách hàng, cộng đồng và môi trường — không chỉ cổ đông (shareholder theory). Agency và resource-based giải quyết câu hỏi chiến lược/quản trị khác.',
  },
};

// Apply rewrites
let rewriteCount = 0;
for (const [id, patch] of Object.entries(rewrites)) {
  const q = data.find(x => x.id === id);
  if (!q) {
    console.warn('Missing id for rewrite:', id);
    continue;
  }
  Object.assign(q, patch);
  cleanQuestion(q);
  rewriteCount++;
}
console.log('Applied rewrites:', rewriteCount);

// ── 3. Soften remaining cartoonish wrongs across bank ────────────────────
const cartoonRe =
  /reprimand publicly|publicly reprimand|publicly shame|ignore the (issue|problem|complaint)|do nothing|yell at|threaten to (fire|terminat)|without any investigation|tell them to stop complaining/i;

let cartoonFixes = 0;
data.forEach(q => {
  q.options.forEach((opt, i) => {
    if (i === q.answer) return;
    if (!cartoonRe.test(opt)) return;
    // Replace with a plausible-but-wrong professional action
    if (q.type === 'sjt') {
      q.options[i] =
        'Escalate immediately to executive leadership and request a company-wide policy change before gathering additional facts';
      if (q.optionsVi)
        q.optionsVi[i] =
          'Leo thang ngay lên ban điều hành và yêu cầu đổi chính sách toàn công ty trước khi thu thập thêm sự kiện';
    } else {
      q.options[i] = 'Delay action until a full year of trend data is available';
      if (q.optionsVi) q.optionsVi[i] = 'Hoãn hành động cho đến khi có đủ dữ liệu xu hướng cả năm';
    }
    cartoonFixes++;
  });
});
console.log('Cartoonish option fixes:', cartoonFixes);

// ── 4. Rebalance AUTH / CREATIVE / HARD answer positions ─────────────────
rebalanceGroup('AUTH_SJT_', [0, 1, 2, 3, 1, 2, 3, 0, 2, 1]);
rebalanceGroup('CREATIVE_SJT_', [0, 1, 2, 3, 1, 2, 0, 3, 2, 1]);
rebalanceGroup('HARD_SJT_', [0, 1, 2, 3, 1, 2, 3, 0, 2, 1]);

// ── 5. Remove a few low-value / broken items; add harder SHRM-style items ─
const removeIds = new Set([
  // Extremely thin / near-tautology knowledge that trains guessing, not judgment
  // Keep most authentic PE/BD items; only drop if still broken after clean
]);

// If PE_Q34 still has nonsense after clean, rewrite it fully
const pe34 = data.find(q => q.id === 'PE_Q34');
if (pe34) {
  Object.assign(pe34, {
    question: 'Which statement best describes a common form of workplace conflict?',
    questionVi: 'Phát biểu nào mô tả đúng nhất một dạng xung đột thường gặp tại nơi làm việc?',
    options: [
      'Horizontal conflict occurs only after union–management negotiations have formally failed',
      'Interpersonal (social) conflict includes disagreement between peers, such as competition for resources',
      'Subjective conflict always has exactly one correct resolution path',
      'Intraorganizational conflict refers exclusively to lawsuits filed by external parties',
    ],
    optionsVi: [
      'Xung đột ngang chỉ xảy ra sau khi đàm phán công đoàn–ban quản lý đã chính thức thất bại',
      'Xung đột giữa các cá nhân (xã hội) gồm bất đồng giữa đồng nghiệp, ví dụ cạnh tranh nguồn lực',
      'Xung đột chủ quan luôn chỉ có đúng một đường giải quyết',
      'Xung đột nội bộ tổ chức chỉ đề cập kiện tụng do bên ngoài khởi kiện',
    ],
    answer: 1,
    explanation:
      'Workplace conflict includes interpersonal/social conflict among peers (competition, personality, resources). It is not limited to failed union talks, single-path problems, or external litigation.',
    explanationVi:
      'Xung đột nơi làm việc gồm xung đột giữa cá nhân/đồng nghiệp (cạnh tranh, tính cách, nguồn lực). Không giới hạn ở đàm phán công đoàn thất bại, bài toán một lời giải, hay kiện tụng bên ngoài.',
  });
  cleanQuestion(pe34);
}

// Drop removeIds
const before = data.length;
data = data.filter(q => !removeIds.has(q.id));
console.log('Removed', before - data.length);

// New high-quality SHRM-style questions (mix SJT + knowledge)
const newQuestions = [
  {
    id: 'SHRM_HARD_K01',
    type: 'knowledge',
    scenario: '',
    scenarioVi: '',
    question:
      'An HR leader presents turnover data showing higher exit rates among high performers in one business unit. Which analytical approach best turns this finding into a decision-ready recommendation for executives?',
    questionVi:
      'Một lãnh đạo HR trình dữ liệu nghỉ việc cho thấy tỷ lệ nghỉ cao hơn ở nhân viên hiệu suất cao tại một đơn vị. Cách tiếp cận phân tích nào biến phát hiện này thành khuyến nghị sẵn sàng quyết định cho ban điều hành?',
    options: [
      'Report the raw turnover percentage for that unit and request additional headcount budget',
      'Combine turnover with performance, engagement, pay equity, and exit themes to isolate likely drivers and options',
      'Benchmark the unit only against industry average turnover and adopt the peer retention program wholesale',
      'Replace the unit leader immediately because high-performer exits prove a toxic climate',
    ],
    optionsVi: [
      'Báo cáo % nghỉ việc thô của đơn vị và xin thêm ngân sách headcount',
      'Kết hợp nghỉ việc với hiệu suất, gắn kết, công bằng lương và chủ đề nghỉ việc để tách động lực có khả năng và các phương án',
      'Chỉ benchmark đơn vị với trung bình ngành và áp dụng nguyên xi chương trình giữ chân của đối thủ',
      'Thay lãnh đạo đơn vị ngay vì nghỉ của high performer chứng minh môi trường độc hại',
    ],
    answer: 1,
    explanation:
      'Executives need decision-ready insight: integrate multiple data sources to identify drivers and options. Raw rates, blind benchmarking, or jumping to leader removal skip analysis and risk wrong interventions.',
    explanationVi:
      'Ban điều hành cần insight sẵn sàng quyết định: tích hợp nhiều nguồn dữ liệu để xác định động lực và phương án. Tỷ lệ thô, benchmark mù, hay sa thải lãnh đạo ngay bỏ qua phân tích và dễ can thiệp sai.',
  },
  {
    id: 'SHRM_HARD_K02',
    type: 'knowledge',
    scenario: '',
    scenarioVi: '',
    question:
      'Which statement best distinguishes adverse impact from disparate treatment in selection?',
    questionVi:
      'Phát biểu nào phân biệt đúng nhất adverse impact (tác động bất lợi) và disparate treatment (đối xử khác biệt) trong tuyển chọn?',
    options: [
      'Adverse impact requires proof of hostile intent; disparate treatment is shown only by statistics',
      'Disparate treatment is intentional different treatment of individuals; adverse impact is a facially neutral practice that disproportionately excludes a protected group',
      'Both terms mean the same legal standard and differ only by which government agency investigates',
      'Adverse impact applies only to promotion; disparate treatment applies only to hiring',
    ],
    optionsVi: [
      'Adverse impact cần chứng minh ý đồ thù địch; disparate treatment chỉ chứng minh bằng thống kê',
      'Disparate treatment là đối xử khác biệt cố ý với cá nhân; adverse impact là thực tiễn trung lập trên giấy nhưng loại trừ không cân xứng một nhóm được bảo vệ',
      'Hai thuật ngữ cùng một chuẩn pháp lý, chỉ khác cơ quan điều tra',
      'Adverse impact chỉ áp dụng thăng tiến; disparate treatment chỉ áp dụng tuyển dụng',
    ],
    answer: 1,
    explanation:
      'Disparate treatment = intentional different treatment. Adverse impact = neutral rule/practice with disproportionate exclusion of a protected group (often shown statistically, without proving bias motive).',
    explanationVi:
      'Disparate treatment = đối xử khác biệt có chủ đích. Adverse impact = quy tắc/thực tiễn trung lập nhưng loại trừ không cân xứng nhóm được bảo vệ (thường qua thống kê, không bắt buộc chứng minh động cơ kỳ thị).',
  },
  {
    id: 'SHRM_HARD_K03',
    type: 'knowledge',
    scenario: '',
    scenarioVi: '',
    question:
      'A global firm wants pay practices that are internally consistent yet externally competitive in each country. Which approach best balances those goals?',
    questionVi:
      'Một công ty toàn cầu muốn đãi ngộ nhất quán nội bộ nhưng vẫn cạnh tranh bên ngoài ở từng quốc gia. Cách tiếp cận nào cân bằng tốt nhất các mục tiêu đó?',
    options: [
      'Apply a single global salary structure with identical midpoints in every country',
      'Use a common job-evaluation backbone and global grades, then price ranges with local market data',
      'Let each country design unrelated job titles and pay systems with no corporate oversight',
      'Pay all employees at the highest country market rate to guarantee external competitiveness',
    ],
    optionsVi: [
      'Áp một khung lương toàn cầu với midpoint giống hệt mọi quốc gia',
      'Dùng xương sống đánh giá công việc và grade toàn cầu, rồi định dải lương bằng dữ liệu thị trường địa phương',
      'Để mỗi quốc gia tự thiết kế chức danh và hệ thống lương không liên quan, không giám sát tập đoàn',
      'Trả mọi người theo mức thị trường cao nhất trong các nước để bảo đảm cạnh tranh ngoài',
    ],
    answer: 1,
    explanation:
      'Best practice is a common internal job architecture (evaluation/grades) with local market pricing of ranges. Identical global midpoints ignore cost-of-labor differences; fully local unrelated systems destroy internal equity; paying the global max is rarely sustainable.',
    explanationVi:
      'Thực hành tốt: kiến trúc công việc nội bộ chung (đánh giá/grade) kèm định giá dải lương theo thị trường địa phương. Midpoint toàn cầu giống hệt bỏ qua khác biệt chi phí lao động; hệ thống địa phương rời rạc phá công bằng nội bộ; trả max toàn cầu hiếm khi bền vững.',
  },
  {
    id: 'SHRM_HARD_K04',
    type: 'knowledge',
    scenario: '',
    scenarioVi: '',
    question:
      'During workforce planning, demand forecasts exceed internal supply for a critical digital skill. Which response is most strategically sound as a first portfolio move?',
    questionVi:
      'Trong hoạch định nhân sự, dự báo nhu cầu vượt cung nội bộ cho một kỹ năng số then chốt. Phản ứng nào hợp chiến lược nhất như bước danh mục đầu tiên?',
    options: [
      'Immediately outsource the entire function overseas to eliminate the skill gap',
      'Build a multi-lever plan: upskill/reskill, targeted hiring, and selective contingent talent while protecting critical knowledge',
      'Freeze all related projects until universities produce more graduates in three years',
      'Promote the most tenured employees into the digital roles to reward loyalty',
    ],
    optionsVi: [
      'Outsource ngay toàn bộ chức năng ra nước ngoài để xóa khoảng trống kỹ năng',
      'Xây kế hoạch đa đòn bẩy: upskill/reskill, tuyển có mục tiêu, và talent thời vụ chọn lọc, đồng thời bảo vệ tri thức then chốt',
      'Đóng băng mọi dự án liên quan đến khi đại học đào tạo thêm sinh viên sau ba năm',
      'Thăng nhân viên thâm niên nhất vào vai trò số để thưởng trung thành',
    ],
    answer: 1,
    explanation:
      'Strategic workforce planning uses a portfolio of build/buy/borrow levers with risk control — not a single extreme move (full offshore, multi-year freeze, or tenure-based promotion unrelated to skill).',
    explanationVi:
      'Hoạch định nhân sự chiến lược dùng danh mục đòn bẩy build/buy/borrow kèm kiểm soát rủi ro — không phải một nước cờ cực đoan (offshore toàn bộ, đóng băng nhiều năm, hay thăng theo thâm niên không gắn kỹ năng).',
  },
  {
    id: 'SHRM_HARD_K05',
    type: 'knowledge',
    scenario: '',
    scenarioVi: '',
    question:
      'Which metric set best evaluates whether a leadership development program is improving organizational capability — not just participant satisfaction?',
    questionVi:
      'Bộ chỉ số nào đánh giá tốt nhất liệu chương trình phát triển lãnh đạo có nâng năng lực tổ chức — chứ không chỉ mức hài lòng người học?',
    options: [
      'Smile-sheet satisfaction scores collected at the end of each workshop',
      'Completion rates for e-learning modules assigned to high-potential staff',
      'Pre/post competency ratings, promotion/ready-now bench strength, and business KPIs tied to leader behaviors',
      'Number of training hours delivered per leader per year',
    ],
    optionsVi: [
      'Điểm hài lòng smile-sheet cuối mỗi workshop',
      'Tỷ lệ hoàn thành module e-learning giao cho nhân tài tiềm năng',
      'Đánh giá năng lực trước/sau, sức mạnh bench ready-now/thăng tiến, và KPI kinh doanh gắn hành vi lãnh đạo',
      'Số giờ đào tạo giao cho mỗi lãnh đạo mỗi năm',
    ],
    answer: 2,
    explanation:
      'Kirkpatrick/Phillips-style evaluation looks beyond reaction and activity: behavior change, bench strength, and business outcomes. Satisfaction, completion, and hours measure activity/reaction, not capability impact.',
    explanationVi:
      'Đánh giá kiểu Kirkpatrick/Phillips vượt phản ứng và hoạt động: thay đổi hành vi, sức bench và kết quả kinh doanh. Hài lòng, hoàn thành module và số giờ đo hoạt động/phản ứng, không đo tác động năng lực.',
  },
  {
    id: 'SHRM_HARD_SJT01',
    type: 'sjt',
    scenario:
      'A high-performing sales director privately tells HR that a peer on the leadership team made repeated comments about her pregnancy, including jokes about whether she would "come back the same" after leave. She asks HR not to "make a big deal" because she fears damage to client relationships and her bonus. The peer is a top revenue producer. No prior complaints are on file.',
    scenarioVi:
      'Một giám đốc kinh doanh hiệu suất cao nói riêng với HR rằng một đồng cấp trong ban lãnh đạo nhiều lần bình luận về việc cô mang thai, gồm chuyện đùa liệu cô có "trở lại như cũ" sau nghỉ thai sản. Cô nhờ HR "đừng làm to" vì sợ ảnh hưởng quan hệ khách hàng và thưởng. Đồng cấp đó là người mang lại doanh thu hàng đầu. Chưa có khiếu nại trước trong hồ sơ.',
    question: 'What is the MOST appropriate next step for HR?',
    questionVi: 'Bước tiếp theo PHÙ HỢP NHẤT cho HR là gì?',
    options: [
      'Honor her request for confidentiality completely and take no action unless she files a written complaint later',
      'Thank her, document the conversation, explain the organization\'s duty to address potential harassment, and initiate a prompt, discreet review consistent with policy',
      'Transfer the sales director to another region immediately so she no longer works with the peer',
      'Tell the peer in a private hallway conversation to "watch the pregnancy jokes" without creating any formal record',
    ],
    optionsVi: [
      'Tôn trọng tuyệt đối yêu cầu bảo mật và không hành động trừ khi sau này có đơn bằng văn bản',
      'Cảm ơn, ghi nhận trao đổi, giải thích nghĩa vụ của tổ chức phải xử lý nguy cơ quấy rối, và mở rà soát kịp thời, kín đáo theo chính sách',
      'Điều chuyển ngay giám đốc kinh doanh sang vùng khác để không còn làm việc với đồng cấp',
      'Nói riêng ngoài hành lang với đồng cấp là "cẩn thận chuyện đùa thai sản" mà không lập hồ sơ chính thức',
    ],
    answer: 1,
    explanation:
      'Once HR knows of potential harassment, the organization has a duty to act — even if the employee prefers silence. Document, explain limits of pure confidentiality, and investigate discreetly. Doing nothing, relocating the reporter, or informal unrecorded warnings are common errors that increase legal and cultural risk.',
    explanationVi:
      'Khi HR biết về nguy cơ quấy rối, tổ chức có nghĩa vụ hành động — dù nhân viên muốn im. Ghi nhận, giải thích giới hạn của bảo mật tuyệt đối, và điều tra kín đáo. Không làm gì, điều chuyển người báo cáo, hay cảnh báo miệng không hồ sơ là sai lầm phổ biến, tăng rủi ro pháp lý và văn hóa.',
  },
  {
    id: 'SHRM_HARD_SJT02',
    type: 'sjt',
    scenario:
      'An operations VP asks HR to implement a mandatory on-site schedule "effective Monday" for a hybrid workforce after missing a quarterly target. Employee engagement scores are already declining. No business-case analysis of role suitability, customer impact, or exception criteria has been prepared. Several employees have approved remote arrangements tied to disability accommodations.',
    scenarioVi:
      'Một VP vận hành yêu cầu HR áp dụng lịch on-site bắt buộc "có hiệu lực từ thứ Hai" cho lực lượng hybrid sau khi trượt mục tiêu quý. Điểm gắn kết vốn đang giảm. Chưa có phân tích business case về phù hợp vai trò, tác động khách hàng hay tiêu chí ngoại lệ. Một số nhân viên có thỏa thuận remote đã duyệt gắn với điều chỉnh vì khuyết tật.',
    question: 'How should HR respond MOST effectively?',
    questionVi: 'HR nên phản hồi HIỆU QUẢ NHẤT như thế nào?',
    options: [
      'Issue the Monday mandate as requested to support the VP\'s urgency and revisit concerns after 90 days',
      'Partner with the VP to define business outcomes, role-based presence criteria, legal review of accommodation impacts, and a phased communication plan before any blanket change',
      'Survey employees for preferred days in office and set policy solely by majority vote',
      'Refuse any on-site requirement because hybrid work is an employee right in all jurisdictions',
    ],
    optionsVi: [
      'Ban hành lệnh thứ Hai theo yêu cầu để ủng hộ độ gấp của VP, xem lại sau 90 ngày',
      'Đồng hành với VP để xác định kết quả kinh doanh, tiêu chí hiện diện theo vai trò, rà soát pháp lý tác động accommodation, và kế hoạch truyền thông theo giai đoạn trước mọi thay đổi diện rộng',
      'Khảo sát ngày vào văn phòng ưa thích và đặt chính sách chỉ theo phiếu đa số',
      'Từ chối mọi yêu cầu on-site vì hybrid là quyền của nhân viên ở mọi khu vực pháp lý',
    ],
    answer: 1,
    explanation:
      'HR is a strategic partner: convert a reactive mandate into an evidence-based, legally sound design (business outcomes, role criteria, accommodations, change management). Instant blanket orders risk ADA/equivalent violations and engagement collapse; majority vote and absolute "rights" framing are equally flawed.',
    explanationVi:
      'HR là đối tác chiến lược: biến mệnh lệnh phản ứng thành thiết kế dựa bằng chứng, vững pháp lý (kết quả KD, tiêu chí vai trò, accommodation, quản trị thay đổi). Lệnh diện rộng tức thì rủi ro vi phạm ADA/tương đương và sụt gắn kết; bỏ phiếu đa số và khung "quyền tuyệt đối" cũng sai.',
  },
  {
    id: 'SHRM_HARD_SJT03',
    type: 'sjt',
    scenario:
      'During a restructuring, a manager asks HR to select employees for layoff using "whoever is easiest to replace" and to avoid employees the manager "likes working with." The company has a documented selection matrix based on skills criticality, performance, and conduct. Legal counsel has not yet reviewed the draft list.',
    scenarioVi:
      'Trong tái cấu trúc, một quản lý nhờ HR chọn người cắt giảm theo kiểu "ai dễ thay thế nhất" và tránh những người quản lý "thích làm việc cùng". Công ty có ma trận lựa chọn đã ban hành dựa trên độ then chốt kỹ năng, hiệu suất và kỷ luật. Pháp chế chưa rà danh sách nháp.',
    question: 'What should HR do FIRST?',
    questionVi: 'HR nên làm GÌ TRƯỚC?',
    options: [
      'Accept the manager\'s criteria because line leaders know team dynamics best',
      'Reset the process to the approved selection matrix, document rationale for each proposed selection, and route the package for legal review before notifications',
      'Rank employees solely by last performance rating to keep the process simple and defensible',
      'Let volunteers for severance come forward first and only then apply any matrix to remaining roles',
    ],
    optionsVi: [
      'Chấp nhận tiêu chí của quản lý vì lãnh đạo trực tiếp hiểu động thái nhóm nhất',
      'Đưa quy trình về ma trận đã duyệt, ghi lý do cho từng đề xuất, và chuyển gói cho pháp chế rà trước khi thông báo',
      'Xếp hạng chỉ theo rating hiệu suất gần nhất để quy trình đơn giản và dễ bảo vệ',
      'Cho tình nguyện nhận severance trước, rồi mới áp ma trận cho phần còn lại',
    ],
    answer: 1,
    explanation:
      'Layoff selection must follow consistent, job-related criteria and legal review. Manager preference and "ease of replace" invite discrimination claims. Single-factor ratings and volunteer-first approaches can be tools later but must still align with policy and adverse-impact checks.',
    explanationVi:
      'Chọn đối tượng cắt giảm phải theo tiêu chí nhất quán, gắn việc và qua rà soát pháp lý. Sở thích quản lý và "dễ thay thế" dễ dẫn khiếu nại phân biệt. Rating một yếu tố hay tình nguyện trước có thể là công cụ sau nhưng vẫn phải khớp chính sách và kiểm adverse impact.',
  },
  {
    id: 'SHRM_HARD_SJT04',
    type: 'sjt',
    scenario:
      'An employee returns from medical leave with a note requesting a permanent remote schedule. The role has historically required two days per week of on-site equipment calibration. The manager says remote work is "impossible." The employee has strong performance history and is a member of a protected class under applicable law.',
    scenarioVi:
      'Một nhân viên trở lại sau nghỉ y tế với giấy đề nghị lịch remote vĩnh viễn. Vai trò trước nay cần hai ngày/tuần hiệu chuẩn thiết bị on-site. Quản lý nói remote là "không thể". Nhân viên có lịch sử hiệu suất tốt và thuộc nhóm được bảo vệ theo luật áp dụng.',
    question: 'Which action best meets both operational needs and accommodation obligations?',
    questionVi: 'Hành động nào đáp ứng tốt nhất cả nhu cầu vận hành và nghĩa vụ điều chỉnh hợp lý?',
    options: [
      'Deny the request because the historical schedule proves on-site presence is an essential function',
      'Approve permanent full remote immediately to avoid any discrimination claim',
      'Begin an interactive process: clarify functional limitations, identify essential functions with the manager, explore alternatives (partial remote, schedule redesign, assistive tools), and document the analysis',
      'Require the employee to transfer to a different fully remote job family as the only option',
    ],
    optionsVi: [
      'Từ chối vì lịch sử lịch làm việc chứng minh on-site là chức năng thiết yếu',
      'Duyệt full remote vĩnh viễn ngay để tránh khiếu nại phân biệt',
      'Bắt đầu quy trình tương tác: làm rõ hạn chế chức năng, xác định chức năng thiết yếu với quản lý, khảo sát phương án (remote một phần, redesign lịch, công cụ hỗ trợ), và ghi nhận phân tích',
      'Yêu cầu nhân viên chuyển sang job family remote hoàn toàn như lựa chọn duy nhất',
    ],
    answer: 2,
    explanation:
      'Disability accommodation requires an interactive process — not automatic denial based on past practice, automatic full grant, or forced transfer as the only path. Essential functions and undue hardship are determined through structured dialogue and documentation.',
    explanationVi:
      'Điều chỉnh vì khuyết tật đòi hỏi interactive process — không phải từ chối tự động theo thói quen cũ, duyệt full ngay, hay ép điều chuyển như lối duy nhất. Chức năng thiết yếu và undue hardship được xác định qua đối thoại có cấu trúc và hồ sơ.',
  },
  {
    id: 'SHRM_HARD_SJT05',
    type: 'sjt',
    scenario:
      'HR discovers that a popular hiring manager has been adding "culture fit" scores after interviews without defined behavioral anchors. Over two years, hire rates for candidates from certain universities and demographic groups are markedly lower in that manager\'s pipeline, despite similar structured-interview scores.',
    scenarioVi:
      'HR phát hiện một hiring manager được ưa chuộng vẫn chấm "culture fit" sau phỏng vấn mà không có neo hành vi. Trong hai năm, tỷ lệ tuyển ứng viên từ một số trường và nhóm nhân khẩu trong pipeline của quản lý đó thấp hơn rõ, dù điểm phỏng vấn có cấu trúc tương đương.',
    question: 'What is the BEST strategic intervention?',
    questionVi: 'Can thiệp chiến lược TỐT NHẤT là gì?',
    options: [
      'Remove the manager from hiring permanently and publish the disparity data to all employees',
      'Retire unstructured culture-fit scoring, require anchored criteria aligned to values, retrain interviewers, and audit outcomes for adverse impact with leadership accountability',
      'Keep culture-fit scores but increase the weight of structured interviews so the bias is diluted statistically',
      'Only hire through a vendor assessment that ignores manager input for six months',
    ],
    optionsVi: [
      'Gỡ vĩnh viễn quản lý khỏi tuyển dụng và công bố dữ liệu chênh lệch cho mọi nhân viên',
      'Bỏ chấm culture-fit không cấu trúc, bắt buộc tiêu chí có neo gắn giá trị, đào tạo lại interviewer, và audit kết quả adverse impact kèm trách nhiệm lãnh đạo',
      'Giữ điểm culture fit nhưng tăng trọng số phỏng vấn có cấu trúc để "pha loãng" thiên kiến thống kê',
      'Chỉ tuyển qua assessment vendor, bỏ qua ý kiến quản lý trong sáu tháng',
    ],
    answer: 1,
    explanation:
      'Fix the system: eliminate unanchored subjective filters, train, and monitor adverse impact with accountability. Public shaming/removal without redesign, statistical dilution, or fully sidelining managers are incomplete or risky responses.',
    explanationVi:
      'Sửa hệ thống: loại bộ lọc chủ quan không neo, đào tạo, giám sát adverse impact kèm trách nhiệm. Công khai/trừng phạt mà không thiết kế lại, "pha loãng" thống kê, hay loại hoàn toàn quản lý là phản ứng thiếu hoặc rủi ro.',
  },
];

// Ensure new IDs unique
const existingIds = new Set(data.map(q => q.id));
let addedCount = 0;
newQuestions.forEach(q => {
  if (existingIds.has(q.id)) return;
  cleanQuestion(q);
  data.push(q);
  existingIds.add(q.id);
  addedCount++;
});
console.log('Added', addedCount, 'new questions; total', data.length);

// ── 6. Stats ─────────────────────────────────────────────────────────────
const types = {};
const ans = [0, 0, 0, 0];
data.forEach(q => {
  types[q.type] = (types[q.type] || 0) + 1;
  ans[q.answer]++;
});
console.log('Types:', types);
console.log('Answer A-D:', ans, ans.map(n => ((100 * n) / data.length).toFixed(1) + '%'));

// ── 7. Write QUIZ_DATA to data/quiz.js (+ JSON mirror) ───────────────────
const newJson = JSON.stringify(data, null, 2);
fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(QUIZ_JS, 'const QUIZ_DATA = ' + newJson + ';\n', 'utf8');
fs.writeFileSync(QUIZ_JSON, newJson + '\n', 'utf8');
console.log('Wrote', QUIZ_JS, 'and', QUIZ_JSON);

// Ensure option-shuffle helper exists in index.html (idempotent)
let htmlOut = fs.readFileSync(INDEX, 'utf8');
if (!htmlOut.includes('function shuffleQuizOptions')) {
  const oldNext = `function nextQuizQuestion() {
  quiz.selected = -1;
  quiz.locked = false;
  
  if (quiz.queue.length === 0) {
    quiz.queue = shuffle(quiz.pool.slice());
  }
  
  quiz.current = quiz.queue.shift();
  quiz.index += 1;
  renderQuiz();
  scrollCardToTop();
}`;

  const newNext = `function nextQuizQuestion() {
  quiz.selected = -1;
  quiz.locked = false;
  
  if (quiz.queue.length === 0) {
    quiz.queue = shuffle(quiz.pool.slice());
  }
  
  const raw = quiz.queue.shift();
  // Shuffle option order each time so answer position cannot be memorized/guessed
  quiz.current = shuffleQuizOptions(raw);
  quiz.index += 1;
  renderQuiz();
  scrollCardToTop();
}

/** Return a shallow copy of a quiz item with options (and VI options) permuted; answer index remapped. */
function shuffleQuizOptions(q) {
  if (!q || !Array.isArray(q.options) || q.options.length < 2) return q;
  const n = q.options.length;
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = order[i]; order[i] = order[j]; order[j] = t;
  }
  const copy = Object.assign({}, q);
  copy.options = order.map(i => q.options[i]);
  if (Array.isArray(q.optionsVi)) {
    copy.optionsVi = order.map(i => q.optionsVi[i]);
  }
  const ans = typeof q.answer === 'number' ? q.answer : 0;
  copy.answer = order.indexOf(ans);
  copy._optionOrder = order;
  return copy;
}`;

  if (htmlOut.includes(oldNext)) {
    htmlOut = htmlOut.replace(oldNext, newNext);
  } else if (htmlOut.includes('quiz.current = quiz.queue.shift();')) {
    htmlOut = htmlOut.replace(
      /function nextQuizQuestion\(\) \{[\s\S]*?quiz\.current = quiz\.queue\.shift\(\);\s*quiz\.index \+= 1;\s*renderQuiz\(\);\s*scrollCardToTop\(\);\s*\}/,
      newNext.trim()
    );
  } else {
    console.warn('Could not inject shuffleQuizOptions — already customized?');
  }
  fs.writeFileSync(INDEX, htmlOut, 'utf8');
  console.log('Patched option shuffle into index.html');
} else {
  console.log('Option shuffle already present in index.html');
}

console.log('Done.');
