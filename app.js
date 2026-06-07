'use strict';

// ── API KEYS — replace these with your actual keys ───────────────────────
const GROQ_KEY    = 'YOUR_GROQ_KEY_HERE';
const OWM_KEY     = 'YOUR_OPENWEATHERMAP_KEY_HERE';
const GEMINI_KEY  = 'YOUR_GEMINI_KEY_HERE';

// ── ALL 52 MP DISTRICTS ───────────────────────────────────────────────────────
const MP_DISTRICTS = [
  {n:'इंदौर',lat:22.7196,lon:75.8577,zone:'मालवा'},
  {n:'खरगोन',lat:21.8234,lon:75.6128,zone:'निमाड़'},
  {n:'खंडवा',lat:21.8285,lon:76.3521,zone:'निमाड़'},
  {n:'भोपाल',lat:23.2599,lon:77.4126,zone:'मध्य'},
  {n:'जबलपुर',lat:23.1815,lon:79.9864,zone:'महाकौशल'},
  {n:'ग्वालियर',lat:26.2183,lon:78.1828,zone:'चंबल'},
  {n:'उज्जैन',lat:23.1765,lon:75.7885,zone:'मालवा'},
  {n:'सागर',lat:23.8388,lon:78.7378,zone:'बुंदेलखंड'},
  {n:'रतलाम',lat:23.3315,lon:75.0367,zone:'मालवा'},
  {n:'देवास',lat:22.9623,lon:76.0499,zone:'मालवा'},
  {n:'धार',lat:22.5982,lon:75.2999,zone:'मालवा'},
  {n:'झाबुआ',lat:22.7658,lon:74.5995,zone:'मालवा'},
  {n:'मंदसौर',lat:24.0765,lon:75.0688,zone:'मालवा'},
  {n:'नीमच',lat:24.4685,lon:74.8712,zone:'मालवा'},
  {n:'शाजापुर',lat:23.4265,lon:76.2770,zone:'मालवा'},
  {n:'राजगढ़',lat:23.8391,lon:76.7307,zone:'मालवा'},
  {n:'आगर मालवा',lat:23.7123,lon:76.0182,zone:'मालवा'},
  {n:'बड़वानी',lat:21.9325,lon:74.9086,zone:'निमाड़'},
  {n:'बुरहानपुर',lat:21.3086,lon:76.2291,zone:'निमाड़'},
  {n:'अलीराजपुर',lat:22.1868,lon:74.1174,zone:'निमाड़'},
  {n:'विदिशा',lat:23.5249,lon:77.8153,zone:'मध्य'},
  {n:'रायसेन',lat:23.3326,lon:77.7846,zone:'मध्य'},
  {n:'सीहोर',lat:23.2038,lon:77.0843,zone:'मध्य'},
  {n:'होशंगाबाद',lat:22.7520,lon:77.7273,zone:'मध्य'},
  {n:'बैतूल',lat:21.9196,lon:77.5941,zone:'मध्य'},
  {n:'हरदा',lat:22.3329,lon:77.0899,zone:'मध्य'},
  {n:'छिंदवाड़ा',lat:22.0576,lon:78.9378,zone:'महाकौशल'},
  {n:'नरसिंहपुर',lat:22.9493,lon:79.1943,zone:'महाकौशल'},
  {n:'सिवनी',lat:22.0839,lon:79.5584,zone:'महाकौशल'},
  {n:'बालाघाट',lat:21.8136,lon:80.1872,zone:'महाकौशल'},
  {n:'मंडला',lat:22.5979,lon:80.3745,zone:'महाकौशल'},
  {n:'डिंडौरी',lat:22.9435,lon:81.0715,zone:'महाकौशल'},
  {n:'कटनी',lat:23.8337,lon:80.3936,zone:'महाकौशल'},
  {n:'उमरिया',lat:23.5244,lon:80.8375,zone:'महाकौशल'},
  {n:'शहडोल',lat:23.2894,lon:81.3524,zone:'विंध्य'},
  {n:'अनूपुर',lat:23.1069,lon:81.6850,zone:'विंध्य'},
  {n:'रीवा',lat:24.5362,lon:81.3036,zone:'विंध्य'},
  {n:'सतना',lat:24.5773,lon:80.8322,zone:'विंध्य'},
  {n:'सीधी',lat:24.4197,lon:81.8789,zone:'विंध्य'},
  {n:'सिंगरौली',lat:24.1994,lon:82.6688,zone:'विंध्य'},
  {n:'पन्ना',lat:24.7181,lon:80.1854,zone:'बुंदेलखंड'},
  {n:'छतरपुर',lat:24.9118,lon:79.5939,zone:'बुंदेलखंड'},
  {n:'टीकमगढ़',lat:24.7430,lon:78.8313,zone:'बुंदेलखंड'},
  {n:'दमोह',lat:23.8327,lon:79.4397,zone:'बुंदेलखंड'},
  {n:'निवाड़ी',lat:25.0166,lon:78.7724,zone:'बुंदेलखंड'},
  {n:'मुरैना',lat:26.4966,lon:77.9969,zone:'चंबल'},
  {n:'भिंड',lat:26.5647,lon:78.7897,zone:'चंबल'},
  {n:'दतिया',lat:25.6648,lon:78.4609,zone:'चंबल'},
  {n:'श्योपुर',lat:25.6633,lon:76.7009,zone:'चंबल'},
  {n:'अशोकनगर',lat:24.5752,lon:77.7278,zone:'चंबल'},
  {n:'गुना',lat:24.6542,lon:77.3152,zone:'चंबल'},
  {n:'शिवपुरी',lat:25.4256,lon:77.6601,zone:'चंबल'},
];

const CROPS = ['सोयाबीन','गेहूं','कपास','मिर्च','प्याज','लहसुन','धनिया','टमाटर',
  'गाजर','भिंडी','केला','पपीता','आम','अमरूद','अनार','मक्का','चना','तरबूज',
  'नींबू','बैंगन','फूलगोभी','पालक','खीरा','मूंग','उड़द','अरहर','सरसों','मूंगफली'];

const PESTS = [
  {e:'🦗',n:'गर्डल बीटल',crop:'सोयाबीन',months:[6,7,8],risk:'high',
   short:'तना काटकर नुकसान',
   detail:'गर्डल बीटल सोयाबीन का सबसे खतरनाक कीट है। मादा तने पर दो गोल निशान बनाकर अंडे देती है और तने को काट देती है।\n\n**पहचान:** तने पर दो गोल छल्ले, ऊपरी भाग सूखा\n**नुकसान:** 20-80% उपज हानि\n**रासायनिक:** Chlorpyriphos 20EC @ 1.5ml/लीटर या Triazophos 40EC @ 2ml/लीटर\n**जैविक:** नीम तेल 5ml+साबुन 1ml/लीटर, सुबह छिड़काव\n**बचाव:** जुलाई पहले हफ्ते निवारक छिड़काव करें'},
  {e:'🐛',n:'हेलिकोवर्पा बोरर',crop:'कपास, मिर्च, टमाटर, चना',months:[1,2,3,4,5,6,7,8,9,10,11,12],risk:'high',
   short:'फल में छेद',
   detail:'हेलिकोवर्पा सुंडी फल, फली और डोडे में घुसकर खाती है।\n\n**पहचान:** फल पर गोल छेद, अंदर हरी-भूरी सुंडी\n**रासायनिक:** Spinosad 45SC @ 0.3ml/लीटर या Emamectin 5SG @ 0.4g/लीटर\n**जैविक:** HaNPV वायरस 250LE/हेक्टेयर, शाम छिड़काव\n**ट्रैप:** फेरोमोन ट्रैप 5/एकड़\n**बचाव:** अंडों के लिए पत्तियां जांचते रहें'},
  {e:'🦟',n:'थ्रिप्स',crop:'मिर्च, प्याज, कपास',months:[10,11,12,1,2,3],risk:'high',
   short:'पत्तियां मुड़ती हैं',
   detail:'थ्रिप्स पत्तियों का रस चूसते हैं और लीफ कर्ल वायरस फैलाते हैं।\n\n**पहचान:** पत्तियां ऊपर मुड़ती हैं, नीचे चांदी जैसा रंग\n**रासायनिक:** Spinosad 45SC @ 0.3ml/लीटर या Imidacloprid @ 0.5ml/लीटर\n**जैविक:** नीम तेल 5ml+साबुन 1ml/लीटर\n**ट्रैप:** नीली/पीली स्टिकी ट्रैप 10/एकड़\n**सावधानी:** एक दवा बार-बार न डालें'},
  {e:'🦎',n:'सफेद मक्खी',crop:'कपास, मिर्च, टमाटर',months:[7,8,9,10,11],risk:'high',
   short:'वायरस फैलाती है',
   detail:'सफेद मक्खी लीफ कर्ल वायरस की सबसे बड़ी वाहक है।\n\n**पहचान:** पत्ती हिलाने पर सफेद मक्खियां उड़ती हैं\n**रासायनिक:** Thiamethoxam 25WG @ 0.5g/लीटर या Spiromesifen @ 1ml/लीटर\n**जैविक:** नीम तेल 5ml+साबुन 2ml/लीटर\n**ट्रैप:** पीली स्टिकी ट्रैप 10/एकड़\n**जरूरी:** प्रभावित पौधे तुरंत हटाएं'},
  {e:'🐜',n:'माहू (अफीड)',crop:'सरसों, गेहूं, धनिया',months:[11,12,1,2],risk:'med',
   short:'रस चूसता है',
   detail:'माहू ठंड में तेजी से फैलता है। रस चूसता है और मधुरस छोड़ता है।\n\n**पहचान:** छोटे हरे-काले कीट पत्तियों के नीचे\n**रासायनिक:** Dimethoate 30EC @ 1.5ml/लीटर\n**जैविक:** नीम तेल, लहसुन-मिर्च अर्क\n**प्राकृतिक दुश्मन:** लेडी बर्ड बीटल बचाएं\n**बचाव:** नाइट्रोजन कम डालें'},
  {e:'🐞',n:'लाल मकड़ी',crop:'सोयाबीन, कपास',months:[6,7,8,9],risk:'med',
   short:'पत्ती कांसे जैसी',
   detail:'लाल मकड़ी गर्म-सूखे मौसम में तेजी से फैलती है।\n\n**पहचान:** पत्ती कांसा-भूरी, नीचे महीन जाला\n**रासायनिक:** Abamectin 1.9EC @ 0.5ml/लीटर (acaricide चाहिए)\n**जैविक:** नीम तेल 10ml/लीटर\n**बचाव:** पत्तियों पर पानी छिड़कें, नमी बनाएं'},
  {e:'🦋',n:'पत्ती सुरंग कीट',crop:'टमाटर, भिंडी, गाजर',months:[10,11,12,1,2,3],risk:'low',
   short:'पत्तियों में सुरंग',
   detail:'सुंडियां पत्तियों के अंदर सुरंग बनाकर हरा भाग खाती हैं।\n\n**पहचान:** पत्तियों पर सफेद टेढ़ी लकीरें\n**रासायनिक:** Cyromazine 75WP @ 1.5g/लीटर\n**जैविक:** नीम तेल 5ml/लीटर\n**बचाव:** प्रभावित पत्तियां तोड़कर नष्ट करें'},
  {e:'🐝',n:'दीमक',crop:'गन्ना, मक्का, गेहूं',months:[5,6,7],risk:'med',
   short:'जड़ें खाता है',
   detail:'दीमक जड़ों और तने को खाती है। गर्मियों में नुकसान अधिक।\n\n**पहचान:** पौधा अचानक मुरझाता है, जड़ पर मिट्टी की नलियां\n**रासायनिक:** Chlorpyriphos 20EC @ 3ml/लीटर सिंचाई में\n**बीज उपचार:** Imidacloprid 600FS @ 1ml/kg बीज\n**जैविक:** Beauveria bassiana 1kg/एकड़'},
];

// ── STATE ─────────────────────────────────────────────────────────────────────
const S = {
  page: 'home',
  photoTab: 'crop',
  moreSub: 'mandi',
  newsFilter: 'all',
  policyFilter: 'all',
  activeCrop: null,
  photoData: null,
  photoMime: 'image/jpeg',
  weather: null,
  forecast: [],
  news: [],
  policies: {central:[], mp_state:[]},
  chatHistory: [],
  pestChatHistory: [],
  aiLoading: false,
  micActive: false,
  recognition: null,
  farmer: null,   // loaded from localStorage
  briefingDone: false,
};

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  S.farmer = loadFarmer();
  if (!S.farmer) { showOnboarding(); return; }
  initApp();
});

function initApp() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/kisan-mitra_App/sw.js').catch(() => {});
  }
  showPage('home');
  fetchWeather();
  loadNews();
  loadPolicies();
  setInterval(fetchWeather, 10 * 60 * 1000);
  document.getElementById('cam-input').addEventListener('change', e => { if (e.target.files?.[0]) handlePhoto(e.target.files[0]); });
  document.getElementById('gal-input').addEventListener('change', e => { if (e.target.files?.[0]) handlePhoto(e.target.files[0]); });
}

// ── FARMER PROFILE ────────────────────────────────────────────────────────────
function loadFarmer() {
  try { return JSON.parse(localStorage.getItem('km_farmer')); } catch { return null; }
}
function saveFarmer(f) {
  localStorage.setItem('km_farmer', JSON.stringify(f));
  S.farmer = f;
}

function showOnboarding() {
  document.getElementById('onboarding').style.display = 'flex';
  populateDistrictSelect();
}

function populateDistrictSelect() {
  const sel = document.getElementById('ob-district');
  MP_DISTRICTS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.n; opt.textContent = `${d.n} (${d.zone})`;
    sel.appendChild(opt);
  });
}

function saveOnboarding() {
  const name = document.getElementById('ob-name').value.trim();
  const district = document.getElementById('ob-district').value;
  const land = document.getElementById('ob-land').value;
  const crops = Array.from(document.querySelectorAll('.ob-crop-btn.selected')).map(b => b.dataset.crop);
  if (!name || !district) { alert('नाम और जिला जरूरी है'); return; }
  saveFarmer({ name, district, land: land || '5', crops: crops.length ? crops : ['सोयाबीन','गेहूं'], createdAt: Date.now() });
  document.getElementById('onboarding').style.display = 'none';
  initApp();
}

function toggleObCrop(btn) {
  btn.classList.toggle('selected');
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function showPage(page) {
  S.page = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelector(`.nb[data-page="${page}"]`)?.classList.add('active');
  ({home: rHome, photo: rPhoto, weather: rWeather, pest: rPest, more: rMore})[page]?.();
}

// ── WEATHER ───────────────────────────────────────────────────────────────────
async function fetchWeather() {
  const d = MP_DISTRICTS.find(d => d.n === S.farmer?.district) || MP_DISTRICTS[0];
  try {
    const [cur, fore] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${d.lat}&lon=${d.lon}&appid=${OWM_KEY}&units=metric&lang=hi`).then(r => r.json()),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${d.lat}&lon=${d.lon}&appid=${OWM_KEY}&units=metric&lang=hi&cnt=35`).then(r => r.json())
    ]);
    S.weather = {
      temp: Math.round(cur.main.temp), feels: Math.round(cur.main.feels_like),
      min: Math.round(cur.main.temp_min), max: Math.round(cur.main.temp_max),
      hum: cur.main.humidity, wind: Math.round(cur.wind.speed * 3.6),
      desc: cur.weather[0].description, icon: owmIcon(cur.weather[0].id),
      rain: cur.rain?.['1h'] || 0, district: d.n, live: true
    };
    // Build daily forecast
    const days = {};
    fore.list?.forEach(item => {
      const day = item.dt_text?.split(' ')[0];
      if (!day) return;
      if (!days[day]) days[day] = {temps:[], icons:[], rain:0};
      days[day].temps.push(item.main.temp);
      days[day].icons.push(item.weather[0].id);
      days[day].rain += item.rain?.['3h'] || 0;
    });
    const dayNames = ['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
    S.forecast = Object.entries(days).slice(0,7).map(([date, data], i) => {
      const dt = new Date(date);
      return {
        day: i === 0 ? 'आज' : i === 1 ? 'कल' : dayNames[dt.getDay()],
        icon: owmIcon(data.icons[Math.floor(data.icons.length/2)]),
        hi: Math.round(Math.max(...data.temps)),
        lo: Math.round(Math.min(...data.temps)),
        rain: Math.round(data.rain)
      };
    });
  } catch {
    if (!S.weather) {
      S.weather = {temp:34,min:24,max:38,hum:62,wind:8,desc:'आंशिक बादल',icon:'⛅',rain:0,feels:37,live:false,district:S.farmer?.district||'इंदौर'};
      S.forecast = [{day:'आज',icon:'⛅',hi:38,lo:24,rain:0},{day:'कल',icon:'🌧️',hi:32,lo:22,rain:15}];
    }
  }
  updateHdrWeather();
  if (S.page === 'home') rHome();
  if (S.page === 'weather') rWeather();
  if (!S.briefingDone && S.weather) { S.briefingDone = true; genDailyBriefing(); }
}

function owmIcon(id) {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id === 800) return '☀️';
  if (id <= 802) return '🌤️';
  return '⛅';
}

function updateHdrWeather() {
  const w = S.weather; if (!w) return;
  const el = document.getElementById('hdr-weather');
  if (el) el.innerHTML = `<span class="w-temp">${w.icon} ${w.temp}°</span><span class="w-desc">${w.district}${w.live?' · Live':''}</span>`;
  const distEl = document.getElementById('hdr-district');
  if (distEl) distEl.textContent = S.farmer?.district || 'जिला चुनें';
}

// ── NEWS & POLICIES ───────────────────────────────────────────────────────────
async function loadNews() {
  try {
    const r = await fetch('/kisan-mitra_App/data/news.json?' + Date.now());
    const d = await r.json();
    S.news = d.articles || [];
    updateNewsBadge();
    if (S.page === 'more' && S.moreSub === 'news') rMoreContent('news');
  } catch { console.log('News load failed — using starter data'); }
}

async function loadPolicies() {
  try {
    const r = await fetch('/kisan-mitra_App/data/policies.json');
    const d = await r.json();
    S.policies = d;
  } catch { console.log('Policies load failed'); }
}

function updateNewsBadge() {
  const important = S.news.filter(n => n.important).length;
  const badge = document.getElementById('news-badge');
  if (badge) { badge.textContent = important; badge.style.display = important ? 'flex' : 'none'; }
}

// ── AI CALLS ──────────────────────────────────────────────────────────────────
async function callGroq(messages, maxTokens = 800) {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{role:'system', content: `तुम किसान मित्र AI हो — MP के किसानों के लिए एक भरोसेमंद कृषि सहायक। हमेशा सरल हिंदी में जवाब दो। किसान की भाषा में बोलो। ${S.farmer ? `किसान का नाम: ${S.farmer.name}, जिला: ${S.farmer.district}, फसलें: ${S.farmer.crops?.join(', ')}, जमीन: ${S.farmer.land} बीघा` : 'MP, इंदौर-खरगोन-खंडवा क्षेत्र'}.`}, ...messages],
      max_tokens: maxTokens, temperature: 0.7
    })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.choices[0].message.content;
}

async function callGeminiVision(prompt, base64, mime) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({contents:[{parts:[
      {inline_data:{mime_type: mime, data: base64}},
      {text: prompt}
    ]}]})
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.candidates[0].content.parts[0].text;
}

// ── DAILY BRIEFING ────────────────────────────────────────────────────────────
async function genDailyBriefing() {
  const out = document.getElementById('briefing-out');
  if (!out) return;
  const w = S.weather;
  const month = new Date().getMonth() + 1;
  const activePests = PESTS.filter(p => p.months.includes(month)).slice(0,2).map(p=>p.n).join(', ');
  const topNews = S.news[0]?.title || '';
  out.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callGroq([{role:'user', content:
      `आज का किसान सुबह का संदेश बनाओ। इसमें शामिल करो:
      1. ${S.farmer?.name}जी को शुभकामना
      2. आज का मौसम: ${w?.temp}°C, ${w?.desc}, नमी ${w?.hum}%, हवा ${w?.wind}km/h
      3. इस महीने (${month}) सावधान रहें: ${activePests}
      4. आज का मुख्य समाचार: ${topNews}
      5. एक छोटी खेती की सलाह आज के मौसम और मौसम के हिसाब से
      
      100 शब्दों में, गर्मजोशी से, हिंदी में।`
    }]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.85">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch {
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.85">${S.farmer?.name ? S.farmer.name+'जी,' : ''} नमस्ते! आज ${w?.temp||34}°C तापमान है। ${activePests ? activePests+' से सावधान रहें।' : ''} अच्छी खेती करें!</div>`;
  }
}

// ── VOICE ─────────────────────────────────────────────────────────────────────
function startVoice(inputId, micBtnId) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('आपके ब्राउज़र में आवाज की सुविधा नहीं है'); return; }
  if (S.micActive) { S.recognition?.stop(); return; }
  const r = new SR();
  S.recognition = r; r.lang = 'hi-IN'; r.continuous = false; r.interimResults = false;
  r.onstart = () => { S.micActive = true; document.getElementById(micBtnId)?.classList.add('mic-active'); showToast('सुन रहा हूं...'); };
  r.onresult = e => { const t = e.results[0][0].transcript; const inp = document.getElementById(inputId); if(inp) inp.value = t; showToast('✓ '+t.slice(0,30)); };
  r.onend = () => { S.micActive = false; document.getElementById(micBtnId)?.classList.remove('mic-active'); };
  r.onerror = e => { S.micActive = false; showToast('माइक्रोफोन एक्सेस दें'); };
  r.start();
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1A1208;color:#F5A500;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;z-index:999;border:1px solid #C07800;pointer-events:none;font-family:var(--font)'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity='1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity='0'; }, 2500);
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function rHome() {
  const w = S.weather || {temp:34,min:24,max:38,hum:62,wind:8,icon:'⛅',live:false};
  const month = new Date().getMonth() + 1;
  const activePests = PESTS.filter(p => p.months.includes(month) && p.risk === 'high');
  const importantNews = S.news.filter(n => n.important).slice(0,2);
  document.getElementById('page-home').innerHTML = `
    <div class="card" style="display:flex;gap:14px;align-items:center;cursor:pointer" onclick="showPage('weather')">
      <div style="font-size:44px;line-height:1">${w.icon}</div>
      <div style="flex:1">
        <div style="font-size:30px;font-weight:900;color:var(--sun);line-height:1">${w.temp}°C</div>
        <div style="font-size:11px;font-weight:700;color:#806040;margin-top:3px">${w.min}°–${w.max}° · ${w.hum}% नमी · ${w.wind}km/h हवा</div>
        <div style="font-size:10px;color:#605030;margin-top:2px">${w.live?'🟢 Live':'📡 अनुमानित'} · ${w.district}</div>
      </div>
      <div style="text-align:right"><div style="font-size:10px;font-weight:800;color:#C07800">7 दिन ›</div></div>
    </div>

    ${w.wind > 15 ? `<div class="alert warn"><div class="alert-icon">💨</div><div><div class="alert-title">तेज हवा — छिड़काव न करें</div><div class="alert-desc">हवा ${w.wind}km/h — 10km/h से कम होने पर छिड़काव करें।</div></div></div>` : ''}
    ${w.hum > 80 ? `<div class="alert danger"><div class="alert-icon">💧</div><div><div class="alert-title">अधिक नमी — फफूंद खतरा</div><div class="alert-desc">नमी ${w.hum}% — मिर्च/टमाटर में Mancozeb छिड़काव करें।</div></div></div>` : ''}
    ${w.temp > 38 ? `<div class="alert warn"><div class="alert-icon">🌡️</div><div><div class="alert-title">अत्यधिक गर्मी — ${w.temp}°C</div><div class="alert-desc">मिर्च/टमाटर में फूल झड़ेंगे। शाम को सिंचाई करें।</div></div></div>` : ''}
    ${activePests.length ? `<div class="alert danger"><div class="alert-icon">🐛</div><div><div class="alert-title">इस माह सावधान: ${activePests.map(p=>p.n).join(', ')}</div><div class="alert-desc">कीट पेज पर जाएं — पूरी जानकारी और उपाय पाएं।</div></div></div>` : ''}
    ${importantNews.map(n=>`<div class="alert info" onclick="showPage('more');setTimeout(()=>{S.moreSub='news';rMore()},100)" style="cursor:pointer"><div class="alert-icon">📰</div><div><div class="alert-title">${n.title}</div><div class="alert-desc">${n.summary.slice(0,80)}...</div></div></div>`).join('')}

    <div class="st">AI से पूछें</div>
    <div class="ask-bar" onclick="document.getElementById('home-ask').focus()">
      <input id="home-ask" class="ask-bar-input" placeholder="कोई भी सवाल पूछें..." onkeydown="if(event.key==='Enter')homeAsk()"/>
      <button class="ask-bar-mic" id="home-mic" onclick="startVoice('home-ask','home-mic')">🎤</button>
      <button class="ask-bar-send" onclick="homeAsk()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
    </div>
    <div id="home-ai-out"></div>

    <div class="st">आज का संदेश</div>
    <div class="card" id="briefing-out"><div style="font-size:12px;color:#806040">संदेश तैयार हो रहा है...</div></div>

    <div class="st">त्वरित कार्य</div>
    <div class="qgrid">
      <div class="qbtn highlight" onclick="showPage('photo')"><div class="qi">📸</div><div class="ql">फोटो जांच</div><div class="qs">रोग · मिट्टी · रिपोर्ट</div></div>
      <div class="qbtn" onclick="showPage('pest')"><div class="qi">🐛</div><div class="ql">कीट अलर्ट</div><div class="qs">इस माह के कीट</div></div>
      <div class="qbtn" onclick="goMore('mandi')"><div class="qi">💰</div><div class="ql">मंडी भाव</div><div class="qs">AI सहित</div></div>
      <div class="qbtn" onclick="goMore('policy')"><div class="qi">🏛️</div><div class="ql">योजनाएं</div><div class="qs">केंद्र + MP</div></div>
    </div>

    <div class="st">आपकी फसलें</div>
    <div class="card">
      ${(S.farmer?.crops || ['सोयाबीन','गेहूं']).map(c => `<div class="drow"><div class="dcrop">🌾</div><div><div class="dname">${c}</div><div class="ddate">${S.farmer?.district} · ${S.farmer?.land} बीघा</div></div><button style="background:var(--sun);border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:900;color:var(--sun-txt);cursor:pointer;font-family:var(--font)" onclick="cropAI('${c}')">AI सलाह</button></div>`).join('')}
    </div>
  `;
  if (!document.getElementById('briefing-out').querySelector('.loading-dots')) {
    if (!S.briefingDone) genDailyBriefing();
  }
}

async function homeAsk() {
  const q = document.getElementById('home-ask')?.value?.trim(); if (!q) return;
  document.getElementById('home-ask').value = '';
  const out = document.getElementById('home-ai-out');
  out.innerHTML = `<div class="card"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
  try {
    const ctx = S.weather ? `मौसम: ${S.weather.temp}°C, ${S.weather.desc}, ${S.weather.hum}% नमी` : '';
    const reply = await callGroq([{role:'user', content:`${ctx}\n\n${q}`}]);
    out.innerHTML = `<div class="card" style="border-color:var(--sun-dk)"><div style="font-size:10px;font-weight:900;color:var(--sun);margin-bottom:6px">🤖 AI जवाब</div><div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.85">${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div></div>`;
  } catch(e) {
    out.innerHTML = `<div class="card"><div style="font-size:13px;color:#806040">AI से जुड़ने में समस्या। API key जांचें।<br><small>${e.message}</small></div></div>`;
  }
}

async function cropAI(crop) {
  const w = S.weather;
  const month = new Date().getMonth() + 1;
  openChat(`${crop} के बारे में आज की सलाह दो। मौसम: ${w?.temp||34}°C, माह: ${month}, जिला: ${S.farmer?.district}।`);
}

// ── PHOTO PAGE ────────────────────────────────────────────────────────────────
function rPhoto() {
  document.getElementById('page-photo').innerHTML = `
    <div class="tabs">
      <button class="tab ${S.photoTab==='crop'?'active':''}" onclick="swPT('crop',this)">🌿 फसल/पत्ती</button>
      <button class="tab ${S.photoTab==='soil'?'active':''}" onclick="swPT('soil',this)">🌱 मिट्टी</button>
      <button class="tab ${S.photoTab==='report'?'active':''}" onclick="swPT('report',this)">📄 रिपोर्ट</button>
    </div>
    <div class="photo-btns">
      <button class="photo-btn" onclick="document.getElementById('cam-input').click()"><span class="pb-icon">📷</span>कैमरे से खींचें</button>
      <button class="photo-btn" onclick="document.getElementById('gal-input').click()"><span class="pb-icon">🖼️</span>गैलरी से चुनें</button>
    </div>
    <img id="photo-preview" class="photo-preview" alt="फोटो">
    <div id="photo-zone">${photoZoneHTML()}</div>
    <div id="photo-ai-out"></div>
    <div class="st">फसल चुनें</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${CROPS.map(c=>`<button class="crop-chip ${S.activeCrop===c?'active':''}" onclick="selCrop('${c}',this)">${c}</button>`).join('')}
    </div>
    <div class="st">पिछली जांच</div>
    <div class="card">
      <div class="drow"><div class="dcrop">🌶️</div><div><div class="dname">मिर्च — लीफ कर्ल वायरस</div><div class="ddate">3 दिन पहले</div></div><span class="badge badge-fire">गंभीर</span></div>
    </div>`;
}

function photoZoneHTML() {
  const cfg = {
    crop:{icon:'🌿',title:'फसल/पत्ती/फल की फोटो',sub:'रोग · कमी · कीट नुकसान — Gemini AI जांचेगा'},
    soil:{icon:'🌱',title:'मिट्टी की फोटो',sub:'रंग · बनावट · दरारें — AI मिट्टी का हाल बताएगा'},
    report:{icon:'📄',title:'मिट्टी परीक्षण रिपोर्ट',sub:'NPK मान AI खुद पढ़ेगा'},
  }[S.photoTab];
  return `<div class="photo-zone" onclick="document.getElementById('gal-input').click()"><div class="pz-icon">${cfg.icon}</div><div class="pz-title">${cfg.title}</div><div class="pz-sub">${cfg.sub}</div><div style="margin-top:12px;background:var(--sun);color:var(--sun-txt);border-radius:8px;padding:9px 20px;font-size:13px;font-weight:900;display:inline-block">📷 फोटो लें या चुनें</div></div>`;
}

function swPT(t, btn) {
  S.photoTab = t; S.photoData = null;
  document.querySelectorAll('#page-photo .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('photo-zone').innerHTML = photoZoneHTML();
  document.getElementById('photo-ai-out').innerHTML = '';
  const prev = document.getElementById('photo-preview');
  if (prev) { prev.src=''; prev.classList.remove('show'); }
}

function selCrop(c, btn) {
  S.activeCrop = c;
  document.querySelectorAll('.crop-chip').forEach(b=>{b.classList.remove('active')});
  btn.classList.add('active');
}

function handlePhoto(file) {
  const reader = new FileReader();
  S.photoMime = file.type || 'image/jpeg';
  reader.onload = e => {
    S.photoData = e.target.result.split(',')[1];
    const prev = document.getElementById('photo-preview');
    if (prev) { prev.src = e.target.result; prev.classList.add('show'); }
    runPhotoAI();
  };
  reader.readAsDataURL(file);
}

async function runPhotoAI() {
  if (S.aiLoading) return;
  S.aiLoading = true;
  const crop = S.activeCrop || 'फसल';
  const out = document.getElementById('photo-ai-out');
  out.innerHTML = `<div class="card"><div class="loading-dots"><span></span><span></span><span></span></div><div style="font-size:12px;font-weight:700;color:#806040;padding:0 0 8px">Gemini AI से फोटो जांच हो रही है...</div></div>`;
  const prompts = {
    crop: `तुम MP के कृषि विशेषज्ञ हो। इस ${crop} फसल की फोटो देखकर बताओ:
1. क्या रोग/समस्या है? (नाम हिंदी में)
2. गंभीरता: सामान्य/चिंताजनक/गंभीर
3. मुख्य कारण
4. तुरंत रासायनिक उपाय (दवा का नाम + मात्रा)
5. जैविक उपाय
6. बचाव के तरीके
सरल हिंदी में 150 शब्दों में।`,
    soil: `MP की काली मिट्टी (रेगुर) की यह फोटो देखकर बताओ:
1. मिट्टी का प्रकार
2. रंग से स्वास्थ्य संकेत
3. संभावित कमियां
4. सुधार के उपाय (जैविक + रासायनिक प्रति बीघा)
अंत में: "पक्की जानकारी के लिए मिट्टी परीक्षण करवाएं।"
सरल हिंदी में 150 शब्दों में।`,
    report: `यह मिट्टी परीक्षण रिपोर्ट/कार्ड पढ़कर बताओ:
1. NPK मान और उनका अर्थ
2. pH और उसका मतलब
3. सूक्ष्म पोषक तत्व (Zinc, Sulfur, Boron)
4. प्रति बीघा खाद की सिफारिश
सरल हिंदी में।`
  };
  try {
    const reply = await callGeminiVision(prompts[S.photoTab], S.photoData, S.photoMime);
    let sev='चिंताजनक', sevColor='var(--warn)', sevBg='#2A1400';
    if (reply.includes('गंभीर')) { sev='गंभीर'; sevColor='#FF8060'; sevBg='#3A0A00'; }
    if (reply.includes('सामान्य')&&!reply.includes('असामान्य')) { sev='सामान्य'; sevColor='var(--leaf-lt)'; sevBg='#0A2000'; }
    out.innerHTML = `
      <div class="card" style="border-color:var(--sun-dk)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="font-size:14px;font-weight:900;color:var(--sun)">🤖 Gemini AI विश्लेषण</div>
          <span style="background:${sevBg};color:${sevColor};border:1px solid ${sevColor};padding:3px 10px;border-radius:10px;font-size:11px;font-weight:900">${sev}</span>
        </div>
        <div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.85">${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div>
        <div style="margin-top:10px;padding:8px;background:#2A1400;border-radius:8px;font-size:11px;font-weight:700;color:#C09050;border-left:3px solid var(--warn)">⚠️ AI अनुमान है। पक्की जानकारी के लिए KVK या कृषि विशेषज्ञ से मिलें।</div>
        <button class="btn-sun" style="margin-top:10px" onclick="openChat('${crop} की इस समस्या के बारे में और विस्तार से बताओ।')">💬 AI से और पूछें</button>
      </div>`;
    S.aiLoading = false;
  } catch(e) {
    S.aiLoading = false;
    out.innerHTML = `<div class="card"><div style="font-size:13px;color:#FF8060;margin-bottom:8px">Gemini API error: ${e.message}</div><div style="font-size:12px;color:#806040">API key जांचें या कुछ देर बाद प्रयास करें।</div></div>`;
  }
}

// ── WEATHER PAGE ──────────────────────────────────────────────────────────────
function rWeather() {
  const w = S.weather || {temp:34,min:24,max:38,hum:62,wind:8,icon:'⛅',live:false,district:'इंदौर',feels:37,desc:'आंशिक बादल',rain:0};
  const pct = 92;
  document.getElementById('page-weather').innerHTML = `
    <div class="st">जिला बदलें</div>
    <select id="district-sel" style="width:100%;background:var(--soil2);border:1.5px solid var(--soil3);border-radius:8px;padding:10px 12px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);margin-bottom:12px;outline:none" onchange="changeDistrict(this.value)">
      ${MP_DISTRICTS.map(d=>`<option value="${d.n}" ${d.n===S.farmer?.district?'selected':''}>${d.n} (${d.zone})</option>`).join('')}
    </select>

    <div class="w-hero">
      <div class="w-icon-big">${w.icon}</div>
      <div>
        <div class="w-temp-big">${w.temp}°C</div>
        <div class="w-loc">${w.district} ${w.live?'· 🟢 Live':''}</div>
        <div class="w-det">महसूस: ${w.feels}° · ${w.desc}</div>
        <div class="w-det">${w.min}°–${w.max}° · नमी ${w.hum}% · हवा ${w.wind}km/h</div>
      </div>
    </div>

    ${w.wind < 10 ? `<div class="alert good"><div class="alert-icon">✅</div><div><div class="alert-title">छिड़काव के लिए अच्छा समय</div><div class="alert-desc">हवा ${w.wind}km/h — अभी कीटनाशक/फफूंदनाशक छिड़क सकते हैं।</div></div></div>` : `<div class="alert warn"><div class="alert-icon">💨</div><div><div class="alert-title">तेज हवा — छिड़काव न करें</div><div class="alert-desc">हवा ${w.wind}km/h — 10km/h से कम होने पर ही छिड़काव करें।</div></div></div>`}

    <div class="st">7 दिन का पूर्वानुमान</div>
    <div class="frow">${(S.forecast.length ? S.forecast : [{day:'आज',icon:w.icon,hi:w.max,lo:w.min,rain:0}]).map((f,i)=>`<div class="fday ${i===0?'today':''}"><div class="fd-d">${f.day}</div><div class="fd-i">${f.icon}</div><div class="fd-t">${f.hi}°/${f.lo}°</div><div class="fd-r">${f.rain>0?'💧'+f.rain+'mm':'—'}</div></div>`).join('')}</div>

    <div class="st">मानसून ट्रैकर 2025</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div><div style="font-size:11px;font-weight:800;color:#806040">संचित वर्षा</div><div style="font-size:26px;font-weight:900;color:var(--sky-lt)">847mm</div></div>
        <div style="text-align:right"><div style="font-size:11px;font-weight:800;color:#806040">सामान्य</div><div style="font-size:26px;font-weight:900;color:#605030">920mm</div></div>
      </div>
      <div class="mbar"><div class="mbl"><span>प्रगति (${pct}%)</span><span>73mm कम</span></div><div class="mbb"><div class="mbf" style="width:${pct}%"></div></div></div>
    </div>

    <div class="wgrid">
      <div class="wstat"><div class="wl">नमी</div><div class="wv">${w.hum}%</div><div class="ws">${w.hum>75?'फफूंद जोखिम ⚠️':'सामान्य ✓'}</div></div>
      <div class="wstat"><div class="wl">हवा</div><div class="wv">${w.wind}</div><div class="ws">km/h · ${w.wind<10?'स्प्रे ठीक ✓':'स्प्रे न करें ⚠️'}</div></div>
    </div>

    <div class="st">AI मौसम सलाह</div>
    <div class="card">
      <div style="display:flex;gap:8px">
        <input id="w-q" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="जैसे: कल बारिश है, क्या करें?">
        <button id="w-mic" style="background:var(--sun);border:none;border-radius:8px;width:40px;height:40px;font-size:18px;cursor:pointer;flex-shrink:0" onclick="startVoice('w-q','w-mic')">🎤</button>
        <button style="background:var(--leaf);border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center" onclick="weatherAsk()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8F090" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div id="w-ai-out"></div>
    </div>

    <div class="st">📞 हेल्पलाइन</div>
    <div class="card">
      <div class="drow"><div class="dcrop">📞</div><div><div class="dname">किसान कॉल सेंटर</div><div class="ddate">निःशुल्क · 24×7</div></div><a href="tel:18001801551" style="background:var(--leaf);color:var(--leaf-lt);border:none;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:900;text-decoration:none">📞 कॉल</a></div>
      <div class="drow"><div class="dcrop">👨‍🌾</div><div><div class="dname">KVK ${w.district}</div><div class="ddate">सोम–शनि 9–5</div></div><a href="tel:07312434312" style="background:var(--soil3);color:var(--sun);border:none;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:900;text-decoration:none">📞 कॉल</a></div>
    </div>
  `;
}

async function changeDistrict(district) {
  if (S.farmer) { S.farmer.district = district; saveFarmer(S.farmer); }
  await fetchWeather();
  rWeather();
}

async function weatherAsk() {
  const q = document.getElementById('w-q')?.value?.trim(); if (!q) return;
  const out = document.getElementById('w-ai-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const w = S.weather;
    const reply = await callGroq([{role:'user', content:`मौसम: ${w?.temp}°C, नमी ${w?.hum}%, हवा ${w?.wind}km/h, ${w?.district}। सवाल: ${q} — 80 शब्दों में खेती सलाह।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch(e) { out.innerHTML = `<div style="color:#FF8060;font-size:12px;margin-top:8px">Error: ${e.message}</div>`; }
}

// ── PEST PAGE ─────────────────────────────────────────────────────────────────
function rPest() {
  const month = new Date().getMonth() + 1;
  const sorted = [...PESTS].sort((a,b) => {
    const aActive = a.months.includes(month) ? 1 : 0;
    const bActive = b.months.includes(month) ? 1 : 0;
    if (bActive !== aActive) return bActive - aActive;
    const riskOrder = {high:0, med:1, low:2};
    return riskOrder[a.risk] - riskOrder[b.risk];
  });

  document.getElementById('page-pest').innerHTML = `
    <div class="alert warn">
      <div class="alert-icon">🐛</div>
      <div><div class="alert-title">किसी भी कीट पर टैप करें</div>
      <div class="alert-desc">पूरी जानकारी + AI से सीधी बात। इस माह के सक्रिय कीट ऊपर दिखाए गए हैं।</div></div>
    </div>

    <div class="ask-bar" onclick="document.getElementById('pest-ask').focus()">
      <input id="pest-ask" class="ask-bar-input" placeholder="कीट का नाम या लक्षण पूछें..." onkeydown="if(event.key==='Enter')pestAsk()"/>
      <button class="ask-bar-mic" id="pest-mic" onclick="startVoice('pest-ask','pest-mic')">🎤</button>
      <button class="ask-bar-send" onclick="pestAsk()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
    </div>
    <div id="pest-ask-out"></div>

    <div class="st">इस माह सक्रिय कीट</div>
    ${sorted.map((p,i) => {
      const isActive = p.months.includes(month);
      return `<div class="pest-card" onclick="openPestDetail(${PESTS.indexOf(p)})" style="${isActive?'border-color:var(--sun-dk)':''}">
        <div class="pest-emoji">${p.e}</div>
        <div style="flex:1;padding-right:20px">
          ${isActive ? '<div style="font-size:9px;font-weight:900;color:var(--sun);margin-bottom:3px">● इस माह सक्रिय</div>' : ''}
          <div class="pest-name">${p.n}</div>
          <div class="pest-crop">फसल: ${p.crop}</div>
          <div class="pest-season" style="margin-top:3px;color:#A08060">${p.short}</div>
          <div class="risk ${p.risk}">${p.risk==='high'?'अधिक खतरा':p.risk==='med'?'मध्यम खतरा':'सामान्य'}</div>
        </div>
      </div>`;
    }).join('')}

    <div class="st">जैविक IPM</div>
    <div class="card">
      <div class="drow"><div class="dcrop">🌿</div><div><div class="dname">नीम तेल</div><div class="ddate">5ml+साबुन 1ml/लीटर — सभी फसलें</div></div></div>
      <div class="drow"><div class="dcrop">🪤</div><div><div class="dname">फेरोमोन ट्रैप</div><div class="ddate">हेलिकोवर्पा — 5/एकड़</div></div></div>
      <div class="drow"><div class="dcrop">🟡</div><div><div class="dname">स्टिकी ट्रैप</div><div class="ddate">सफेद मक्खी/थ्रिप्स — 10/एकड़</div></div></div>
    </div>
  `;
}

async function pestAsk() {
  const q = document.getElementById('pest-ask')?.value?.trim(); if (!q) return;
  document.getElementById('pest-ask').value = '';
  const out = document.getElementById('pest-ask-out');
  out.innerHTML = `<div class="card"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
  try {
    const reply = await callGroq([{role:'user', content:`${q} — MP किसान के लिए कीट/रोग जानकारी, रासायनिक और जैविक उपाय 100 शब्दों में।`}]);
    out.innerHTML = `<div class="card" style="border-color:var(--sun-dk)"><div style="font-size:10px;font-weight:900;color:var(--sun);margin-bottom:6px">🤖 AI जवाब</div><div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.85">${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div></div>`;
  } catch(e) { out.innerHTML = `<div class="card"><div style="color:#FF8060;font-size:12px">Error: ${e.message}</div></div>`; }
}

function openPestDetail(idx) {
  const p = PESTS[idx];
  document.getElementById('pest-ov-title').textContent = `${p.e} ${p.n}`;
  const body = document.getElementById('pest-ov-body');
  const month = new Date().getMonth() + 1;
  const isActive = p.months.includes(month);
  body.innerHTML = `
    <div class="card" style="border-color:${isActive?'var(--sun-dk)':'var(--soil3)'}">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <div style="font-size:44px">${p.e}</div>
        <div>
          <div style="font-size:16px;font-weight:900;color:var(--sun)">${p.n}</div>
          <div style="font-size:12px;color:#806040;margin-top:2px">फसल: ${p.crop}</div>
          <div style="font-size:12px;color:#806040">सक्रिय माह: ${p.months.join(', ')}</div>
          ${isActive?'<div style="font-size:11px;font-weight:900;color:var(--sun);margin-top:4px">● अभी सक्रिय है</div>':''}
          <div class="risk ${p.risk}" style="margin-top:6px">${p.risk==='high'?'अधिक खतरा':p.risk==='med'?'मध्यम':'सामान्य'}</div>
        </div>
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.9">${p.detail.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div>
    </div>
    <div class="st">AI से पूछें</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${['दवा की मात्रा बताओ','जैविक उपाय क्या हैं?','कब छिड़काव करें?','बचाव कैसे करें?','यह मेरी फसल में है क्या?'].map(q=>`<button style="background:var(--soil3);border:1px solid var(--soil4);border-radius:20px;padding:6px 12px;font-size:11px;font-weight:700;color:var(--sun);cursor:pointer;font-family:var(--font)" onclick="pestQuickAsk('${q}','${p.n}','${p.crop}')">${q}</button>`).join('')}
    </div>
    <div id="pest-chat" class="chat-thread" style="padding-bottom:80px"></div>
  `;
  S.pestChatHistory = [];
  pestChatAI(`${p.n} कीट के बारे में ${p.crop} के लिए MP किसान को सरल हिंदी में 100 शब्दों में बताओ — पहचान, नुकसान और मुख्य उपाय।`, p.n);
  document.getElementById('pest-overlay').classList.add('open');
  document.getElementById('pest-chat-input').value = '';
  document.getElementById('pest-chat-input').dataset.pest = p.n;
  document.getElementById('pest-chat-input').dataset.crop = p.crop;
}

async function pestChatAI(question, pestName) {
  const thread = document.getElementById('pest-chat'); if (!thread) return;
  const typing = document.createElement('div');
  typing.className = 'typing'; typing.innerHTML = '<span></span><span></span><span></span>';
  thread.appendChild(typing); thread.scrollTop = thread.scrollHeight;
  try {
    S.pestChatHistory.push({role:'user', content: question});
    const reply = await callGroq(S.pestChatHistory);
    S.pestChatHistory.push({role:'assistant', content: reply});
    typing.remove();
    const msg = document.createElement('div');
    msg.className = 'msg ai';
    msg.innerHTML = `<div class="msg-label">🤖 किसान मित्र AI</div>${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}`;
    thread.appendChild(msg); thread.scrollTop = thread.scrollHeight;
  } catch(e) {
    typing.remove();
    const msg = document.createElement('div'); msg.className = 'msg ai';
    msg.innerHTML = `<span style="color:#FF8060">Error: ${e.message}</span>`;
    thread.appendChild(msg);
  }
}

function pestQuickAsk(q, pest, crop) {
  const thread = document.getElementById('pest-chat');
  const userMsg = document.createElement('div'); userMsg.className = 'msg user'; userMsg.textContent = q;
  thread.appendChild(userMsg);
  pestChatAI(`${pest} (${crop} में): ${q}`, pest);
}

function sendPestChat() {
  const inp = document.getElementById('pest-chat-input');
  const q = inp.value.trim(); if (!q) return;
  inp.value = '';
  const thread = document.getElementById('pest-chat');
  const userMsg = document.createElement('div'); userMsg.className = 'msg user'; userMsg.textContent = q;
  thread.appendChild(userMsg);
  pestChatAI(`${inp.dataset.pest||'कीट'} के बारे में: ${q}`, inp.dataset.pest||'कीट');
}

function closePestOverlay() { document.getElementById('pest-overlay').classList.remove('open'); }

// ── MORE PAGE ─────────────────────────────────────────────────────────────────
function rMore() {
  document.getElementById('page-more').innerHTML = `
    <div class="tabs" style="overflow-x:auto;flex-wrap:nowrap">
      <button class="tab ${S.moreSub==='mandi'?'active':''}" onclick="msub('mandi',this)" style="flex-shrink:0">💰 मंडी</button>
      <button class="tab ${S.moreSub==='news'?'active':''}" onclick="msub('news',this)" style="flex-shrink:0;position:relative">📰 खबरें<span id="news-badge" style="position:absolute;top:2px;right:2px;background:var(--fire);color:white;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:900;display:none;align-items:center;justify-content:center">0</span></button>
      <button class="tab ${S.moreSub==='policy'?'active':''}" onclick="msub('policy',this)" style="flex-shrink:0">🏛️ योजनाएं</button>
      <button class="tab ${S.moreSub==='soil'?'active':''}" onclick="msub('soil',this)" style="flex-shrink:0">🧪 मिट्टी</button>
      <button class="tab ${S.moreSub==='tools'?'active':''}" onclick="msub('tools',this)" style="flex-shrink:0">🔧 टूल्स</button>
    </div>
    <div id="more-content"></div>
  `;
  rMoreContent(S.moreSub);
  updateNewsBadge();
}

function msub(t, btn) {
  S.moreSub = t;
  document.querySelectorAll('#page-more .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  rMoreContent(t);
}

function goMore(t) { S.moreSub = t; showPage('more'); }

function rMoreContent(t) {
  const el = document.getElementById('more-content'); if (!el) return;
  if (t === 'mandi') rMandi(el);
  else if (t === 'news') rNews(el);
  else if (t === 'policy') rPolicy(el);
  else if (t === 'soil') rSoil(el);
  else if (t === 'tools') rTools(el);
}

function rMandi(el) {
  el.innerHTML = `
    <div class="st">AI मंडी भाव (Groq)</div>
    <div class="card">
      <div style="font-size:12px;color:#806040;margin-bottom:8px">कोई भी फसल का नाम लिखें — AI आज के अनुमानित भाव और सलाह देगा:</div>
      <div style="display:flex;gap:8px">
        <input id="m-q" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="जैसे: मिर्च, सोयाबीन, प्याज...">
        <button id="m-mic" style="background:var(--sun);border:none;border-radius:8px;width:40px;height:40px;font-size:18px;cursor:pointer;flex-shrink:0" onclick="startVoice('m-q','m-mic')">🎤</button>
        <button style="background:var(--leaf);border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center" onclick="mandiAsk()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8F090" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div id="m-ai-out"></div>
    </div>
    <div class="st">इंदौर-खरगोन-खंडवा मंडी (अनुमानित)</div>
    <div class="card" id="mandi-list"><div class="loading-dots"><span></span><span></span><span></span></div></div>
    <div class="st">📞 मंडी हेल्पलाइन</div>
    <div class="card">
      <div class="drow"><div class="dcrop">📞</div><div><div class="dname">e-NAM हेल्पलाइन</div><div class="ddate">ऑनलाइन मंडी पंजीकरण</div></div><a href="tel:18002700224" style="background:var(--leaf);color:var(--leaf-lt);border:none;border-radius:6px;padding:6px 10px;font-size:11px;font-weight:900;text-decoration:none">📞 कॉल</a></div>
    </div>
  `;
  loadMandiPrices();
}

async function loadMandiPrices() {
  const el = document.getElementById('mandi-list'); if (!el) return;
  try {
    const crops = (S.farmer?.crops || ['सोयाबीन','मिर्च','गेहूं','प्याज','लहसुन']).slice(0,6).join(', ');
    const reply = await callGroq([{role:'user', content:
      `${S.farmer?.district||'इंदौर'}, खरगोन, खंडवा मंडी में आज के अनुमानित थोक भाव बताओ इन फसलों के लिए: ${crops}।
      प्रत्येक फसल के लिए: फसल का नाम | अनुमानित भाव (₹/क्विंटल) | बाजार की स्थिति (तेज/मंदा/स्थिर)
      केवल डेटा दो, एक लाइन में प्रत्येक फसल। कोई अतिरिक्त पाठ नहीं।`
    }], 300);
    const rows = reply.split('\n').filter(r => r.trim() && r.includes('|'));
    el.innerHTML = rows.map(row => {
      const parts = row.split('|').map(p => p.trim());
      const [crop, price, trend] = parts;
      if (!crop || !price) return '';
      const up = trend?.includes('तेज');
      const dn = trend?.includes('मंदा');
      return `<div class="mandi-row"><div><div class="mandi-crop">${crop}</div><div class="mandi-loc">${S.farmer?.district||'इंदौर'} मंडी · AI अनुमान</div></div><div class="mandi-price"><div class="mpv">${price}</div><div class="mpc ${up?'up':dn?'dn':''}">${up?'▲ तेज':dn?'▼ मंदा':'→ स्थिर'}</div></div></div>`;
    }).join('') || `<div style="font-size:12px;color:#806040">मंडी डेटा लोड हो रहा है...</div>`;
    el.innerHTML += `<div style="font-size:10px;color:#504030;margin-top:10px;padding-top:8px;border-top:1px solid var(--soil3)">⚠️ ये AI-अनुमानित भाव हैं। पक्के भाव के लिए e-NAM या स्थानीय मंडी से संपर्क करें।</div>`;
  } catch(e) {
    el.innerHTML = `<div style="font-size:12px;color:#FF8060">Error: ${e.message}</div>`;
  }
}

async function mandiAsk() {
  const q = document.getElementById('m-q')?.value?.trim(); if (!q) return;
  const out = document.getElementById('m-ai-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callGroq([{role:'user', content:`${q} — ${S.farmer?.district||'इंदौर'} मंडी में आज की स्थिति, बेचें या रुकें — 80 शब्दों में।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch(e) { out.innerHTML = `<div style="color:#FF8060;font-size:12px;margin-top:8px">Error: ${e.message}</div>`; }
}

function rNews(el) {
  const filters = ['all','central','state','district','price','scheme','market'];
  const filterLabels = {all:'सभी',central:'केंद्र',state:'MP',district:'जिला',price:'भाव',scheme:'योजना',market:'बाजार'};
  const filtered = S.newsFilter === 'all' ? S.news : S.news.filter(n => n.level === S.newsFilter || n.category === S.newsFilter);
  el.innerHTML = `
    <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:10px">
      ${filters.map(f=>`<button style="background:${S.newsFilter===f?'var(--sun)':'var(--soil2)'};color:${S.newsFilter===f?'var(--sun-txt)':'#A08060'};border:1px solid ${S.newsFilter===f?'var(--sun-dk)':'var(--soil3)'};border-radius:20px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;font-family:var(--font);flex-shrink:0" onclick="setNewsFilter('${f}')">${filterLabels[f]}</button>`).join('')}
    </div>
    ${filtered.length === 0 ? `<div class="empty-state"><div class="es-icon">📰</div>कोई खबर नहीं मिली</div>` :
      filtered.map(n => `
        <div class="card" style="${n.important?'border-color:var(--sun-dk)':''}">
          <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:8px">
            <div>
              ${n.important?'<span style="background:var(--fire);color:#FFD0C0;font-size:9px;font-weight:900;padding:2px 6px;border-radius:4px;margin-right:6px">जरूरी</span>':''}
              <span style="background:var(--soil3);color:var(--sun);font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px">${n.level==='central'?'केंद्र':n.level==='state'?'MP':'जिला'}</span>
              <span style="background:var(--soil3);color:#A08060;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;margin-left:4px">${n.category}</span>
            </div>
          </div>
          <div style="font-size:14px;font-weight:900;color:var(--clay);margin-bottom:6px;line-height:1.4">${n.title}</div>
          <div style="font-size:12px;font-weight:600;color:#C0A880;line-height:1.65">${n.summary}</div>
          <div style="font-size:10px;color:#605030;margin-top:8px">${n.source} · ${n.date}</div>
          ${n.link ? `<a href="${n.link}" style="font-size:11px;color:var(--sky-lt);display:block;margin-top:4px">पूरी खबर पढ़ें ›</a>` : ''}
        </div>`).join('')}
    <div style="text-align:center;padding:12px 0">
      <button onclick="loadNews()" style="background:var(--soil2);border:1px solid var(--soil3);border-radius:20px;padding:8px 20px;font-size:12px;font-weight:700;color:var(--sun);cursor:pointer;font-family:var(--font)">🔄 नई खबरें देखें</button>
    </div>
  `;
}

function setNewsFilter(f) { S.newsFilter = f; rMoreContent('news'); }

function rPolicy(el) {
  const allPolicies = [...(S.policies.central||[]), ...(S.policies.mp_state||[])];
  const filtered = S.policyFilter === 'all' ? allPolicies :
    S.policyFilter === 'central' ? (S.policies.central||[]) :
    S.policyFilter === 'state' ? (S.policies.mp_state||[]) :
    allPolicies.filter(p => p.category === S.policyFilter);

  el.innerHTML = `
    <div class="ask-bar" onclick="document.getElementById('pol-ask').focus()" style="margin-bottom:10px">
      <input id="pol-ask" class="ask-bar-input" placeholder="योजना के बारे में पूछें — मुझे कौन सी मिलेगी?" onkeydown="if(event.key==='Enter')policyAsk()"/>
      <button class="ask-bar-mic" id="pol-mic" onclick="startVoice('pol-ask','pol-mic')">🎤</button>
      <button class="ask-bar-send" onclick="policyAsk()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
    </div>
    <div id="pol-ai-out"></div>

    <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:10px">
      ${['all','central','state','income_support','insurance','credit','irrigation','seeds'].map(f=>{
        const labels = {all:'सभी',central:'केंद्रीय',state:'MP सरकार',income_support:'आय सहायता',insurance:'बीमा',credit:'ऋण',irrigation:'सिंचाई',seeds:'बीज'};
        return `<button style="background:${S.policyFilter===f?'var(--sun)':'var(--soil2)'};color:${S.policyFilter===f?'var(--sun-txt)':'#A08060'};border:1px solid ${S.policyFilter===f?'var(--sun-dk)':'var(--soil3)'};border-radius:20px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;font-family:var(--font);flex-shrink:0" onclick="setPolicyFilter('${f}')">${labels[f]||f}</button>`;
      }).join('')}
    </div>

    ${filtered.length === 0 ? `<div class="empty-state"><div class="es-icon">🏛️</div>कोई योजना नहीं मिली</div>` :
      filtered.map(p => `
        <div class="card">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
            <div style="font-size:14px;font-weight:900;color:var(--clay);flex:1;line-height:1.4">${p.name}</div>
            <span style="background:${p.id.startsWith('mp')||p.id.startsWith('cm')||p.id.startsWith('bh')?'#1C3A00':'#001428'};color:${p.id.startsWith('mp')||p.id.startsWith('cm')||p.id.startsWith('bh')?'var(--leaf-lt)':'var(--sky-lt)'};font-size:9px;font-weight:900;padding:2px 7px;border-radius:4px;white-space:nowrap;flex-shrink:0;margin-left:8px">${p.id.startsWith('mp')||p.id.startsWith('cm')||p.id.startsWith('bh')?'MP सरकार':'केंद्र'}</span>
          </div>
          <div style="font-size:12px;font-weight:700;color:var(--sun);margin-bottom:6px">लाभ: ${p.benefit}</div>
          <div style="font-size:12px;color:#A09070;line-height:1.6"><strong style="color:#C0A880">पात्रता:</strong> ${p.eligibility}</div>
          <div style="font-size:12px;color:#A09070;margin-top:4px"><strong style="color:#C0A880">कैसे आवेदन करें:</strong> ${p.howto}</div>
          <div style="font-size:12px;color:#A09070;margin-top:4px"><strong style="color:#C0A880">जरूरी कागज:</strong> ${p.documents}</div>
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
            <div style="background:var(--soil3);color:var(--sun);font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px">📅 ${p.deadline}</div>
            ${p.helpline?`<a href="tel:${p.helpline}" style="background:var(--leaf);color:var(--leaf-lt);font-size:10px;font-weight:900;padding:3px 8px;border-radius:6px;text-decoration:none">📞 ${p.helpline}</a>`:''}
            ${p.amount>0?`<div style="background:#001428;color:var(--sky-lt);font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px">₹${p.amount.toLocaleString('hi')}</div>`:''}
          </div>
        </div>`).join('')}
  `;
}

function setPolicyFilter(f) { S.policyFilter = f; rMoreContent('policy'); }

async function policyAsk() {
  const q = document.getElementById('pol-ask')?.value?.trim(); if (!q) return;
  const out = document.getElementById('pol-ai-out');
  out.innerHTML = `<div class="card"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
  try {
    const policyNames = [...(S.policies.central||[]),...(S.policies.mp_state||[])].map(p=>p.name).join(', ');
    const reply = await callGroq([{role:'user', content:
      `उपलब्ध योजनाएं: ${policyNames}\n\nकिसान का सवाल: ${q}\n\nइस किसान (${S.farmer?.district}, ${S.farmer?.land} बीघा) के लिए कौन सी योजनाएं सबसे उपयुक्त हैं, पात्रता और आवेदन प्रक्रिया बताओ। 120 शब्दों में।`
    }]);
    out.innerHTML = `<div class="card" style="border-color:var(--sun-dk);margin-bottom:10px"><div style="font-size:10px;font-weight:900;color:var(--sun);margin-bottom:6px">🤖 AI योजना सलाह</div><div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.85">${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div></div>`;
  } catch(e) { out.innerHTML = `<div class="card"><div style="color:#FF8060;font-size:12px">Error: ${e.message}</div></div>`; }
}

function rSoil(el) {
  el.innerHTML = `
    <div class="st">मिट्टी स्वास्थ्य (आपके खेत)</div>
    <div class="card">
      <div style="font-size:13px;font-weight:900;color:var(--clay);margin-bottom:14px">काली मिट्टी (रेगुर) · ${S.farmer?.district}</div>
      ${[
        {l:'नाइट्रोजन (N)',v:'220 kg/ha',pct:58,c:'var(--warn)',s:'मध्यम'},
        {l:'फॉस्फोरस (P)',v:'18 kg/ha',pct:28,c:'#CC4400',s:'कम ⚠️'},
        {l:'पोटाश (K)',v:'310 kg/ha',pct:80,c:'var(--leaf2)',s:'पर्याप्त ✓'},
        {l:'जस्ता (Zinc)',v:'0.4 mg/kg',pct:18,c:'#CC1800',s:'बहुत कम ⚠️'},
        {l:'pH',v:'7.8',pct:72,c:'var(--sky)',s:'हल्का क्षारीय'},
      ].map(b=>`<div class="sbar"><div class="sbl"><span>${b.l}</span><span style="color:${b.c}">${b.v} · ${b.s}</span></div><div class="sbb"><div class="sbf" style="width:${b.pct}%;background:${b.c}"></div></div></div>`).join('')}
      <div style="font-size:11px;color:#504030;margin-top:10px">👆 अपनी असली मिट्टी रिपोर्ट अपलोड करें — AI पढ़ेगा और सब बदल देगा</div>
    </div>
    <button class="btn-sun" onclick="showPage('photo');setTimeout(()=>swPT('report',document.querySelectorAll('#page-photo .tab')[2]),200)">📄 मिट्टी रिपोर्ट अपलोड करें</button>
    <div class="st">AI मिट्टी सलाह</div>
    <div class="card">
      <div style="display:flex;gap:8px">
        <input id="s-q" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="जैसे: मिर्च के लिए कौन सी खाद?">
        <button id="s-mic" style="background:var(--sun);border:none;border-radius:8px;width:40px;height:40px;font-size:18px;cursor:pointer;flex-shrink:0" onclick="startVoice('s-q','s-mic')">🎤</button>
        <button style="background:var(--leaf);border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center" onclick="soilAsk()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8F090" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div id="s-ai-out"></div>
    </div>`;
}

async function soilAsk() {
  const q = document.getElementById('s-q')?.value?.trim(); if (!q) return;
  const out = document.getElementById('s-ai-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callGroq([{role:'user', content:`काली मिट्टी (रेगुर), pH 7.8, Zinc कम, P कम, ${S.farmer?.district}। सवाल: ${q} — 80 शब्दों में।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch(e) { out.innerHTML = `<div style="color:#FF8060;font-size:12px;margin-top:8px">Error: ${e.message}</div>`; }
}

function rTools(el) {
  el.innerHTML = `
    <div class="st">🧮 खाद कैलकुलेटर</div>
    <div class="card">
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <input id="tc-crop" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="फसल का नाम">
        <input id="tc-land" type="number" style="width:80px;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="बीघा">
      </div>
      <button class="btn-sun" onclick="calcFertiliser()">खाद की मात्रा जानें</button>
      <div id="tc-out"></div>
    </div>

    <div class="st">🌱 बुआई कैलेंडर</div>
    <div class="card">
      <button class="btn-sun" onclick="sowingCalendar()">इस माह क्या बोएं?</button>
      <div id="sc-out"></div>
    </div>

    <div class="st">💊 स्प्रे कैलेंडर</div>
    <div class="card">
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <input id="sp-crop" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="फसल का नाम">
        <input id="sp-age" type="number" style="width:80px;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="उम्र (दिन)">
      </div>
      <button class="btn-sun" onclick="spraySchedule()">स्प्रे कैलेंडर बनाओ</button>
      <div id="sp-out"></div>
    </div>

    <div class="st">⚙️ प्रोफाइल बदलें</div>
    <div class="card">
      <div class="drow"><div class="dcrop">👤</div><div><div class="dname">${S.farmer?.name}</div><div class="ddate">${S.farmer?.district} · ${S.farmer?.land} बीघा</div></div></div>
      <div class="drow"><div class="dcrop">🌾</div><div><div class="dname">फसलें</div><div class="ddate">${S.farmer?.crops?.join(', ')}</div></div></div>
      <button class="btn-leaf" onclick="editProfile()">प्रोफाइल बदलें</button>
    </div>
  `;
}

async function calcFertiliser() {
  const crop = document.getElementById('tc-crop')?.value?.trim();
  const land = document.getElementById('tc-land')?.value?.trim();
  if (!crop || !land) { showToast('फसल और बीघा दोनों भरें'); return; }
  const out = document.getElementById('tc-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callGroq([{role:'user', content:`${land} बीघा में ${crop} के लिए MP की काली मिट्टी में कितनी खाद चाहिए? DAP, Urea, MOP, Zinc Sulphate — बोरियों में बताओ। 80 शब्दों में।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch(e) { out.innerHTML = `<div style="color:#FF8060;font-size:12px;margin-top:8px">Error: ${e.message}</div>`; }
}

async function sowingCalendar() {
  const out = document.getElementById('sc-out');
  const month = new Date().toLocaleString('hi',{month:'long'});
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callGroq([{role:'user', content:`${month} में ${S.farmer?.district} MP में काली मिट्टी पर क्या बोया जाए? 5 फसलें बताओ — नाम, किस्म, बीज दर प्रति बीघा। 100 शब्दों में।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch(e) { out.innerHTML = `<div style="color:#FF8060;font-size:12px;margin-top:8px">Error: ${e.message}</div>`; }
}

async function spraySchedule() {
  const crop = document.getElementById('sp-crop')?.value?.trim();
  const age = document.getElementById('sp-age')?.value?.trim();
  if (!crop) { showToast('फसल का नाम भरें'); return; }
  const out = document.getElementById('sp-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callGroq([{role:'user', content:`${crop} (उम्र: ${age||'अज्ञात'} दिन) के लिए अगले 30 दिन का स्प्रे शेड्यूल बनाओ MP के मौसम के हिसाब से। कौन सा दिन, क्या स्प्रे, मात्रा। 100 शब्दों में।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch(e) { out.innerHTML = `<div style="color:#FF8060;font-size:12px;margin-top:8px">Error: ${e.message}</div>`; }
}

function editProfile() {
  localStorage.removeItem('km_farmer');
  location.reload();
}

// ── GENERAL CHAT OVERLAY ──────────────────────────────────────────────────────
function openChat(initialMsg) {
  S.chatHistory = [];
  document.getElementById('chat-thread-main').innerHTML = '';
  document.getElementById('chat-input-main').value = '';
  document.getElementById('chat-overlay').classList.add('open');
  if (initialMsg) mainChatSend(initialMsg);
}

async function mainChatSend(msg) {
  const thread = document.getElementById('chat-thread-main');
  const userDiv = document.createElement('div'); userDiv.className = 'msg user'; userDiv.textContent = msg;
  thread.appendChild(userDiv);
  const typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<span></span><span></span><span></span>';
  thread.appendChild(typing); thread.scrollTop = thread.scrollHeight;
  S.chatHistory.push({role:'user', content: msg});
  try {
    const reply = await callGroq(S.chatHistory);
    S.chatHistory.push({role:'assistant', content: reply});
    typing.remove();
    const aiDiv = document.createElement('div'); aiDiv.className = 'msg ai';
    aiDiv.innerHTML = `<div class="msg-label">🤖 किसान मित्र AI</div>${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}`;
    thread.appendChild(aiDiv); thread.scrollTop = thread.scrollHeight;
  } catch(e) {
    typing.remove();
    const errDiv = document.createElement('div'); errDiv.className = 'msg ai';
    errDiv.innerHTML = `<span style="color:#FF8060">Error: ${e.message}</span>`;
    thread.appendChild(errDiv);
  }
}

function sendMainChat() {
  const inp = document.getElementById('chat-input-main');
  const q = inp.value.trim(); if (!q) return;
  inp.value = ''; mainChatSend(q);
}

function closeChat() { document.getElementById('chat-overlay').classList.remove('open'); }
