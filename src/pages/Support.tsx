import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, Mail, HelpCircle, Clock, CheckCircle, 
  Send, ChevronDown, Search
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does the points system work?",
    answer: "You earn points by teaching skills to others. These points can be used to learn new skills or converted to real money once you reach the minimum threshold of 1,000 points."
  },
  {
    question: "How do I withdraw my earnings?",
    answer: "Go to your Wallet page, enter the amount of points you want to withdraw (minimum 1,000), and submit a withdrawal request. Funds are processed within 3-5 business days."
  },
  {
    question: "Can I teach and learn at the same time?",
    answer: "Absolutely! Many of our members both teach and learn on the platform. You can offer multiple skills while also enrolling in courses from other instructors."
  },
  {
    question: "How are sessions conducted?",
    answer: "Sessions can be conducted via video call, in-person (if both parties agree), or through our integrated video platform. You can also upload pre-recorded content for asynchronous learning."
  },
  {
    question: "What happens if I'm not satisfied with a session?",
    answer: "We have a satisfaction guarantee. If you're not happy with a session, contact our support team within 48 hours, and we'll review your case for a potential refund."
  },
];

const tickets = [
  { id: "TK-001", subject: "Payment issue", status: "resolved", date: "Jan 10, 2026" },
  { id: "TK-002", subject: "Session scheduling problem", status: "open", date: "Jan 12, 2026" },
];

const Support = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>Help & Support</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              How Can We <span className="gradient-text">Help?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions or reach out to our support team.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                className="pl-12 h-14 rounded-2xl text-lg"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors duration-300"
                    >
                      <span className="font-medium text-foreground pr-4">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300",
                          expandedFaq === index && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        expandedFaq === index ? "max-h-48" : "max-h-0"
                      )}
                    >
                      <p className="px-5 pb-5 text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Contact Support</h2>
              <div className="rounded-2xl border border-border bg-card p-6">
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                    <Input
                      placeholder="Brief subject of your inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                    <Textarea
                      placeholder="Describe your issue or question in detail..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" className="w-full">
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Support Tickets */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Support Tickets</h3>
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        {ticket.status === 'resolved' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground">{ticket.id} • {ticket.date}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        ticket.status === 'resolved' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                      )}>
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
