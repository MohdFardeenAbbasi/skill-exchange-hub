import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Building2,
  Smartphone,
  FileCheck2,
  Wallet as WalletIcon,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

type Method = "bank_transfer" | "upi" | "cheque";

const PACKAGES = [
  { id: "p99", amount: 99, points: 100, tag: "Starter" },
  { id: "p250", amount: 250, points: 300, tag: "Saver" },
  { id: "p500", amount: 500, points: 600, tag: "Popular" },
  { id: "p1000", amount: 1000, points: 1300, tag: "Pro" },
  { id: "p10000", amount: 10000, points: 18000, tag: "Elite" },
];

const UPI_ID = "9773819327@ptsbi";
const PAYEE = "Mohd Fardeen";
const BANK = {
  holder: "Mohd Fardeen",
  name: "SBI",
  branch: "Zakir Nagar",
  account: "[ADMIN WILL UPDATE]",
  ifsc: "[ADMIN WILL UPDATE]",
};

const baseSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
});

const refSchema = z.string().trim().min(6, "Reference number too short").max(40);

const buildQrUrl = (amount: number) => {
  const upi = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    PAYEE
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent("SkillExchanger Wallet")}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
    upi
  )}`;
};

const BuyPoints = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState<Method>("upi");
  const [packageId, setPackageId] = useState(PACKAGES[2].id);
  const [submitting, setSubmitting] = useState(false);

  // shared fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [bankName, setBankName] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeDate, setChequeDate] = useState("");

  const selected = useMemo(
    () => PACKAGES.find((p) => p.id === packageId) ?? PACKAGES[0],
    [packageId]
  );

  const { data: profile } = useQuery({
    queryKey: ["profile-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("points_balance, full_name")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

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

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const openPaytm = () => {
    const upi = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
      PAYEE
    )}&am=${selected.amount}&cu=INR&tn=${encodeURIComponent(
      "SkillExchanger Wallet"
    )}`;
    window.location.href = upi;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const base = baseSchema.safeParse({ full_name: fullName, email });
    if (!base.success) {
      toast.error(base.error.issues[0].message);
      return;
    }

    let ref = reference;
    if (method === "cheque") ref = chequeNumber;
    const parsedRef = refSchema.safeParse(ref);
    if (!parsedRef.success) {
      toast.error(parsedRef.error.issues[0].message);
      return;
    }

    if (method === "cheque" && !chequeDate) {
      toast.error("Cheque date is required");
      return;
    }
    if (method === "bank_transfer" && !paymentDate) {
      toast.error("Payment date is required");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("payment_requests").insert({
      user_id: user.id,
      transaction_id: parsedRef.data,
      amount: selected.amount,
      points: selected.points,
      payment_method: method,
      package_id: selected.id,
      full_name: base.data.full_name,
      email: base.data.email,
      payment_date: method === "bank_transfer" ? paymentDate : null,
      bank_name: method === "cheque" ? bankName : null,
      cheque_number: method === "cheque" ? chequeNumber : null,
      cheque_date: method === "cheque" ? chequeDate : null,
    } as any);

    if (error) {
      if (error.code === "23505") {
        toast.error("This reference number was already submitted.");
      } else {
        toast.error(error.message || "Failed to submit request");
      }
    } else {
      toast.success("Request submitted! Points credit after admin approval.");
      setReference("");
      setChequeNumber("");
      setChequeDate("");
      setBankName("");
      refetch();
    }
    setSubmitting(false);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { cls: string; icon: JSX.Element; label: string }> = {
      pending: {
        cls: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      approved: {
        cls: "bg-green-500/10 text-green-600 border-green-500/20",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Approved",
      },
      rejected: {
        cls: "bg-destructive/10 text-destructive border-destructive/20",
        icon: <XCircle className="w-3 h-3" />,
        label: "Rejected",
      },
    };
    const v = map[s] ?? map.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${v.cls}`}
      >
        {v.icon}
        {v.label}
      </span>
    );
  };

  const methodCards: { id: Method; title: string; desc: string; icon: JSX.Element }[] = [
    {
      id: "bank_transfer",
      title: "Bank Transfer",
      desc: "NEFT / IMPS / RTGS",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: "upi",
      title: "UPI Payment",
      desc: "Paytm, GPay, PhonePe",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      id: "cheque",
      title: "Cheque Payment",
      desc: "Submit cheque details",
      icon: <FileCheck2 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header + Balance */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Wallet Recharge</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Recharge your <span className="gradient-text">Wallet</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Pick a package, pay via UPI / Bank / Cheque, and submit for approval.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-4 px-6 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground">
                <WalletIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current balance</p>
                <p className="text-2xl font-bold text-foreground">
                  {(profile?.points_balance ?? 0).toLocaleString()}{" "}
                  <span className="text-sm font-medium text-muted-foreground">pts</span>
                </p>
              </div>
            </div>
          </div>

          {/* Packages */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Choose a package
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {PACKAGES.map((p) => {
                const active = p.id === packageId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPackageId(p.id)}
                    className={`relative rounded-2xl border p-4 text-left transition-all backdrop-blur ${
                      active
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.02]"
                        : "border-border bg-card/60 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      {p.tag}
                    </div>
                    <div className="text-xl font-bold text-foreground">₹{p.amount}</div>
                    <div className="text-sm text-primary font-medium mt-1">
                      {p.points} pts
                    </div>
                    {active && (
                      <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* LEFT (methods + form) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Method cards */}
              <div className="grid sm:grid-cols-3 gap-3">
                {methodCards.map((m) => {
                  const active = m.id === method;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`rounded-2xl border p-4 text-left transition-all backdrop-blur ${
                        active
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border bg-card/60 hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {m.icon}
                      </div>
                      <div className="font-semibold text-foreground text-sm">
                        {m.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Method panel */}
              <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6">
                {method === "bank_transfer" && (
                  <div className="mb-5 grid sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label="Account Holder" value={BANK.holder} />
                    <InfoRow label="Bank" value={BANK.name} />
                    <InfoRow label="Branch" value={BANK.branch} />
                    <InfoRow label="Account #" value={BANK.account} />
                    <InfoRow label="IFSC" value={BANK.ifsc} />
                  </div>
                )}

                {method === "upi" && (
                  <div className="mb-5 p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">UPI ID</p>
                      <p className="font-mono font-semibold text-foreground">{UPI_ID}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copy(UPI_ID, "UPI ID")}
                      >
                        <Copy className="w-4 h-4" /> Copy
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={openPaytm}
                        className="bg-gradient-to-r from-primary to-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" /> Pay ₹{selected.amount}
                      </Button>
                    </div>
                  </div>
                )}

                {method === "cheque" && (
                  <div className="mb-5 p-4 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground">
                    Issue the cheque in favor of{" "}
                    <span className="text-foreground font-semibold">{BANK.holder}</span> and
                    submit the cheque details below.
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      maxLength={80}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      maxLength={255}
                    />
                  </Field>

                  <Field label="Selected Package">
                    <Input
                      readOnly
                      value={`₹${selected.amount} → ${selected.points} pts`}
                      className="bg-muted/40 font-medium"
                    />
                  </Field>

                  {method === "bank_transfer" && (
                    <>
                      <Field label="Transaction Reference #">
                        <Input
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          placeholder="e.g. NEFTXXXXXXXX"
                          maxLength={40}
                        />
                      </Field>
                      <Field label="Payment Date">
                        <Input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                        />
                      </Field>
                    </>
                  )}

                  {method === "upi" && (
                    <Field label="UTR Number" wide>
                      <Input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="12-digit UTR from your UPI app"
                        maxLength={40}
                      />
                    </Field>
                  )}

                  {method === "cheque" && (
                    <>
                      <Field label="Cheque Number">
                        <Input
                          value={chequeNumber}
                          onChange={(e) => setChequeNumber(e.target.value)}
                          placeholder="6-digit cheque number"
                          maxLength={20}
                        />
                      </Field>
                      <Field label="Bank Name">
                        <Input
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="Issuing bank"
                          maxLength={60}
                        />
                      </Field>
                      <Field label="Cheque Date" wide>
                        <Input
                          type="date"
                          value={chequeDate}
                          onChange={(e) => setChequeDate(e.target.value)}
                        />
                      </Field>
                    </>
                  )}

                  <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 pt-2">
                    {method === "upi" && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={openPaytm}
                      >
                        <Smartphone className="w-4 h-4" /> Pay via Paytm (₹{selected.amount})
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="hero"
                      className="flex-1"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Payment Request"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT (QR) */}
            <aside className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-1">Scan & Pay</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Works with any UPI app — Paytm, GPay, PhonePe, BHIM.
                </p>
                <div className="relative rounded-2xl bg-white p-4 border border-border flex items-center justify-center">
                  <img
                    src={buildQrUrl(selected.amount)}
                    alt={`UPI QR for ₹${selected.amount}`}
                    className="w-full max-w-[280px] aspect-square"
                  />
                </div>
                <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground">UPI ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono font-semibold text-foreground text-sm">
                      {UPI_ID}
                    </p>
                    <button
                      type="button"
                      onClick={() => copy(UPI_ID, "UPI ID")}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  You can directly pay to <strong className="text-foreground">{PAYEE}</strong>{" "}
                  using the QR code, UPI ID, Bank Transfer, or Cheque. Submit your transaction
                  details after payment. <strong className="text-foreground">Points will
                  be credited after approval.</strong>
                </p>
              </div>
            </aside>
          </div>

          {/* History */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recharge History</h2>
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden">
              {!requests || requests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No payment requests yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Method</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Points</th>
                        <th className="text-left p-3">Reference</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r: any) => (
                        <tr key={r.id} className="border-t border-border">
                          <td className="p-3 text-foreground whitespace-nowrap">
                            {new Date(r.created_at).toLocaleString()}
                          </td>
                          <td className="p-3 capitalize">
                            {(r.payment_method || "upi").replace("_", " ")}
                          </td>
                          <td className="p-3 font-medium text-foreground">₹{r.amount}</td>
                          <td className="p-3 text-primary font-medium">+{r.points}</td>
                          <td className="p-3 font-mono text-xs">{r.transaction_id}</td>
                          <td className="p-3">{statusBadge(r.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) => (
  <div className={wide ? "sm:col-span-2" : ""}>
    <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
    {children}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 rounded-xl bg-muted/40 border border-border">
    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="font-medium text-foreground text-sm break-all">{value}</p>
  </div>
);

export default BuyPoints;
