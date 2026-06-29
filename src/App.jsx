import { useState, useEffect, useRef } from "react";

export default function App() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setResponse("Sorry, your browser does not support Speech Recognition.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setResponse("You said: " + text);
      setListening(false);
    };

    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => setListening(false);
  }, []);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      setResponse("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0f0f0f", color: "#fff", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎙️ SrisVoice</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>AI Voice Assistant</p>
      <button
        onClick={toggleListening}
        style={{ padding: "1rem 2.5rem", fontSize: "1.2rem", borderRadius: "50px", border: "none", background: listening ? "#e74c3c" : "#6c63ff", color: "#fff", cursor: "pointer", transition: "all 0.3s" }}
      >
        {listening ? "⏹ Stop" : "🎤 Speak"}
      </button>
      {transcript && <p style={{ marginTop: "2rem", fontSize: "1.1rem", color: "#ccc" }}>📝 {transcript}</p>}
      {response && <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#6c63ff" }}>{response}</p>}
    </div>
  );
}
