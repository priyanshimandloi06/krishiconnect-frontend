import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useHydrated, useStore, actions } from "@/lib/store";
import { fetchOrders } from "@/lib/api";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";
export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — KrishiConnect" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { t } = useT();
  const { orders, user } = useStore();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!user?.id) return;
    fetchOrders(user.id)
      .then((backendOrders) => {
        const mappedOrders = backendOrders.map((order: any) => ({
          id: String(order.id),
          items: [
            {
              product: {
                id: String(order.productId),
                name: "Produce item",
                category: "",
                image: "",
                price: Number(order.totalAmount) / Number(order.qty),
                fairPrice: Number(order.totalAmount) / Number(order.qty),
                unit: "kg",
                quantity: Number(order.qty),
                farmerId: String(order.productId),
                farmerName: "Farmer",
                village: "",
                district: "",
                state: "",
                distanceKm: 0,
                rating: 0,
                reviews: 0,
                harvestedDaysAgo: 0,
                description: "",
              },
              qty: Number(order.qty),
            },
          ],
          total: Number(order.totalAmount),
          status: String(order.status) as any,
          placedAt: new Date(order.createdAt).getTime() || Date.now(),
          buyerName: user.name,
          deliveryAddress: String(order.deliveryLocation),
          farmerName: "Farmer",
          farmerId: String(order.productId),
        }));
        actions.setOrders(mappedOrders);
      })
      .catch((error) => console.error("Failed to load orders", error));
  }, [user?.id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-navy">{t("orders.mainTitle")}</h1>

        {!hydrated || orders.length === 0 ? (
          <div className="mt-8 text-center py-16 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">
              {hydrated ? t("orders.noOrders") : t("orders.loading")}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="block bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">{t("orders.orderId")}</div>
                    <div className="font-mono font-semibold">{o.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t("orders.placed")}</div>
                    <div>{new Date(o.placedAt).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t("orders.total")}</div>
                    <div className="font-bold text-india-green">₹{o.total + 30}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-india-green/10 text-india-green">
                    {o.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="text-muted-foreground">
                    {o.items.length} {t("orders.itemsFrom")} {o.farmerName}
                  </div>
                  {o.payment ? (
                    <div className="text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-india-green/10 text-india-green font-semibold">
                        ✓ {t("orders.paid")} · {o.payment.method}
                      </span>
                      <span className="font-mono text-muted-foreground">{o.payment.txnId}</span>
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-saffron/10 text-saffron font-semibold text-xs">
                      {t("orders.paymentPending")}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/track/$id"
                    params={{ id: o.id }}
                    className="text-xs font-semibold text-saffron hover:underline"
                  >
                    {t("orders.trackOrder")}
                  </Link>
                  {!o.payment && (
                    <Link
                      to="/payment/$id"
                      params={{ id: o.id }}
                      className="text-xs font-semibold text-india-green hover:underline ml-auto"
                    >
                      {t("orders.payNow")}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
