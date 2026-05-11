import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState } from "react";
import { actions } from "@/lib/store";
import { registerFarmer } from "@/lib/api";
import { ShieldCheck, Phone } from "lucide-react";

export const Route = createFileRoute("/auth/farmer")({
  head: () => ({ meta: [{ title: "Farmer Registration — KrishiConnect" }] }),
  component: FarmerAuth,
});

function FarmerAuth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    name: "",
    aadhaar: "",
    pmKisanId: "",
    village: "",
    district: "",
    state: "",
    landAcres: "",
    landPhoto: "",
  });

  function sendOtp() {
    if (phone.length !== 10) return alert("Enter a valid 10-digit mobile number");
    setStep(2);
  }
  function verifyOtp() {
    if (otp.length !== 6) return alert("Enter the 6-digit OTP");
    setStep(3);
  }
  async function submit() {
    if (!form.name || !form.aadhaar || !form.pmKisanId || !form.landPhoto) {
      return alert("Please fill all required fields and upload a land photo with you standing on the land.");
    }

    try {
      const { userId } = await registerFarmer({
        name: form.name,
        phone,
        aadhaar: form.aadhaar,
        pmKisanId: form.pmKisanId,
        village: form.village,
        district: form.district,
        state: form.state,
        landAcres: form.landAcres,
        landPhoto: form.landPhoto,
      });
      actions.login({
        id: userId,
        role: "farmer",
        name: form.name,
        phone,
        village: form.village,
        district: form.district,
        state: form.state,
        aadhaar: form.aadhaar,
        pmKisanId: form.pmKisanId,
        verified: true,
      });
      navigate({ to: "/farmer/dashboard" });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-india-green text-india-green-foreground px-6 py-4">
            <div className="text-xs uppercase tracking-widest opacity-90">Farmer Portal</div>
            <h1 className="text-2xl font-bold">Secure Farmer Registration</h1>
          </div>

          {/* Stepper */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-2 text-sm">
            {["Mobile OTP", "Verify OTP", "Verification"].map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3;
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
                  {n < 3 && <span className="mx-2 text-border">———</span>}
                </div>
              );
            })}
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-4 max-w-md">
                <Field label="Mobile Number (linked to Aadhaar)">
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
                  <Phone className="w-3 h-3" /> No smartphone? Call 1800-180-1551 to register by IVR.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 max-w-md">
                <p className="text-sm text-muted-foreground">
                  An OTP has been sent to +91-{phone}. (Demo: enter any 6 digits)
                </p>
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
                  className="w-full px-4 py-3 rounded-md bg-saffron text-saffron-foreground font-semibold"
                >
                  Verify &amp; Continue
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="p-4 rounded-md bg-india-green/5 border border-india-green/20 flex gap-3 text-sm">
                  <ShieldCheck className="w-5 h-5 text-india-green shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-india-green">Secure Verification</div>
                    <div className="text-muted-foreground">
                      Your Aadhaar is verified via UIDAI eKYC. PM-Kisan ID is checked against the
                      official registry. Information is encrypted and never shared.
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name *">
                    <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  </Field>
                  <Field label="Aadhaar Number *">
                    <Input
                      value={form.aadhaar}
                      onChange={(v) =>
                        setForm({ ...form, aadhaar: v.replace(/\D/g, "").slice(0, 12) })
                      }
                      placeholder="XXXX XXXX XXXX"
                    />
                  </Field>
                  <Field label="PM-Kisan / KCC ID *">
                    <Input
                      value={form.pmKisanId}
                      onChange={(v) => setForm({ ...form, pmKisanId: v })}
                      placeholder="PMK-XXXXXXX"
                    />
                  </Field>
                  <Field label="Land Holding (Acres)">
                    <Input
                      value={form.landAcres}
                      onChange={(v) => setForm({ ...form, landAcres: v.replace(/[^\d.]/g, "") })}
                      placeholder="e.g. 2.5"
                    />
                  </Field>
                  <Field label="Village">
                    <Input value={form.village} onChange={(v) => setForm({ ...form, village: v })} />
                  </Field>
                  <Field label="District">
                    <Input
                      value={form.district}
                      onChange={(v) => setForm({ ...form, district: v })}
                    />
                  </Field>
                  <Field label="State">
                    <Input value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
                  </Field>
                </div>

                <Field label="Land Photo (Farmer standing on land) *">
                  <div className="space-y-3">
                    <label className="block rounded-lg border border-input bg-background p-3 cursor-pointer hover:border-navy">
                      <div className="flex items-center justify-between gap-3 text-sm font-medium text-foreground">
                        <span>{form.landPhoto ? "Replace photo" : "Upload / Take photo"}</span>
                        <span className="text-xs text-muted-foreground">.jpg, .png</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result;
                            if (typeof result === "string") {
                              setForm((prev) => ({ ...prev, landPhoto: result }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="sr-only"
                      />
                    </label>
                    {form.landPhoto && (
                      <img
                        src={form.landPhoto}
                        alt="Land photo preview"
                        className="w-full h-56 rounded-md object-cover border border-border"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Add a photo of the land with you standing on it. Use the camera option on mobile to take the picture directly.
                    </p>
                  </div>
                </Field>

                <button
                  onClick={submit}
                  className="w-full px-4 py-3 rounded-md bg-india-green text-india-green-foreground font-semibold"
                >
                  Complete Registration →
                </button>
              </div>
            )}
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
function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring bg-background"
    />
  );
}
