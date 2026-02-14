import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Moon,
  Sun,
  HeartPulse,
  User,
} from "lucide-react";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const emergencyKeywords = [
  "chest pain",
  "difficulty breathing",
  "unconscious",
  "stroke",
  "heart attack",
  "severe bleeding",
  "suicidal"
];

const isEmergency = (text) => {
  return emergencyKeywords.some(word =>
    text.toLowerCase().includes(word)
  );
};
  const [healthData, setHealthData] = useState([
  { time: 0, heart: 72 }
]);
useEffect(() => {
  const interval = setInterval(() => {
    const newHeart = Math.floor(70 + Math.random() * 15);

    setHeartRate(newHeart);

    setHealthData((prev) => {
      const newPoint = {
        time: prev.length,
        heart: newHeart,
      };

      const updated = [...prev, newPoint];

      // keep only last 20 points
      return updated.slice(-20);
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);



const [heartRate, setHeartRate] = useState(72);
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typingText]);

  // LETTER-BY-LETTER EFFECT
  const typeText = (text) => {
    let i = 0;
    setTypingText("");

    const interval = setInterval(() => {
      setTypingText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setChat((prev) => [...prev, { sender: "bot", text }]);
        setTypingText("");

  
      }
    }, 25);
  };

  const sendMessage = async () => {
    if (isEmergency(message)) {
  setChat((prev) => [
    ...prev,
    { sender: "bot", text: "⚠️ This may be a medical emergency. Please contact emergency services or a doctor immediately." }
  ]);
}
    if (!message.trim()) return;

    setChat((prev) => [...prev, { sender: "user", text: message }]);
    setLoading(true);

    try {
      const response = await fetch("https://healthcare-chatbot-szwm.onrender.com/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message }),
});
console.log("Response status:", response.status);

      const data = await response.json();

      setLoading(false);
      typeText(data.answer);
    } catch (error) {
      console.error(error);
    }

    setMessage("");
  };

  return (
    <div className={`app ${theme}`}>

      {/* HOLOGRAM BACKGROUND */}
      <div className="hologram"></div>

      {/* SIDEBAR */}
      <motion.div
        className="sidebar"
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2><HeartPulse size={22} /> HealthAI</h2>

        <button className="new-chat-btn">
          <Plus size={16}/> New Chat
        </button>

        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}
        </button>
      </motion.div>

      {/* MAIN CHAT */}
      <div className="chat-area">

        {/* ECG HEADER */}
        <div className="chat-header">
          <span>Virtual Healthcare Assistant</span>
          <div
  className={`ecg-line ${typingText ? "active" : ""}`}
  style={{ animationDuration: `${60 / heartRate}s` }}
></div>
        </div>

        {/* WAVEFORM */}
        <div className="ai-wave">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>

        <div className="dashboard">
  <h3>Live Health Monitor</h3>

  <div className="health-stats">
    ❤️ Heart Rate: <strong>{heartRate} BPM</strong>
  </div>

  <ResponsiveContainer width="100%" height={180}>
    <LineChart data={healthData}>
      <XAxis dataKey="time" hide />
      <YAxis domain={[60, 100]} hide />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="heart"
        stroke="#00ffc8"
        strokeWidth={3}
        dot={false}
        isAnimationActive={true}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

        <div className="chat-container">
          {chat.map((msg, i) => (
            <motion.div
              key={i}
              className={`message-row ${msg.sender}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`avatar ${msg.sender === "bot" ? "bot-avatar" : ""}`}>
                {msg.sender === "user" ? <User size={18}/> : <HeartPulse size={18}/>}
              </div>
              <div className="message">{msg.text}</div>
            </motion.div>
          ))}

          {typingText && (
            <div className="message-row bot">
              <div className="avatar bot-avatar">
                <HeartPulse size={18}/>
              </div>
              <div className="message">{typingText}</div>
            </div>
          )}

          {loading && (
            <div className="message-row bot">
              <div className="avatar bot-avatar"><HeartPulse size={18}/></div>
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="input-container">
          <input
            value={message}
            placeholder="Describe your symptoms..."
            onChange={(e)=>setMessage(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
       <footer className="footer">
  Created by SUBAHADIP KARMAKAR | Educational only — Not medical advice.
</footer>
    </div>
  );
}

export default App;