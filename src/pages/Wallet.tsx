import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Coins, Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownLeft,
  CreditCard, DollarSign, Clock, CheckCircle, AlertCircle
} from "lucide-react";

const transactions = [
  { id: 1, type: "earned", description: "Taught React Fundamentals", points: 200, date: "Jan 12, 2026", status: "completed" },
  { id: 2, type: "spent", description: "Learned Guitar Basics", points: -100, date: "Jan 11, 2026", status: "completed" },
  { id: 3, type: "earned", description: "Taught UI Design", points: 150, date: "Jan 10, 2026", status: "completed" },
  { id: 4, type: "withdrawal", description: "Withdrawal to Bank", points: -500, date: "Jan 8, 2026", status: "pending" },
  { id: 5, type: "earned", description: "Taught Python Basics", points: 175, date: "Jan 5, 2026", status: "completed" },
];

const Wallet = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const totalPoints = 2450;
  const pendingPoints = 500;
  const availablePoints = totalPoints - pendingPoints;
  const conversionRate = 0.10; // $0.10 per point

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
              <p className="text-3xl font-bold text-foreground">{availablePoints.toLocaleString()}</p>
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
            {/* Transaction History */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Transaction History</h2>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'earned' ? 'bg-green-500/10' : 
                        tx.type === 'withdrawal' ? 'bg-yellow-500/10' : 'bg-accent/10'
                      }`}>
                        {tx.type === 'earned' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-500" />
                        ) : tx.type === 'withdrawal' ? (
                          <DollarSign className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tx.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{tx.date}</span>
                          {tx.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${tx.points > 0 ? 'text-green-500' : 'text-foreground'}`}>
                      {tx.points > 0 ? '+' : ''}{tx.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Withdraw Section */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Withdraw Funds</h2>
              
              <div className="p-4 rounded-xl bg-muted/50 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                <p className="text-lg font-semibold text-foreground">1 Point = $0.10 USD</p>
                <p className="text-xs text-muted-foreground mt-1">Minimum withdrawal: 1,000 points</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Points to Withdraw</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter points"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="h-12 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">pts</span>
                  </div>
                  {withdrawAmount && (
                    <p className="text-sm text-primary mt-2">
                      You'll receive: ${(Number(withdrawAmount) * conversionRate).toFixed(2)} USD
                    </p>
                  )}
                </div>

                <Button variant="hero" className="w-full" disabled={!withdrawAmount || Number(withdrawAmount) < 1000}>
                  <CreditCard className="w-4 h-4" />
                  Request Withdrawal
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Withdrawals are processed within 3-5 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
