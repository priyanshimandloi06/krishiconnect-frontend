import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState } from "react";
import { actions } from "@/lib/store";
import { registerConsumer } from "@/lib/api";

export const Route = createFileRoute("/auth/consumer")({
  head: () => ({ meta: [{ title: "Consumer Registration — KrishiConnect" }] }),
  component: ConsumerAuth,
});

function ConsumerAuth() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const location = form.location.trim();

    if (!name || !/^[0-9]{10}$/.test(phone)) {
      return alert("Please fill your name and a valid 10-digit mobile number.");
    }

    setSubmitting(true);
    try {
      const { userId, user } = await registerConsumer({
        name,
        phone,
        location,
      });
      actions.login({
        id: userId,
        role: user.role,
        name: user.name,
        phone: user.phone,
        location: user.location ?? undefined,
      });
      navigate({ to: "/marketplace" });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1 max-w-xl mx-auto px-4 py-12 w-full">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-saffron text-saffron-foreground px-6 py-4">
            <div className="text-xs uppercase tracking-widest opacity-90">Consumer Portal</div>
            <h1 className="text-2xl font-bold">Quick Registration</h1>
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            <label className="block">
              <div className="text-sm font-medium mb-1.5">Full Name</div>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your name"
              />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1.5">Mobile Number</div>
              <div className="flex">
                <span className="px-3 py-2 bg-muted border border-r-0 border-input rounded-l-md text-sm flex items-center">
                  +91
                </span>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                  className="flex-1 px-3 py-2 border border-input rounded-r-md outline-none focus:ring-2 focus:ring-ring"
                  placeholder="98XXXXXXXX"
                />
              </div>
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1.5">Delivery Location (City / PIN)</div>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. Gurugram, 122001"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 rounded-md bg-saffron text-saffron-foreground font-semibold disabled:opacity-60"
            >
              {submitting ? "Registering…" : "Register & Browse →"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              By registering you agree to our Terms &amp; Privacy Policy.
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
