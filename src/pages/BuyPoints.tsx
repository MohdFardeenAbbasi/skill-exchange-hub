import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QrCode, IndianRupee, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const BuyPoints = () => {
  const { user } = useAuth();
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: requests, refetch } = useQuery({
    queryKey: ["payment-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const amt = Number(amount);
    if (amt < 10) {
      toast.error("Minimum amount is ₹10");
      return;
    }
    if (!transactionId.trim()) {
      toast.error("Please enter your transaction/UTR ID");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("payment_requests").insert({
      user_id: user.id,
      transaction_id: transactionId.trim(),
      amount: amt,
      points: amt, // 1:1 ratio
    });

    if (error) {
      toast.error("Failed to submit request");
    } else {
      toast.success("Payment request submitted! We'll verify and add points shortly.");
      setTransactionId("");
      setAmount("");
      refetch();
    }
    setSubmitting(false);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/10 text-green-600";
      case "rejected": return "bg-destructive/10 text-destructive";
      default: return "bg-yellow-500/10 text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <IndianRupee className="w-5 h-5" />
              <span>Buy Points</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Purchase <span className="gradient-text">Points</span>
            </h1>
            <p className="text-muted-foreground mt-2">Scan the QR code, pay via UPI, and submit your transaction ID.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code Section */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold text-foreground mb-4">Scan & Pay</h2>
              <div className="w-56 h-56 rounded-xl bg-muted flex items-center justify-center mb-4 border-2 border-dashed border-primary/30">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">UPI QR Code</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mb-2">
                Pay to: <span className="font-semibold text-foreground">skillxchange@upi</span>
              </p>
              <div className="p-3 rounded-xl bg-muted/50 w-full text-center">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-lg font-bold text-foreground">₹1 = 1 Point</p>
                <p className="text-xs text-muted-foreground">Min: ₹10 | Max: ₹10,000</p>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4 leading-relaxed">
                You can make the payment directly to <strong>Mohd Fardeen's</strong> registered phone number.
                After completing the payment, please enter the <strong>UTR (Transaction Reference Number)</strong> in the UTR field for verification.
              </p>
            </div>

            {/* Payment Form */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Submit Payment Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Amount Paid (₹)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount in rupees"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={10}
                    max={10000}
                    className="h-12"
                  />
                  {amount && Number(amount) >= 10 && (
                    <p className="text-sm text-primary mt-1">You'll receive: {Number(amount)} points</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Transaction ID / UTR Number</label>
                  <Input
                    type="text"
                    placeholder="Enter UTR or transaction reference"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-12"
                    maxLength={50}
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={submitting || !amount || !transactionId}>
                  <Send className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit for Verification"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Points will be added after admin verification
                </p>
              </form>
            </div>
          </div>

          {/* Payment History */}
          {requests && requests.length > 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Payment Requests</h2>
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      {statusIcon(req.status)}
                      <div>
                        <p className="font-medium text-foreground">₹{req.amount} → {req.points} pts</p>
                        <p className="text-xs text-muted-foreground">UTR: {req.transaction_id} • {new Date(req.created_at).toLocaleDateString()}</p>
                        {req.admin_notes && <p className="text-xs text-destructive mt-1">{req.admin_notes}</p>}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuyPoints;
