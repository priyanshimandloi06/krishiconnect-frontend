import { useEffect, useState, useSyncExternalStore } from "react";
import type { Product } from "./data";

// ----- Auth -----
export type Role = "farmer" | "consumer";
export type User = {
  id?: string;
  role: Role;
  name: string;
  phone: string;
  location?: string;
  village?: string;
  district?: string;
  state?: string;
  aadhaar?: string;
  pmKisanId?: string;
  verified?: boolean;
};

// ----- Cart / Orders -----
export type CartItem = { product: Product; qty: number };
export type OrderStatus =
  | "Placed"
  | "Confirmed by Farmer"
  | "Picked up by Agent"
  | "Out for Delivery"
  | "Delivered"
  | "confirmed";
export type PaymentMethod = "UPI" | "QR" | "NetBanking" | "Card" | "COD";
export type Payment = {
  method: PaymentMethod;
  status: "Paid" | "Pending";
  txnId: string;
  paidAt: number;
  details?: string; // last4, UPI id, bank, etc.
};
export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  placedAt: number;
  buyerName: string;
  deliveryAddress: string;
  farmerName: string;
  farmerId?: string;
  payment?: Payment;
};

type State = {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  myListings: Product[]; // farmer's listings (extras)
  promotedFarmers: string[]; // farmer ids who paid for boost
  myBoosts: { plan: string; price: number; activatedAt: number }[]; // current farmer's purchases
  farmerStats?: any; // farmer dashboard stats
};

const KEY = "krishi_state_v1";

const DEFAULT_STATE: State = { user: null, cart: [], orders: [], myListings: [], promotedFarmers: [], myBoosts: [], farmerStats: null };

function load(): State {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_STATE };
}

let state: State = { user: null, cart: [], orders: [], myListings: [], promotedFarmers: [], myBoosts: [], farmerStats: null };
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (!initialized && typeof window !== "undefined") {
    state = load();
    initialized = true;
  }
}

function setState(updater: (s: State) => State) {
  ensureInit();
  state = updater(state);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  ensureInit();
  return state;
}
function getServerSnapshot(): State {
  return { user: null, cart: [], orders: [], myListings: [], promotedFarmers: [], myBoosts: [], farmerStats: null };
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Hydration-safe hook for components that depend on persisted state
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

// ----- Actions -----
export const actions = {
  login(user: User) {
    setState((s) => ({ ...s, user }));
  },
  logout() {
    setState((s) => ({ ...s, user: null, cart: [] }));
  },
  setOrders(orders: Order[]) {
    setState((s) => ({ ...s, orders }));
  },
  addOrders(orders: Order[]) {
    setState((s) => ({ ...s, orders: [...orders, ...s.orders], cart: [] }));
  },
  addToCart(product: Product, qty = 1) {
    setState((s) => {
      const existing = s.cart.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          ...s,
          cart: s.cart.map((i) =>
            i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
          ),
        };
      }
      return { ...s, cart: [...s.cart, { product, qty }] };
    });
  },
  updateQty(productId: string, qty: number) {
    setState((s) => ({
      ...s,
      cart:
        qty <= 0
          ? s.cart.filter((i) => i.product.id !== productId)
          : s.cart.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
    }));
  },
  removeFromCart(productId: string) {
    setState((s) => ({ ...s, cart: s.cart.filter((i) => i.product.id !== productId) }));
  },
  clearCart() {
    setState((s) => ({ ...s, cart: [] }));
  },
  placeOrder(buyerName: string, deliveryAddress: string) {
    let order: Order | null = null;
    setState((s) => {
      const total = s.cart.reduce((a, i) => a + i.product.price * i.qty, 0);
      order = {
        id: "ORD" + Math.floor(100000 + Math.random() * 900000),
        items: s.cart,
        total,
        status: "Placed",
        placedAt: Date.now(),
        buyerName,
        deliveryAddress,
        farmerName: s.cart[0]?.product.farmerName ?? "",
        farmerId: s.cart[0]?.product.farmerId,
      };
      return { ...s, cart: [], orders: [order, ...s.orders] };
    });
    return order!;
  },
  attachPayment(orderId: string, payment: Payment) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, payment } : o)),
    }));
  },
  advanceOrder(orderId: string) {
    const flow: OrderStatus[] = [
      "Placed",
      "Confirmed by Farmer",
      "Picked up by Agent",
      "Out for Delivery",
      "Delivered",
    ];
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const idx = flow.indexOf(o.status);
        return { ...o, status: flow[Math.min(idx + 1, flow.length - 1)] };
      }),
    }));
  },
  addListing(product: Product) {
    setState((s) => ({ ...s, myListings: [product, ...s.myListings] }));
  },
  promoteFarmer(farmerId: string, plan: string, price: number) {
    setState((s) => ({
      ...s,
      promotedFarmers: s.promotedFarmers.includes(farmerId)
        ? s.promotedFarmers
        : [...s.promotedFarmers, farmerId],
      myBoosts: [{ plan, price, activatedAt: Date.now() }, ...s.myBoosts],
    }));
  },
  updateOrderStatus(orderId: string, status: OrderStatus) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },
  updateMyListings(listings: Product[]) {
    setState((s) => ({ ...s, myListings: listings }));
  },
  updateFarmerStats(stats: any) {
    // Store farmer stats in state if needed
    setState((s) => ({ ...s, farmerStats: stats }));
  },
};
