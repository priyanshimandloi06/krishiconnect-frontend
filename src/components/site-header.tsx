import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import { actions, useHydrated, useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

export function SiteHeader() {
  const { user, cart } = useStore();
  const hydrated = useHydrated();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useT();

  const cartCount = hydrated ? cart.reduce((a, i) => a + i.qty, 0) : 0;

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/marketplace", label: t("nav.marketplace") },
    { to: "/map", label: t("nav.map") },
    { to: "/price-intelligence", label: t("nav.prices") },
    { to: "/about", label: t("nav.about") },
    { to: "/help", label: t("nav.help") },
  ];

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div
      className={`inline-flex items-center rounded-md border border-white/30 overflow-hidden text-[11px] font-semibold ${className}`}
      role="group"
      aria-label="Language switcher"
    >
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-0.5 transition-colors ${lang === "en" ? "bg-white text-navy" : "hover:bg-white/10"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`px-2 py-0.5 transition-colors ${lang === "hi" ? "bg-white text-navy" : "hover:bg-white/10"}`}
        aria-pressed={lang === "hi"}
      >
        हिं
      </button>
    </div>
  );

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      {/* Government top strip */}
      <div className="bg-navy text-navy-foreground text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3">
          <span className="opacity-90 truncate">{t("gov.strip")}</span>
          <div className="flex items-center gap-3 opacity-95 shrink-0">
            <span className="hidden sm:inline">{t("gov.skip")}</span>
            <span className="hidden sm:inline">A- A A+</span>
            <LangToggle />
          </div>
        </div>
      </div>
      {/* Tricolor accent line */}
      <div className="h-1 tricolor-strip" />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-full bg-navy text-navy-foreground grid place-items-center font-display text-xl font-bold ring-2 ring-gold">
            कृ
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-tight text-navy">
              KrishiConnect
            </div>
            <div className="text-[11px] text-muted-foreground leading-tight">
              {t("brand.tagline")}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "bg-navy text-navy-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Link
            to="/cart"
            className="relative p-2 rounded-md hover:bg-accent text-foreground"
            aria-label={t("nav.cart")}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-saffron text-saffron-foreground text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center">
                {cartCount}
              </span>
            )}
          </Link>

          {hydrated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === "farmer" ? "/farmer/dashboard" : "/orders"}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
              >
                <UserIcon className="w-4 h-4" />
                <span className="font-medium">{user.name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={() => actions.logout()}
                className="p-2 rounded-md hover:bg-accent"
                aria-label={t("nav.logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold rounded-md bg-saffron text-saffron-foreground hover:opacity-90"
            >
              {t("nav.signin")}
            </Link>
          )}

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-2 flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
            <div className="py-2 flex items-center gap-2 text-sm">
              <Languages className="w-4 h-4" />
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-md border ${lang === "en" ? "bg-navy text-navy-foreground border-navy" : "border-border"}`}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-3 py-1 rounded-md border ${lang === "hi" ? "bg-navy text-navy-foreground border-navy" : "border-border"}`}
              >
                हिन्दी
              </button>
            </div>
            {!user && (
              <Link
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="mt-2 mb-3 inline-flex justify-center px-4 py-2 text-sm font-semibold rounded-md bg-saffron text-saffron-foreground"
              >
                {t("nav.signin")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
