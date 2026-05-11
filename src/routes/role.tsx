import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Sprout, ShoppingBasket } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/role")({
  head: () => ({
    meta: [
      { title: "Choose Your Role — KrishiConnect" },
      { name: "description", content: "Register as a farmer or consumer on KrishiConnect." },
    ],
  }),
  component: RolePage,
});

function RolePage() {
  const { t } = useT();
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-semibold text-saffron uppercase tracking-wider">
            {t("role.step")}
          </div>
          <h1 className="text-4xl font-bold text-navy mt-2">{t("role.title")}</h1>
          <p className="text-muted-foreground mt-3">{t("role.subtitle")}</p>
          <div className="mt-4">
            <Link
              to="/auth/login"
              className="text-saffron font-semibold hover:underline"
            >
              Already registered? Login here.
            </Link>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link
            to="/auth/farmer"
            className="group bg-card border-2 border-border rounded-lg p-8 hover:border-india-green hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-india-green/10 grid place-items-center group-hover:bg-india-green/20">
              <Sprout className="w-7 h-7 text-india-green" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-navy">{t("role.farmer.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{t("role.farmer.text")}</p>
            <ul className="mt-4 space-y-1 text-sm text-foreground/80">
              <li>✓ Aadhaar + PM-Kisan ID</li>
              <li>✓ AI {t("nav.prices")}</li>
              <li>✓ {t("how.f3.t")}</li>
              <li>✓ IVR 1800-180-1551</li>
            </ul>
            <div className="mt-6 inline-flex items-center text-india-green font-semibold">
              {t("role.farmer.cta")}
            </div>
          </Link>

          <Link
            to="/auth/consumer"
            className="group bg-card border-2 border-border rounded-lg p-8 hover:border-saffron hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-saffron/10 grid place-items-center group-hover:bg-saffron/20">
              <ShoppingBasket className="w-7 h-7 text-saffron" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-navy">{t("role.consumer.title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{t("role.consumer.text")}</p>
            <ul className="mt-4 space-y-1 text-sm text-foreground/80">
              <li>✓ OTP</li>
              <li>✓ {t("nav.map")}</li>
              <li>✓ {t("nav.marketplace")}</li>
              <li>✓ {t("feat.fair")}</li>
            </ul>
            <div className="mt-6 inline-flex items-center text-saffron font-semibold">
              {t("role.consumer.cta")}
            </div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
