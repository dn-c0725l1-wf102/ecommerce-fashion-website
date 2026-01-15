import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./ChatAI.css";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Xin chào, tôi là trợ lý tư vấn quần áo. Bạn cần hỗ trợ gì?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // 👈 thêm state này

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  return (
    <>
      {/* Icon khi thu nhỏ */}
      {!isOpen && (
        <div className="chat-fab" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {/* Chatbox */}
      <div className={`chatbox ${isOpen ? "open" : "closed"}`}>
        {/* Header */}
        <div className="chatbox-header">
          <span>Ecommerce-fashion</span>
          <button onClick={() => setIsOpen(false)}>—</button>
        </div>

        {/* Nội dung chat */}
        <div className="chatbox-body">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <strong>{m.role === "user" ? "Bạn" : "AI"}:</strong> {m.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="chatbox-footer">
          <Form.Control
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Nhập câu hỏi..."
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} size="sm">Gửi</Button>
        </div>
      </div>
    </>
  );
}