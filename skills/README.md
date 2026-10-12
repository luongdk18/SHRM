# SHRM Platform Knowledge & Skills Repository

Tập hợp các tài liệu kỹ thuật, kiến trúc mã nguồn, hệ thống thiết kế và phương pháp sư phạm quản trị nhân sự (SHRM BASK) được đúc kết từ dự án **SHRM Exam Flashcards & Endless Quiz Platform**.

---

## Danh mục Skills

| File | Tên Skill | Mô tả tóm tắt |
|---|---|---|
| [`00.coding.md`](./00.coding.md) | **Architecture & Coding Standards** | Kiến trúc Vanilla JS SPA không phụ thuộc thư viện ngoài, quản lý State, localStorage protocol, Fisher-Yates runtime shuffling, và tối ưu hiệu năng. |
| [`01.visual.md`](./01.visual.md) | **Visual Design System & UI Architecture** | Hệ thống CSS Design Tokens (Light/Dark mode), Typography (`DM Serif Display` + `DM Sans`), Layout thích ứng Mobile (<768px) vs Desktop (900-1000px), trạng thái nút lựa chọn. |
| [`02.shrm-bask.md`](./02.shrm-bask.md) | **SHRM BASK Framework & Domain Knowledge** | Cấu trúc chuẩn 4 Clusters & 22 Domains của SHRM, các lý thuyết quản trị trọng điểm (Herzberg, Vroom, Adams, Kotter, Blake-Mouton), nguyên tắc tư duy đề thi. |
| [`03.sjt-engineering.md`](./03.sjt-engineering.md) | **SJT Engineering & Psychometrics** | Kỹ thuật biên soạn câu hỏi Tình huống (SJT), 4 bẫy tâm lý học thi cử (Sequence Trap, Common Sense Trap, Escalation Trap, Band-Aid Trap), cân bằng độ dài phương án. |
| [`04.flashcard-pedagogy.md`](./04.flashcard-pedagogy.md) | **Active Recall & Flashcard Pedagogy** | Phương pháp học chủ động (Testing Effect), quy trình 4 bước học thẻ, phân tách tiến độ theo Domain, tính năng ẩn luật Mỹ (US Law toggle) cho thí sinh quốc tế. |
| [`05.data-pipeline.md`](./05.data-pipeline.md) | **Data Pipeline & Quality Assurance** | Quy trình trích xuất đề thi từ PDF, chuẩn hóa OCR, kiến trúc lưu trữ phân tách (`data/cards.js` và `data/quiz.js` kèm JSON mirror), các kịch bản kiểm tra tự động. |
| [`06.git-deployment.md`](./06.git-deployment.md) | **Git Workflow & Static Web Deployment** | Mô hình triển khai tĩnh không cần build (GitHub Pages), đường dẫn tương đối, kiểm thử cú pháp trước commit, quy ước commit và phát hành. |

---

## Hướng dẫn sử dụng bộ Skills
- **Dành cho Lập trình viên**: Tham khảo `00.coding.md`, `01.visual.md`, `05.data-pipeline.md`, `06.git-deployment.md` để nắm cấu trúc mã nguồn, quy chuẩn CSS/JS và triển khai.
- **Dành cho Người biên soạn nội dung & Giảng viên**: Tham khảo `02.shrm-bask.md`, `03.sjt-engineering.md`, `04.flashcard-pedagogy.md` để tạo thêm câu hỏi tình huống mới chuẩn SHRM BASK, tránh các lỗi phương án quá lộ liễu.
