import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

const responses: { keywords: string[]; reply: string }[] = [
  { keywords: ["register", "signup", "sign up"], reply: "To register, click 'Sign In / Register' and choose Farmer or Consumer. Farmers verify with Aadhaar + PM-Kisan ID." },
  { keywords: ["price", "fair", "ai"], reply: "Our AI suggests a fair price based on local mandi rates, season, and quality. Farmers can accept or override it." },
  { keywords: ["delivery", "track", "order"], reply: "Delivery agents pick from the farm and deliver to you in 24–48 hours. Track in 'My Orders'." },
  { keywords: ["call", "ivr", "phone", "toll"], reply: "Farmers without internet can list and receive orders by calling toll-free 1800-180-1551." },
  { keywords: ["payment", "pay", "cash"], reply: "We support UPI, cards, netbanking, and Cash on Delivery." },
  { keywords: ["aadhaar", "kisan", "verify"], reply: "Farmer verification needs Aadhaar + (PM-Kisan ID OR Kisan Credit Card) + land details." },
];

function answer(q: string) {
  const lower = q.toLowerCase();
  for (const r of responses) {
    if (r.keywords.some((k) => lower.includes(k))) return r.reply;
  }
  return "I can help with registration, pricing, orders, delivery, IVR, and payments. Try asking about any of those.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "नमस्ते! I'm KrishiBot. Ask me anything about KrishiConnect." },
  ]);

  function send() {
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: answer(q) }]);
    }, 400);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-saffron text-saffron-foreground shadow-lg grid place-items-center hover:scale-105 transition"
        aria-label="Chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-navy text-navy-foreground px-4 py-3">
            <div className="font-semibold">KrishiBot Assistant</div>
            <div className="text-xs opacity-80">Online · Multi-lingual</div>
          </div>
          <div className="flex-1 p-3 space-y-2 max-h-80 overflow-y-auto bg-muted/30">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
                  m.from === "bot"
                    ? "bg-card border border-border"
                    : "bg-navy text-navy-foreground ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your question…"
              className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={send}
              className="px-3 rounded-md bg-saffron text-saffron-foreground"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
