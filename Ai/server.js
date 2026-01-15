console.log("SERVER STARTED");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "Đã load" : "Chưa load");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Backend is running");
});

/* ===== Khởi tạo Gemini ===== */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model:"gemini-2.5-flash",
});

/* ===== Prompt định hướng cho AI y tế ===== */
const SYSTEM_PROMPT = `
Bạn là trợ lý sức khỏe AI cho website bán quần áo.

Nhiệm vụ:
- Trả lời các câu hỏi về quần áo phổ thông
- Giải thích dễ hiểu cho người không chuyên
- Không được chẩn đoán sang chủ đề khác
- Luôn khuyên người dùng về các sản phẩm có liên quan tới gu thời trang của khách hàng
- Luôn trả lời bằng tiếng Việt lịch sự, nhẹ nhàng
`;

app.post("/chat", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    let userMessage = "";

    if (Array.isArray(req.body.messages)) {
      userMessage = req.body.messages.at(-1)?.content || "";
    } else if (req.body.message) {
      userMessage = req.body.message;
    } else if (req.body.text) {
      userMessage = req.body.text;
    }

    if (!userMessage) {
      return res.status(400).json({ reply: "Không nhận được nội dung câu hỏi." });
    }

    const prompt = `
${SYSTEM_PROMPT}

Người dùng: ${userMessage}
AI:
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({
      reply: "Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau.",
    });
  }
});


app.listen(3001, () => {
  console.log("AI Server running at http://localhost:3001");
});