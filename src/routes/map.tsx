import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Chatbot } from "@/components/chatbot";
import { useEffect, useMemo, useRef, useState } from "react";
import { consumerLocation, distanceKm, farmers, products } from "@/lib/data";
import { MapPin, Navigation, ShieldCheck, Star, Locate } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Nearby Farmers Map — KrishiConnect" },
      {
        name: "description",
        content:
          "Find verified farmers near you on an interactive map and order fresh produce directly.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [me, setMe] = useState(consumerLocation);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const LRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const farmersWithDistance = useMemo(
    () =>
      farmers
        .map((f) => ({
          ...f,
          distance: Number(distanceKm(me, { lat: f.lat, lng: f.lng }).toFixed(1)),
        }))
        .sort((a, b) => a.distance - b.distance),
    [me],
  );

  // Initialize Leaflet on the client only
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const leafletModule = await import("leaflet");
      const L = leafletModule.default ?? leafletModule;
      // CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (cancelled || !mapDivRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(mapDivRef.current, {
        center: [me.lat, me.lng],
        zoom: 11,
        scrollWheelZoom: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      drawMarkers();
      map.invalidateSize();
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw markers when location or selection changes
  useEffect(() => {
    drawMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, selectedId]);

  function drawMarkers() {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    layersRef.current.forEach((l) => map.removeLayer(l));
    layersRef.current = [];

    // Consumer marker (you)
    const youIcon = L.divIcon({
      className: "",
      html: `<div style="background:#1e3a8a;color:#fff;border:3px solid #fff;border-radius:9999px;width:22px;height:22px;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    const youMarker = L.marker([me.lat, me.lng], { icon: youIcon })
      .addTo(map)
      .bindPopup("<b>You are here</b>");
    layersRef.current.push(youMarker);

    // 30km radius circle
    const circle = L.circle([me.lat, me.lng], {
      radius: 30000,
      color: "#1e3a8a",
      fillColor: "#1e3a8a",
      fillOpacity: 0.05,
      weight: 1,
      dashArray: "4 4",
    }).addTo(map);
    layersRef.current.push(circle);

    // Farmer markers
    farmersWithDistance.forEach((f) => {
      const isSel = f.id === selectedId;
      const color = isSel ? "#ea580c" : "#15803d";
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center;">
          <div style="background:${color};color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:9999px;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.25);white-space:nowrap;">
            ${f.name.split(" ")[0]} · ${f.distance}km
          </div>
          <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${color};margin-top:-1px;"></div>
        </div>`,
        iconSize: [120, 36],
        iconAnchor: [60, 36],
      });
      const m = L.marker([f.lat, f.lng], { icon })
        .addTo(map)
        .on("click", () => setSelectedId(f.id));
      layersRef.current.push(m);
    });
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationError(null);
    setLocating(true);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude, label: "Your location" };
        setMe(next);
        if (mapRef.current) {
          mapRef.current.invalidateSize();
          mapRef.current.flyTo([next.lat, next.lng], 13, { duration: 0.8 });
        }
        setLocating(false);
      },
      (error) => {
        console.error("Geolocation error", error);
        setLocationError("Unable to access your location. Please enable location permissions and try again.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 },
    );
  }

  const selected = farmersWithDistance.find((f) => f.id === selectedId);
  const selectedProducts = selected ? products.filter((p) => p.farmerId === selected.id) : [];

  function flyTo(id: string) {
    const f = farmersWithDistance.find((x) => x.id === id);
    if (!f || !mapRef.current) return;
    setSelectedId(id);
    mapRef.current.flyTo([f.lat, f.lng], 13, { duration: 0.8 });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <div className="bg-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-xs font-semibold text-saffron uppercase tracking-wider">
            Nearby Farmers
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy mt-1">
            Farmers in your area
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Showing verified farmers within 30 km of {me.label}. Tap a marker to view their produce.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full grid lg:grid-cols-[1fr_360px] gap-5">
        {locationError && (
          <div className="col-span-full rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {locationError}
          </div>
        )}
        {/* Map */}
        <div className="relative">
          <div
            ref={mapDivRef}
            className="w-full rounded-lg border border-border overflow-hidden bg-muted"
            style={{ height: "min(70vh, 640px)" }}
          />
          <button
            onClick={locateMe}
            disabled={locating}
            className="absolute top-3 right-3 z-[400] bg-card border border-border shadow-md px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-accent disabled:opacity-60"
          >
            <Locate className="w-4 h-4" />
            {locating ? "Locating…" : "Use my location"}
          </button>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
          {selected && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-border bg-cream">
                <img
                  src={selected.photo}
                  alt={selected.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-india-green"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy flex items-center gap-1.5">
                    {selected.name}
                    <ShieldCheck className="w-4 h-4 text-india-green" />
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selected.village}, {selected.district}
                  </div>
                  <div className="text-xs flex items-center gap-2 mt-0.5">
                    <Navigation className="w-3 h-3 text-saffron" />
                    <span className="font-medium">{selected.distance} km away</span>
                    <Star className="w-3 h-3 fill-gold text-gold ml-1" />
                    <span>{selected.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-3">
                <div className="text-xs bg-muted/40 rounded-md p-2.5 border border-border">
                  <div className="font-semibold text-navy mb-0.5">Farm Address</div>
                  <div className="text-muted-foreground">
                    {selected.name}, Village {selected.village}, District {selected.district}, {selected.state}
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-muted-foreground">Total sales:</span> <b>{selected.totalSales}</b></div>
                    <div><span className="text-muted-foreground">Specialty:</span> <b>{selected.specialties[0]}</b></div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-muted-foreground">
                  Available produce & prices
                </div>
                {selectedProducts.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No active listings. Specialties: {selected.specialties.join(", ")}
                  </p>
                )}
                <div className="space-y-2">
                  {selectedProducts.map((p) => (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent border border-border"
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-navy truncate">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          Fair price: ₹{p.fairPrice}/{p.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-india-green">₹{p.price}</div>
                        <div className="text-[10px] text-muted-foreground">/{p.unit}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {selectedProducts.length > 0 && (
                  <Link
                    to="/product/$id"
                    params={{ id: selectedProducts[0].id }}
                    className="block text-center w-full mt-2 px-3 py-2 rounded-md bg-saffron text-saffron-foreground text-sm font-semibold"
                  >
                    Place Order →
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            All farmers near you ({farmersWithDistance.length})
          </div>
          {farmersWithDistance.map((f) => (
            <button
              key={f.id}
              onClick={() => flyTo(f.id)}
              className={`text-left bg-card border rounded-lg p-3 hover:border-saffron transition-colors ${
                selectedId === f.id ? "border-saffron ring-1 ring-saffron" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <img src={f.photo} alt={f.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy flex items-center gap-1">
                    {f.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-india-green" />
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {f.village}, {f.state}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] mt-1">
                    <span className="flex items-center gap-1 text-saffron font-medium">
                      <Navigation className="w-3 h-3" /> {f.distance} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold text-gold" /> {f.rating}
                    </span>
                    <span className="text-muted-foreground">{f.totalSales} sales</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </aside>
      </main>

      <SiteFooter />
      <Chatbot />
    </div>
  );
}
