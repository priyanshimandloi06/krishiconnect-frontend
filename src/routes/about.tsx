import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Target, Users, Globe, Award } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — KrishiConnect" },
      {
        name: "description",
        content:
          "KrishiConnect's mission is to empower farmers with fair pricing and consumers with fresh produce.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useT();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-cream border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-xs font-semibold text-saffron uppercase tracking-widest">
              {t("about.kicker")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mt-2">
              {t("about.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {t("about.intro")}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy">{t("about.mission")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("about.missionText")}</p>
            <h2 className="text-2xl font-bold text-navy pt-4">{t("about.vision")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("about.visionText")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Target, t: "8,412 " + t("stats.farmers"), d: "PM-Kisan / KCC" },
              { icon: Users, t: "120K+", d: t("nav.marketplace") },
              { icon: Globe, t: "24", d: t("home.statesCount") },
              { icon: Award, t: "Digital India", d: t("home.badge") },
            ].map((c) => (
              <div key={c.t} className="bg-card border border-border rounded-lg p-5">
                <c.icon className="w-6 h-6 text-saffron" />
                <div className="font-bold text-navy mt-3">{c.t}</div>
                <div className="text-sm text-muted-foreground">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
