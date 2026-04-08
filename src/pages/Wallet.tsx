import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Coins, Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownLeft,
  CreditCard, DollarSign, Clock, CheckCircle, AlertCircle, IndianRupee
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Wallet = () => {
  const { user } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: paymentRequests } = useQuery({
    queryKey: ["payment-requests-wallet", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data;
    },
    enabled: !!user,
  });

  const totalPoints = profile?.points_balance || 0;
  const pendingRequests = paymentRequests?.filter(r => r.status === "pending") || [];
  const pendingPoints = pendingRequests.reduce((sum, r) => sum + r.points, 0);
  const conversionRate = 0.10;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <WalletIcon className="w-5 h-5" />
              <span>Wallet & Earnings</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Your <span className="gradient-text">Wallet</span>
            </h1>
            <p className="text-muted-foreground mt-2">Manage your points and convert them to real money.</p>
          </div>

          {/* Balance Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-2xl gradient-primary text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <Coins className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-sm opacity-80 mb-1">Total Points</p>
              <p className="text-3xl font-bold">{totalPoints.toLocaleString()}</p>
              <p className="text-sm opacity-80 mt-2">≈ ${(totalPoints * conversionRate).toFixed(2)} USD</p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Available</p>
              <p className="text-3xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-2">Ready to withdraw</p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-foreground">{pendingPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-2">Processing withdrawal</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Payment Requests History */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Payment History</h2>
              <div className="space-y-3">
                {paymentRequests && paymentRequests.length > 0 ? paymentRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        req.status === 'approved' ? 'bg-green-500/10' : 
                        req.status === 'rejected' ? 'bg-destructive/10' : 'bg-yellow-500/10'
                      }`}>
                        {req.status === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : req.status === 'rejected' ? (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">₹{req.amount} → {req.points} pts</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>UTR: {req.transaction_id}</span>
                          <span>•</span>
                          <span>{new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                        {req.admin_notes && <p className="text-xs text-destructive mt-1">{req.admin_notes}</p>}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      req.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                      req.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                      'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-8">No payment history yet</p>
                )}
              </div>
            </div>

            {/* Buy Points Section */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Buy Points</h2>
              
              <div className="p-4 rounded-xl bg-muted/50 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                <p className="text-lg font-semibold text-foreground">₹1 = 1 Point</p>
                <p className="text-xs text-muted-foreground mt-1">Pay via UPI and get points instantly after approval</p>
              </div>

              <Link to="/buy-points">
                <Button variant="hero" className="w-full">
                  <IndianRupee className="w-4 h-4" />
                  Buy Points via UPI
                </Button>
              </Link>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Scan QR, pay, and submit transaction ID for verification
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
