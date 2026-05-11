import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const KEY = "krishi_lang";

type Dict = Record<string, { en: string; hi: string }>;

export const dict: Dict = {
  // Top govt strip
  "gov.strip": {
    en: "Government of India · Ministry of Agriculture & Farmers Welfare",
    hi: "भारत सरकार · कृषि एवं किसान कल्याण मंत्रालय",
  },
  "gov.skip": { en: "Skip to main content", hi: "मुख्य सामग्री पर जाएँ" },

  // Brand
  "brand.tagline": {
    en: "Farmer-Consumer Fair Market",
    hi: "कृषक-उपभोक्ता निष्पक्ष बाज़ार",
  },

  // Nav
  "nav.home": { en: "Home", hi: "मुख पृष्ठ" },
  "nav.marketplace": { en: "Marketplace", hi: "बाज़ार" },
  "nav.map": { en: "Nearby Map", hi: "नज़दीकी नक्शा" },
  "nav.prices": { en: "AI Prices", hi: "एआई मूल्य" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.help": { en: "Help & IVR", hi: "सहायता एवं आईवीआर" },
  "nav.signin": { en: "Sign In / Log In", hi: "साइन इन / पंजीकरण" },
  "nav.cart": { en: "Cart", hi: "कार्ट" },
  "nav.logout": { en: "Logout", hi: "लॉग आउट" },

  // Home hero
  "home.badge": { en: "A Digital India Initiative", hi: "एक डिजिटल इंडिया पहल" },
  "home.title.l1": { en: "Fair price for farmers.", hi: "किसानों के लिए उचित मूल्य।" },
  "home.title.l2": {
    en: "Fresh produce for every Indian home.",
    hi: "हर भारतीय घर के लिए ताज़ी उपज।",
  },
  "home.subtitle": {
    en: "KrishiConnect is a transparent farmer-to-consumer marketplace where verified farmers list produce at AI-recommended fair prices — eliminating exploitation and strengthening the agricultural supply chain.",
    hi: "कृषिकनेक्ट एक पारदर्शी किसान-से-उपभोक्ता बाज़ार है जहाँ सत्यापित किसान एआई द्वारा सुझाए गए उचित मूल्यों पर अपनी उपज सूचीबद्ध करते हैं — शोषण समाप्त कर कृषि आपूर्ति शृंखला को सशक्त बनाते हुए।",
  },
  "home.cta.register": { en: "Get Started — Register", hi: "शुरू करें — पंजीकरण" },
  "home.cta.browse": { en: "Browse Marketplace →", hi: "बाज़ार देखें →" },
  "home.tollfree": { en: "Toll Free: 1800-180-1551", hi: "टोल फ्री: 1800-180-1551" },
  "home.verified": { en: "Aadhaar + PM-Kisan verified", hi: "आधार + पीएम-किसान सत्यापित" },
  "home.avgPrice": { en: "Today's avg. fair price", hi: "आज का औसत उचित मूल्य" },
  "home.overMandi": { en: "over local mandi rate", hi: "स्थानीय मंडी दर से अधिक" },
  "home.farmersCount": { en: "8,412 verified farmers", hi: "8,412 सत्यापित किसान" },
  "home.statesCount": { en: "Across 24 states", hi: "24 राज्यों में" },
  "home.welcomeBack": { en: "Welcome Back", hi: "वापसी पर स्वागत है" },
  "home.loginTitle": { en: "Login or register quickly with your mobile number", hi: "अपने मोबाइल नंबर से जल्दी लॉगिन या पंजीकरण करें" },
  "home.loginSubtitle": { en: "Use the same phone number after registration to login instantly with OTP verification.", hi: "पंजीकरण के बाद उसी फोन नंबर का उपयोग OTP सत्यापन के साथ तुरंत लॉगिन करने के लिए करें।" },
  "home.loginButton": { en: "Login with Mobile", hi: "मोबाइल से लॉगिन" },
  "home.registerButton": { en: "Register as Farmer or Consumer", hi: "किसान या उपभोक्ता के रूप में पंजीकरण करें" },
  "home.otpTitle": { en: "Mobile OTP Login", hi: "मोबाइल OTP लॉगिन" },
  "home.otpSubtitle": { en: "One number, one flow", hi: "एक नंबर, एक प्रवाह" },
  "home.otpDescription": { en: "Register once and come back with the same number to access all features.", hi: "एक बार पंजीकरण करें और सभी सुविधाओं तक पहुंचने के लिए उसी नंबर के साथ वापस आएं।" },

  // Stats
  "stats.farmers": { en: "Verified Farmers", hi: "सत्यापित किसान" },
  "stats.payouts": { en: "Direct Farmer Payouts", hi: "प्रत्यक्ष किसान भुगतान" },
  "stats.delivery": { en: "Avg Farm-to-Door", hi: "औसत खेत-से-द्वार" },
  "stats.ivr": { en: "Toll-Free IVR", hi: "टोल-फ्री आईवीआर" },

  // How it works
  "how.kicker": { en: "How It Works", hi: "यह कैसे काम करता है" },
  "how.title": { en: "Transparent. Fair. Built for Bharat.", hi: "पारदर्शी। निष्पक्ष। भारत के लिए।" },
  "how.subtitle": {
    en: "Four pillars that ensure every farmer earns fairly and every consumer eats fresh.",
    hi: "चार स्तंभ जो सुनिश्चित करते हैं कि हर किसान उचित कमाए और हर उपभोक्ता ताज़ा खाए।",
  },
  "how.f1.t": { en: "Verified Farmers", hi: "सत्यापित किसान" },
  "how.f1.d": {
    en: "Aadhaar + PM-Kisan ID + Kisan Credit Card and land record verification.",
    hi: "आधार + पीएम-किसान आईडी + किसान क्रेडिट कार्ड और भूमि अभिलेख सत्यापन।",
  },
  "how.f2.t": { en: "AI Fair Pricing", hi: "एआई उचित मूल्य" },
  "how.f2.d": {
    en: "ML model suggests optimal prices using mandi data, season, and quality.",
    hi: "एमएल मॉडल मंडी डेटा, मौसम और गुणवत्ता का उपयोग कर इष्टतम मूल्य सुझाता है।",
  },
  "how.f3.t": { en: "Doorstep Logistics", hi: "द्वार पर आपूर्ति" },
  "how.f3.d": {
    en: "Delivery agents pick from farms and deliver to buyers within 48 hours.",
    hi: "डिलीवरी एजेंट खेतों से उठाकर 48 घंटों में खरीदारों तक पहुँचाते हैं।",
  },
  "how.f4.t": { en: "Toll-Free IVR", hi: "टोल-फ्री आईवीआर" },
  "how.f4.d": {
    en: "Farmers without smartphones can list and receive orders by phone call.",
    hi: "स्मार्टफोन के बिना किसान फोन कॉल पर उपज सूचीबद्ध कर ऑर्डर प्राप्त कर सकते हैं।",
  },

  // Featured
  "feat.kicker": { en: "Today's Harvest", hi: "आज की उपज" },
  "feat.title": { en: "Fresh from nearby farms", hi: "नज़दीकी खेतों से ताज़ा" },
  "feat.viewAll": { en: "View all produce →", hi: "सभी उपज देखें →" },
  "feat.fair": { en: "Fair", hi: "उचित" },

  // CTA
  "cta.farmer.kicker": { en: "For Farmers", hi: "किसानों के लिए" },
  "cta.farmer.title": { en: "List your harvest. Set your price.", hi: "अपनी उपज सूचीबद्ध करें। अपना मूल्य तय करें।" },
  "cta.farmer.text": {
    en: "Verified farmers get AI-suggested fair prices, doorstep pickup, and direct payments.",
    hi: "सत्यापित किसानों को एआई-सुझाए उचित मूल्य, द्वार पर पिकअप और सीधा भुगतान मिलता है।",
  },
  "cta.farmer.btn": { en: "Register as Farmer →", hi: "किसान के रूप में पंजीकरण →" },
  "cta.consumer.kicker": { en: "For Consumers", hi: "उपभोक्ताओं के लिए" },
  "cta.consumer.title": { en: "Buy fresh, support farmers.", hi: "ताज़ा खरीदें, किसानों का साथ दें।" },
  "cta.consumer.text": {
    en: "Discover produce from nearby farms at fair prices, delivered straight to your door.",
    hi: "नज़दीकी खेतों से उचित मूल्य पर उपज खोजें, सीधे आपके द्वार पर।",
  },
  "cta.consumer.btn": { en: "Register as Consumer →", hi: "उपभोक्ता के रूप में पंजीकरण →" },

  // Footer
  "footer.about": {
    en: "A digital initiative to ensure fair pricing for farmers and fresh produce for consumers across India.",
    hi: "किसानों के लिए उचित मूल्य और पूरे भारत में उपभोक्ताओं के लिए ताज़ी उपज सुनिश्चित करने हेतु डिजिटल पहल।",
  },
  "footer.quick": { en: "Quick Links", hi: "त्वरित लिंक" },
  "footer.forFarmers": { en: "For Farmers", hi: "किसानों के लिए" },
  "footer.contact": { en: "Contact", hi: "संपर्क" },
  "footer.register": { en: "Register", hi: "पंजीकरण" },
  "footer.copyright": {
    en: "Designed, Developed and Hosted by NIC",
    hi: "एनआईसी द्वारा डिज़ाइन, विकसित और होस्ट किया गया",
  },
  "footer.lastUpdated": { en: "Last updated", hi: "अंतिम अद्यतन" },

  // Role page
  "role.step": { en: "Step 1 of 2", hi: "चरण 1 / 2" },
  "role.title": { en: "How would you like to join?", hi: "आप किस रूप में जुड़ना चाहेंगे?" },
  "role.subtitle": {
    en: "Select your role to continue with secure verification and registration.",
    hi: "सुरक्षित सत्यापन और पंजीकरण के लिए अपनी भूमिका चुनें।",
  },
  "role.farmer.title": { en: "I am a Farmer", hi: "मैं एक किसान हूँ" },
  "role.farmer.text": {
    en: "List your produce, get AI-suggested fair prices, and receive direct orders from consumers and retailers.",
    hi: "अपनी उपज सूचीबद्ध करें, एआई-सुझाए उचित मूल्य पाएँ और उपभोक्ताओं व खुदरा विक्रेताओं से सीधे ऑर्डर पाएँ।",
  },
  "role.farmer.cta": { en: "Continue as Farmer →", hi: "किसान के रूप में आगे बढ़ें →" },
  "role.consumer.title": { en: "I am a Consumer / Buyer", hi: "मैं एक उपभोक्ता / खरीदार हूँ" },
  "role.consumer.text": {
    en: "Discover fresh produce from nearby verified farmers at transparent fair prices.",
    hi: "नज़दीकी सत्यापित किसानों से पारदर्शी उचित मूल्यों पर ताज़ी उपज खोजें।",
  },
  "role.consumer.cta": { en: "Continue as Consumer →", hi: "उपभोक्ता के रूप में आगे बढ़ें →" },

  // About
  "about.kicker": { en: "About KrishiConnect", hi: "कृषिकनेक्ट के बारे में" },
  "about.title": {
    en: "Building a fair, transparent agricultural ecosystem for India.",
    hi: "भारत के लिए एक निष्पक्ष, पारदर्शी कृषि पारिस्थितिकी तंत्र का निर्माण।",
  },
  "about.intro": {
    en: "KrishiConnect is a digital initiative to ensure that every farmer earns a fair price and every Indian household has access to fresh, traceable produce — without exploitation by intermediaries.",
    hi: "कृषिकनेक्ट एक डिजिटल पहल है ताकि हर किसान को उचित मूल्य मिले और हर भारतीय परिवार को ताज़ी, ट्रेस-योग्य उपज मिले — बिचौलियों के शोषण के बिना।",
  },
  "about.mission": { en: "Our Mission", hi: "हमारा मिशन" },
  "about.missionText": {
    en: "To create a scalable, inclusive marketplace that connects verified farmers with consumers, retailers, and vendors at fair, AI-recommended prices. We do not aim to completely remove middlemen — we eliminate exploitation by enforcing transparency, traceability, and accountability.",
    hi: "एक मापनीय, समावेशी बाज़ार बनाना जो सत्यापित किसानों को उपभोक्ताओं, खुदरा विक्रेताओं और विक्रेताओं से एआई-सुझाए उचित मूल्यों पर जोड़े। हमारा उद्देश्य बिचौलियों को पूरी तरह हटाना नहीं — हम पारदर्शिता, ट्रेसबिलिटी और जवाबदेही लागू कर शोषण समाप्त करते हैं।",
  },
  "about.vision": { en: "Our Vision", hi: "हमारा दृष्टिकोण" },
  "about.visionText": {
    en: "An agricultural supply chain where farmer welfare and consumer trust go hand in hand — powered by technology that works equally well in cities and remote villages.",
    hi: "एक कृषि आपूर्ति शृंखला जहाँ किसान कल्याण और उपभोक्ता विश्वास साथ-साथ चलें — उस तकनीक से सशक्त जो शहरों और दूरदराज़ गाँवों में समान रूप से कार्य करे।",
  },

  // Price Intelligence
  "price.title": { en: "AI Price Intelligence — KrishiConnect", hi: "एआई मूल्य खुफिया — कृषिकनेक्ट" },
  "price.desc": {
    en: "Live mandi prices, AI machine-learning forecasts, and stock-market style trend charts for Indian agricultural produce.",
    hi: "भारतीय कृषि उपज के लिए लाइव मंडी मूल्य, एआई मशीन लर्निंग पूर्वानुमान, और स्टॉक मार्केट स्टाइल ट्रेंड चार्ट।",
  },
  "price.badge": { en: "AI Price Intelligence", hi: "एआई मूल्य खुफिया" },
  "price.mainTitle": { en: "Mandi Market Terminal", hi: "मंडी बाज़ार टर्मिनल" },
  "price.subtitle": {
    en: "Machine-learning powered forecasts based on AGMARKNET, eNAM and regional mandi feeds.",
    hi: "एजीमार्कनेट, ईएनएएम और क्षेत्रीय मंडी फीड पर आधारित मशीन लर्निंग पावर्ड पूर्वानुमान।",
  },
  "price.marketSentiment": { en: "Market Sentiment", hi: "बाज़ार भावना" },
  "price.avgChange": { en: "Avg Change", hi: "औसत परिवर्तन" },
  "price.live": { en: "Live", hi: "लाइव" },
  "price.actualPrice": { en: "Actual price", hi: "वास्तविक मूल्य" },
  "price.aiForecast": { en: "AI 7-day forecast", hi: "एआई 7-दिन पूर्वानुमान" },
  "price.aiForecastShort": { en: "AI Forecast", hi: "एआई पूर्वानुमान" },
  "price.mlRecommendation": { en: "ML Recommendation", hi: "एमएल सिफारिश" },
  "price.buy": { en: "BUY", hi: "खरीदें" },
  "price.sell": { en: "SELL", hi: "बेचें" },
  "price.hold": { en: "HOLD", hi: "रखें" },
  "price.dayTarget": { en: "7-day target", hi: "7-दिन लक्ष्य" },
  "price.confidence": { en: "Confidence", hi: "विश्वास" },
  "price.modelDesc": {
    en: "Model: LSTM-Mandi-v3 trained on 5-year AGMARKNET history, weather indices, fuel costs and regional supply data.",
    hi: "मॉडल: एलएसटीएम-मंडी-v3 5-वर्ष के एजीमार्कनेट इतिहास, मौसम सूचकांक, ईंधन लागत और क्षेत्रीय आपूर्ति डेटा पर प्रशिक्षित।",
  },
  "price.pricesRising": {
    en: "Prices likely to rise — farmers may delay harvest sale; consumers should buy now.",
    hi: "मूल्य बढ़ने की संभावना — किसान फसल बिक्री में देरी कर सकते हैं; उपभोक्ताओं को अभी खरीदना चाहिए।",
  },
  "price.pricesFalling": {
    en: "Prices likely to fall — farmers should sell soon; consumers can wait.",
    hi: "मूल्य गिरने की संभावना — किसानों को जल्द बेचना चाहिए; उपभोक्ता इंतजार कर सकते हैं।",
  },
  "price.pricesStable": {
    en: "Prices stable — fair window for both buyers and sellers.",
    hi: "मूल्य स्थिर — खरीदारों और विक्रेताओं दोनों के लिए उचित अवसर।",
  },
  "price.topRecommendedFarmers": { en: "Top Recommended Farmers", hi: "शीर्ष अनुशंसित किसान" },
  "price.topFarmersCommodity": { en: "Top farmers matching the selected commodity", hi: "चयनित वस्तु से मेल खाने वाले शीर्ष किसान" },
  "price.promotedFarmers": { en: "All farmers currently running promotion plans", hi: "सभी किसान जो वर्तमान में प्रचार योजनाएँ चला रहे हैं" },
  "price.mlRanked": { en: "ML RANKED", hi: "एमएल रैंक" },
  "price.promoted": { en: "PROMOTED", hi: "प्रचारित" },
  "price.fairness": { en: "Fairness", hi: "निष्पक्षता" },
  "price.view": { en: "View", hi: "देखें" },
  "price.farmerDetails": { en: "Farmer details", hi: "किसान विवरण" },
  "price.verification": { en: "Verification", hi: "सत्यापन" },
  "price.pmKisanVerified": { en: "PM-Kisan verified", hi: "पीएम-किसान सत्यापित" },
  "price.kisanCreditVerified": { en: "Kisan Credit Card verified", hi: "किसान क्रेडिट कार्ड सत्यापित" },
  "price.productsPrices": { en: "Products & prices", hi: "उत्पाद और मूल्य" },
  "price.noProducts": { en: "This farmer is not currently listing any products.", hi: "यह किसान वर्तमान में कोई उत्पाद सूचीबद्ध नहीं कर रहा है।" },
  "price.selectFarmer": { en: "Select a farmer from the list above to view verification status and product prices.", hi: "सत्यापन स्थिति और उत्पाद मूल्य देखने के लिए ऊपर दी गई सूची से एक किसान चुनें।" },
  "price.farmerQuestion": { en: "Are you a farmer?", hi: "क्या आप एक किसान हैं?" },
  "price.getFeatured": { en: "Get featured here.", hi: "यहाँ विशेष रुप से दिखें।" },
  "price.boostListings": { en: "Boost your listings →", hi: "अपनी लिस्टिंग बढ़ाएँ →" },
  "price.dataIndicative": { en: "Data shown is indicative and combines mandi feeds with model-based estimates.", hi: "दिखाए गए डेटा संकेतात्मक हैं और मंडी फीड को मॉडल-आधारित अनुमानों के साथ जोड़ते हैं।" },
  "price.actualRatesVary": { en: "Actual rates may vary by grade, season, and location.", hi: "वास्तविक दरें ग्रेड, मौसम और स्थान के अनुसार भिन्न हो सकती हैं।" },
  "price.krishiConnectUses": { en: "KrishiConnect uses these signals to recommend fair prices — farmers always retain the right to set their own price.", hi: "कृषिकनेक्ट उचित मूल्य की सिफारिश करने के लिए इन संकेतों का उपयोग करता है — किसानों को हमेशा अपना मूल्य निर्धारित करने का अधिकार होता है।" },
  "price.goToMarketplace": { en: "Go to Marketplace →", hi: "बाज़ार पर जाएँ →" },
  "price.availableProduce": { en: "Available Produce", hi: "उपलब्ध उपज" },
  "price.loading": { en: "Loading price intelligence data…", hi: "मूल्य खुफिया डेटा लोड हो रहा है…" },
  "price.noFarmersListing": { en: "No farmers currently listing this commodity. Try selecting a different product.", hi: "कोई किसान वर्तमान में इस वस्तु को सूचीबद्ध नहीं कर रहा है। एक अलग उत्पाद चुनने का प्रयास करें।" },
  "price.recommendedFarmers": { en: "Recommended Farmers", hi: "अनुशंसित किसान" },
  "price.subscriptionPlans": { en: "Farmers offering subscription plans · get fresh produce delivered", hi: "सदस्यता योजनाएँ प्रदान करने वाले किसान · ताज़ी उपज घर तक पहुँचाएँ" },
  "price.specialties": { en: "Specialties", hi: "विशेषज्ञताएँ" },
  "price.listing": { en: "Listing", hi: "सूचीकरण" },
  "category.all": { en: "All", hi: "सभी" },
  "category.vegetables": { en: "Vegetables", hi: "सब्जियाँ" },
  "category.fruits": { en: "Fruits", hi: "फल" },
  "category.grains": { en: "Grains", hi: "अनाज" },
  "category.leafyGreens": { en: "Leafy Greens", hi: "पत्तेदार सब्ज़ियाँ" },

  // Marketplace
  "market.title": { en: "Marketplace — KrishiConnect", hi: "बाज़ार — कृषिकनेक्ट" },
  "market.desc": { en: "Browse fresh produce from verified Indian farmers at fair prices.", hi: "उचित मूल्यों पर सत्यापित भारतीय किसानों से ताज़ी उपज ब्राउज़ करें।" },
  "market.badge": { en: "Fresh Marketplace", hi: "ताज़ा बाज़ार" },
  "market.mainTitle": { en: "Produce from nearby verified farms", hi: "नज़दीकी सत्यापित खेतों से उपज" },
  "market.subtitle": { en: "Sorted by location · Direct from farmer · Fair AI-suggested pricing", hi: "स्थान के अनुसार क्रमबद्ध · सीधे किसान से · उचित एआई-सुझाए मूल्य" },
  "market.searchPlaceholder": { en: "Search produce or farmer", hi: "उपज या किसान खोजें" },
  "market.sortNearest": { en: "Sort: Nearest", hi: "क्रमबद्ध: निकटतम" },
  "market.sortPrice": { en: "Sort: Lowest price", hi: "क्रमबद्ध: सबसे कम मूल्य" },
  "market.sortRating": { en: "Sort: Top rated", hi: "क्रमबद्ध: उच्च रेटेड" },
  "market.reviews": { en: "reviews", hi: "समीक्षाएँ" },
  "market.aiFairPrice": { en: "AI fair price", hi: "एआई उचित मूल्य" },
  "market.add": { en: "Add", hi: "जोड़ें" },
  "market.noMatches": { en: "No produce matches.", hi: "कोई उपज मेल नहीं खाती।" },
  "market.apiError": { en: "Unable to reach the marketplace API. Showing offline listings instead.", hi: "बाज़ार एपीआई तक पहुँचने में असमर्थ। इसके बजाय ऑफलाइन लिस्टिंग दिखा रहा है।" },

  // Cart
  "cart.title": { en: "Cart — KrishiConnect", hi: "कार्ट — कृषिकनेक्ट" },
  "cart.mainTitle": { en: "Your Cart", hi: "आपका कार्ट" },
  "cart.empty": { en: "Your cart is empty.", hi: "आपका कार्ट खाली है।" },
  "cart.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "cart.browseMarketplace": { en: "Browse Marketplace →", hi: "बाज़ार ब्राउज़ करें →" },
  "cart.deliveryDetails": { en: "Delivery Details", hi: "डिलीवरी विवरण" },
  "cart.yourName": { en: "Your name", hi: "आपका नाम" },
  "cart.deliveryAddress": { en: "Delivery address", hi: "डिलीवरी पता" },
  "cart.subtotal": { en: "Subtotal", hi: "उप-योग" },
  "cart.delivery": { en: "Delivery", hi: "डिलीवरी" },
  "cart.total": { en: "Total", hi: "कुल" },
  "cart.placeOrder": { en: "Place Order & Pay →", hi: "ऑर्डर दें और भुगतान करें →" },
  "cart.placingOrder": { en: "Placing your order…", hi: "आपका ऑर्डर रखा जा रहा है…" },
  "cart.paymentMethods": { en: "COD · UPI · Cards accepted on delivery", hi: "सीओडी · यूपीआई · डिलीवरी पर कार्ड स्वीकार किए जाते हैं" },
  "cart.loginRequired": { en: "Please register or login before placing an order.", hi: "ऑर्डर देने से पहले कृपया रजिस्टर या लॉगिन करें।" },
  "cart.nameRequired": { en: "Please enter your name", hi: "कृपया अपना नाम दर्ज करें" },
  "cart.addressRequired": { en: "Please enter delivery address", hi: "कृपया डिलीवरी पता दर्ज करें" },
  "cart.cartEmpty": { en: "Your cart is empty.", hi: "आपका कार्ट खाली है।" },
  "cart.orderError": { en: "Could not place your order.", hi: "आपका ऑर्डर नहीं रखा जा सका।" },

  // Orders
  "orders.title": { en: "My Orders — KrishiConnect", hi: "मेरे ऑर्डर — कृषिकनेक्ट" },
  "orders.mainTitle": { en: "My Orders", hi: "मेरे ऑर्डर" },
  "orders.noOrders": { en: "You haven't placed any orders yet.", hi: "आपने अभी तक कोई ऑर्डर नहीं दिया है।" },
  "orders.loading": { en: "Loading…", hi: "लोड हो रहा है…" },
  "orders.orderId": { en: "Order ID", hi: "ऑर्डर आईडी" },
  "orders.placed": { en: "Placed", hi: "दिया गया" },
  "orders.total": { en: "Total", hi: "कुल" },
  "orders.itemsFrom": { en: "item(s) · From", hi: "आइटम · से" },
  "orders.paid": { en: "Paid", hi: "भुगतान किया" },
  "orders.paymentPending": { en: "Payment Pending", hi: "भुगतान लंबित" },
  "orders.trackOrder": { en: "Track Order →", hi: "ऑर्डर ट्रैक करें →" },
  "orders.payNow": { en: "Pay Now →", hi: "अभी भुगतान करें →" },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Lang | null;
      if (saved === "en" || saved === "hi") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "hi" ? "hi" : "en";
    }
  };

  const t = (k: string) => {
    const entry = dict[k];
    if (!entry) return k;
    return entry[lang] ?? entry.en;
  };

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useT() {
  return useContext(LangCtx);
}
