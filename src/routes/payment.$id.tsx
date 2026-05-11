import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { actions, useHydrated, useStore, type PaymentMethod } from "@/lib/store";
import { useMemo, useState } from "react";
import {
  QrCode,
  Smartphone,
  Building2,
  CreditCard,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  IndianRupee,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/payment/$id")({
  head: () => ({ meta: [{ title: "Payment — KrishiConnect" }] }),
  component: PaymentPage,
});

type Tab = "upi" | "qr" | "netbanking" | "card" | "cod";

function PaymentPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { orders } = useStore();
  const hydrated = useHydrated();
  const order = orders.find((o) => o.id === id);

  const [tab, setTab] = useState<Tab>("upi");
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("SBIN");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });

  // Static-ish UPI QR payload (deterministic per order)
  const qrText = useMemo(() => {
    if (!order) return "";
    const upi = `upi://pay?pa=krishiconnect@upi&pn=KrishiConnect&am=${order.total + 30}&cu=INR&tn=${order.id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upi)}`;
  }, [order]);

  if (!hydrated) {
    return (
      <Shell><div className="text-muted-foreground">Loading…</div></Shell>
    );
  }
  if (!order) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-navy">Order not found</h1>
        <Link to="/orders" className="text-saffron font-semibold">View orders →</Link>
      </Shell>
    );
  }
  if (order.payment?.status === "Paid") {
    return (
      <Shell>
        <div className="text-center py-10">
          <CheckCircle2 className="w-16 h-16 text-india-green mx-auto" />
          <h1 className="text-2xl font-bold text-navy mt-3">Payment already received</h1>
          <p className="text-muted-foreground">Txn: {order.payment.txnId}</p>
          <Link to="/track/$id" params={{ id: order.id }} className="inline-block mt-5 px-5 py-2.5 rounded-md bg-saffron text-saffron-foreground font-semibold">
            Track Order →
          </Link>
        </div>
      </Shell>
    );
  }

  const total = order.total + 30; // delivery

  function pay(method: PaymentMethod, details: string) {
    setProcessing(true);
    setTimeout(() => {
      const txnId = "TXN" + Date.now().toString().slice(-10);
      actions.attachPayment(order!.id, {
        method,
        status: "Paid",
        txnId,
        paidAt: Date.now(),
        details,
      });
      setProcessing(false);
      navigate({ to: "/track/$id", params: { id: order!.id } });
    }, 1400);
  }

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "upi", label: "UPI", icon: Smartphone },
    { key: "qr", label: "Scan QR", icon: QrCode },
    { key: "netbanking", label: "Net Banking", icon: Building2 },
    { key: "card", label: "Card", icon: CreditCard },
    { key: "cod", label: "Cash on Delivery", icon: Wallet },
  ];

  return (
    <Shell>
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="bg-navy text-navy-foreground px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest opacity-80">Secure Payment</div>
              <div className="font-semibold">Order {order.id}</div>
            </div>
            <ShieldCheck className="w-6 h-6 text-gold" />
          </div>

          {/* Tab nav */}
          <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-saffron text-saffron bg-saffron/5"
                    : "border-transparent text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <t.icon className="w-5 h-5" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === "upi" && (
              <div className="space-y-4">
                <h3 className="font-bold text-navy">Pay using UPI ID</h3>
                <div className="flex gap-2 flex-wrap">
                  {["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setUpiId(`user@${a.toLowerCase().replace(" ", "")}`)}
                      className="px-3 py-2 rounded-md border border-border bg-card hover:border-saffron text-sm font-medium"
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-3 py-2.5 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  disabled={!upiId || processing}
                  onClick={() => pay("UPI", upiId)}
                  className="w-full px-4 py-3 rounded-md bg-india-green text-india-green-foreground font-semibold disabled:opacity-50"
                >
                  {processing ? "Verifying with bank…" : `Pay ₹${total} via UPI`}
                </button>
              </div>
            )}

            {tab === "qr" && (
              <div className="text-center space-y-4">
                <h3 className="font-bold text-navy">Scan with any UPI app</h3>
                <div className="inline-block p-4 bg-white border-2 border-navy rounded-lg">
                  <img src={qrText} alt="UPI QR Code" width={240} height={240} className="block" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Use Google Pay, PhonePe, Paytm, BHIM or any UPI app
                </p>
                <div className="font-mono text-xs text-muted-foreground">
                  krishiconnect@upi · ₹{total}
                </div>
                <button
                  disabled={processing}
                  onClick={() => pay("QR", "Scanned via UPI")}
                  className="w-full px-4 py-3 rounded-md bg-india-green text-india-green-foreground font-semibold disabled:opacity-50"
                >
                  {processing ? "Awaiting confirmation…" : "I have completed the payment"}
                </button>
              </div>
            )}

            {tab === "netbanking" && (
              <div className="space-y-4">
                <h3 className="font-bold text-navy">Choose your bank</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { code: "SBIN", name: "State Bank of India" },
                    { code: "HDFC", name: "HDFC Bank" },
                    { code: "ICIC", name: "ICICI Bank" },
                    { code: "AXIS", name: "Axis Bank" },
                    { code: "PNB", name: "Punjab National Bank" },
                    { code: "BOB", name: "Bank of Baroda" },
                    { code: "KOTAK", name: "Kotak Mahindra" },
                    { code: "CANARA", name: "Canara Bank" },
                    { code: "UNION", name: "Union Bank" },
                  ].map((b) => (
                    <button
                      key={b.code}
                      onClick={() => setBank(b.code)}
                      className={`px-3 py-3 rounded-md border text-left text-sm ${
                        bank === b.code ? "border-saffron bg-saffron/5" : "border-border hover:border-saffron"
                      }`}
                    >
                      <div className="font-semibold text-navy">{b.code}</div>
                      <div className="text-[11px] text-muted-foreground">{b.name}</div>
                    </button>
                  ))}
                </div>
                <button
                  disabled={processing}
                  onClick={() => pay("NetBanking", bank)}
                  className="w-full px-4 py-3 rounded-md bg-india-green text-india-green-foreground font-semibold disabled:opacity-50"
                >
                  {processing ? "Redirecting to bank…" : `Pay ₹${total} via ${bank}`}
                </button>
              </div>
            )}

            {tab === "card" && (
              <div className="space-y-3">
                <h3 className="font-bold text-navy">Credit / Debit Card</h3>
                <div className="flex gap-2 text-xs text-muted-foreground items-center">
                  <span className="px-2 py-1 bg-muted rounded font-bold">VISA</span>
                  <span className="px-2 py-1 bg-muted rounded font-bold">MasterCard</span>
                  <span className="px-2 py-1 bg-muted rounded font-bold">RuPay</span>
                  <span className="px-2 py-1 bg-muted rounded font-bold">AMEX</span>
                </div>
                <input
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, "").slice(0, 19) })}
                  placeholder="Card number"
                  className="w-full px-3 py-2.5 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring font-mono"
                />
                <input
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  placeholder="Name on card"
                  className="w-full px-3 py-2.5 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={card.exp}
                    onChange={(e) => setCard({ ...card, exp: e.target.value.slice(0, 5) })}
                    placeholder="MM/YY"
                    className="px-3 py-2.5 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring font-mono"
                  />
                  <input
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    placeholder="CVV"
                    type="password"
                    className="px-3 py-2.5 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring font-mono"
                  />
                </div>
                <button
                  disabled={!card.number || !card.cvv || processing}
                  onClick={() => pay("Card", `**** ${card.number.slice(-4)}`)}
                  className="w-full px-4 py-3 rounded-md bg-india-green text-india-green-foreground font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {processing ? "Authorising…" : `Pay ₹${total} securely`}
                </button>
              </div>
            )}

            {tab === "cod" && (
              <div className="space-y-4">
                <h3 className="font-bold text-navy">Cash on Delivery</h3>
                <div className="bg-saffron/5 border border-saffron/30 rounded-md p-4 text-sm text-muted-foreground">
                  Pay <span className="font-bold text-navy">₹{total}</span> in cash to the delivery agent when your produce arrives.
                </div>
                <button
                  disabled={processing}
                  onClick={() => pay("COD", "Cash on Delivery")}
                  className="w-full px-4 py-3 rounded-md bg-india-green text-india-green-foreground font-semibold disabled:opacity-50"
                >
                  {processing ? "Confirming…" : "Confirm COD Order"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-card border border-border rounded-lg p-5 h-fit">
          <h3 className="font-bold text-navy">Order Summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            {order.items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between gap-2">
                <span className="text-muted-foreground truncate">{product.name} × {qty}</span>
                <span className="font-medium">₹{product.price * qty}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-sm">
            <Row label="Subtotal" value={`₹${order.total}`} />
            <Row label="Delivery" value="₹30" />
            <div className="flex justify-between font-bold text-base text-navy pt-1.5 border-t border-border">
              <span>Total</span>
              <span className="inline-flex items-center"><IndianRupee className="w-4 h-4" />{total}</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-india-green shrink-0 mt-0.5" />
            100% secure payment. PCI-DSS compliant. Encrypted with 256-bit SSL.
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-navy mb-6">Complete Payment</h1>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
