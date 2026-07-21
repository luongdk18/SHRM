# SHRM Exam Flashcards

A lightweight, offline-friendly web app for studying **SHRM** (Society for Human Resource Management) exam terms — with English definitions, Vietnamese explanations, workplace scenarios, exam tips, and a multiple-choice quiz mode.

Single static page (`index.html`). Ready for **GitHub Pages** or any static host. No build step, no backend.

### Credits

The **initial flashcard app** was based on (copied from) [cjfisher71/SHRM](https://github.com/cjfisher71/SHRM). This fork/local project extends that foundation with Vietnamese translations, scenarios, exam tips, quiz mode, progress persistence, themes, and related UX.

---

## English

### Features

| Feature | Description |
|--------|-------------|
| **392 flashcards** | SHRM terms across 4 clusters and 22 domains |
| **Bilingual definitions** | English definition + Vietnamese translation |
| **Tình huống (scenario)** | Short workplace vignette for each term |
| **Tip thi** | Exam recognition keywords and common confusions |
| **Flashcards mode** | Recall term from definition → reveal → self-rate |
| **Quiz mode** | Definition + 4 answer choices (A–D) |
| **Filters** | All cards, by cluster, or by domain |
| **Progress save** | Resume where you left off (browser `localStorage`) |
| **Light / Dark theme** | Default **light**; preference is remembered |
| **Hide U.S. Employment Law** | Compact **US** button (top-right; default hidden) for non-US learners |
| **Mobile-friendly** | Designed for phone-width study sessions |

### Clusters

| Cluster | Approx. cards |
|---------|----------------|
| Competencies | 103 |
| People | 113 |
| Organization | 66 |
| Workplace | 110 |

### How to run

1. Open `index.html` in a browser, **or**
2. Deploy the repo to GitHub Pages (root or `/docs` with this file as the site root).

No install or build required.

### Flashcards mode

1. Read the **English definition**, **Vietnamese** text, and **scenario**.
2. Try to recall the term, then tap **Reveal term**.
3. After reveal, read the **term**, domain tag, and **Tip thi**.
4. Rate yourself:
   - **Still learning** — hide the answer, stay on the **same card**, scroll to the top so you can try again.
   - **Got it** — mark as done and move to the **next card**.

Other controls:

- **Filter bar** — study all cards, one cluster, or one domain (each filter keeps its own progress).
- **Reshuffle** — re-randomize only remaining cards; completed cards stay completed.
- **Reset** — clear progress for the *current filter* and start over (confirmation required).
- **Theme** (sun/moon) — switch light/dark.

### Quiz mode

1. Switch to the **Quiz** tab.
2. Read the definition (EN + VI).
3. Pick the matching term from **4 options**.
4. See correct/incorrect feedback and the exam tip, then **Next question**.

Notes:

- Uses the same filter as Flashcards.
- Needs **at least 4 cards** in the current filter.
- Wrong options prefer the same domain / cluster when possible.
- Score is for the current quiz session only (not persisted).

### Progress & storage

Saved in the browser via `localStorage`:

| Key | Purpose |
|-----|---------|
| `shrm-flashcards-progress-v1` | Deck order, completed cards, last filter (per filter session) |
| `shrm-flashcards-theme` | `light` or `dark` |
| `shrm-flashcards-hide-us-law` | `1` (hide, default) or `0` (show US law domain) |

- Progress is **per browser / device** (not synced to the cloud).
- Clearing site data resets progress and theme preference.
- Default theme is **light** if nothing is stored yet.

### Project structure

```
.
├── index.html    # App UI + all card data + logic
└── README.md     # This file
```

### Privacy

Everything runs locally in your browser. No analytics, no accounts, no server-side storage.

---

## Tiếng Việt

### Credit / Nguồn gốc

Bản **flashcard ban đầu** lấy từ (copy) [cjfisher71/SHRM](https://github.com/cjfisher71/SHRM). Repo này phát triển thêm: dịch tiếng Việt, tình huống, tip thi, quiz, lưu tiến độ, theme, và các cải tiến UX khác.

### Tính năng

| Tính năng | Mô tả |
|-----------|--------|
| **392 flashcard** | Thuật ngữ SHRM theo 4 cluster và 22 domain |
| **Song ngữ** | Định nghĩa tiếng Anh + bản dịch tiếng Việt |
| **Tình huống** | Vignette thực tế HR gắn với từng term |
| **Tip thi** | Từ khóa nhận diện + hay nhầm với term nào |
| **Chế độ Flashcards** | Nhìn definition → đoán term → tự chấm |
| **Chế độ Quiz** | Definition + 4 đáp án A–D |
| **Bộ lọc** | Tất cả / theo cluster / theo domain |
| **Lưu tiến độ** | Học dở, mở lại tiếp tục (`localStorage`) |
| **Theme sáng / tối** | Mặc định **sáng**; nhớ lựa chọn |
| **Ẩn U.S. Employment Law** | Nút **US** gọn góc trên (mặc định ẩn) cho non-US |
| **Mobile-friendly** | Tối ưu màn hình điện thoại |

### Cluster

| Cluster | Số card (xấp xỉ) |
|---------|------------------|
| Competencies | 103 |
| People | 113 |
| Organization | 66 |
| Workplace | 110 |

### Cách chạy

1. Mở file `index.html` bằng trình duyệt, **hoặc**
2. Deploy repo lên GitHub Pages (không cần build).

### Chế độ Flashcards

1. Đọc **definition EN**, **bản Việt**, và **Tình huống**.
2. Tự nhớ term, rồi bấm **Reveal term**.
3. Xem **term**, domain, và **Tip thi**.
4. Tự đánh giá:
   - **Still learning** — ẩn đáp án, **ở lại card hiện tại**, cuộn lên đầu để ôn lại.
   - **Got it** — đánh dấu xong và **sang card tiếp theo**.

Các nút khác:

- **Thanh filter** — học all / 1 cluster / 1 domain (mỗi filter có tiến độ riêng).
- **Reshuffle** — xáo lại phần còn lại; card đã *Got it* giữ nguyên.
- **Reset** — xóa tiến độ **filter hiện tại** và học lại từ đầu (có confirm).
- **Theme** (mặt trời / mặt trăng) — đổi sáng / tối.

### Chế độ Quiz

1. Chọn tab **Quiz**.
2. Đọc definition (EN + VI).
3. Chọn term đúng trong **4 đáp án**.
4. Xem đúng/sai + tip thi, rồi **Next question**.

Lưu ý:

- Dùng chung filter với Flashcards.
- Cần **ít nhất 4 card** trong filter.
- Đáp án nhiễu ưu tiên cùng domain / cluster.
- Điểm chỉ tính trong phiên quiz (không lưu lâu dài).

### Tiến độ & lưu trữ

Lưu trên trình duyệt (`localStorage`):

| Key | Mục đích |
|-----|----------|
| `shrm-flashcards-progress-v1` | Thứ tự deck, card đã xong, filter (tách theo từng filter) |
| `shrm-flashcards-theme` | `light` hoặc `dark` |
| `shrm-flashcards-hide-us-law` | `1` (ẩn, mặc định) hoặc `0` (hiện domain luật Mỹ) |

- Tiến độ gắn với **máy + trình duyệt** (không đồng bộ cloud).
- Xóa dữ liệu site → mất tiến độ và theme đã chọn.
- Chưa từng chọn theme → mặc định **light**.

### Cấu trúc dự án

```
.
├── index.html    # Giao diện + toàn bộ data card + logic
└── README.md     # File này
```

### Quyền riêng tư

Chạy hoàn toàn trên trình duyệt. Không analytics, không tài khoản, không lưu server.

---

## License / Ghi chú

**Upstream / initial source:** [cjfisher71/SHRM](https://github.com/cjfisher71/SHRM) — original flashcard app that this project was copied from and extended.

Nội dung flashcard phục vụ ôn thi cá nhân. Thuật ngữ và định nghĩa bám khung kiến thức SHRM; không thay thế tài liệu chính thức của SHRM.
