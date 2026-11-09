import { useState, useRef, useEffect } from "react";

function Chat() {
  // ---- State: the data this page depends on ----
  const [messages, setMessages] = useState([]); // the chat bubbles on screen
  const [history, setHistory] = useState([]); // what Claude sees, including tool calls
  const [input, setInput] = useState(""); // what's typed in the box
  const [loading, setLoading] = useState(false); // waiting for a reply?
  const bottomRef = useRef(null); // an invisible marker at the end of the chat

  // Scroll to the newest message whenever the messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(event) {
    event.preventDefault(); // stop the form from reloading the page
    const text = input.trim();
    if (!text || loading) return;

    // Add the user's message (a NEW list; never change state directly)
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the full history so Claude can see its earlier tool calls
        body: JSON.stringify({
          messages: [...history, { role: "user", content: text }],
        }),
      });
      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json(); // { reply, tools_used, messages }
      setHistory(data.messages);
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply, toolsUsed: data.tools_used },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `⚠️ Something went wrong: ${error.message}`,
          toolsUsed: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // ---- What this component looks like ----
  return (
    <div className="flex flex-col lg:h-full lg:py-8 pl-4">
      {/* pr-1 and pb-1 leave room so the hard shadows aren't cut off */}
      <div className="flex flex-1 flex-col gap-frame overflow-y-auto w-full pr-1 pb-1">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-gray-600">
            Try: “roll 2d20”, “pick pizza or tacos for me”, or “what's the
            weather in Tokyo?”
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] mx-1 whitespace-pre-wrap border-2 border-black px-4 py-2 leading-relaxed text-black shadow-frame rounded-sm ${
              m.role === "user"
                ? // Turns go user, assistant, user..., so every 4th message starts a new color pair
                  `self-end ${i % 4 === 0 ? "bg-frameLime" : "bg-frameYellow"}`
                : "self-start bg-white"
            }`}
          >
            {m.toolsUsed?.length > 0 && (
              <div className="mb-1 text-xs text-gray-600">
                🔧 used {m.toolsUsed.join(", ")}
              </div>
            )}
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="self-start border-2 border-black bg-white px-4 py-2 italic text-gray-600 shadow-small">
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-frame flex gap-frame mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something…"
          disabled={loading}
          autoFocus
          className="flex-1 border-2 border-black rounded-sm bg-white p-frame  outline-none shadow-frame"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="border-2 border-black bg-frameLime px-5 font-bold text-black shadow-frame rounded-sm hover:bg-frameYellow disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
