# SHRM Exam Flashcards & Endless SJT Quiz App

A lightweight, offline-friendly web app for studying **SHRM** (Society for Human Resource Management) exam terms and mastering **SHRM Situational Judgement Test (SJT)** scenarios — featuring bilingual (EN+VI) definitions, workplace vignettes, exam tips, responsive desktop/mobile UI, and an **Endless SJT Scenario Quiz Mode**.

Single static page (`index.html`). Ready for **GitHub Pages** or any static host. No build step, no backend.

### Credits

The **initial flashcard app** was based on (copied from) [cjfisher71/SHRM](https://github.com/cjfisher71/SHRM). This project extends that foundation with Vietnamese translations, detailed workplace scenarios, exam tips, an **Endless SJT Scenario Quiz Bank (305+ scenarios)**, progress persistence, responsive layout, and refined UX.

---

## English

### Features

| Feature | Description |
|--------|-------------|
| **392 Flashcards** | SHRM terms across 4 clusters and 22 domains |
| **Bilingual Support (EN + VI)** | English definitions, scenarios, tips, and full Vietnamese translations |
| **Endless SJT Quiz Mode** | **305+ Situational Judgement Test (SJT)** scenarios based on official SHRM exam patterns |
| **Real-time Accuracy & Score** | Continuous practice loop tracking `Score (Correct / Answered)` and `Accuracy %` |
| **Bilingual Explanations** | Detailed SHRM BASK rationale in both English & Vietnamese for every quiz option |
| **Bilingual Toggle (🇻🇳)** | Default Vietnamese display for scenarios, questions, choices, and rationales, with quick toggle |
| **Responsive UI (Desktop & Mobile)** | Ultra-compact top menu on mobile to maximize scenario reading area; expands up to 1000px layout on desktop |
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

#### 2. Endless SJT Quiz Mode
1. Switch to the **Quiz** tab.
2. Read the multi-sentence **Workplace Scenario (Tình huống)** (EN + VI).
3. Analyze the strategic HR question and select the best action from **4 options** (A–D).
4. Review the **BASK Rationale & Explanation** (EN + VI) for why the choice is correct or incorrect.
5. Tap **Next question** to continue seamless, endless practice across 305+ SJT scenarios.

---

### Project Structure

```
.
├── index.html              # App UI + Flashcards + 305+ SJT Quiz Bank + Logic & Styles
├── QUIZ_GENERATION_PLAN.md # Plan for AI-driven dynamic quiz variation generation
└── README.md               # Documentation
```

---

## Tiếng Việt

### Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| **392 Thẻ Flashcard** | Thuật ngữ SHRM thuộc 4 nhóm năng lực (Clusters) và 22 lĩnh vực chuyên môn (Domains) |
| **Song ngữ Anh - Việt** | Định nghĩa tiếng Anh + Bản dịch tiếng Việt sát nghĩa |
| **Chế độ Quiz SJT Không giới hạn** | Ngân hàng **305+ câu hỏi tình huống Situational Judgement (SJT)** chuẩn cấu trúc đề thi SHRM |
| **Theo dõi Điểm số & Độ chính xác** | Đếm số câu đúng / đã làm và tỉ lệ chính xác `%` liên tục |
| **Giải thích Căn cứ SHRM BASK** | Phân tích chi tiết lý do đáp án đúng/sai bằng cả Tiếng Anh và Tiếng Việt |
| **Mặc định hiển thị Tiếng Việt** | Mặc định hiện bản dịch Tiếng Việt cho Tình huống, Câu hỏi, Lựa chọn và Giải thích; có nút bật/tắt |
| **Giao diện Tối ưu Mobile & Desktop** | Menu cực kỳ gọn gàng trên điện thoại (tăng 60% diện tích đọc kịch bản); tự mở rộng 900px - 1000px trên máy tính |
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

#### 2. Chế độ Thi tình huống (Endless SJT Quiz Mode)
1. Chuyển sang tab **Quiz**.
2. Đọc kịch bản **Tình huống công việc (Scenario)** đầy đủ bằng cả tiếng Anh và tiếng Việt.
3. Phân tích câu hỏi chiến lược HR và chọn **1 trong 4 phương án** hành động tốt nhất (A–D).
4. Xem **Giải thích căn cứ SHRM BASK** chi tiết để hiểu lý do đáp án đúng/sai.
5. Nhấn **Next question** để tiếp tục luyện tập liên tục không giới hạn với kho 305+ tình huống.
