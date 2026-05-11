import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { actions, useHydrated, useStore } from "@/lib/store";
import { useMemo, useState, useEffect } from "react";
import { products as seed, getExactProductImage } from "@/lib/data";
import type { Product } from "@/lib/data";
import { Sparkles, IndianRupee, Plus, Package, Rocket, Star, CheckCircle2, ImageIcon, Loader2 } from "lucide-react";
import farmer1 from "@/assets/farmer-1.jpg";
import { fetchFarmerProducts, fetchFarmerOrders, fetchFarmerStats, createProduct, generateProductImage } from "@/lib/api";

export const Route = createFileRoute("/farmer/dashboard")({
  head: () => ({ meta: [{ title: "Farmer Dashboard — KrishiConnect" }] }),
  component: FarmerDashboard,
});

// Simple AI suggestion: based on category + quantity, recommend a price band
function suggestPrice(category: string, qty: number) {
  const base: Record<string, number> = {
    Vegetables: 30,
    "Leafy Greens": 24,
    Fruits: 180,
    Grains: 90,
  };
  const b = base[category] ?? 40;
  // bigger volume → slightly lower per-unit price
  const adj = qty > 100 ? -3 : qty < 30 ? 2 : 0;
  const min = b + adj - 4;
  const max = b + adj + 6;
  return { min, max, recommended: Math.round((min + max) / 2) };
}

function FarmerDashboard() {
  const { user, myListings, orders, promotedFarmers, myBoosts, farmerStats } = useStore();
  const hydrated = useHydrated();

  const [showForm, setShowForm] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Vegetables",
    quantity: "10",
    price: "",
    unit: "kg",
    image: "",
    description: "",
  });
  const [pendingBoost, setPendingBoost] = useState<{
    plan: string;
    price: number;
    duration: string;
  } | null>(null);
  const [boostPaymentMethod, setBoostPaymentMethod] = useState<"UPI" | "Card" | "NetBanking" | "Wallet">("UPI");
  const [boostPaymentDetails, setBoostPaymentDetails] = useState("");
  const [boostProcessing, setBoostProcessing] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState<string | null>(null);

  // Fetch farmer data on mount
  useEffect(() => {
    const farmerId = user?.id;
    if (!farmerId || user.role !== "farmer") return;

    const loadFarmerData = async () => {
      try {
        // Fetch farmer products
        const products = await fetchFarmerProducts(farmerId);
        actions.updateMyListings(products);

        // Fetch farmer orders
        const farmerOrders = await fetchFarmerOrders(farmerId);
        // Map backend orders to frontend format
        const mappedOrders = farmerOrders.map((order: any) => ({
          id: String(order.id),
          items: [
            {
              product: {
                id: String(order.productId),
                name: "Produce item", // Would need to fetch product details
                category: "",
                image: "",
                price: Number(order.totalAmount) / Number(order.qty),
                fairPrice: Number(order.totalAmount) / Number(order.qty),
                unit: "kg",
                quantity: Number(order.qty),
                farmerId: farmerId,
                farmerName: user.name,
                village: user.village || "",
                district: user.district || "",
                state: user.state || "",
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
          buyerName: "Consumer", // Would need to fetch consumer details
          deliveryAddress: String(order.deliveryLocation),
          farmerName: user.name,
          farmerId: user.id!,
        }));
        actions.setOrders(mappedOrders);

        // Fetch farmer stats
        const stats = await fetchFarmerStats(user.id!);
        actions.updateFarmerStats(stats);
      } catch (error) {
        console.error("Failed to load farmer data", error);
      }
    };

    loadFarmerData();
  }, [user?.id]);

  const all = useMemo(() => [...(hydrated ? myListings : []), ...seed.slice(0, 3)], [hydrated, myListings]);

  const suggestion = useMemo(
    () => suggestPrice(form.category, Number(form.quantity) || 0),
    [form.category, form.quantity],
  );

  const matchingProducts = useMemo(() => {
    const query = form.name.trim().toLowerCase();
    if (!query) return [];
    return seed.filter((product) => product.name.toLowerCase().includes(query)).slice(0, 6);
  }, [form.name]);

  function handleNameChange(value: string) {
    const trimmed = value.trim();
    const normalized = trimmed.toLowerCase();
    const exact = seed.find((product) => product.name.toLowerCase() === normalized);
    const partial = seed.find(
      (product) => normalized && product.name.toLowerCase().includes(normalized),
    );
    const selected = exact ?? partial;
    const image = getExactProductImage(trimmed) ?? selected?.image ?? form.image;

    setForm((current) => ({
      ...current,
      name: value,
      category: selected?.category ?? current.category,
      image,
    }));
    setShowNameSuggestions(true);
  }

  function selectProduct(product: Product) {
    setForm({
      ...form,
      name: product.name,
      category: product.category,
      image: product.image,
      description: `Fresh ${product.name.toLowerCase()} from ${user?.village || "our farms"}`,
    });
    setShowNameSuggestions(false);
  }

  async function generateImage() {
    if (!form.name.trim()) {
      alert("Please enter product name first");
      return;
    }

    const exactImage = form.image || getExactProductImage(form.name.trim());
    if (!exactImage) {
      alert(
        "Select a known product from the suggestions to use the exact image asset. Custom product names will not get an exact real product image.",
      );
      return;
    }

    setForm({ ...form, image: exactImage });
  }

  if (hydrated && (!user || user.role !== "farmer")) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-navy">Farmer login required</h1>
          <Link to="/auth/farmer" className="text-saffron font-semibold inline-block mt-4">
            Register as Farmer →
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  async function addListing() {
    if (!form.name || !form.price || !user?.id) return alert("Fill product name and price");

    setLoading(true);
    try {
      const exactImage = form.image || getExactProductImage(form.name.trim());
      if (!exactImage) {
        alert("Please choose a listed product name from the suggestions so your listing uses a real exact image.");
        setLoading(false);
        return;
      }

      const productData = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        fairPrice: suggestion.recommended,
        unit: form.unit,
        quantity: Number(form.quantity),
        farmerId: user.id,
        farmerName: user.name,
        village: user.village || "",
        district: user.district || "",
        state: user.state || "",
        description: form.description || `Freshly harvested ${form.name.toLowerCase()} by ${user.name}`,
        image: exactImage,
      };

      await createProduct(productData);

      // Refresh farmer products
      const products = await fetchFarmerProducts(user.id);
      actions.updateMyListings(products);

      setForm({ name: "", category: "Vegetables", quantity: "10", price: "", unit: "kg", image: "", description: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create product", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Welcome */}
        <div className="bg-card border border-border rounded-lg p-5 flex items-center gap-4 flex-wrap">
          <img
            src={farmer1}
            alt="Farmer"
            width={60}
            height={60}
            className="w-14 h-14 rounded-full object-cover border-2 border-india-green"
          />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">नमस्ते, welcome back</div>
            <div className="font-bold text-xl text-navy">{user?.name ?? "Farmer"}</div>
            <div className="text-xs text-muted-foreground">
              {user?.village}, {user?.state} · PM-Kisan Verified
            </div>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 rounded-md bg-saffron text-saffron-foreground font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> List Produce
          </button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <Stat label="Active Listings" value={String(farmerStats?.productsCount || all.length)} />
          <Stat label="Pending Orders" value={String(farmerStats?.pendingOrders || orders.filter((o) => o.status !== "Delivered").length)} />
          <Stat label="Total Earnings" value={`₹${farmerStats?.totalRevenue?.toLocaleString() || "0"}`} />
          <Stat label="Rating" value="4.8 ★" />
        </div>

        {/* List form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <h2 className="text-lg font-bold text-navy">List New Produce</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field label="Product name">
                <div className="relative">
                  <Input
                    value={form.name}
                    onChange={handleNameChange}
                    onFocus={() => setShowNameSuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowNameSuggestions(false), 150);
                    }}
                  />
                  {showNameSuggestions && matchingProducts.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg z-20">
                      {matchingProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            selectProduct(product);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-muted/70 focus:bg-muted/70"
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a product from the list to use an exact real asset for the listing.
                  </p>
                </div>
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {["Vegetables", "Leafy Greens", "Fruits", "Grains"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Quantity available">
                <Input
                  value={form.quantity}
                  onChange={(v) => setForm({ ...form, quantity: v.replace(/\D/g, "") })}
                />
              </Field>
              <Field label="Unit">
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {["kg", "bunch", "dozen", "quintal"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </Field>
              <Field label="Your price (₹)">
                <Input
                  value={form.price}
                  onChange={(v) => setForm({ ...form, price: v.replace(/[^\d.]/g, "") })}
                />
              </Field>
              <Field label="Description (optional)">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your produce..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  rows={2}
                />
              </Field>
            </div>

            {/* Product Image Preview and Generation */}
            <div className="mt-6 p-4 rounded-md bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Product Image</h3>
                </div>
                <button
                  type="button"
                  onClick={generateImage}
                  disabled={!form.name.trim()}
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Load Exact Image
                </button>
              </div>
              {form.image ? (
                <div className="relative">
                  <img
                    src={form.image}
                    alt="Product preview"
                    className="w-full max-w-xs h-48 object-cover rounded-md border border-blue-300"
                  />
                  <p className="text-sm text-blue-600 mt-2">✓ Image generated automatically for your product!</p>
                </div>
              ) : (
                <div className="w-full max-w-xs h-48 bg-white border-2 border-dashed border-blue-300 rounded-md flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-blue-300 mb-2" />
                  <p className="text-sm text-blue-600 text-center">
                    {form.name.trim() ? "Click 'Generate Image' to create a product image" : "Enter product name first"}
                  </p>
                </div>
              )}
              <p className="text-xs text-blue-700 mt-3">
                🟢 Exact product images are selected from the verified produce library. Choose a listed product name from the suggestions for the best matching asset.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-md bg-india-green/5 border border-india-green/20 flex gap-3">
              <Sparkles className="w-5 h-5 text-india-green shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold text-india-green">AI Fair Price Suggestion</div>
                <div className="text-muted-foreground">
                  Based on local mandi rates and quantity, recommended price is{" "}
                  <span className="font-bold text-navy">
                    ₹{suggestion.recommended}/{form.unit}
                  </span>{" "}
                  (range ₹{suggestion.min}–₹{suggestion.max}).
                </div>
                <button
                  onClick={() => setForm({ ...form, price: String(suggestion.recommended) })}
                  className="mt-2 text-xs font-semibold text-saffron hover:underline"
                >
                  Use recommended price
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={addListing}
                disabled={loading}
                className="px-5 py-2.5 rounded-md bg-india-green text-india-green-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish Listing"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="px-5 py-2.5 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Listings table */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-navy mb-3">My Listings</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {all.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.image} alt={p.name} loading="lazy" className="w-10 h-10 rounded object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3">{p.quantity} {p.unit}</td>
                    <td className="px-4 py-3 font-semibold text-india-green inline-flex items-center">
                      <IndianRupee className="w-3.5 h-3.5" />{p.price}/{p.unit}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-india-green/10 text-india-green font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incoming Orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Package className="w-5 h-5 text-saffron" /> Incoming Orders
            </h2>
            <span className="text-xs text-muted-foreground">{orders.length} total</span>
          </div>
          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
              No orders yet. As consumers place orders for your produce, they will appear here.
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Buyer</th>
                    <th className="px-4 py-3 font-semibold">Items</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Payment</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-border align-top">
                      <td className="px-4 py-3">
                        <div className="font-mono font-semibold text-navy">{o.id}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {new Date(o.placedAt).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.buyerName}</div>
                        <div className="text-[11px] text-muted-foreground line-clamp-2 max-w-[180px]">
                          {o.deliveryAddress}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ul className="space-y-0.5">
                          {o.items.map((i) => (
                            <li key={i.product.id} className="text-xs">
                              {i.product.name} × <b>{i.qty}</b> {i.product.unit}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 font-semibold text-india-green">₹{o.total + 30}</td>
                      <td className="px-4 py-3">
                        {o.payment ? (
                          <span className="px-2 py-0.5 rounded bg-india-green/10 text-india-green text-[11px] font-semibold">
                            {o.payment.method} ✓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-saffron/10 text-saffron text-[11px] font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-[11px] rounded-full bg-navy/10 text-navy font-semibold">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Boost / Promote */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-1">
            <Rocket className="w-5 h-5 text-saffron" /> Increase Your Sales — Promotion Plans
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Get featured in the AI Marketplace's "Recommended Farmers" section and reach more buyers selling at fair prices.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <BoostCard
              plan="Starter"
              price={199}
              duration="7 days"
              perks={["Featured in AI recommendations", "Priority in nearby map", "1 region targeting"]}
              tone="border-border"
              onActivate={() => setPendingBoost({ plan: "Starter", price: 199, duration: "7 days" })}
            />
            <BoostCard
              plan="Growth"
              price={499}
              duration="30 days"
              perks={["Top of recommendation list", "Verified ★ Premium badge", "3 regions targeting", "WhatsApp lead alerts"]}
              tone="border-saffron ring-2 ring-saffron/30"
              recommended
              onActivate={() => setPendingBoost({ plan: "Growth", price: 499, duration: "30 days" })}
            />
            <BoostCard
              plan="Pro Kisan"
              price={1499}
              duration="90 days"
              perks={["Pinned across marketplace", "Homepage spotlight", "Pan-India targeting", "Personal account manager", "Premium analytics"]}
              tone="border-india-green"
              onActivate={() => setPendingBoost({ plan: "Pro Kisan", price: 1499, duration: "90 days" })}
            />
          </div>
          {promotedFarmers.length > 0 && (
            <div className="mt-4 bg-india-green/5 border border-india-green/30 rounded-md p-3 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-india-green mt-0.5" />
              <div>
                <div className="font-semibold text-india-green">Boost active!</div>
                <div className="text-xs text-muted-foreground">
                  Your profile is being shown in the AI Marketplace recommendations.
                  {myBoosts[0] && ` Plan: ${myBoosts[0].plan} · ₹${myBoosts[0].price}.`}
                </div>
              </div>
            </div>
          )}

          {pendingBoost && (
            <div className="mt-6 bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Payment required</div>
                  <div className="text-xl font-bold text-navy mt-2">Activate {pendingBoost.plan} Plan</div>
                  <div className="text-sm text-muted-foreground">₹{pendingBoost.price} · {pendingBoost.duration}</div>
                </div>
                <button
                  onClick={() => setPendingBoost(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(["UPI", "Card", "NetBanking", "Wallet"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setBoostPaymentMethod(method)}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      boostPaymentMethod === method
                        ? "border-saffron bg-saffron/10"
                        : "border-border bg-muted/50 hover:border-saffron"
                    }`}
                  >
                    <div className="text-sm font-semibold text-navy">{method}</div>
                    <div className="text-xs text-muted-foreground">Pay using {method}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-navy mb-2">Payment details</label>
                <input
                  value={boostPaymentDetails}
                  onChange={(e) => setBoostPaymentDetails(e.target.value)}
                  placeholder={
                    boostPaymentMethod === "UPI"
                      ? "Enter UPI ID"
                      : boostPaymentMethod === "Card"
                      ? "Enter last 4 digits"
                      : boostPaymentMethod === "NetBanking"
                      ? "Enter bank name"
                      : "Enter wallet name"
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:ring-2 focus:ring-saffron"
                />
              </div>

              <button
                onClick={async () => {
                  if (!pendingBoost) return;
                  if (!boostPaymentDetails.trim()) {
                    alert("Enter payment details to continue.");
                    return;
                  }
                  setBoostProcessing(true);
                  await new Promise((resolve) => setTimeout(resolve, 1200));
                  actions.promoteFarmer(user?.id ?? "me", pendingBoost.plan, pendingBoost.price);
                  setBoostProcessing(false);
                  setBoostSuccess(pendingBoost.plan);
                  setPendingBoost(null);
                  setBoostPaymentDetails("");
                }}
                disabled={boostProcessing}
                className="mt-5 w-full rounded-lg bg-india-green px-4 py-3 text-white font-semibold hover:bg-india-green/90 disabled:opacity-50"
              >
                {boostProcessing ? `Processing ${boostPaymentMethod} payment…` : `Pay ₹${pendingBoost.price} & Activate`}
              </button>
            </div>
          )}

          {boostSuccess && (
            <div className="mt-4 rounded-lg bg-india-green/10 border border-india-green/30 p-3 text-sm text-india-green">
              <div className="font-semibold">{boostSuccess} plan activated!</div>
              <div>Your farmer profile is now eligible for AI recommendation boosts.</div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-display font-bold text-navy mt-1">{value}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1.5">{label}</div>
      {children}
    </label>
  );
}
type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string;
  onChange: (v: string) => void;
};

function Input({ value, onChange, className, ...props }: InputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring bg-background ${className ?? ""}`}
      {...props}
    />
  );
}

function BoostCard({
  plan,
  price,
  duration,
  perks,
  tone,
  recommended,
  onActivate,
}: {
  plan: string;
  price: number;
  duration: string;
  perks: string[];
  tone: string;
  recommended?: boolean;
  onActivate: () => void;
}) {
  return (
    <div className={`relative bg-card border rounded-lg p-5 flex flex-col ${tone}`}>
      {recommended && (
        <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-saffron text-saffron-foreground text-[10px] font-bold uppercase tracking-wider">
          Most Popular
        </span>
      )}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-navy text-lg">{plan}</h3>
        <Star className="w-4 h-4 text-gold fill-gold" />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-display font-bold text-navy">₹{price}</span>
        <span className="text-xs text-muted-foreground">/ {duration}</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm flex-1">
        {perks.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-india-green shrink-0 mt-0.5" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onActivate}
        className="mt-5 w-full px-4 py-2.5 rounded-md bg-saffron text-saffron-foreground font-semibold hover:opacity-90"
      >
        Activate Plan →
      </button>
    </div>
  );
}
