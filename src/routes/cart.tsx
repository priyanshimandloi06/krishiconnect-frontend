import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { actions, useHydrated, useStore } from "@/lib/store";
import { createOrder } from "@/lib/api";
import { IndianRupee, Trash2 } from "lucide-react";
import { useState } from "react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — KrishiConnect" }] }),
  component: CartPage,
});

function CartPage() {
  const { t } = useT();
  const navigate = useNavigate();
  const { cart, user } = useStore();
  const hydrated = useHydrated();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const total = cart.reduce((a, i) => a + i.product.price * i.qty, 0);
  const delivery = cart.length ? 30 : 0;
  const [saving, setSaving] = useState(false);

  async function checkout() {
    if (!user?.id) {
      return alert(t("cart.loginRequired"));
    }
    const finalName = name || user?.name;
    if (!finalName) return alert(t("cart.nameRequired"));
    if (!address) return alert(t("cart.addressRequired"));
    if (cart.length === 0) return alert(t("cart.cartEmpty"));

    setSaving(true);
    try {
      const createdOrders = await Promise.all(
        cart.map(async ({ product, qty }) => {
          const { orderId } = await createOrder({
            consumerId: user.id!,
            productId: product.id,
            qty,
            deliveryLocation: address,
          });
          return {
            id: orderId,
            items: [{ product, qty }],
            total: product.price * qty,
            status: "Placed" as const,
            placedAt: Date.now(),
            buyerName: finalName,
            deliveryAddress: address,
            farmerName: product.farmerName,
            farmerId: product.farmerId,
          };
        }),
      );
      actions.addOrders(createdOrders);
      navigate({ to: "/payment/$id", params: { id: createdOrders[0].id } });
    } catch (error) {
      alert(error instanceof Error ? error.message : t("cart.orderError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-navy">{t("cart.mainTitle")}</h1>

        {!hydrated || cart.length === 0 ? (
          <div className="mt-10 text-center py-16 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">
              {hydrated ? t("cart.empty") : t("cart.loading")}
            </p>
            {hydrated && (
              <Link
                to="/marketplace"
                className="inline-block mt-4 px-5 py-2.5 rounded-md bg-saffron text-saffron-foreground font-semibold"
              >
                {t("cart.browseMarketplace")}
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {cart.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-lg p-3 flex gap-4 items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    loading="lazy"
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.farmerName} · {product.village}
                    </div>
                    <div className="flex items-center text-india-green font-bold mt-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {product.price}
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        /{product.unit}
                      </span>
                    </div>
                  </div>
                  <div className="inline-flex items-center border border-input rounded-md">
                    <button
                      onClick={() => actions.updateQty(product.id, qty - 1)}
                      className="px-2 py-1 hover:bg-accent"
                    >−</button>
                    <span className="px-3 text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => actions.updateQty(product.id, qty + 1)}
                      className="px-2 py-1 hover:bg-accent"
                    >+</button>
                  </div>
                  <button
                    onClick={() => actions.removeFromCart(product.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-5 h-fit space-y-4">
              <h2 className="font-bold text-navy text-lg">{t("cart.deliveryDetails")}</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user?.name ?? t("cart.yourName")}
                className="w-full px-3 py-2 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("cart.deliveryAddress")}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div className="text-sm space-y-1.5 pt-3 border-t border-border">
                <Row label={t("cart.subtotal")} value={`₹${total}`} />
                <Row label={t("cart.delivery")} value={`₹${delivery}`} />
                <Row label={t("cart.total")} value={`₹${total + delivery}`} bold />
              </div>
              <button
                onClick={checkout}
                disabled={saving}
                className="w-full px-4 py-3 rounded-md bg-india-green text-india-green-foreground font-semibold disabled:opacity-50"
              >
                {saving ? t("cart.placingOrder") : t("cart.placeOrder")}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                {t("cart.paymentMethods")}
              </p>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-base text-navy pt-1.5" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
