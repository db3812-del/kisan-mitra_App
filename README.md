# 🌾 किसान मित्र — KisanMitra

> AI-powered smart farming assistant for farmers in **Madhya Pradesh** — Indore, Khargone & Khandwa districts.

![PWA](https://img.shields.io/badge/PWA-installable-green) ![Hindi](https://img.shields.io/badge/language-Hindi-orange) ![AI](https://img.shields.io/badge/AI-Claude%20Sonnet-blue) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📱 What is KisanMitra?

KisanMitra is a **Progressive Web App (PWA)** — meaning farmers can install it directly from a browser link onto their Android or iPhone home screen, with no app store required. It works on low-end Android phones and has offline support for core features.

Built specifically for the **Indore–Khargone–Khandwa agricultural belt** of Madhya Pradesh, with a focus on black cotton soil (regur), local crop varieties, and regional mandi prices.

---

## ✨ Features

### 📸 AI Photo Analysis (3 types)
| Photo Type | What AI Detects |
|---|---|
| 🌿 Crop / Leaf / Fruit | Disease, pest damage, nutrient deficiency |
| 🌱 Soil surface / pit | Soil type, health indicators, salinity, compaction |
| 📄 Soil Health Card / Lab Report | OCR extracts NPK & micronutrient values |

All results in **Hindi**, with severity rating: सामान्य / चिंताजनक / गंभीर

### 🌾 Crops Covered
**Kharif:** Soybean, Cotton, Maize, Urad, Moong, Jowar, Paddy  
**Rabi:** Wheat, Gram, Mustard, Linseed, Garlic, Onion  
**Vegetables:** Tomato, Brinjal, Okra, Cauliflower, Spinach, Coriander, **Chilli** (dedicated focus), Cucumber, Bottle Gourd, **Carrot**  
**Fruits:** Banana, Papaya, Mango, Guava, Pomegranate, Lemon, Watermelon, Muskmelon, Chikoo, Amla

### ☁️ Weather Intelligence
- 7-day hyperlocal forecast (Indore/Khargone/Khandwa district level)
- **Monsoon tracker** — cumulative vs normal rainfall
- Crop-specific weather warnings (heat stress, waterlogging, frost, wind)
- Spray timing alerts based on wind speed and humidity

### 🐛 Pest & Insect Intelligence
- Season-wise pest alerts for MP crops
- Risk levels: High / Medium / Low
- AI-powered pest advice on demand
- IPM (Integrated Pest Management) guidance — biological + chemical

### 💰 Mandi Prices
- Live-style prices for Indore, Khargone, Khandwa mandis
- AI mandi advice — "sell now or wait?"
- Price trends and MSP updates

### 🧪 Soil Health Dashboard
- NPK meter, pH, Zinc, Sulfur, Boron indicators
- Recommendations per bigha (local land unit)
- Organic improvement plans (jeevamrit, vermicompost)

### 📔 Farm Diary
- Log crops sown, area (bigha), input costs
- Season profit/loss summary
- Crop rotation recommendations

### 🏛️ Government Schemes
- PM-KISAN, Fasal Bima Yojana, CM Kisan Kalyan
- KVK (Krishi Vigyan Kendra) contact details
- Kisan Call Centre: 1800-180-1551

### 👨‍🌾 Community Feed
- Farmer-to-farmer posts with AI-moderated tagging
- AI advice on community questions
- Photo sharing

### 🎤 Voice Input
- Speak queries in Hindi — AI responds in Hindi
- Uses browser Speech Recognition API

---

## 🎨 Design: Sunlight Optimized

The app uses a custom **sunlight-optimized color system** built for outdoor use in bright MP field conditions:

- **Dark soil-toned backgrounds** — no glare from direct sunlight
- **Deep amber (`#F5A500`) primary** — maximum visibility at high lux
- **All text 700–900 font weight** — readable without squinting
- **2px solid borders** — visible even in harsh light (hairlines disappear outdoors)
- **52px minimum touch targets** — works with sweaty or gloved fingers
- **Zero pastels** — all colors at 600–900 stop intensity

---

## 🗂️ File Structure

```
kisanmitra/
├── index.html          # Main app shell (PWA entry point)
├── app.js              # All JavaScript — navigation, AI calls, data
├── app.css             # Base styles
├── app-sunlight.css    # ✅ Sunlight-optimized styles (use this one)
├── manifest.json       # PWA manifest — app name, icons, theme
├── sw.js               # Service Worker — offline caching
└── icons/
    ├── icon-192.png    # Home screen icon (Android)
    └── icon-512.png    # Splash screen icon
```

---

## 🚀 Deployment

### Option 1 — Netlify Drop (Easiest, Free, 2 minutes)
1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag and drop the `kisanmitra` **folder** (not the zip)
3. Get a live URL like `https://kisanmitra-abc123.netlify.app`
4. Open that URL on your phone → tap **"Add to Home Screen"**

### Option 2 — GitHub Pages (Free, from this repo)
1. Go to your repo **Settings → Pages**
2. Set Source: **Deploy from branch → main → / (root)**
3. Save — your app will be live at `https://yourusername.github.io/kisanmitra`
4. Open on phone → install as PWA

### Option 3 — Any Web Hosting
Upload all files to any hosting (Hostinger, cPanel, etc.) and visit the URL on your phone.

> ⚠️ **Must be served over HTTPS** for PWA install and camera/mic to work.

---

## 📲 Installing on Phone

### Android
1. Open the app URL in **Chrome**
2. Tap the **⋮ menu → "Add to Home Screen"**
3. Or wait for the automatic install banner

### iPhone (iOS)
1. Open the app URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button → "Add to Home Screen"**

---

## 🤖 AI Integration

This app uses the **Anthropic Claude API** (`claude-sonnet-4-20250514`) for:
- Crop/leaf/soil/report photo analysis
- Pest identification and control advice
- Mandi price recommendations
- Soil health guidance
- Weather-based farming advice
- Voice query responses
- Community post AI advice

### API Key Setup
The app currently calls `https://api.anthropic.com/v1/messages` directly from the browser. For production use, you should proxy this through a backend to protect your API key:

```
Browser → Your Backend Server → Anthropic API
```

For a quick personal/demo setup, the key can be embedded — but for a public app serving many farmers, set up a simple Node.js or Python proxy.

---

## 🌐 Offline Support

The Service Worker (`sw.js`) caches:
- All app files (HTML, CSS, JS, icons)
- Google Fonts

Features that work offline:
- Pest library browsing
- Soil health dashboard (last loaded data)
- Farm diary viewing
- Mandi prices (last loaded)

Features requiring internet:
- AI photo analysis
- AI chat queries
- Live weather data
- Real mandi prices

---

## 🔧 Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/kisanmitra.git
cd kisanmitra

# Serve locally (PWA needs a server, not file://)
npx serve .
# or
python3 -m http.server 8080

# Open http://localhost:8080
```

> Note: Camera and mic features require HTTPS in production. For local dev, `localhost` is treated as secure.

---

## 🗺️ Roadmap

- [ ] Real weather API integration (IMD India / OpenWeatherMap)
- [ ] Live Agmarknet mandi price API
- [ ] Backend API proxy for secure Claude API calls
- [ ] Actual image upload to Claude Vision for photo analysis
- [ ] User accounts and farm profile persistence
- [ ] Push notifications for weather alerts
- [ ] Multi-language support (Marathi, Gujarati)
- [ ] KVK expert live chat integration
- [ ] Soil test lab finder (nearest lab map)
- [ ] Offline AI using smaller on-device model

---

## 📍 Target Region

| District | Focus Area |
|---|---|
| Indore | Malwa plateau, mixed crops, major mandi |
| Khargone | Nimar region, chilli capital of MP, banana belt |
| Khandwa | Narmada valley, cotton + soybean zone |

Soil type: **Black cotton soil (Vertisol / Regur)** — high clay content, self-mulching, zinc-deficient

---

## 🙏 Credits

Built for the farmers of Madhya Pradesh.  
AI powered by [Anthropic Claude](https://anthropic.com).  
Fonts: Noto Sans Devanagari, Baloo 2 (Google Fonts).

---

## 📄 License

MIT License — free to use, modify, and distribute.
