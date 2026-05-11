import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { actions, useHydrated, useStore } from "@/lib/store";
import { CheckCircle2, Circle, Package, Truck, Home, Sprout } from "lucide-react";

export const Route = createFileRoute("/track/$id")({
  head: () => ({ meta: [{ title: "Track Order — KrishiConnect" }] }),
  component: TrackPage,
});

const stages = [
  { key: "Placed", label: "Order Placed", icon: Package },
  { key: "Confirmed by Farmer", label: "Confirmed by Farmer", icon: Sprout },
  { key: "Picked up by Agent", label: "Picked up by Agent", icon: Package },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
] as const;

function TrackPage() {
  const { id } = Route.useParams();
  const { orders } = useStore();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full text-muted-foreground">
          Loading…
        </main>
        <SiteFooter />
      </div>
    );
  }

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 text-center w-full">
          <h1 className="text-2xl font-bold text-navy">Order not found</h1>
          <Link to="/orders" className="text-saffron font-semibold mt-3 inline-block">
            View all orders →
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const currentIdx = stages.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="bg-navy text-navy-foreground px-6 py-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80">Order ID</div>
              <div className="font-mono text-lg">{order.id}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80">Total</div>
              <div className="text-2xl font-bold text-gold">₹{order.total}</div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="font-semibold text-navy">Live Tracking</h2>
            <div className="mt-6 relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
              <div
                className="absolute left-5 top-5 w-0.5 bg-india-green transition-all duration-500"
                style={{ height: `calc(${(currentIdx / (stages.length - 1)) * 100}% - 0px)` }}
              />
              <ul className="space-y-6">
                {stages.map((s, i) => {
                  const done = i <= currentIdx;
                  const Icon = s.icon;
                  return (
                    <li key={s.key} className="flex items-center gap-4 relative">
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full grid place-items-center ${
                          done
                            ? "bg-india-green text-india-green-foreground"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${done ? "text-navy" : "text-muted-foreground"}`}>
                          {s.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {done ? "Completed" : "Pending"}
                        </div>
                      </div>
                      <Icon className={`w-5 h-5 ${done ? "text-india-green" : "text-muted-foreground"}`} />
                    </li>
                  );
                })}
              </ul>
            </div>

            {order.status !== "Delivered" && (
              <button
                onClick={() => actions.advanceOrder(order.id)}
                className="mt-8 w-full px-4 py-3 rounded-md bg-saffron text-saffron-foreground font-semibold"
              >
                Simulate next stage →
              </button>
            )}
          </div>

          <div className="border-t border-border p-6 grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-muted-foreground">Delivery to</div>
              <div className="font-medium">{order.buyerName}</div>
              <div>{order.deliveryAddress}</div>
            </div>
            <div>
              <div className="text-muted-foreground">From farmer</div>
              <div className="font-medium">{order.farmerName}</div>
              <div>{order.items.length} item(s)</div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
