# SHRM Exam Flashcards & Endless Quiz App

A lightweight, offline-friendly web app for studying **SHRM** (Society for Human Resource Management) exam terms and mastering **SHRM Situational Judgement Test (SJT)** scenarios as well as **Knowledge/Competency** questions — featuring bilingual (EN+VI) definitions, workplace vignettes, exam tips, responsive desktop/mobile UI, dynamic question badges, and an **Endless Quiz Mode**.

Static site (`index.html` + `data/*.js`). Ready for **GitHub Pages** or any static host. No build step, no backend. Open `index.html` directly or deploy the whole folder (relative `data/` scripts load automatically).

### Credits

The **initial flashcard app** was based on (copied from) [cjfisher71/SHRM](https://github.com/cjfisher71/SHRM). This project extends that foundation with Vietnamese translations, detailed workplace scenarios, exam tips, an **Endless Quiz Bank (307 SHRM-style questions)** with high-plausibility distractors and runtime option shuffling, progress persistence, responsive layout, and enhanced UX.

---

## English

### Features

| Feature | Description |
|--------|-------------|
| **392 Flashcards** | SHRM terms across 4 clusters and 22 domains |
| **Bilingual Support (EN + VI)** | English definitions, scenarios, tips, and full Vietnamese translations |
| **307 Quiz Question Bank** | **175 SJT Scenarios** + **132 Knowledge & Competency** questions (practice-exam style + hard judgment items) |
| **High-Plausibility Distractors** | Four professional options per SHRM BASK standards — no cartoon wrongs; users must reason, not eliminate absurd choices |
| **Runtime Option Shuffle** | Choices A–D are reshuffled every time a question appears so answer position cannot be memorized |
| **Dynamic Question Badges** | Auto-distinguishes `SJT Tình Huống` (purple badge) vs `Lý Thuyết / Năng Lực` (green badge) |
| **Quiz Filter Toggles** | Seamlessly switch between `📚 All Questions (307 Qs)` and `🎯 SJT Scenarios Only (175 Qs)` |
| **Real-time Accuracy & Score** | Continuous practice loop tracking `Score (Correct / Answered)` and `Accuracy %` |
| **Bilingual Explanations** | Detailed SHRM BASK rationale in both English & Vietnamese for every quiz option |
| **Bilingual Toggle (🇻🇳)** | Default Vietnamese display for scenarios, questions, choices, and rationales, with quick toggle |
| **Responsive UI (Desktop & Mobile)** | Ultra-compact top menu on mobile to maximize scenario reading area; expands up to 1000px layout on desktop |
| **Unbolded Question Styling** | Clean, natural typography (`font-weight: 400`) for effortless long-session reading |
| **Filters & US Law Toggle** | Study by cluster or domain; compact **US** toggle (default hidden for non-US learners) |
| **Progress Persistence** | Automatically saves flashcard deck progress in browser `localStorage` |
| **Light / Dark Theme** | Default **Light** theme with persistent preference |

---

### Study Modes

#### 1. Flashcards Mode
1. Read the **English definition**, **Vietnamese translation**, and **Workplace Scenario (Tình huống)**.
2. Recall the term, then tap **Reveal term**.
3. Read the **Term**, domain tag, and **Exam Tips (Mẹo thi)**.
4. Self-rate:
   - **Still learning** — keep the card in active deck to re-study.
   - **Got it** — mark as completed and advance to next card.

#### 2. Endless Quiz Mode
1. Switch to the **Quiz** tab.
2. Filter your session using `📚 All Questions` or `🎯 SJT Scenarios Only`.
3. For SJT questions, read the multi-sentence **Workplace Scenario (Tình huống)** (EN + VI).
4. Analyze the strategic HR question and select the best action from **4 plausible options** (A–D).
5. Review the **BASK Rationale & Explanation** (EN + VI) for why the choice is correct or incorrect.
6. Tap **Next question** to continue seamless, endless practice.

---

### Project Structure

```
.
├── index.html              # App UI + logic + styles (~60 KB)
├── data/
│   ├── cards.js            # 392 flashcards (ALL_CARDS)
│   ├── cards.json          # Same payload as cards.js (tooling / export)
│   ├── quiz.js             # 307 quiz questions (QUIZ_DATA)
│   └── quiz.json           # Same payload as quiz.js (tooling / export)
├── skills/                 # Platform engineering & pedagogical skills directory
├── fix_quiz.js             # Maintenance script for quiz quality passes
└── README.md               # Documentation
```

Data is loaded via `<script src="data/cards.js">` and `<script src="data/quiz.js">` so the browser can cache banks separately and `index.html` stays light. Content is unchanged — only packaging moved.

---

## Tiếng Việt

### Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| **392 Thẻ Flashcard** | Thuật ngữ SHRM thuộc 4 nhóm năng lực (Clusters) và 22 lĩnh vực chuyên môn (Domains) |
| **Song ngữ Anh - Việt** | Định nghĩa tiếng Anh + Bản dịch tiếng Việt sát nghĩa |
| **Ngân hàng 307 Câu Quiz** | **175 câu Tình huống SJT** + **132 câu Lý thuyết & Năng lực** theo phong cách đề SHRM |
| **Phương án Nhiễu Tinh tế** | 4 lựa chọn đều mang tính chuyên môn theo SHRM BASK — không đáp án rác; phải tư duy để chọn |
| **Xáo phương án mỗi lần hiện** | Đáp án A–D được xáo ngẫu nhiên mỗi lần câu hỏi xuất hiện, không đoán theo vị trí |
| **Tự động Gắn Nhãn Phân loại** | Tự động hiển thị nhãn tím `SJT Tình Huống` hoặc nhãn xanh `Lý Thuyết / Năng Lực` |
| **Bộ lọc Chế độ Thi linh hoạt** | Chuyển đổi nhanh giữa `📚 Tất cả (307 câu)` và `🎯 Chỉ SJT Tình Huống (175 câu)` |
| **Theo dõi Điểm số & Độ chính xác** | Đếm số câu đúng / đã làm và tỉ lệ chính xác `%` liên tục trong Endless Mode |
| **Giải thích Căn cứ SHRM BASK** | Phân tích chi tiết lý do đáp án đúng/sai bằng cả Tiếng Anh và Tiếng Việt |
| **Mặc định hiển thị Tiếng Việt** | Mặc định hiện bản dịch Tiếng Việt cho Tình huống, Câu hỏi, Lựa chọn và Giải thích; có nút bật/tắt |
| **Giao diện Tối ưu Mobile & Desktop** | Menu cực kỳ gọn gàng trên điện thoại (tăng 60% diện tích đọc kịch bản); tự mở rộng 900px - 1000px trên máy tính |
| **Kiểu chữ Tiêu đề Dễ đọc** | Chữ câu hỏi nét thường nhẹ nhàng (`font-weight: 400`) giúp đọc kịch bản dài không mỏi mắt |
| **Ẩn/Hiện Luật Lao động Mỹ (US Law)** | Nút bật/tắt nhanh luật Mỹ (mặc định ẩn phù hợp cho học viên quốc tế) |
| **Lưu Tiến độ Tự động** | Tự động lưu trạng thái học vào `localStorage` của trình duyệt |
| **Giao diện Sáng / Tối (Light/Dark)** | Giao diện nền sáng mặc định, tùy chỉnh dễ dàng |

---

### Hướng dẫn sử dụng

#### 1. Chế độ Thẻ ghi nhớ (Flashcards Mode)
1. Đọc định nghĩa tiếng Anh, bản dịch tiếng Việt và **Tình huống thực tế**.
2. Nhẩm lại thuật ngữ, sau đó nhấn **Reveal term (Hiện đáp án)**.
3. Xem thuật ngữ, nhãn domain và **Mẹo thi (Exam tips)**.
4. Đánh giá:
   - **Still learning**: Giữ thẻ trong bộ học để ôn lại.
   - **Got it**: Đánh dấu hoàn thành và chuyển sang thẻ tiếp theo.

#### 2. Chế độ Thi (Endless Quiz Mode)
1. Chuyển sang tab **Quiz**.
2. Chọn bộ lọc `📚 Tất cả` hoặc `🎯 Chỉ SJT Tình Huống`.
3. Với câu hỏi SJT, đọc kịch bản **Tình huống công việc (Scenario)** đầy đủ bằng cả tiếng Anh và tiếng Việt.
4. Phân tích câu hỏi chiến lược HR và chọn **1 trong 4 phương án** hành động tốt nhất (A–D).
5. Xem **Giải thích căn cứ SHRM BASK** chi tiết để hiểu lý do đáp án đúng/sai.
6. Nhấn **Next question** để tiếp tục luyện tập liên tục không giới hạn.
