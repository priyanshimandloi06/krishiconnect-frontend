import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Phone, MessageCircle, Mail, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — KrishiConnect" },
      {
        name: "description",
        content: "Toll-free IVR, email, and frequently asked questions for KrishiConnect.",
      },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do farmers register without a smartphone?",
    a: "Farmers can call the toll-free number 1800-180-1551. The IVR system records produce details in your local language and a field officer follows up for verification.",
  },
  {
    q: "How is the AI fair price calculated?",
    a: "It combines local APMC mandi rates, season, quality grade, and demand from nearby buyers to suggest a price range. Farmers can accept it or set their own price.",
  },
  {
    q: "What documents are needed for verification?",
    a: "Aadhaar (linked to mobile), and any one of: PM-Kisan Registration ID or Kisan Credit Card (KCC), plus optional land record details.",
  },
  {
    q: "Who delivers the produce?",
    a: "KrishiConnect's network of delivery agents picks up from the farm and delivers to the consumer's address within 24–48 hours.",
  },
  {
    q: "What happens if produce is damaged?",
    a: "Consumers can raise a complaint within 6 hours of delivery. Verified complaints are refunded; farmers are not penalised for transit damage.",
  },
];

function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="text-xs font-semibold text-saffron uppercase tracking-widest">
          Help &amp; Support
        </div>
        <h1 className="text-4xl font-bold text-navy mt-1">We're here to help.</h1>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <Card icon={Phone} title="Toll Free IVR" lines={["1800-180-1551", "24×7 in 12 languages"]} accent="saffron" />
          <Card icon={Mail} title="Email" lines={["support@krishiconnect.gov.in", "Reply within 24 hours"]} accent="navy" />
          <Card icon={MessageCircle} title="In-App Chat" lines={["Open KrishiBot anytime", "Bottom-right of any page"]} accent="india-green" />
        </div>

        <h2 className="text-2xl font-bold text-navy mt-12 mb-4 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-saffron" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="bg-card border border-border rounded-lg p-4 group">
              <summary className="font-semibold cursor-pointer text-navy list-none flex justify-between items-center">
                {f.q}
                <span className="text-saffron group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  lines,
  accent,
}: {
  icon: typeof Phone;
  title: string;
  lines: string[];
  accent: "saffron" | "navy" | "india-green";
}) {
  const accentClass =
    accent === "saffron"
      ? "bg-saffron text-saffron-foreground"
      : accent === "navy"
      ? "bg-navy text-navy-foreground"
      : "bg-india-green text-india-green-foreground";
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className={`w-10 h-10 rounded-md grid place-items-center ${accentClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-semibold text-navy mt-3">{title}</div>
      {lines.map((l, i) => (
        <div key={i} className={i === 0 ? "font-medium mt-1" : "text-sm text-muted-foreground"}>
          {l}
        </div>
      ))}
    </div>
  );
}
