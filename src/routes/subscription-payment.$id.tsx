import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSubscription, getFarmer } from "@/lib/data";
import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Check,
  ChevronRight,
  ArrowLeft,
  Lock,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/subscription-payment/$id")({
  head: () => ({
    meta: [
      { title: "Payment — KrishiConnect" },
      {
        name: "description",
        content: "Complete your subscription payment securely.",
      },
    ],
  }),
  component: SubscriptionPayment,
});

type PaymentMethod = "credit-card" | "upi" | "netbanking" | "wallet";

function SubscriptionPayment() {
  const { id } = useParams({ from: "/subscription-payment/$id" });
  const navigate = useNavigate();
  const subscription = getSubscription(id);
  const farmer = subscription ? getFarmer(subscription.farmerId) : null;

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!subscription || !farmer) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-navy mb-2">Subscription not found</h1>
            <button
              onClick={() => navigate({ to: "/subscription-offers" })}
              className="text-saffron hover:underline"
            >
              Go back to offers
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentComplete(true);

    // Redirect after 3 seconds
    setTimeout(() => {
      navigate({ to: "/" });
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-india-green/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-india-green" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-2">
              Your subscription to <b>{subscription.name}</b> is now active.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              First delivery will arrive within 3-5 business days. You will receive updates via SMS and email.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="px-6 py-2 rounded-lg bg-saffron text-saffron-foreground font-semibold hover:bg-saffron/90"
            >
              Go Home
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate({ to: "/subscription-offers" })}
          className="inline-flex items-center gap-2 text-saffron hover:underline mb-8 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Offers
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold text-navy mb-4">Order Summary</h2>

              {/* Farmer Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={farmer.photo}
                    alt={farmer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-navy text-sm">{farmer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {farmer.village}, {farmer.state}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-semibold text-navy mb-3 text-sm">{subscription.name}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  {subscription.productsIncluded.map((product, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-india-green" />
                      {product}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-muted-foreground">
                  {subscription.frequency === "weekly"
                    ? "Weekly delivery"
                    : subscription.frequency === "biweekly"
                    ? "Bi-weekly delivery"
                    : "Monthly delivery"}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Charge</span>
                  <span className="font-semibold text-navy">₹{subscription.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold text-navy">{subscription.duration} month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-semibold text-navy">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-navy">Total</span>
                <span className="text-2xl font-bold text-saffron">₹{subscription.price}</span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3 text-india-green" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-india-green" />
                  Your data is protected
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-navy mb-6">Select Payment Method</h2>

              <div className="space-y-4 mb-8">
                {/* UPI */}
                <PaymentMethodCard
                  id="upi"
                  icon={Smartphone}
                  title="UPI / Google Pay / Phone Pay"
                  description="Instant payment using your UPI app"
                  selected={selectedPayment === "upi"}
                  onSelect={() => setSelectedPayment("upi")}
                />

                {/* Credit/Debit Card */}
                <PaymentMethodCard
                  id="credit-card"
                  icon={CreditCard}
                  title="Credit / Debit Card"
                  description="Visa, MasterCard, RuPay"
                  selected={selectedPayment === "credit-card"}
                  onSelect={() => setSelectedPayment("credit-card")}
                />

                {/* Net Banking */}
                <PaymentMethodCard
                  id="netbanking"
                  icon={Building2}
                  title="Net Banking"
                  description="Direct bank transfer from your account"
                  selected={selectedPayment === "netbanking"}
                  onSelect={() => setSelectedPayment("netbanking")}
                />

                {/* Wallet */}
                <PaymentMethodCard
                  id="wallet"
                  icon={Wallet}
                  title="Digital Wallet"
                  description="Paytm, Amazon Pay, Airtel Money"
                  selected={selectedPayment === "wallet"}
                  onSelect={() => setSelectedPayment("wallet")}
                />
              </div>

              {/* Payment Form */}
              <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
                {selectedPayment === "upi" && <UPIForm />}
                {selectedPayment === "credit-card" && <CardForm />}
                {selectedPayment === "netbanking" && <NetBankingForm />}
                {selectedPayment === "wallet" && <WalletForm />}
              </div>

              {/* Terms Checkbox */}
              <div className="mb-6 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  defaultChecked
                  className="w-4 h-4 rounded mt-1"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the terms and conditions and authorize KrishiConnect to process my payment.
                  Auto-renewal will occur every month unless cancelled.
                </label>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full px-6 py-3 rounded-lg bg-india-green text-white font-semibold hover:bg-india-green/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹{subscription.price} Securely
                  </>
                )}
              </button>

              {/* Info Text */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Your payment is secure and encrypted. No card details are stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function PaymentMethodCard({
  id,
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
}: {
  id: string;
  icon: any;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? "border-saffron bg-saffron/5"
          : "border-border bg-muted/30 hover:border-saffron/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${selected ? "bg-saffron/20" : "bg-muted"}`}>
          <Icon className={`w-6 h-6 ${selected ? "text-saffron" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-navy">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-saffron bg-saffron" : "border-border"
          }`}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    </button>
  );
}

function UPIForm() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">UPI ID</label>
        <input
          type="text"
          placeholder="yourname@upi"
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        You will be redirected to your UPI app to complete the payment.
      </p>
    </div>
  );
}

function CardForm() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">Cardholder Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Expiry</label>
          <input
            type="text"
            placeholder="MM/YY"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">CVV</label>
          <input
            type="text"
            placeholder="123"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
          />
        </div>
      </div>
    </div>
  );
}

function NetBankingForm() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">Select Your Bank</label>
        <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron">
          <option>HDFC Bank</option>
          <option>ICICI Bank</option>
          <option>Axis Bank</option>
          <option>SBI</option>
          <option>Other Bank</option>
        </select>
      </div>
      <p className="text-xs text-muted-foreground">
        You will be redirected to your bank's secure login page.
      </p>
    </div>
  );
}

function WalletForm() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">Select Wallet</label>
        <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron">
          <option>Paytm</option>
          <option>Amazon Pay</option>
          <option>Airtel Money</option>
          <option>MobiKwik</option>
        </select>
      </div>
      <p className="text-xs text-muted-foreground">
        You will be redirected to your wallet app to confirm payment.
      </p>
    </div>
  );
}
