import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { farmerSubscriptions, getFarmer, getSubscription } from "@/lib/data";
import { ChevronRight, Check, Star, ShieldCheck, Calendar, Truck, Gift } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/subscription-offers")({
  head: () => ({
    meta: [
      { title: "Subscription Offers — KrishiConnect" },
      {
        name: "description",
        content: "Subscribe to get fresh produce delivered regularly from verified Indian farmers.",
      },
    ],
  }),
  component: SubscriptionOffers,
});

function SubscriptionOffers() {
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-india-green/10 border border-india-green/30 text-india-green text-[11px] font-bold uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5" /> Exclusive Offers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-3">
            Fresh Produce Subscriptions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Subscribe to get fresh, farm-to-door produce delivered regularly from verified farmers. 
            Enjoy consistent quality, fair prices, and direct support to farmers.
          </p>
        </div>

        {/* Subscription Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {farmerSubscriptions.map((subscription) => {
            const farmer = getFarmer(subscription.farmerId);
            if (!farmer) return null;

            const isSelected = selectedSubscription === subscription.id;

            return (
              <div
                key={subscription.id}
                className={`rounded-lg border-2 transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-saffron bg-saffron/5 shadow-lg"
                    : "border-border bg-card hover:border-saffron/50"
                }`}
              >
                {/* Farmer Info */}
                <div className="p-6 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={farmer.photo}
                      alt={farmer.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-india-green"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy">{farmer.name}</span>
                        <ShieldCheck className="w-4 h-4 text-india-green" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {farmer.village}, {farmer.state}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="font-semibold text-navy">{farmer.rating}</span>
                    <span className="text-muted-foreground">({farmer.totalSales} sales)</span>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy mb-2">{subscription.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{subscription.description}</p>

                  {/* Price and Duration */}
                  <div className="mb-6 p-4 bg-india-green/5 rounded-lg border border-india-green/20">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-bold text-india-green">₹{subscription.price}</span>
                      <span className="text-muted-foreground">per month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="inline w-3 h-3 mr-1" />
                      {subscription.frequency === "weekly"
                        ? "Delivered every week"
                        : subscription.frequency === "biweekly"
                        ? "Delivered every two weeks"
                        : "Delivered monthly"}
                    </div>
                  </div>

                  {/* Products Included */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-navy mb-3">Products Included:</h4>
                    <ul className="space-y-2">
                      {subscription.productsIncluded.map((product, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-india-green" />
                          {product}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-navy mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {subscription.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Truck className="w-4 h-4 text-saffron" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/subscription-payment/$id"
                    params={{ id: subscription.id }}
                    className="w-full px-4 py-3 rounded-lg bg-saffron text-saffron-foreground font-semibold hover:bg-saffron/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Subscribe Now <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ / Info Section */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-navy mb-6">Why Subscribe?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 rounded-lg bg-india-green/10 flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-india-green" />
              </div>
              <h3 className="font-semibold text-navy mb-2">Guaranteed Quality</h3>
              <p className="text-sm text-muted-foreground">
                Verified farmers ensure consistent quality and freshness with every delivery.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-india-green/10 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-india-green" />
              </div>
              <h3 className="font-semibold text-navy mb-2">Convenient Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Fresh produce delivered right to your doorstep on a schedule that works for you.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-india-green/10 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-india-green" />
              </div>
              <h3 className="font-semibold text-navy mb-2">Fair Prices</h3>
              <p className="text-sm text-muted-foreground">
                Direct from farmer to your home — no middlemen, ensuring the best prices for you.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
