import { useState } from "react";
import { MessageCircleQuestion, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const helpTopics = [
  { q: "How do I earn points?", a: "Upload videos to teach skills. When other users watch your videos, points are transferred from their account to yours (10 pts per watch)." },
  { q: "How do I buy points?", a: "Go to Wallet → Buy Points. Scan the UPI QR code, make a payment, then submit your transaction ID. Points are added after admin verification (₹1 = 1 point)." },
  { q: "How do I upload a video?", a: "Go to your Dashboard and click 'Upload Video'. Select a video file, choose a category, add a title and description, then submit." },
  { q: "How does the wallet work?", a: "Your wallet shows your total points, pending withdrawals, and transaction history. You can also request withdrawals from the wallet page." },
  { q: "What are the categories?", a: "Videos can be categorized as Education, Entertainment, Sports, Technology, Music, Gaming, Lifestyle, News, or Other." },
  { q: "Is there a cooldown for watching?", a: "Yes, there's a 30-minute cooldown between watching the same video to prevent point farming." },
];

const AiHelpAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Hi! 👋 I'm your SkillXchange assistant. How can I help you today?" },
  ]);

  const handleTopic = (topic: typeof helpTopics[0]) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: topic.q },
      { role: "bot", text: topic.a },
    ]);
  };

  const answeredQuestions = messages.filter(m => m.role === "user").map(m => m.text);
  const availableTopics = helpTopics.filter(t => !answeredQuestions.includes(t.q));

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Help assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircleQuestion className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-h-[70vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 gradient-primary text-primary-foreground">
            <h3 className="font-semibold">SkillXchange Help</h3>
            <p className="text-xs opacity-80">Ask me anything about the platform</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {availableTopics.length > 0 && (
            <div className="p-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {availableTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleTopic(topic)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors text-foreground"
                  >
                    {topic.q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AiHelpAssistant;
