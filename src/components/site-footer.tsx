import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="mt-16 border-t border-border bg-navy text-navy-foreground">
      <div className="h-1 tricolor-strip" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-display text-lg font-bold mb-2">KrishiConnect</div>
          <p className="opacity-80 leading-relaxed">{t("footer.about")}</p>
        </div>
        <div>
          <div className="font-semibold mb-3">{t("footer.quick")}</div>
          <ul className="space-y-2 opacity-90">
            <li><Link to="/marketplace">{t("nav.marketplace")}</Link></li>
            <li><Link to="/about">{t("nav.about")}</Link></li>
            <li><Link to="/help">{t("nav.help")}</Link></li>
            <li><Link to="/role">{t("footer.register")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">{t("footer.forFarmers")}</div>
          <ul className="space-y-2 opacity-90">
            <li>PM-Kisan Verification</li>
            <li>AI Price Suggestions</li>
            <li>IVR: 1800-180-1551</li>
            <li>Doorstep Pickup</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">{t("footer.contact")}</div>
          <ul className="space-y-2 opacity-90">
            <li>{t("home.tollfree")}</li>
            <li>support@krishiconnect.gov.in</li>
            <li>Krishi Bhawan, New Delhi</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} KrishiConnect · {t("footer.copyright")} ·
        {" "}{t("footer.lastUpdated")}: {new Date().toLocaleDateString(t("nav.home") === "मुख पृष्ठ" ? "hi-IN" : "en-IN")}
      </div>
    </footer>
  );
}
