import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const AdminPayments = () => {
  const { user } = useAuth();
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", {
        _user_id: user!.id,
        _role: "admin",
      });
      return data;
    },
    enabled: !!user,
  });

  const { data: requests, refetch } = useQuery({
    queryKey: ["admin-payment-requests"],
    queryFn: async () => {
      // Fetch payment requests
      const { data: payments, error } = await supabase
        .from("payment_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch profiles for all unique user_ids
      const userIds = [...new Set(payments.map((p) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      // Email is column-protected; fetch per user via secured RPC (admin or self only)
      const profilesWithEmail = await Promise.all(
        (profiles || []).map(async (p) => {
          const { data: email } = await supabase.rpc("get_user_email", { _user_id: p.user_id });
          return { ...p, email: email as string | null };
        })
      );

      const profileMap = new Map(
        profilesWithEmail.map((p) => [p.user_id, p])
      );

      return payments.map((p) => ({
        ...p,
        profile: profileMap.get(p.user_id) || null,
      }));
    },
    enabled: !!user && isAdmin === true,
  });

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const { data, error } = await supabase.rpc("approve_payment", { p_payment_id: id });
    if (error) {
      toast.error("Failed to approve");
    } else {
      const result = data as any;
      if (result?.success) {
        toast.success(`Approved! ${result.points_added} points added.`);
        refetch();
      } else {
        toast.error(result?.error || "Failed");
      }
    }
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    const { data, error } = await supabase.rpc("reject_payment", {
      p_payment_id: id,
      p_reason: rejectReason[id] || null,
    });
    if (error) {
      toast.error("Failed to reject");
    } else {
      const result = data as any;
      if (result?.success) {
        toast.success("Payment request rejected.");
        refetch();
      } else {
        toast.error(result?.error || "Failed");
      }
    }
    setProcessing(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 lg:pt-28 pb-16 flex items-center justify-center">
          <div className="text-center">
            <ShieldCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Admin Access Required</h1>
            <p className="text-muted-foreground mt-2">You don't have permission to view this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pending = requests?.filter((r) => r.status === "pending") || [];
  const processed = requests?.filter((r) => r.status !== "pending") || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Admin Panel</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Payment <span className="gradient-text">Approvals</span>
            </h1>
            <p className="text-muted-foreground mt-2">Review and manage payment requests from users.</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-4">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{pending.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{processed.filter(r => r.status === 'approved').length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{requests?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Pending Requests</h2>
            {pending.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {pending.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl border border-border bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-foreground">₹{req.amount} → {req.points} Points</p>
                        <p className="text-sm text-muted-foreground">UTR: <span className="font-mono text-foreground">{req.transaction_id}</span></p>
                        <p className="text-xs text-muted-foreground">
                          {req.profile?.full_name || req.profile?.email || req.user_id.slice(0, 8) + "..."} • {new Date(req.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                        <Input
                          placeholder="Reject reason (optional)"
                          value={rejectReason[req.id] || ""}
                          onChange={(e) => setRejectReason(prev => ({ ...prev, [req.id]: e.target.value }))}
                          className="h-9 text-sm w-full sm:w-48"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id)}
                            disabled={processing === req.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(req.id)}
                            disabled={processing === req.id}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Processed */}
          {processed.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Processed Requests</h2>
              <div className="space-y-3">
                {processed.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">₹{req.amount} → {req.points} pts</p>
                      <p className="text-xs text-muted-foreground">UTR: {req.transaction_id} • {new Date(req.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      req.status === 'approved' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
                    }`}>
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

export default AdminPayments;
