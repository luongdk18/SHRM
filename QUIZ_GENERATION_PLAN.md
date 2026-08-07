# Kế hoạch phát triển Quiz tự động sinh câu hỏi tương tự (SHRM Quiz Variation Generator)

Tài liệu này vạch ra phương pháp thiết kế và phát triển tính năng **tự động sinh câu hỏi tương tự** dựa trên ngân hàng 267 câu hỏi mẫu (từ file `Practice Exam` và `BoDe2026`). Mục tiêu là giúp học viên rèn luyện tư duy phân tích tình huống (Situational Judgement) thay vì học vẹt hay nhớ đáp án của đề cũ.

---

## 1. Nguyên lý hoạt động

Thay vì hiển thị cố định 267 câu hỏi gốc, hệ thống sẽ sử dụng các câu gốc này làm **Template (mẫu tư duy)**. Với mỗi câu gốc, chúng ta sẽ tạo ra các **Variations (biến thể)** bằng cách thay đổi:
*   **Bối cảnh (Context/Industry):** Thay vì một công ty công nghệ, chuyển sang bệnh viện, trường học, sản xuất, bán lẻ.
*   **Nhân vật & Vai trò (Characters & Roles):** Thay vì HRBP và CHRO, chuyển sang HR Manager và CEO, hoặc Team Leader và Department Head.
*   **Tình huống cụ thể (Scenario details):** Giữ nguyên bản chất xung đột/vấn đề nhưng thay đổi chi tiết sự việc.
*   **Các lựa chọn nhiễu (Distractors):** Giữ nguyên nguyên lý đánh giá năng lực của SHRM (ví dụ: hành động trực tiếp, đi qua đúng kênh, tôn trọng quy trình, phân tích dữ liệu trước khi quyết định) nhưng viết lại phù hợp với bối cảnh mới.

---

## 2. Quy trình triển khai (Workflow)

```
[267 Câu hỏi gốc] ──> [Script gọi API LLM (Gemini/Claude)] ──> [File QUIZ_VARIATIONS.json]
                                                                      │
                                                                      ▼
                                                            [Tích hợp vào Web UI]
                                                      (Chọn ngẫu nhiên câu gốc/biến thể)
```

### Bước 1: Thiết lập Prompt Template cho AI để sinh biến thể
Chúng ta sẽ viết một script Python sử dụng API (Gemini/Claude) để đọc từng câu trong `QUIZ_DATA` hiện tại và sinh ra 2-3 câu hỏi tương tự.

**Prompt mẫu cho AI:**
```text
You are an expert SHRM-SCP instructor. Your task is to analyze the following SHRM exam question (Scenario, Question, Options, Correct Answer, Explanation) and generate 2 completely new, high-quality variation questions.

Guidelines for Variations:
1. Keep the exact same SHRM Competency/Concept being tested (e.g., Nepotism, Pay Compression, Change Management).
2. Change the industry, company scale, roles of characters, and specific scenario events.
3. Keep the same reasoning logic for why the correct option is selected, and why the distractors are wrong.
4. Output the result in bilingual format (English and Vietnamese) matching the exact JSON structure provided.

JSON Structure:
{
  "type": "sjt" | "knowledge",
  "scenario": "...",
  "scenarioVi": "...",
  "question": "...",
  "questionVi": "...",
  "options": ["A", "B", "C", "D"],
  "optionsVi": ["A", "B", "C", "D"],
  "answer": 0, // index of correct option (0-3)
  "explanation": "...",
  "explanationVi": "..."
}
```

### Bước 2: Viết Generator Script (`generate_variations.py`)
Script này sẽ tự động đọc `quiz_data_raw.json` hiện tại, gửi request đến API LLM và lưu kết quả vào file `quiz_data_with_variations.json`.

*   **Input:** `quiz_data_raw.json` (267 câu)
*   **Process:** Chạy vòng lặp qua các câu hỏi, gọi API sinh biến thể, tự động kiểm tra định dạng JSON trả về.
*   **Output:** `quiz_data_extended.json` (gồm 267 câu gốc + ~534 câu biến thể = ~800 câu).

### Bước 3: Cập nhật Web UI để tận dụng biến thể
Trong `index.html`, cập nhật hàm `startQuiz()` để:
1.  Cho phép người dùng chọn chế độ:
    *   `Standard Mode`: Chỉ làm câu hỏi gốc từ đề thi (267 câu).
    *   `Practice Mode (No Duplicates)`: Mỗi câu gốc sẽ ngẫu nhiên chọn hoặc câu gốc, hoặc một trong các biến thể của nó để hiển thị (tổng số câu làm vẫn là 134 nhưng nội dung thay đổi liên tục).
    *   `Endless Mode`: Trộn toàn bộ câu gốc + câu biến thể để làm bài không giới hạn.

---

## 3. Cấu trúc dữ liệu mở rộng cho câu hỏi

Để quản lý tốt các câu hỏi biến thể, cấu trúc dữ liệu mới sẽ nhóm các câu hỏi theo nhóm template:

```js
const QUIZ_DATA = [
  {
    templateId: "ethics_nepotism_01",
    competency: "Ethical Practice",
    variations: [
      {
        id: "orig_01",
        isOriginal: true,
        scenario: "VP asks HR to hire nephew...",
        // ... options, answer, explanation ...
      },
      {
        id: "var_01_a",
        isOriginal: false,
        scenario: "Director asks Team Leader to hire wife's friend...",
        // ... options, answer, explanation ...
      },
      {
        id: "var_01_b",
        isOriginal: false,
        scenario: "General Manager insists on promoting their son...",
        // ... options, answer, explanation ...
      }
    ]
  }
];
```

---

## 4. Kế hoạch triển khai kỹ thuật sau này

- [ ] **Tạo script generator:** Viết Python script sử dụng `google-genai` hoặc `openai` SDK để kết nối với API LLM.
- [ ] **Cấu hình API Key:** Sử dụng file cấu hình `.env` hoặc hệ thống quản lý biến môi trường để bảo mật khóa API.
- [ ] **Chạy thử nghiệm trên 5 câu đầu tiên:** Validate chất lượng dịch thuật song ngữ và độ hợp lý của các phương án nhiễu do AI sinh ra.
- [ ] **Sinh hàng loạt (Batch generate):** Chạy script toàn bộ ngân hàng câu hỏi để tạo ra file `quiz_data_extended.json`.
- [ ] **Cập nhật giao diện lựa chọn:** Bổ sung cấu hình chọn Mode (Original / Random Variation / Mix All) ở màn hình bắt đầu Quiz.
