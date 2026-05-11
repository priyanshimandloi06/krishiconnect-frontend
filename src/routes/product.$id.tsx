import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Chatbot } from "@/components/chatbot";
import { getProduct, products, type Product } from "@/lib/data";
import { actions } from "@/lib/store";
import { fetchProduct } from "@/lib/api";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { IndianRupee, MapPin, ShieldCheck, Star, Truck, Calendar } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return {
      meta: [
        { title: p ? `${p.name} — KrishiConnect` : "Product — KrishiConnect" },
        {
          name: "description",
          content: p
            ? `${p.name} from ${p.farmerName}, ${p.village}. ₹${p.price}/${p.unit}.`
            : "Product details",
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch((error) => {
        console.error("Failed to load product", error);
        const fallback = getProduct(id);
        setProduct(fallback ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const { lang } = useT();
  const p = product ?? getProduct(id) ?? products[0];
  const displayName = lang === "hi" ? p.nameHi : p.name;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/marketplace" className="hover:underline">Marketplace</Link>
          <span className="mx-1.5">/</span>
          <span>{p.category}</span>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{displayName}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <img
              src={p.image}
              alt={displayName}
              width={800}
              height={800}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" /> {p.village}, {p.district}, {p.state} · {p.distanceKm} km
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy mt-1">{displayName}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="inline-flex items-center gap-1 text-india-green font-medium">
                <ShieldCheck className="w-4 h-4" /> Verified Farmer
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="font-semibold">{p.rating}</span>
                <span className="text-muted-foreground">({p.reviews})</span>
              </span>
            </div>

            <div className="mt-6 p-5 rounded-lg bg-cream border border-border">
              <div className="flex items-end gap-3">
                <div className="flex items-center text-india-green font-bold text-4xl">
                  <IndianRupee className="w-7 h-7" />
                  {p.price}
                </div>
                <div className="text-muted-foreground">/ {p.unit}</div>
                <div className="ml-auto text-right text-xs">
                  <div className="text-muted-foreground">AI Fair Price</div>
                  <div className="font-semibold text-navy">₹{p.fairPrice}/{p.unit}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Harvested {p.harvestedDaysAgo === 0 ? "today" : `${p.harvestedDaysAgo}d ago`}</span>
                <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Delivery in 24–48h</span>
                <span>· {p.quantity} {p.unit} available</span>
              </div>
            </div>

            <p className="mt-5 text-foreground/80 leading-relaxed">{p.description}</p>

            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <div className="inline-flex items-center border border-input rounded-md">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-accent"
                >−</button>
                <span className="px-4 font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(p.quantity, q + 1))}
                  className="px-3 py-2 hover:bg-accent"
                >+</button>
              </div>
              <button
                onClick={() => actions.addToCart(p, qty)}
                className="px-5 py-2.5 rounded-md bg-card border border-navy text-navy font-semibold hover:bg-navy hover:text-navy-foreground transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  actions.addToCart(p, qty);
                  navigate({ to: "/cart" });
                }}
                className="px-5 py-2.5 rounded-md bg-saffron text-saffron-foreground font-semibold"
              >
                Buy Now →
              </button>
            </div>

            <div className="mt-6 p-4 border border-border rounded-lg flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-india-green/10 grid place-items-center text-india-green font-bold">
                {p.farmerName[0]}
              </div>
              <div>
                <div className="font-semibold text-navy">{p.farmerName}</div>
                <div className="text-xs text-muted-foreground">
                  {p.village}, {p.state} · Verified by PM-Kisan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-navy mb-4">Ratings &amp; Reviews</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Anjali S.", text: "Tomatoes were super fresh, came within a day. Tasted just like home garden!", r: 5 },
              { name: "Vikram M.", text: "Fair price compared to local market. Trustworthy platform.", r: 4 },
              { name: "Pooja R.", text: "Loved meeting the farmer through the app — direct and honest.", r: 5 },
            ].map((r) => (
              <div key={r.name} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.name}</div>
                  <div className="flex">
                    {Array.from({ length: r.r }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <Chatbot />
    </div>
  );
}
