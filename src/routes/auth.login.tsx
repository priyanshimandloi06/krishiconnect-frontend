import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState } from "react";
import { actions } from "@/lib/store";
import { loginUser } from "@/lib/api";
import { ShieldCheck, Phone, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Login — KrishiConnect" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function sendOtp() {
    if (phone.length !== 10) return alert("Enter a valid 10-digit mobile number");
    setStep(2);
  }

  async function verifyOtp() {
    if (otp.length !== 6) return alert("Enter the 6-digit OTP");
    setLoading(true);

    try {
      const user = await loginUser(phone);
      actions.login({
        id: String(user.id),
        role: user.role,
        name: user.name,
        phone: user.phone,
        location: user.location ?? undefined,
        village: user.village ?? undefined,
        district: user.district ?? undefined,
        state: user.state ?? undefined,
        aadhaar: user.aadhaar ?? undefined,
        pmKisanId: user.pmKisanId ?? undefined,
        verified: Boolean(user.verified),
      });

      navigate({ to: user.role === "farmer" ? "/farmer/dashboard" : "/marketplace" });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to log in. Please register first.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-navy text-navy-foreground px-6 py-4">
            <div className="text-xs uppercase tracking-widest opacity-90">Secure Login</div>
            <h1 className="text-2xl font-bold">Login with Mobile OTP</h1>
          </div>

          <div className="px-6 py-4 border-b border-border flex items-center gap-2 text-sm">
            {['Mobile OTP', 'Verify OTP'].map((label, i) => {
              const n = (i + 1) as 1 | 2;
              const active = step === n;
              const done = step > n;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full grid place-items-center text-xs font-semibold ${
                      active
                        ? "bg-navy text-navy-foreground"
                        : done
                        ? "bg-india-green text-india-green-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : n}
                  </div>
                  <span className={active ? "font-semibold text-navy" : "text-muted-foreground"}>
                    {label}
                  </span>
                  {n < 2 && <span className="mx-2 text-border">———</span>}
                </div>
              );
            })}
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-4 max-w-md">
                <Field label="Mobile Number">
                  <div className="flex">
                    <span className="px-3 py-2 bg-muted border border-r-0 border-input rounded-l-md text-sm flex items-center">
                      +91
                    </span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="flex-1 px-3 py-2 border border-input rounded-r-md outline-none focus:ring-2 focus:ring-ring"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </Field>
                <button
                  onClick={sendOtp}
                  className="w-full px-4 py-3 rounded-md bg-saffron text-saffron-foreground font-semibold"
                >
                  Send OTP
                </button>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  After registration you can log in with the same number.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 max-w-md">
                <div className="rounded-md bg-india-green/5 border border-india-green/20 p-4 text-sm">
                  <div className="font-semibold text-india-green flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> OTP Verification
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Enter the OTP sent to +91-{phone}. (Demo: any 6 digits)
                  </p>
                </div>
                <Field label="Enter OTP">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-3 py-2 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring tracking-[0.5em] text-center font-mono text-lg"
                    placeholder="••••••"
                  />
                </Field>
                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-60"
                >
                  {loading ? "Logging in…" : "Verify OTP & Login"}
                </button>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <Link to="/role" className="text-saffron hover:underline">
                    Register instead
                  </Link>
                  <button
                    onClick={() => setStep(1)}
                    className="text-foreground hover:underline"
                    type="button"
                  >
                    Change number
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3">
            <ArrowRight className="w-4 h-4" />
            Already registered as a farmer or consumer? Use your mobile number and OTP to log in.
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1.5 text-foreground">{label}</div>
      {children}
    </label>
  );
}
