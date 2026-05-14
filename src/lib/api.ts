import tomato from "@/assets/produce-tomato.jpg";
import wheat from "@/assets/produce-wheat.jpg";
import spinach from "@/assets/produce-spinach.jpg";
import carrot from "@/assets/produce-carrot.jpg";
import onion from "@/assets/produce-onion.jpg";
import chilli from "@/assets/produce-chilli.jpg";
import mango from "@/assets/produce-mango.jpg";
import rice from "@/assets/produce-rice.jpg";
import potato from "@/assets/produce-potato.jpg";
import cauliflower from "@/assets/produce-cauliflower.jpg";
import cabbage from "@/assets/produce-cabbage.jpg";
import bottleGourd from "@/assets/produce-bottle-gourd.jpg";
import cucumber from "@/assets/produce-cucumber.jpg";
import banana from "@/assets/produce-banana.jpg";
import apple from "@/assets/produce-apple.jpg";
import orange from "@/assets/produce-orange.jpg";
import papaya from "@/assets/produce-papaya.jpg";
import guava from "@/assets/produce-guava.jpg";
import grapes from "@/assets/produce-grapes.jpg";
import pomegranate from "@/assets/produce-pomegranate.jpg";
import pineapple from "@/assets/produce-pineapple.jpg";
import maize from "@/assets/produce-maize.jpg";
import barley from "@/assets/produce-barley.jpg";
import jowar from "@/assets/produce-jowar.jpg";
import bajra from "@/assets/produce-bajra.jpg";
import ragi from "@/assets/produce-ragi.jpg";
import oats from "@/assets/produce-oats.jpg";
import type { Product } from "./data";

const BASE_URL = import.meta.env.VITE_API_URL ?? "https://krishiconnect-backend-r402.onrender.com/api";

const defaultImage = rice;

const imageMap: Record<string, string> = {
  "produce-tomato.jpg": tomato,
  "produce-spinach.jpg": spinach,
  "produce-carrot.jpg": carrot,
  "produce-onion.jpg": onion,
  "produce-chilli.jpg": chilli,
  "produce-mango.jpg": mango,
  "produce-rice.jpg": rice,
  "produce-wheat.jpg": wheat,
  "produce-potato.jpg": potato,
  "produce-cauliflower.jpg": cauliflower,
  "produce-cabbage.jpg": cabbage,
  "produce-bottle-gourd.jpg": bottleGourd,
  "produce-cucumber.jpg": cucumber,
  "produce-banana.jpg": banana,
  "produce-apple.jpg": apple,
  "produce-orange.jpg": orange,
  "produce-papaya.jpg": papaya,
  "produce-guava.jpg": guava,
  "produce-grapes.jpg": grapes,
  "produce-pomegranate.jpg": pomegranate,
  "produce-pineapple.jpg": pineapple,
  "produce-maize.jpg": maize,
  "produce-barley.jpg": barley,
  "produce-jowar.jpg": jowar,
  "produce-bajra.jpg": bajra,
  "produce-ragi.jpg": ragi,
  "produce-oats.jpg": oats,
  "produce-chana.jpg": defaultImage,
  "produce-rajma.jpg": defaultImage,
  "produce-masoor-dal.jpg": defaultImage,
  "produce-urad-dal.jpg": defaultImage,
};

const normalizedImageMap: Record<string, string> = Object.fromEntries(
  Object.entries(imageMap).map(([key, value]) => [key.toLowerCase(), value]),
);

function resolveProductImage(rawImage: unknown, rawName: unknown): string {
  if (typeof rawImage === "string") {
    const normalized = rawImage.trim().toLowerCase();
    const exactMatch = normalizedImageMap[normalized];
    if (exactMatch) return exactMatch;
    if (normalized.includes("ragi")) return ragi;
    if (normalized.includes("bajra")) return bajra;
    if (normalized.includes("jowar")) return jowar;
    if (normalized.includes("rice")) return rice;
    if (normalized.includes("wheat")) return wheat;
    if (normalized.includes("oats")) return oats;
    if (normalized.includes("maize")) return maize;
    if (normalized.includes("barley")) return barley;
    return defaultImage;
  }

  if (typeof rawName === "string") {
    const normalizedName = rawName.trim().toLowerCase();
    if (normalizedName.includes("ragi")) return ragi;
    if (normalizedName.includes("bajra")) return bajra;
    if (normalizedName.includes("jowar")) return jowar;
    if (normalizedName.includes("rice")) return rice;
    if (normalizedName.includes("wheat")) return wheat;
  }

  return defaultImage;
}

function normalizeProduct(raw: any): Product {
  return {
    id: String(raw.id),
    name: String(raw.name),
    category: String(raw.category),
    image: resolveProductImage(raw.image, raw.name),
    price: Number(raw.price),
    fairPrice: Number(raw.fairPrice),
    unit: String(raw.unit),
    quantity: Number(raw.quantity),
    farmerId: String(raw.farmerId),
    farmerName: String(raw.farmerName),
    village: raw.village ? String(raw.village) : "",
    district: raw.district ? String(raw.district) : "",
    state: raw.state ? String(raw.state) : "",
    distanceKm: Number(raw.distanceKm ?? 0),
    rating: Number(raw.rating ?? 0),
    reviews: Number(raw.reviews ?? 0),
    harvestedDaysAgo: Number(raw.harvestedDaysAgo ?? 0),
    description: raw.description ? String(raw.description) : "",
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const body = (await res.json()) as { status?: string; message?: string; data?: any };
  if (!res.ok || body.status === "error") {
    throw new Error(body.message || "API request failed");
  }
  return body.data;
}

export type ConsumerRegisterPayload = {
  name: string;
  phone: string;
  location?: string;
};

export type FarmerRegisterPayload = {
  name: string;
  phone: string;
  aadhaar: string;
  pmKisanId: string;
  village?: string;
  district?: string;
  state?: string;
  landAcres?: string | number;
  landPhoto?: string;
};

export async function registerConsumer(payload: ConsumerRegisterPayload) {
  return request<{ userId: string; user: any }>("/auth/consumer/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerFarmer(payload: FarmerRegisterPayload) {
  return request<{ userId: string; user: any }>("/auth/farmer/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(phone: string) {
  return request<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  farmerId?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append("category", params.category);
  if (params?.search) searchParams.append("search", params.search);
  if (params?.farmerId) searchParams.append("farmerId", params.farmerId);
  const query = searchParams.toString();
  const products = await request<any>(`/products${query ? `?${query}` : ""}`);
  return Array.isArray(products) ? products.map(normalizeProduct) : [];
}

export async function fetchProduct(productId: string) {
  const product = await request<any>(`/products/${productId}`);
  return normalizeProduct(product);
}

export async function createOrder(payload: {
  consumerId: string;
  productId: string;
  qty: number;
  deliveryLocation: string;
}) {
  return request<{ orderId: string }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchOrders(consumerId: string) {
  return request<any[]>(`/orders?consumerId=${encodeURIComponent(consumerId)}`);
}

export async function updateOrderStatus(orderId: string, status: string) {
  return request<any>(`/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function createProduct(payload: {
  name: string;
  category: string;
  price: number;
  fairPrice: number;
  unit: string;
  quantity: number;
  farmerId: string;
  farmerName: string;
  village?: string;
  district?: string;
  state?: string;
  distanceKm?: number;
  rating?: number;
  reviews?: number;
  harvestedDaysAgo?: number;
  description?: string;
  image?: string;
}) {
  return request<{ productId: string }>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function processPayment(orderId: string, method: string, amount: number) {
  return request<any>(`/orders/${orderId}/payment`, {
    method: "POST",
    body: JSON.stringify({ method, amount }),
  });
}

export async function trackOrder(orderId: string) {
  return request<any>(`/track/${orderId}`);
}

export async function fetchFarmerProducts(farmerId: string) {
  return request<any[]>(`/farmer/products?farmerId=${encodeURIComponent(farmerId)}`);
}

export async function fetchFarmerOrders(farmerId: string) {
  return request<any[]>(`/farmer/orders?farmerId=${encodeURIComponent(farmerId)}`);
}

export async function fetchFarmerStats(farmerId: string) {
  return request<any>(`/farmer/stats?farmerId=${encodeURIComponent(farmerId)}`);
}

export async function fetchPriceTrends(commodity?: string, days?: number) {
  const params = new URLSearchParams();
  if (commodity) params.append("commodity", commodity);
  if (days) params.append("days", days.toString());
  return request<any[]>(`/analytics/price-trends?${params.toString()}`);
}

export async function fetchMarketInsights() {
  return request<any[]>("/analytics/market-insights");
}

export async function sendChatMessage(message: string, userId?: string, role?: string) {
  return request<{ reply: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({ message, userId, role }),
  });
}

export async function fetchChatHistory(userId?: string, limit?: number) {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (limit) params.append("limit", limit.toString());
  return request<any[]>(`/chat/history?${params.toString()}`);
}

export async function fetchNotifications(userId: string) {
  return request<any[]>(`/notifications?userId=${encodeURIComponent(userId)}`);
}

export async function boostFarmer(farmerId: string, plan: string, price: number) {
  return request<any>("/farmer/boost", {
    method: "POST",
    body: JSON.stringify({ farmerId, plan, price }),
  });
}

export async function generateProductImage(productName: string, category: string) {
  return request<{ imageBase64: string; productName: string; category: string }>("/generate-image", {
    method: "POST",
    body: JSON.stringify({ productName, category }),
  });
}

export async function searchProducts(query: string, category?: string, location?: string) {
  const params = new URLSearchParams();
  params.append("q", query);
  if (category) params.append("category", category);
  if (location) params.append("location", location);
  return request<any[]>(`/search?${params.toString()}`);
}

export async function getPriceIntelligence(product?: string, category?: string, quantity?: number, unit?: string) {
  return request<any>("/price", {
    method: "POST",
    body: JSON.stringify({ product, category, quantity, unit }),
  });
}

export async function seedDatabase() {
  return request<any>("/seed", {
    method: "POST",
  });
}
