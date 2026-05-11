import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Chatbot } from "@/components/chatbot";
import { ShieldCheck, IndianRupee, Truck, Phone, Sparkles, MapPin, Star } from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";
import { products } from "@/lib/data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KrishiConnect — Fair Farmer-to-Consumer Marketplace" },
      {
        name: "description",
        content:
          "KrishiConnect connects verified Indian farmers directly with consumers, retailers, and vendors at fair AI-recommended prices. Fresh produce, transparent delivery.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { lang, t } = useT();
  const featured = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-india-green/10 border border-india-green/30 text-india-green text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
              {t("home.badge")}
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
              {t("home.title.l1")}<br />
              {t("home.title.l2")}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
              {t("home.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/role"
                className="px-6 py-3 rounded-md bg-saffron text-saffron-foreground font-semibold hover:opacity-90 shadow-sm"
              >
                {t("home.cta.register")}
              </Link>
              <Link
                to="/marketplace"
                className="px-6 py-3 rounded-md bg-card border border-border font-semibold hover:bg-accent"
              >
                {t("home.cta.browse")}
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-india-green" />
                <span className="font-medium">{t("home.tollfree")}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-navy" />
                <span>{t("home.verified")}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-india-green/20 to-saffron/20 blur-3xl rounded-full" />
            <div className="relative rounded-lg overflow-hidden border-4 border-card shadow-2xl">
              <img
                src={heroImg}
                alt="Indian farmer in a field at sunrise"
                width={1600}
                height={1024}
                className="w-full h-[420px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-lg p-4 shadow-xl hidden sm:block">
              <div className="text-xs text-muted-foreground">{t("home.avgPrice")}</div>
              <div className="text-2xl font-display font-bold text-india-green">+18%</div>
              <div className="text-xs text-muted-foreground">{t("home.overMandi")}</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg p-3 shadow-xl hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-india-green" />
              <div className="text-sm">
                <div className="font-semibold">{t("home.farmersCount")}</div>
                <div className="text-xs text-muted-foreground">{t("home.statesCount")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-6 items-center bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron">
              {t("home.welcomeBack")}
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-navy">
              {t("home.loginTitle")}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl leading-relaxed">
              {t("home.loginSubtitle")}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-saffron-foreground hover:opacity-90"
              >
                {t("home.loginButton")}
              </Link>
              <Link
                to="/role"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold text-navy hover:bg-muted"
              >
                {t("home.registerButton")}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-india-green/10 via-saffron/10 to-card p-6">
            <div className="rounded-3xl border border-border bg-background p-6">
              <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {t("home.otpTitle")}
              </div>
              <div className="mt-4 text-4xl font-bold text-navy">
                {t("home.otpSubtitle")}
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {t("home.otpDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-navy text-navy-foreground">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "8,412+", l: t("stats.farmers") },
            { v: "₹14.2 Cr", l: t("stats.payouts") },
            { v: "48 hrs", l: t("stats.delivery") },
            { v: "24×7", l: t("stats.ivr") },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl md:text-4xl font-display font-bold text-gold">{s.v}</div>
              <div className="text-sm opacity-80 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-semibold text-saffron uppercase tracking-wider">{t("how.kicker")}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">
            {t("how.title")}
          </h2>
          <p className="text-muted-foreground mt-3">
            {t("how.subtitle")}
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: ShieldCheck, title: t("how.f1.t"), text: t("how.f1.d") },
            { icon: Sparkles, title: t("how.f2.t"), text: t("how.f2.d") },
            { icon: Truck, title: t("how.f3.t"), text: t("how.f3.d") },
            { icon: Phone, title: t("how.f4.t"), text: t("how.f4.d") },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-md bg-navy text-navy-foreground grid place-items-center">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="mt-4 font-semibold text-lg text-navy">{f.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured produce */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-sm font-semibold text-saffron uppercase tracking-wider">
                {t("feat.kicker")}
              </div>
              <h2 className="text-3xl font-bold text-navy mt-1">{t("feat.title")}</h2>
            </div>
            <Link
              to="/marketplace"
              className="text-sm font-semibold text-navy hover:underline"
            >
              {t("feat.viewAll")}
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="bg-card rounded-lg border border-border overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={lang === "hi" ? p.nameHi : p.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {p.village}, {p.state} · {p.distanceKm} km
                  </div>
                  <div className="font-semibold mt-1 text-navy">{lang === "hi" ? p.nameHi : p.name}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="font-medium">{p.rating}</span>
                    <span className="text-muted-foreground">({p.reviews})</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="flex items-center text-india-green font-bold text-lg">
                      <IndianRupee className="w-4 h-4" />
                      {p.price}
                      <span className="text-xs text-muted-foreground font-normal ml-1">/{p.unit}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-india-green/10 text-india-green font-semibold uppercase">
                      {t("feat.fair")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        <div className="rounded-lg p-8 bg-saffron text-saffron-foreground">
          <div className="text-xs font-semibold uppercase tracking-widest opacity-90">{t("cta.farmer.kicker")}</div>
          <h3 className="text-2xl font-bold mt-2">{t("cta.farmer.title")}</h3>
          <p className="mt-2 opacity-95 leading-relaxed">{t("cta.farmer.text")}</p>
          <Link
            to="/role"
            className="inline-block mt-5 px-5 py-2.5 rounded-md bg-card text-saffron font-semibold"
          >
            {t("cta.farmer.btn")}
          </Link>
        </div>
        <div className="rounded-lg p-8 bg-india-green text-india-green-foreground">
          <div className="text-xs font-semibold uppercase tracking-widest opacity-90">{t("cta.consumer.kicker")}</div>
          <h3 className="text-2xl font-bold mt-2">{t("cta.consumer.title")}</h3>
          <p className="mt-2 opacity-95 leading-relaxed">{t("cta.consumer.text")}</p>
          <Link
            to="/role"
            className="inline-block mt-5 px-5 py-2.5 rounded-md bg-card text-india-green font-semibold"
          >
            {t("cta.consumer.btn")}
          </Link>
        </div>
      </section>

      <SiteFooter />
      <Chatbot />
    </div>
  );
}
