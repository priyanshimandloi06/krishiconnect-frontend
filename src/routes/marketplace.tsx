import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Chatbot } from "@/components/chatbot";
import { categories, products as sampleProducts, type Product } from "@/lib/data";
import { actions, useHydrated, useStore } from "@/lib/store";
import { fetchProducts } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { IndianRupee, MapPin, Search, Star, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — KrishiConnect" },
      {
        name: "description",
        content: "Browse fresh produce from verified Indian farmers at fair prices.",
      },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const { lang, t } = useT();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const categoryKeys: Record<string, string> = {
    All: "category.all",
    Vegetables: "category.vegetables",
    Fruits: "category.fruits",
    Grains: "category.grains",
    "Leafy Greens": "category.leafyGreens",
  };
  const [sort, setSort] = useState<"distance" | "price" | "rating">("distance");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { myListings } = useStore();
  const hydrated = useHydrated();

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((error) => {
        console.error("Failed to load products", error);
        setError(t("market.apiError"));
        setProducts(sampleProducts);
      })
      .finally(() => setLoading(false));
  }, []);

const all = useMemo(() => {
  const farmerListings = hydrated ? myListings : [];

  const mergedProducts = [
    ...farmerListings,
    ...products.filter(
      (product) =>
        !farmerListings.some((listing) => {
          const farmerName = listing.name.toLowerCase().trim();
          const productName = product.name.toLowerCase().trim();

          return (
            farmerName.includes(productName) ||
            productName.includes(farmerName)
          );
        })
    ),
  ];

  return mergedProducts;
}, [hydrated, myListings, products]);

  const list = useMemo(() => {
    let l = all;
    if (cat !== "All") l = l.filter((p) => p.category === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.nameHi.toLowerCase().includes(s) ||
          p.farmerName.toLowerCase().includes(s),
      );
    }
    l = [...l].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      return a.distanceKm - b.distanceKm;
    });
    return l;
  }, [all, cat, q, sort]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Page header */}
      <div className="bg-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-xs font-semibold text-saffron uppercase tracking-wider">
            {t("market.badge")}
          </div>
          <h1 className="text-3xl font-bold text-navy mt-1">{t("market.mainTitle")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("market.subtitle")}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  cat === c
                    ? "bg-navy text-navy-foreground border-navy"
                    : "bg-card border-border hover:bg-accent"
                }`}
              >
                {t(categoryKeys[c] ?? c)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("market.searchPlaceholder")}
                className="pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-card outline-none focus:ring-2 focus:ring-ring w-64 max-w-full"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-3 py-2 text-sm border border-input rounded-md bg-card"
            >
              <option value="distance">{t("market.sortNearest")}</option>
              <option value="price">{t("market.sortPrice")}</option>
              <option value="rating">{t("market.sortRating")}</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((p) => (
            <div
              key={p.id}
              className="bg-card rounded-lg border border-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              <Link to="/product/$id" params={{ id: p.id }} className="block aspect-square overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={lang === "hi" ? p.nameHi : p.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {p.village}, {p.state} · {p.distanceKm} km
                </div>
                <Link
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="font-semibold mt-1 text-navy hover:underline"
                >
                  {lang === "hi" ? p.nameHi : p.name}
                </Link>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <ShieldCheck className="w-3 h-3 text-india-green" />
                  <span className="text-muted-foreground">{p.farmerName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <Star className="w-3 h-3 fill-gold text-gold" />
                  <span className="font-medium">{p.rating}</span>
                  <span className="text-muted-foreground">({p.reviews} {t("market.reviews")})</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="flex items-center text-india-green font-bold text-xl">
                      <IndianRupee className="w-4 h-4" />
                      {p.price}
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        /{p.unit}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {t("market.aiFairPrice")} ₹{p.fairPrice}/{p.unit}
                    </div>
                  </div>
                  <button
                    onClick={() => actions.addToCart(p)}
                    className="px-3 py-2 rounded-md bg-saffron text-saffron-foreground text-sm font-semibold hover:opacity-90"
                  >
                    {t("market.add")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">{t("market.noMatches")}</div>
        )}
      </main>
      <SiteFooter />
      <Chatbot />
    </div>
  );
}
