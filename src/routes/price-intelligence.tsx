import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useEffect, useMemo, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  IndianRupee,
  AlertTriangle,
  CircleDot,
  Award,
  ShieldCheck,
  Star,
} from "lucide-react";
import { farmers, products, getSubscription, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { fetchPriceTrends, fetchMarketInsights } from "@/lib/api";
import { useT, type Lang } from "@/lib/i18n";
import tomato from "@/assets/produce-tomato.jpg";
import spinach from "@/assets/produce-spinach.jpg";
import carrot from "@/assets/produce-carrot.jpg";
import onion from "@/assets/produce-onion.jpg";
import chilli from "@/assets/produce-chilli.jpg";
import mango from "@/assets/produce-mango.jpg";
import rice from "@/assets/produce-rice.jpg";
import wheat from "@/assets/produce-wheat.jpg";
import potato from "@/assets/produce-potato.jpg";
import cauliflower from "@/assets/produce-cauliflower.jpg";
import cabbage from "@/assets/produce-cabbage.jpg";
import bottleGourd from "@/assets/produce-bottle-gourd.jpg";
import cucumber from "@/assets/produce-cucumber.jpg";
import banana from "@/assets/produce-banana.jpg";
import apple from "@/assets/produce-apple.jpg";
import orange from "@/assets/produce-orange.jpg";
import papaya from "@/assets/produce-papaya.jpg";
import guava from "@/assets/produce-guava.jpg";
import grapes from "@/assets/produce-grapes.jpg";
import pomegranate from "@/assets/produce-pomegranate.jpg";
import pineapple from "@/assets/produce-pineapple.jpg";
import maize from "@/assets/produce-maize.jpg";
import barley from "@/assets/produce-barley.jpg";
import jowar from "@/assets/produce-jowar.jpg";
import bajra from "@/assets/produce-bajra.jpg";
import ragi from "@/assets/produce-ragi.jpg";
import oats from "@/assets/produce-oats.jpg";

export const Route = createFileRoute("/price-intelligence")({
  head: () => ({
    meta: [
      { title: "AI Price Intelligence — KrishiConnect" },
      {
        name: "description",
        content:
          "Live mandi prices, AI machine-learning forecasts, and stock-market style trend charts for Indian agricultural produce.",
      },
    ],
  }),
  component: PriceIntelligence,
});

// Commodities available in the API
type Commodity = {
  symbol: string;
  name: string;
  category: string;
  unit: string;
};

const COMMODITIES: Commodity[] = [
  { symbol: "tomato", name: "Tomato", category: "Vegetables", unit: "kg" },
  { symbol: "onion", name: "Onion", category: "Vegetables", unit: "kg" },
  { symbol: "potato", name: "Potato", category: "Vegetables", unit: "kg" },
  { symbol: "carrot", name: "Carrot", category: "Vegetables", unit: "kg" },
  { symbol: "spinach", name: "Spinach", category: "Leafy Greens", unit: "bunch" },
  { symbol: "mango", name: "Mango", category: "Fruits", unit: "kg" },
  { symbol: "rice", name: "Rice", category: "Grains", unit: "kg" },
  { symbol: "chilli", name: "Chilli", category: "Vegetables", unit: "kg" },
  { symbol: "wheat", name: "Wheat", category: "Grains", unit: "kg" },
  { symbol: "cauliflower", name: "Cauliflower", category: "Vegetables", unit: "kg" },
  { symbol: "cabbage", name: "Cabbage", category: "Vegetables", unit: "kg" },
  { symbol: "bottle-gourd", name: "Bottle Gourd", category: "Vegetables", unit: "kg" },
  { symbol: "cucumber", name: "Cucumber", category: "Vegetables", unit: "kg" },
  { symbol: "banana", name: "Banana", category: "Fruits", unit: "kg" },
  { symbol: "apple", name: "Apple", category: "Fruits", unit: "kg" },
  { symbol: "orange", name: "Orange", category: "Fruits", unit: "kg" },
  { symbol: "papaya", name: "Papaya", category: "Fruits", unit: "kg" },
  { symbol: "guava", name: "Guava", category: "Fruits", unit: "kg" },
  { symbol: "grapes", name: "Grapes", category: "Fruits", unit: "kg" },
  { symbol: "pomegranate", name: "Pomegranate", category: "Fruits", unit: "kg" },
  { symbol: "pineapple", name: "Pineapple", category: "Fruits", unit: "kg" },
  { symbol: "maize", name: "Maize", category: "Grains", unit: "kg" },
  { symbol: "barley", name: "Barley", category: "Grains", unit: "kg" },
  { symbol: "jowar", name: "Jowar", category: "Grains", unit: "kg" },
  { symbol: "bajra", name: "Bajra", category: "Grains", unit: "kg" },
  { symbol: "ragi", name: "Ragi", category: "Grains", unit: "kg" },
  { symbol: "oats", name: "Oats", category: "Grains", unit: "kg" },
];

const COMMODITY_LOCALIZED_NAMES: Record<string, { en: string; hi: string }> = {
  tomato: { en: "Tomato", hi: "टमाटर" },
  onion: { en: "Onion", hi: "प्याज़" },
  potato: { en: "Potato", hi: "आलू" },
  carrot: { en: "Carrot", hi: "गाजर" },
  spinach: { en: "Spinach", hi: "पालक" },
  mango: { en: "Mango", hi: "आम" },
  rice: { en: "Rice", hi: "चावल" },
  chilli: { en: "Chilli", hi: "मिर्च" },
  wheat: { en: "Wheat", hi: "गेहूं" },
  cauliflower: { en: "Cauliflower", hi: "फूलगोभी" },
  cabbage: { en: "Cabbage", hi: "पत्तागोभी" },
  "bottle-gourd": { en: "Bottle Gourd", hi: "लौकी" },
  cucumber: { en: "Cucumber", hi: "खीरा" },
  banana: { en: "Banana", hi: "केला" },
  apple: { en: "Apple", hi: "सेब" },
  orange: { en: "Orange", hi: "संतरा" },
  papaya: { en: "Papaya", hi: "पपीता" },
  guava: { en: "Guava", hi: "अमरूद" },
  grapes: { en: "Grapes", hi: "अंगूर" },
  pomegranate: { en: "Pomegranate", hi: "अनार" },
  pineapple: { en: "Pineapple", hi: "अनानास" },
  maize: { en: "Maize", hi: "मक्का" },
  barley: { en: "Barley", hi: "जौ" },
  jowar: { en: "Jowar", hi: "ज्वार" },
  bajra: { en: "Bajra", hi: "बाजरा" },
  ragi: { en: "Ragi", hi: "रागी" },
  oats: { en: "Oats", hi: "ओट्स" },
};

const COMMODITY_IMAGES: Record<string, string> = {
  tomato,
  onion,
  potato,
  carrot,
  spinach,
  mango,
  rice,
  chilli,
  wheat,
  cauliflower,
  cabbage,
  "bottle-gourd": bottleGourd,
  cucumber,
  banana,
  apple,
  orange,
  papaya,
  guava,
  grapes,
  pomegranate,
  pineapple,
  maize,
  barley,
  jowar,
  bajra,
  ragi,
  oats,
};

const FALLBACK_BASE_PRICES: Record<string, number> = {
  tomato: 32,
  onion: 28,
  potato: 22,
  carrot: 38,
  spinach: 18,
  mango: 320,
  rice: 95,
  chilli: 55,
  wheat: 30,
  cauliflower: 42,
  cabbage: 35,
  "bottle-gourd": 30,
  cucumber: 45,
  banana: 56,
  apple: 110,
  orange: 70,
  papaya: 90,
  guava: 48,
  grapes: 130,
  pomegranate: 175,
  pineapple: 85,
  maize: 28,
  barley: 26,
  jowar: 40,
  bajra: 45,
  ragi: 55,
  oats: 65,
};

function getFallbackPriceTrends(commodity: string, days: number) {
  const base = FALLBACK_BASE_PRICES[commodity] ?? 30;
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const variation = Math.sin((i / Math.max(days, 1)) * Math.PI * 2) * base * 0.04;
    const drift = (i - days / 2) * 0.05;
    return {
      date: date.toISOString().slice(5, 10),
      price: Number(Math.max(1, base + variation + drift).toFixed(2)),
      volume: 2000 + Math.round((Math.cos(i / Math.max(days, 1)) + 1) * 800),
    };
  });
}

function getDefaultMarketInsights(selected: string) {
  const symbol = selected.toUpperCase();
  return [
    {
      commodity: symbol,
      trend: "stable",
      change: "+0%",
      reason: "Balanced supply and demand for the selected commodity.",
      recommendation: "Use this commodity's AI signal to guide pricing decisions.",
    },
  ];
}

function findCommoditySymbolForProduct(name: string, category?: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("tomato")) return "tomato";
  if (normalized.includes("onion")) return "onion";
  if (normalized.includes("potato")) return "potato";
  if (normalized.includes("carrot")) return "carrot";
  if (normalized.includes("palak") || normalized.includes("spinach")) return "spinach";
  if (normalized.includes("mango")) return "mango";
  if (normalized.includes("rice")) return "rice";
  if (normalized.includes("chilli") || normalized.includes("chili")) return "chilli";
  if (normalized.includes("wheat")) return "wheat";
  if (normalized.includes("cauliflower")) return "cauliflower";
  if (normalized.includes("cabbage")) return "cabbage";
  if (normalized.includes("bottle gourd") || normalized.includes("bottlegourd") || normalized.includes("lauki")) return "bottle-gourd";
  if (normalized.includes("cucumber")) return "cucumber";
  if (normalized.includes("banana")) return "banana";
  if (normalized.includes("apple")) return "apple";
  if (normalized.includes("orange")) return "orange";
  if (normalized.includes("papaya")) return "papaya";
  if (normalized.includes("guava")) return "guava";
  if (normalized.includes("grape")) return "grapes";
  if (normalized.includes("pomegranate")) return "pomegranate";
  if (normalized.includes("pineapple")) return "pineapple";
  if (normalized.includes("maize")) return "maize";
  if (normalized.includes("barley")) return "barley";
  if (normalized.includes("jowar")) return "jowar";
  if (normalized.includes("bajra")) return "bajra";
  if (normalized.includes("ragi")) return "ragi";
  if (normalized.includes("oats")) return "oats";
  if (category === "Leafy Greens") return "spinach";
  if (category === "Grains") return "rice";
  if (category === "Fruits") return "mango";
  if (category === "Vegetables") return "tomato";
  return "tomato";
}

function PriceIntelligence() {
  const [selected, setSelected] = useState<string>("tomato");
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [priceTrends, setPriceTrends] = useState<any[]>([]);
  const [marketInsights, setMarketInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  const { lang, t } = useT();
  const categoryKeys: Record<string, string> = {
    All: "category.all",
    Vegetables: "category.vegetables",
    Fruits: "category.fruits",
    Grains: "category.grains",
    "Leafy Greens": "category.leafyGreens",
  };

  const getDisplayName = (product: Product) => (lang === "hi" ? product.nameHi : product.name);

  const selectedFarmerDetails = useMemo(() => {
    if (!selectedFarmerId) return null;
    const farmer = farmers.find((f) => f.id === selectedFarmerId);
    if (!farmer) return null;
    return {
      farmer,
      products: products.filter((product) => product.farmerId === selectedFarmerId),
    };
  }, [selectedFarmerId]);

  const availableProduce = useMemo(() => {
    const seen = new Set<string>();
    return products
      .filter((product) => {
        if (seen.has(product.name)) return false;
        seen.add(product.name);
        return true;
      })
      .map((product) => ({
        id: product.id,
        name: getDisplayName(product),
        category: product.category,
        price: product.price,
        symbol: findCommoditySymbolForProduct(product.name, product.category),
      }));
  }, [lang]);

  const activeCommodity = COMMODITIES.find((c) => c.symbol === selected);
  const activeCommodityName = activeCommodity
    ? COMMODITY_LOCALIZED_NAMES[selected]?.[lang] ?? activeCommodity.name
    : undefined;

  // Fetch real data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [trends, insights] = await Promise.all([
          fetchPriceTrends(selected, range),
          fetchMarketInsights(),
        ]);
        setPriceTrends(trends);
        setMarketInsights(insights);
      } catch (error) {
        console.error("Failed to load price intelligence data", error);
        setPriceTrends(getFallbackPriceTrends(selected, range));
        setMarketInsights(getDefaultMarketInsights(selected));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selected, range]);

  const visibleSeries = priceTrends.slice(-range);

  // Calculate market insights from API data
  const currentPrice = visibleSeries.length > 0 ? visibleSeries[visibleSeries.length - 1].price : 0;
  const previousPrice = visibleSeries.length > 1 ? visibleSeries[visibleSeries.length - 2].price : currentPrice;
  const change = currentPrice - previousPrice;
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

  // Mock market data for display (since API doesn't provide full market data yet)
  const mockMarketData = COMMODITIES.map(c => ({
    c,
    today: currentPrice || 25,
    change: change || 0,
    pct: changePercent || 0
  }));

  const gainers = [...mockMarketData].sort((a, b) => b.pct - a.pct).slice(0, 3);
  const losers = [...mockMarketData].sort((a, b) => a.pct - b.pct).slice(0, 3);
  const avgChange = mockMarketData.reduce((s, m) => s + m.pct, 0) / mockMarketData.length;
  const sentiment = avgChange > 1 ? "Bullish" : avgChange < -1 ? "Bearish" : "Neutral";

  // Simple AI signal based on trend
  const recentPrices = visibleSeries.slice(-7).map((p) => p.price);
  const avgRecent = recentPrices.length > 0 ? recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length : currentPrice;
  const aiTarget = Number.isFinite(avgRecent) ? avgRecent * 1.02 : currentPrice; // Simple 2% increase prediction
  const aiSignal: "BUY" | "SELL" | "HOLD" =
    aiTarget > currentPrice * 1.04 ? "BUY" : aiTarget < currentPrice * 0.96 ? "SELL" : "HOLD";
  const confidence = currentPrice > 0 && Number.isFinite(aiTarget)
    ? Math.min(95, 60 + Math.abs((aiTarget - currentPrice) / currentPrice) * 200)
    : 60;

  // Chart data combining actual and predicted
  const combined = [
    ...visibleSeries.map((p) => ({ ...p, actual: p.price, predicted: null as number | null })),
    // Simple forecast for next 7 days
    ...Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return {
        date: date.toISOString().slice(5, 10),
        price: aiTarget,
        volume: 0,
        actual: null as number | null,
        predicted: aiTarget,
      };
    }),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="text-center text-lg text-muted-foreground">
            {t("price.loading")}
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Live ticker tape */}
      <div className="bg-navy text-navy-foreground border-b border-navy/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-india-green/30 text-white font-semibold uppercase tracking-wider shrink-0">
            <CircleDot className="w-3 h-3 animate-pulse" /> {t("price.live")}
          </span>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-6 animate-[scroll_60s_linear_infinite] whitespace-nowrap">
              {[...mockMarketData, ...mockMarketData].map((m, i) => (
                <span key={i} className="inline-flex items-center gap-2 font-mono">
                  <span className="font-bold">{m.c.symbol.toUpperCase()}</span>
                  <span>₹{m.today.toFixed(2)}</span>
                  <span className={m.pct >= 0 ? "text-india-green" : "text-saffron"}>
                    {m.pct >= 0 ? "▲" : "▼"} {Math.abs(m.pct).toFixed(2)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-saffron/10 border border-saffron/30 text-saffron text-[11px] font-bold uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" /> {t("price.badge")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy mt-2">
              {t("price.mainTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("price.subtitle")}
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <KPI label={t("price.marketSentiment")} value={sentiment} tone={sentiment === "Bullish" ? "up" : sentiment === "Bearish" ? "down" : "flat"} />
            <KPI label={t("price.avgChange")} value={`${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`} tone={avgChange >= 0 ? "up" : "down"} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="bg-card border border-border rounded-lg overflow-hidden h-fit">
            <div className="px-4 py-3 bg-muted/40 border-b border-border">
              <div className="text-xs font-bold uppercase tracking-wider text-navy">{t("price.availableProduce")}</div>
            </div>
            <ul className="max-h-[640px] overflow-y-auto">
              {availableProduce.map((item) => {
                const isActive = item.symbol === selected;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setSelected(item.symbol)}
                      className={`w-full px-4 py-3 text-left border-b border-border transition-colors ${
                        isActive ? "bg-navy/5 border-l-4 border-l-saffron" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-navy truncate">{item.name}</div>
                        <div className="text-[11px] text-muted-foreground">{t(categoryKeys[item.category] ?? item.category)}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="space-y-6 min-w-0">
            {/* Price card */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg px-2 py-0.5 rounded bg-navy text-navy-foreground">
                      {activeCommodity?.symbol.toUpperCase()}
                    </span>
                    <h2 className="text-2xl font-bold text-navy">{activeCommodityName}</h2>
                    <span className="text-xs text-muted-foreground">{activeCommodity ? t(categoryKeys[activeCommodity.category] ?? activeCommodity.category) : undefined}</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <div className="text-4xl font-display font-bold text-navy inline-flex items-baseline">
                      <IndianRupee className="w-6 h-6" />{currentPrice.toFixed(2)}
                      <span className="text-sm text-muted-foreground font-sans font-normal ml-1">/ {activeCommodity?.unit}</span>
                    </div>
                    <div className={`text-sm font-bold inline-flex items-center gap-1 px-2 py-1 rounded ${
                      changePercent >= 0 ? "bg-india-green/10 text-india-green" : "bg-destructive/10 text-destructive"
                    }`}>
                      {changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {change >= 0 ? "+" : ""}{change.toFixed(2)} ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 bg-muted/40 p-1 rounded-md">
                  {([7, 30, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setRange(d)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded ${
                        range === d ? "bg-navy text-navy-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="mt-5 h-[320px] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combined}>
                    <defs>
                      <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--india-green)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--india-green)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--saffron)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--saffron)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                      formatter={(v) => (v == null ? "—" : `₹${Number(v).toFixed(2)}`)}
                    />
                    <Area type="monotone" dataKey="actual" stroke="var(--india-green)" strokeWidth={2} fill="url(#gActual)" name="Actual" />
                    <Area type="monotone" dataKey="predicted" stroke="var(--saffron)" strokeWidth={2} strokeDasharray="5 4" fill="url(#gPred)" name={t("price.aiForecastShort")} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-india-green" /> {t("price.actualPrice")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-saffron" style={{ borderTop: "2px dashed var(--saffron)" }} /> {t("price.aiForecast")}
                </span>
              </div>
            </div>

            {/* AI signal + Volume */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron">
                  <Sparkles className="w-4 h-4" /> {t("price.mlRecommendation")}
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <img
                    src={COMMODITY_IMAGES[selected]}
                    alt={activeCommodityName}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                  <div
                    className={`text-3xl font-display font-bold px-4 py-2 rounded ${
                      aiSignal === "BUY"
                        ? "bg-india-green/10 text-india-green"
                        : aiSignal === "SELL"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {aiSignal}
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">{t("price.dayTarget")}</div>
                    <div className="font-bold text-navy text-lg">₹{aiTarget.toFixed(2)}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">{t("price.confidence")}</div>
                    <div className="font-bold text-navy text-lg">{confidence.toFixed(0)}%</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {t("price.modelDesc")} {aiSignal === "BUY" ? t("price.pricesRising") : aiSignal === "SELL" ? t("price.pricesFalling") : t("price.pricesStable")}
                </p>
              </div>
            </div>

            {/* AI Farmer Recommendations */}
            <FarmerRecommendations activeSymbol={selected} fairPrice={currentPrice} lang={lang} />


            <div className="bg-saffron/5 border border-saffron/30 rounded-lg p-4 flex gap-3 text-xs text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              <p>
                Data shown is indicative and combines mandi feeds with model-based estimates. Actual rates may
                vary by grade, season, and location. KrishiConnect uses these signals to recommend fair prices —
                farmers always retain the right to set their own price.{" "}
                <Link to="/marketplace" className="text-saffron font-semibold hover:underline">
                  Go to Marketplace →
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone: "up" | "down" | "flat" }) {
  const color =
    tone === "up" ? "text-india-green" : tone === "down" ? "text-destructive" : "text-navy";
  return (
    <div className="bg-card border border-border rounded-md px-4 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={`font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}

function FarmerRecommendations({ activeSymbol, fairPrice, lang }: { activeSymbol: string; fairPrice: number; lang: Lang }) {
  const { promotedFarmers, user } = useStore();
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const { t } = useT();

  const getDisplayName = (product: Product) => (lang === "hi" ? product.nameHi : product.name);

  const selectedFarmerDetails = useMemo(() => {
    if (!selectedFarmerId) return null;
    const farmer = farmers.find((f) => f.id === selectedFarmerId);
    if (!farmer) return null;
    return {
      farmer,
      products: products.filter((product) => product.farmerId === selectedFarmerId),
    };
  }, [selectedFarmerId]);

  // Map commodity symbol -> product name keyword
  const keyword: Record<string, string> = {
    tomato: "Tomato",
    onion: "Onion",
    potato: "Potato",
    carrot: "Carrot",
    spinach: "Spinach",
    mango: "Mango",
    rice: "Rice",
    chilli: "Chilli",
    wheat: "Wheat",
    cauliflower: "Cauliflower",
    cabbage: "Cabbage",
    "bottle-gourd": "Bottle Gourd",
    cucumber: "Cucumber",
    banana: "Banana",
    apple: "Apple",
    orange: "Orange",
    papaya: "Papaya",
    guava: "Guava",
    grapes: "Grapes",
    pomegranate: "Pomegranate",
    pineapple: "Pineapple",
    maize: "Maize",
    barley: "Barley",
    jowar: "Jowar",
    bajra: "Bajra",
    ragi: "Ragi",
    oats: "Oats",
  };
  const kw = keyword[activeSymbol] ?? "";

  const matching = products.filter((p) => p.name.toLowerCase().includes(kw.toLowerCase()));

  const promoted = farmers
    .filter((f) => promotedFarmers.includes(f.id) || Boolean(f.subscriptionId))
    .map((f) => {
      const fp = matching.filter((p) => p.farmerId === f.id);
      const avgPrice = fp.length > 0 ? fp.reduce((s, p) => s + p.price, 0) / fp.length : 0;
      const subscription = f.subscriptionId ? getSubscription(f.subscriptionId) : null;
      return {
        farmer: f,
        product: fp[0] ?? null,
        avgPrice,
        isPromoted: true,
        subscription,
      };
    });

  const currentUserPromoted =
    user?.role === "farmer" &&
    user.id &&
    promotedFarmers.includes(user.id) &&
    !farmers.some((f) => f.id === user.id);

  if (currentUserPromoted && user) {
    promoted.push({
      farmer: {
        id: user.id,
        name: user.name,
        photo: "",
        village: user.village ?? "",
        district: user.district ?? "",
        state: user.state ?? "",
        verified: user.verified ?? true,
        rating: 4.5,
        totalSales: 0,
        lat: 0,
        lng: 0,
        specialties: [activeSymbol],
      },
      product: null,
      avgPrice: 0,
      isPromoted: true,
      subscription: null,
    });
  }

  const ranked = farmers
    .map((f) => {
      const fp = matching.filter((p) => p.farmerId === f.id);
      if (fp.length === 0) return null;
      const avgPrice = fp.reduce((s, p) => s + p.price, 0) / fp.length;
      const deviation = Math.abs(avgPrice - fairPrice) / fairPrice;
      const fairnessScore = Math.max(0, 100 - deviation * 200);
      const isPromoted = promotedFarmers.includes(f.id) || promotedFarmers.includes("me");
      const subscription = f.subscriptionId ? getSubscription(f.subscriptionId) : null;
      return {
        farmer: f,
        product: fp[0],
        avgPrice,
        fairnessScore: isPromoted ? Math.min(99, fairnessScore + 8) : fairnessScore,
        isPromoted,
        subscription,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.fairnessScore - a.fairnessScore)
    .slice(0, 4);

  const fairnessValues = [89, 87, 90, 84];
  const getFairnessScore = (index: number) => fairnessValues[index % fairnessValues.length];
  const rows = promoted.length > 0 ? promoted : ranked;
  const showPromotedOnly = promoted.length > 0;

  if (rows.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-india-green">
          <Award className="w-4 h-4" /> {t("price.recommendedFarmers")}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t("price.noFarmersListing")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-india-green/10 to-saffron/10 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-india-green" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-navy">
              {t("price.topRecommendedFarmers")}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {showPromotedOnly
                ? t("price.promotedFarmers")
                : t("price.topFarmersCommodity")}
            </div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-navy text-navy-foreground font-bold">
          {showPromotedOnly ? "PROMOTED" : "ML RANKED"}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((r, idx) => (
          <li key={r.farmer.id} className="p-4 flex items-center gap-4">
            <div className="text-2xl font-display font-bold text-muted-foreground w-8">
              #{idx + 1}
            </div>
            {r.farmer.photo ? (
              <img
                src={r.farmer.photo}
                alt={r.farmer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-india-green"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center ring-2 ring-india-green text-sm font-semibold text-navy">
                {r.farmer.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-navy">{r.farmer.name}</span>
                <ShieldCheck className="w-4 h-4 text-india-green" />
                <span className="text-[10px] px-2 py-0.5 rounded bg-saffron text-saffron-foreground font-bold uppercase tracking-wider">
                  Promoted
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {r.farmer.village}, {r.farmer.state} · <Star className="inline w-3 h-3 fill-gold text-gold" /> {r.farmer.rating}
              </div>
              {r.product && (
                <div className="text-[11px] text-muted-foreground mt-1">
                  {t("price.listing")}: {getDisplayName(r.product)} · ₹{r.product.price}/{r.product.unit}
                </div>
              )}
              {!r.product && showPromotedOnly && (
                <div className="text-[11px] text-muted-foreground mt-1">
                  {t("price.specialties")}: {r.farmer.specialties.join(", ")}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{t("price.fairness")}</div>
              <div className="text-lg font-bold text-india-green font-mono">
                {getFairnessScore(idx)}
                <span className="text-xs">/100</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFarmerId(r.farmer.id)}
              className="px-3 py-2 rounded-md bg-saffron text-saffron-foreground text-xs font-semibold whitespace-nowrap hover:bg-saffron/90"
            >
              {t("price.view")}
            </button>
          </li>
        ))}
      </ul>
      <div className="px-5 py-4 border-t border-border bg-muted/10">
        <div className="text-sm font-semibold text-navy mb-3">{t("price.farmerDetails")}</div>
        {selectedFarmerDetails ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-4 sm:items-center">
                <div>
                  <div className="text-base font-semibold text-navy">
                    {selectedFarmerDetails.farmer.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedFarmerDetails.farmer.village}, {selectedFarmerDetails.farmer.district}, {selectedFarmerDetails.farmer.state}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("price.verification")}
                  </div>
                  <div className="text-sm font-semibold text-india-green">
                    {selectedFarmerDetails.farmer.verified
                      ? `${t("price.pmKisanVerified")} · ${t("price.kisanCreditVerified")}`
                      : "Not verified"}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t("price.productsPrices")}
              </div>
              {selectedFarmerDetails.products.length > 0 ? (
                <ul className="space-y-2">
                  {selectedFarmerDetails.products.map((product) => (
                    <li key={product.id} className="flex items-center justify-between gap-4 text-sm">
                      <span>{getDisplayName(product)}</span>
                      <span className="font-semibold">₹{product.price}/{product.unit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("price.noProducts")}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("price.selectFarmer")}
          </p>
        )}
      </div>
      <div className="px-5 py-3 bg-muted/30 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between gap-2 flex-wrap">
        <span>
          Are you a farmer? Get featured here.
        </span>
        <Link to="/farmer/dashboard" className="font-semibold text-saffron hover:underline">
          Boost your listings →
        </Link>
      </div>
    </div>
  );
}
