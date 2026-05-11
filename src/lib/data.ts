import tomato from "@/assets/produce-tomato.jpg";
import spinach from "@/assets/produce-spinach.jpg";
import carrot from "@/assets/produce-carrot.jpg";
import onion from "@/assets/produce-onion.jpg";
import chilli from "@/assets/produce-chilli.jpg";
import mango from "@/assets/produce-mango.jpg";
import rice from "@/assets/produce-rice.jpg";
import wheat from "@/assets/produce-wheat.jpg";
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
import farmer1 from "@/assets/farmer-1.jpg";
import farmer2 from "@/assets/farmer-2.jpg";

export type Product = {
  id: string;
  name: string;
  nameHi: string; // Hindi name
  category: string;
  image: string;
  price: number; // per kg INR
  fairPrice: number; // AI recommended
  unit: string;
  quantity: number; // available kg
  farmerId: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  harvestedDaysAgo: number;
  description: string;
};

export type FarmerSubscription = {
  id: string;
  farmerId: string;
  name: string;
  description: string;
  price: number; // monthly price in INR
  frequency: "weekly" | "biweekly" | "monthly";
  productsIncluded: string[];
  benefits: string[];
  duration: number; // in months
  isActive: boolean;
};

export type Farmer = {
  id: string;
  name: string;
  photo: string;
  village: string;
  district: string;
  state: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  lat: number;
  lng: number;
  specialties: string[];
  subscriptionId?: string; // farmer's active subscription offer
};

// Consumer's default location (Delhi NCR center) — used to compute distances on the map
export const consumerLocation = { lat: 28.6139, lng: 77.209, label: "New Delhi" };

export const farmers: Farmer[] = [
  {
    id: "f1",
    name: "Ramesh Kumar",
    photo: farmer1,
    village: "Bhondsi",
    district: "Gurugram",
    state: "Haryana",
    verified: true,
    rating: 4.8,
    totalSales: 142,
    lat: 28.3796,
    lng: 77.0498,
    specialties: ["Tomatoes", "Carrots", "Chillies", "Basmati Rice"],
    subscriptionId: "sub1",
  },
  {
    id: "f2",
    name: "Sunita Devi",
    photo: farmer2,
    village: "Kanpur Dehat",
    district: "Kanpur",
    state: "Uttar Pradesh",
    verified: true,
    rating: 4.9,
    totalSales: 287,
    lat: 28.5021,
    lng: 77.4025,
    specialties: ["Spinach", "Onions", "Mangoes"],
    subscriptionId: "sub2",
  },
  {
    id: "f3",
    name: "Mohan Singh",
    photo: farmer1,
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    verified: true,
    rating: 4.6,
    totalSales: 98,
    lat: 28.6092,
    lng: 76.9798,
    specialties: ["Wheat", "Mustard", "Seasonal Vegetables"],
    subscriptionId: "sub3",
  },
  {
    id: "f4",
    name: "Lakshmi Bai",
    photo: farmer2,
    village: "Sonipat",
    district: "Sonipat",
    state: "Haryana",
    verified: true,
    rating: 4.7,
    totalSales: 176,
    lat: 28.9931,
    lng: 77.0151,
    specialties: ["Okra", "Bottle Gourd", "Cucumber"],
    subscriptionId: "sub4",
  },
  {
    id: "f5",
    name: "Arjun Yadav",
    photo: farmer1,
    village: "Ballabhgarh",
    district: "Faridabad",
    state: "Haryana",
    verified: true,
    rating: 4.5,
    totalSales: 64,
    lat: 28.3398,
    lng: 77.3266,
    specialties: ["Cauliflower", "Cabbage", "Peas"],
  },
  {
    id: "f6",
    name: "Geeta Sharma",
    photo: farmer2,
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    verified: true,
    rating: 4.8,
    totalSales: 211,
    lat: 28.6692,
    lng: 77.4538,
    specialties: ["Guava", "Papaya", "Leafy Greens"],
    subscriptionId: "sub5",
  },
];

// Haversine distance in km
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(x)) * 10) / 10;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Vine-Ripened Tomatoes",
    nameHi: "बेल से पके टमाटर",
    category: "Vegetables",
    image: tomato,
    price: 28,
    fairPrice: 32,
    unit: "kg",
    quantity: 120,
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    village: "Bhondsi",
    district: "Gurugram",
    state: "Haryana",
    distanceKm: 12,
    rating: 4.7,
    reviews: 38,
    harvestedDaysAgo: 1,
    description: "Fresh, naturally ripened tomatoes harvested from open farmland. No artificial ripening agents used.",
  },
  {
    id: "p2",
    name: "Fresh Palak (Spinach)",
    nameHi: "ताज़ा पालक",
    category: "Leafy Greens",
    image: spinach,
    price: 22,
    fairPrice: 25,
    unit: "bunch",
    quantity: 60,
    farmerId: "f2",
    farmerName: "Sunita Devi",
    village: "Kanpur Dehat",
    district: "Kanpur",
    state: "Uttar Pradesh",
    distanceKm: 8,
    rating: 4.9,
    reviews: 64,
    harvestedDaysAgo: 0,
    description: "Tender spinach leaves harvested this morning. Pesticide free.",
  },
  {
    id: "p3",
    name: "Organic Carrots",
    nameHi: "जैविक गाजर",
    category: "Vegetables",
    image: carrot,
    price: 35,
    fairPrice: 38,
    unit: "kg",
    quantity: 80,
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    village: "Bhondsi",
    district: "Gurugram",
    state: "Haryana",
    distanceKm: 12,
    rating: 4.6,
    reviews: 21,
    harvestedDaysAgo: 2,
    description: "Sweet, juicy carrots with green tops. Grown without chemical fertilizers.",
  },
  {
    id: "p4",
    name: "Yellow Onions",
    nameHi: "पीले प्याज",
    category: "Vegetables",
    image: onion,
    price: 24,
    fairPrice: 26,
    unit: "kg",
    quantity: 200,
    farmerId: "f2",
    farmerName: "Sunita Devi",
    village: "Kanpur Dehat",
    district: "Kanpur",
    state: "Uttar Pradesh",
    distanceKm: 8,
    rating: 4.5,
    reviews: 47,
    harvestedDaysAgo: 5,
    description: "Sun-cured onions with long shelf life. Standard storage variety.",
  },
  {
    id: "p5",
    name: "Green Chillies",
    nameHi: "हरी मिर्च",
    category: "Vegetables",
    image: chilli,
    price: 60,
    fairPrice: 65,
    unit: "kg",
    quantity: 30,
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    village: "Bhondsi",
    district: "Gurugram",
    state: "Haryana",
    distanceKm: 12,
    rating: 4.8,
    reviews: 19,
    harvestedDaysAgo: 1,
    description: "Hot and crisp green chillies, ideal for daily cooking.",
  },
  {
    id: "p6",
    name: "Alphonso Mangoes",
    nameHi: "आल्फोंसो आम",
    category: "Fruits",
    image: mango,
    price: 320,
    fairPrice: 350,
    unit: "kg",
    quantity: 45,
    farmerId: "f2",
    farmerName: "Sunita Devi",
    village: "Kanpur Dehat",
    district: "Kanpur",
    state: "Uttar Pradesh",
    distanceKm: 8,
    rating: 5.0,
    reviews: 92,
    harvestedDaysAgo: 1,
    description: "Premium Alphonso mangoes — King of fruits, naturally ripened.",
  },
  {
    id: "p7",
    name: "Basmati Rice",
    nameHi: "बासमती चावल",
    category: "Grains",
    image: rice,
    price: 95,
    fairPrice: 100,
    unit: "kg",
    quantity: 500,
    farmerId: "f1",
    farmerName: "Ramesh Kumar",
    village: "Bhondsi",
    district: "Gurugram",
    state: "Haryana",
    distanceKm: 12,
    rating: 4.7,
    reviews: 153,
    harvestedDaysAgo: 30,
    description: "Long-grain aromatic basmati from Haryana fields.",
  },
  {
    id: "p8",
    name: "Whole Wheat Grains",
    nameHi: "गेहूं का पूरा अनाज",
    category: "Grains",
    image: wheat,
    price: 30,
    fairPrice: 34,
    unit: "kg",
    quantity: 300,
    farmerId: "f3",
    farmerName: "Mohan Singh",
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    distanceKm: 15,
    rating: 4.7,
    reviews: 25,
    harvestedDaysAgo: 25,
    description: "High-quality wheat grains for daily use.",
  },
  {
    id: "p9",
    name: "Golden Potatoes",
    nameHi: "सुनहरे आलू",
    category: "Vegetables",
    image: potato,
    price: 26,
    fairPrice: 29,
    unit: "kg",
    quantity: 220,
    farmerId: "f4",
    farmerName: "Lakshmi Bai",
    village: "Sonipat",
    district: "Sonipat",
    state: "Haryana",
    distanceKm: 18,
    rating: 4.4,
    reviews: 39,
    harvestedDaysAgo: 3,
    description: "Fresh table potatoes, ideal for everyday cooking.",
  },
  {
    id: "p10",
    name: "Fresh Cauliflower",
    nameHi: "ताज़ा फूलगोभी",
    category: "Vegetables",
    image: cauliflower,
    price: 42,
    fairPrice: 45,
    unit: "kg",
    quantity: 90,
    farmerId: "f5",
    farmerName: "Arjun Yadav",
    village: "Ballabhgarh",
    district: "Faridabad",
    state: "Haryana",
    distanceKm: 20,
    rating: 4.6,
    reviews: 30,
    harvestedDaysAgo: 2,
    description: "Crunchy white cauliflower heads, freshly harvested.",
  },
  {
    id: "p11",
    name: "Crunchy Cabbage",
    nameHi: "कुरकुरा पत्तागोभी",
    category: "Vegetables",
    image: cabbage,
    price: 30,
    fairPrice: 33,
    unit: "kg",
    quantity: 110,
    farmerId: "f5",
    farmerName: "Arjun Yadav",
    village: "Ballabhgarh",
    district: "Faridabad",
    state: "Haryana",
    distanceKm: 20,
    rating: 4.5,
    reviews: 27,
    harvestedDaysAgo: 4,
    description: "Green cabbage with crisp leaves, ideal for salads and curries.",
  },
  {
    id: "p12",
    name: "Bottle Gourd",
    nameHi: "लौकी",
    category: "Vegetables",
    image: bottleGourd,
    price: 38,
    fairPrice: 42,
    unit: "kg",
    quantity: 75,
    farmerId: "f4",
    farmerName: "Lakshmi Bai",
    village: "Sonipat",
    district: "Sonipat",
    state: "Haryana",
    distanceKm: 18,
    rating: 4.3,
    reviews: 22,
    harvestedDaysAgo: 5,
    description: "Fresh bottle gourd for healthy cooking and soups.",
  },
  {
    id: "p13",
    name: "Fresh Cucumber",
    nameHi: "ताज़ा खीरा",
    category: "Vegetables",
    image: cucumber,
    price: 36,
    fairPrice: 40,
    unit: "kg",
    quantity: 65,
    farmerId: "f4",
    farmerName: "Lakshmi Bai",
    village: "Sonipat",
    district: "Sonipat",
    state: "Haryana",
    distanceKm: 18,
    rating: 4.6,
    reviews: 18,
    harvestedDaysAgo: 2,
    description: "Cool, crisp cucumbers for salads and raitas.",
  },
  {
    id: "p14",
    name: "Sweet Bananas",
    nameHi: "मीठे केले",
    category: "Fruits",
    image: banana,
    price: 58,
    fairPrice: 62,
    unit: "kg",
    quantity: 140,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.8,
    reviews: 54,
    harvestedDaysAgo: 1,
    description: "Ripe bananas rich in energy and vitamins.",
  },
  {
    id: "p15",
    name: "Red Apples",
    nameHi: "लाल सेव",
    category: "Fruits",
    image: apple,
    price: 180,
    fairPrice: 190,
    unit: "kg",
    quantity: 90,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.7,
    reviews: 41,
    harvestedDaysAgo: 3,
    description: "Crunchy red apples with a sweet-tart flavor.",
  },
  {
    id: "p16",
    name: "Juicy Oranges",
    nameHi: "रसदार संतरे",
    category: "Fruits",
    image: orange,
    price: 120,
    fairPrice: 128,
    unit: "kg",
    quantity: 70,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.6,
    reviews: 36,
    harvestedDaysAgo: 2,
    description: "Sweet and tangy oranges perfect for juice.",
  },
  {
    id: "p17",
    name: "Ripe Papayas",
    nameHi: "पके पपीते",
    category: "Fruits",
    image: papaya,
    price: 90,
    fairPrice: 98,
    unit: "kg",
    quantity: 50,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.6,
    reviews: 29,
    harvestedDaysAgo: 1,
    description: "Sweet papayas with soft orange flesh.",
  },
  {
    id: "p18",
    name: "Fresh Guavas",
    nameHi: "ताज़ी अमरूद",
    category: "Fruits",
    image: guava,
    price: 100,
    fairPrice: 108,
    unit: "kg",
    quantity: 60,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.7,
    reviews: 34,
    harvestedDaysAgo: 1,
    description: "Fragrant guava rich in fiber and vitamin C.",
  },
  {
    id: "p19",
    name: "Seedless Grapes",
    nameHi: "बीज रहित अंगूर",
    category: "Fruits",
    image: grapes,
    price: 260,
    fairPrice: 275,
    unit: "kg",
    quantity: 35,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.8,
    reviews: 49,
    harvestedDaysAgo: 2,
    description: "Sweet and juicy seedless grapes, perfect as a snack.",
  },
  {
    id: "p20",
    name: "Ruby Pomegranates",    nameHi: "गहरे लाल अनार",    category: "Fruits",
    image: pomegranate,
    price: 280,
    fairPrice: 300,
    unit: "kg",
    quantity: 40,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.8,
    reviews: 59,
    harvestedDaysAgo: 3,
    description: "Fresh pomegranates loaded with juicy arils.",
  },
  {
    id: "p21",
    name: "Sweet Pineapple",
    nameHi: "मीठा अनानास",
    category: "Fruits",
    image: pineapple,
    price: 140,
    fairPrice: 150,
    unit: "kg",
    quantity: 25,
    farmerId: "f6",
    farmerName: "Geeta Sharma",
    village: "Ghaziabad Rural",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    distanceKm: 22,
    rating: 4.7,
    reviews: 33,
    harvestedDaysAgo: 2,
    description: "Tropical pineapples with sweet, tangy flavor.",
  },
  {
    id: "p22",
    name: "Yellow Maize",
    category: "Grains",
    image: maize,
    price: 48,
    fairPrice: 52,
    unit: "kg",
    quantity: 180,
    farmerId: "f3",
    farmerName: "Mohan Singh",
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    distanceKm: 15,
    rating: 4.6,
    reviews: 28,
    harvestedDaysAgo: 20,
    description: "Bright yellow maize grains for baking and cooking.",
  },
  {
    id: "p23",
    name: "Pearl Barley",
    category: "Grains",
    image: barley,
    price: 85,
    fairPrice: 90,
    unit: "kg",
    quantity: 120,
    farmerId: "f3",
    farmerName: "Mohan Singh",
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    distanceKm: 15,
    rating: 4.5,
    reviews: 24,
    harvestedDaysAgo: 18,
    description: "Nutritious pearl barley for soups and healthy meals.",
  },
  {
    id: "p24",
    name: "Jowar Millet",
    category: "Grains",
    image: jowar,
    price: 70,
    fairPrice: 76,
    unit: "kg",
    quantity: 130,
    farmerId: "f3",
    farmerName: "Mohan Singh",
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    distanceKm: 15,
    rating: 4.6,
    reviews: 22,
    harvestedDaysAgo: 22,
    description: "Healthy jowar millet for traditional Indian dishes.",
  },
  {
    id: "p25",
    name: "Bajra Millet",
    category: "Grains",
    image: bajra,
    price: 68,
    fairPrice: 73,
    unit: "kg",
    quantity: 110,
    farmerId: "f3",
    farmerName: "Mohan Singh",
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    distanceKm: 15,
    rating: 4.5,
    reviews: 20,
    harvestedDaysAgo: 25,
    description: "Wholesome bajra millet for traditional roti and porridge.",
  },
  {
    id: "p26",
    name: "Ragi Millet",
    category: "Grains",
    image: ragi,
    price: 92,
    fairPrice: 98,
    unit: "kg",
    quantity: 85,
    farmerId: "f3",
    farmerName: "Mohan Singh",
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    distanceKm: 15,
    rating: 4.7,
    reviews: 16,
    harvestedDaysAgo: 28,
    description: "Finger millet (ragi) for nutritious porridge and rotis.",
  },
  {
    id: "p27",
    name: "Whole Oats",
    category: "Grains",
    image: oats,
    price: 120,
    fairPrice: 128,
    unit: "kg",
    quantity: 90,
    farmerId: "f3",
    farmerName: "Mohan Singh",
    village: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    distanceKm: 15,
    rating: 4.6,
    reviews: 18,
    harvestedDaysAgo: 10,
    description: "Whole oats for healthy breakfast meals and baking.",
  },
];

export const productImageMap: Record<string, string> = {
  "vine-ripened tomatoes": tomato,
  "fresh palak (spinach)": spinach,
  "organic carrots": carrot,
  "yellow onions": onion,
  "green chillies": chilli,
  "alphonso mangoes": mango,
  "basmati rice": rice,
  "whole wheat grains": wheat,
  "golden potatoes": potato,
  "fresh cauliflower": cauliflower,
  "crunchy cabbage": cabbage,
  "bottle gourd": bottleGourd,
  "fresh cucumber": cucumber,
  "sweet bananas": banana,
  "red apples": apple,
  "juicy oranges": orange,
  "ripe papayas": papaya,
  "fresh guavas": guava,
  "seedless grapes": grapes,
  "ruby pomegranates": pomegranate,
  "sweet pineapple": pineapple,
  "yellow maize": maize,
  "pearl barley": barley,
  "jowar millet": jowar,
  "bajra millet": bajra,
  "ragi millet": ragi,
  "whole oats": oats,
};

function normalizeProductName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeToken(token: string) {
  return token.replace(/ies$/g, "y").replace(/s$/g, "");
}

export function getExactProductImage(name: string) {
  const normalizedName = normalizeProductName(name);
  if (!normalizedName) return undefined;

  const exactMatch = productImageMap[normalizedName];
  if (exactMatch) return exactMatch;

  const nameTokens = normalizedName.split(" ").map(normalizeToken);
  let bestMatch: { image: string; score: number } | undefined;

  Object.entries(productImageMap).forEach(([key, image]) => {
    const normalizedKey = normalizeProductName(key);
    if (!normalizedKey) return;

    if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
      const score = normalizedKey.length;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { image, score };
      }
      return;
    }

    const keyTokens = normalizedKey.split(" ").map(normalizeToken);
    const commonTokens = keyTokens.filter((token) => nameTokens.includes(token));
    if (commonTokens.length > 0) {
      const score = commonTokens.length + keyTokens.length / 10;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { image, score };
      }
    }
  });

  return bestMatch?.image;
}

export const farmerSubscriptions: FarmerSubscription[] = [
  {
    id: "sub1",
    farmerId: "f1",
    name: "Fresh Vegetables Weekly",
    description: "Get fresh seasonal vegetables delivered weekly from Ramesh Kumar's farm",
    price: 499,
    frequency: "weekly",
    productsIncluded: ["Tomatoes", "Carrots", "Onions", "Fresh Chillies"],
    benefits: ["Free delivery", "Direct from farm", "Verified farmer", "Quality guarantee"],
    duration: 1,
    isActive: true,
  },
  {
    id: "sub2",
    farmerId: "f2",
    name: "Organic Greens Bundle",
    description: "Premium organic spinach and leafy greens subscription from Sunita Devi",
    price: 399,
    frequency: "weekly",
    productsIncluded: ["Fresh Palak", "Fenugreek Leaves", "Seasonal Greens"],
    benefits: ["100% Organic", "Pesticide-free", "Farm-fresh", "Premium quality"],
    duration: 1,
    isActive: true,
  },
  {
    id: "sub3",
    farmerId: "f3",
    name: "Grains & Staples Pack",
    description: "Essential grains and staples delivered bi-weekly from Mohan Singh",
    price: 599,
    frequency: "biweekly",
    productsIncluded: ["Wheat", "Mustard Oil", "Seasonal Vegetables"],
    benefits: ["Bulk discount", "Storage tips", "Verified quality", "Fair pricing"],
    duration: 2,
    isActive: true,
  },
  {
    id: "sub4",
    farmerId: "f4",
    name: "Summer Vegetables Special",
    description: "Specialty summer vegetables weekly from Lakshmi Bai's farm",
    price: 449,
    frequency: "weekly",
    productsIncluded: ["Okra", "Bottle Gourd", "Cucumber", "Bitter Gourd"],
    benefits: ["Fresh harvest", "Low price", "Quality checked", "Free delivery"],
    duration: 1,
    isActive: true,
  },
  {
    id: "sub5",
    farmerId: "f6",
    name: "Fruits & Greens Combo",
    description: "Mix of fresh fruits and leafy greens from Geeta Sharma's farm",
    price: 749,
    frequency: "weekly",
    productsIncluded: ["Guava", "Papaya", "Fresh Greens", "Seasonal Fruits"],
    benefits: ["Nutritious mix", "Health benefits", "Farm-fresh", "Expert selection"],
    duration: 1,
    isActive: true,
  },
];

export const categories = ["All", "Vegetables", "Leafy Greens", "Fruits", "Grains"];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
export function getFarmer(id: string) {
  return farmers.find((f) => f.id === id);
}
export function getSubscription(id: string) {
  return farmerSubscriptions.find((s) => s.id === id);
}
export function getSubscriptionsByFarmer(farmerId: string) {
  return farmerSubscriptions.filter((s) => s.farmerId === farmerId);
}
