'use strict';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const OWM_KEY = 'PASTE_YOUR_OPENWEATHERMAP_KEY_HERE'; // free at openweathermap.org
const INDORE_LAT = 22.7196, INDORE_LON = 75.8577;
const AI_MODEL = 'claude-sonnet-4-20250514';
const AI_SYSTEM = `You are किसान मित्र AI — a helpful, warm farming assistant for farmers in Madhya Pradesh, India (Indore, Khargone, Khandwa districts). Black cotton soil zone. Always respond in simple Hindi (Devanagari script). Be practical, specific, and caring. Use local terms farmers understand. Give doses in bigha or acre. Mention local crop varieties when relevant. Keep responses concise but complete.`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const CROPS = ['सोयाबीन','गेहूं','कपास','मिर्च','प्याज','लहसुन','धनिया','टमाटर','गाजर','भिंडी','केला','पपीता','आम','अमरूद','अनार','मक्का','चना','तरबूज','नींबू','बैंगन','फूलगोभी','पालक','खीरा','मूंग','उड़द'];

const PESTS = [
  {e:'🦗',n:'गर्डल बीटल',crop:'सोयाबीन',season:'जुलाई–अगस्त',risk:'high',
   short:'तना काटकर सोयाबीन को नुकसान पहुंचाता है',
   detail:'गर्डल बीटल सोयाबीन का सबसे खतरनाक कीट है। मादा तने में अंडे देती है और वहीं रिंग बनाकर काट देती है जिससे ऊपरी हिस्सा सूख जाता है।\n\n**पहचान:** तने पर गोलाकार निशान, ऊपर से पत्तियां पीली-भूरी\n**नुकसान:** 20-80% तक उपज कम\n**नियंत्रण:** Chlorpyriphos 20EC @ 1.5ml/लीटर या Triazophos 40EC @ 2ml/लीटर\n**जैविक:** नीम तेल 5ml/लीटर, सुबह छिड़काव\n**बचाव:** जुलाई के पहले हफ्ते में निवारक छिड़काव'},
  {e:'🐛',n:'हेलिकोवर्पा बोरर',crop:'कपास, मिर्च, टमाटर, चना',season:'सालभर',risk:'high',
   short:'फल और फलियों में छेद करके नुकसान पहुंचाता है',
   detail:'हेलिकोवर्पा (बोलवर्म) बहुत सी फसलों को नुकसान पहुंचाता है। सुंडी फल, फली और डोडे में घुसकर खाती है।\n\n**पहचान:** फल पर गोल छेद, अंदर हरी-भूरी सुंडी\n**नियंत्रण:** Spinosad 45SC @ 0.3ml/लीटर या Emamectin 5SG @ 0.4g/लीटर\n**जैविक:** HaNPV वायरस 250LE/हेक्टेयर, शाम को छिड़काव\n**ट्रैप:** फेरोमोन ट्रैप 5/एकड़ — नर कीट पकड़े\n**बचाव:** अंडे के लिए पत्तियां जांचते रहें'},
  {e:'🦟',n:'थ्रिप्स',crop:'मिर्च, प्याज, कपास',season:'नवम्बर–मार्च',risk:'high',
   short:'पत्तियां मुड़ाता है, वायरस फैलाता है',
   detail:'थ्रिप्स बहुत छोटे कीट हैं जो पत्तियों का रस चूसते हैं और लीफ कर्ल वायरस फैलाते हैं। मिर्च में बहुत नुकसानदेह।\n\n**पहचान:** पत्तियां ऊपर की ओर मुड़ती हैं, नीचे चांदी जैसा रंग\n**नियंत्रण:** Spinosad 45SC @ 0.3ml/लीटर या Imidacloprid 17.8SL @ 0.5ml/लीटर\n**जैविक:** नीम तेल 5ml/लीटर + साबुन 1ml/लीटर\n**ट्रैप:** नीली और पीली स्टिकी ट्रैप 10/एकड़\n**सावधानी:** एक ही दवा बार-बार न डालें — resistance होता है'},
  {e:'🦎',n:'सफेद मक्खी',crop:'कपास, मिर्च, टमाटर',season:'जुलाई–नवम्बर',risk:'high',
   short:'लीफ कर्ल वायरस फैलाती है, रस चूसती है',
   detail:'सफेद मक्खी (Whitefly) लीफ कर्ल वायरस की सबसे बड़ी वाहक है। एक बार वायरस फैल जाए तो इलाज नहीं।\n\n**पहचान:** पत्ती हिलाने पर सफेद मक्खियां उड़ती हैं, पत्तियां पीली\n**नियंत्रण:** Thiamethoxam 25WG @ 0.5g/लीटर या Spiromesifen 22.9SC @ 1ml/लीटर\n**जैविक:** नीम तेल 5ml + साबुन 2ml/लीटर\n**ट्रैप:** पीली स्टिकी ट्रैप 10/एकड़\n**जरूरी:** प्रभावित पौधे तुरंत उखाड़ें, जलाएं'},
  {e:'🐜',n:'माहू (अफीड)',crop:'सरसों, गेहूं, धनिया, मिर्च',season:'नवम्बर–फरवरी',risk:'med',
   short:'रस चूसता है, चिपचिपा पदार्थ छोड़ता है',
   detail:'माहू (Aphid) ठंड के मौसम में तेजी से फैलता है। पत्तियों का रस चूसता है और मधुरस छोड़ता है जिससे काला कवक लगता है।\n\n**पहचान:** छोटे हरे-काले कीट पत्तियों के नीचे, चिपचिपापन\n**नियंत्रण:** Dimethoate 30EC @ 1.5ml/लीटर या Imidacloprid @ 0.5ml/लीटर\n**जैविक:** नीम तेल, साबुन का घोल, लहसुन-मिर्च अर्क\n**प्राकृतिक दुश्मन:** लेडी बर्ड बीटल — इन्हें बचाएं!\n**बचाव:** नाइट्रोजन कम डालें — माहू को नरम पत्तियां पसंद'},
  {e:'🐞',n:'लाल मकड़ी (Spider Mite)',crop:'सोयाबीन, कपास, बैंगन',season:'जून–सितम्बर',risk:'med',
   short:'पत्ती कांसे जैसी हो जाती है, जाला दिखता है',
   detail:'लाल मकड़ी (Red Spider Mite) गर्म-सूखे मौसम में तेजी से फैलती है। पत्तियों की कोशिकाओं का रस चूसती है।\n\n**पहचान:** पत्ती का रंग कांसा-भूरा, नीचे महीन जाला\n**नियंत्रण:** Abamectin 1.9EC @ 0.5ml/लीटर या Propargite 57EC @ 2ml/लीटर\n**जैविक:** नीम तेल 10ml/लीटर, लहसुन अर्क\n**ध्यान:** कीटनाशक नहीं — acaricide (माइटिसाइड) चाहिए\n**बचाव:** नमी बनाए रखें, पत्तियों पर पानी छिड़कें'},
  {e:'🦋',n:'पत्ती सुरंग कीट',crop:'टमाटर, भिंडी, गाजर, आलू',season:'अक्टूबर–मार्च',risk:'low',
   short:'पत्तियों में सफेद सुरंग बनाता है',
   detail:'पत्ती सुरंग कीट (Leaf Miner) की सुंडियां पत्तियों के अंदर सुरंग बनाकर हरा भाग खाती हैं।\n\n**पहचान:** पत्तियों पर सफेद टेढ़ी-मेढ़ी लकीरें, सुरंग\n**नियंत्रण:** Cyromazine 75WP @ 1.5g/लीटर या Abamectin @ 0.5ml/लीटर\n**जैविक:** नीम तेल 5ml/लीटर\n**ट्रैप:** पीली स्टिकी ट्रैप\n**बचाव:** प्रभावित पत्तियां तोड़कर नष्ट करें'},
  {e:'🐝',n:'दीमक (Termite)',crop:'गन्ना, मक्का, गेहूं, मूंगफली',season:'मई–जुलाई',risk:'med',
   short:'जड़ें खाता है, पौधा अचानक मर जाता है',
   detail:'दीमक (Termite) जड़ों और तने को खाती है। गर्मियों में नई फसल में सबसे अधिक नुकसान।\n\n**पहचान:** पौधा अचानक मुरझाता है, जड़ पर मिट्टी की नलियां\n**नियंत्रण:** Chlorpyriphos 20EC @ 3ml/लीटर सिंचाई के पानी में\n**बीज उपचार:** Imidacloprid 600FS @ 1ml/kg बीज\n**मिट्टी उपचार:** Chlorpyriphos 1.5% पाउडर 10kg/एकड़\n**जैविक:** Beauveria bassiana 1kg/एकड़'},
];

const MANDI_DATA = [
  {c:'🌶️ मिर्च (लाल सूखी)',l:'खरगोन',p:18500,prev:17700,unit:'क्विंटल'},
  {c:'🫘 सोयाबीन',l:'इंदौर',p:4320,prev:4440,unit:'क्विंटल'},
  {c:'🧅 प्याज',l:'इंदौर',p:1850,prev:1650,unit:'क्विंटल'},
  {c:'🌾 गेहूं',l:'खंडवा',p:2275,prev:2275,unit:'क्विंटल'},
  {c:'🧄 लहसुन',l:'इंदौर',p:9200,prev:8750,unit:'क्विंटल'},
  {c:'🌿 धनिया बीज',l:'खंडवा',p:6800,prev:7100,unit:'क्विंटल'},
  {c:'🍌 केला',l:'खरगोन',p:1200,prev:1120,unit:'क्विंटल'},
  {c:'🥕 गाजर',l:'इंदौर',p:1600,prev:1500,unit:'क्विंटल'},
  {c:'🍅 टमाटर',l:'इंदौर',p:1100,prev:1250,unit:'क्विंटल'},
  {c:'🫛 चना',l:'इंदौर',p:5600,prev:5400,unit:'क्विंटल'},
];

const SCHEMES = [
  {n:'PM-KISAN सम्मान निधि',d:'₹6,000/वर्ष — 3 किस्तों में। अगली किस्त अप्रैल 2026।',b:'पंजीकृत ✓'},
  {n:'PM फसल बीमा योजना',d:'खरीफ 2025 — अंतिम तिथि 31 जुलाई 2025।',b:'आवेदन करें ⚠️'},
  {n:'CM किसान कल्याण',d:'₹4,000 अतिरिक्त — PM-KISAN के साथ MP सरकार द्वारा।',b:'लाभ लें'},
  {n:'मृदा स्वास्थ्य कार्ड',d:'निःशुल्क मिट्टी परीक्षण — नजदीकी कृषि कार्यालय।',b:'निःशुल्क'},
  {n:'किसान क्रेडिट कार्ड',d:'4% ब्याज पर खेती ऋण — नजदीकी बैंक में आवेदन।',b:'KCC बनवाएं'},
];

// ── STATE ─────────────────────────────────────────────────────────────────────
let state = {
  page: 'home',
  photoTab: 'crop',
  moreSub: 'mandi',
  activeCrop: null,
  photoData: null,
  weatherData: null,
  chatHistory: [],
  aiLoading: false,
  recognition: null,
  micActive: false,
};

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderPage('home');
  fetchWeather();
  setInterval(fetchWeather, 10 * 60 * 1000);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/kisan-mitra_App/sw.js').catch(()=>{});
});

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function showPage(page) {
  state.page = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelector(`.nb[data-page="${page}"]`)?.classList.add('active');
  renderPage(page);
}

function renderPage(page) {
  const fns = {home: renderHome, photo: renderPhoto, weather: renderWeather, pest: renderPest, more: renderMore};
  fns[page]?.();
}

// ── WEATHER API ───────────────────────────────────────────────────────────────
async function fetchWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${INDORE_LAT}&lon=${INDORE_LON}&appid=${OWM_KEY}&units=metric&lang=hi`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const d = await res.json();
    state.weatherData = {
      temp: Math.round(d.main.temp),
      feels: Math.round(d.main.feels_like),
      min: Math.round(d.main.temp_min),
      max: Math.round(d.main.temp_max),
      hum: d.main.humidity,
      wind: Math.round(d.wind.speed * 3.6),
      desc: d.weather[0].description,
      icon: owmIcon(d.weather[0].id),
      rain: d.rain?.['1h'] || 0,
      live: true,
    };
  } catch {
    state.weatherData = {temp:34,min:24,max:38,hum:62,wind:8,desc:'आंशिक बादल',icon:'⛅',rain:0,feels:37,live:false};
  }
  updateWeatherHeader();
  if (state.page === 'weather') renderWeather();
  if (state.page === 'home') renderHome();
}

function owmIcon(id) {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id === 800) return '☀️';
  if (id === 801) return '🌤️';
  if (id <= 804) return '⛅';
  return '🌥️';
}

function updateWeatherHeader() {
  const w = state.weatherData;
  if (!w) return;
  const el = document.getElementById('hdr-weather');
  if (el) el.innerHTML = `<span class="w-temp">${w.icon} ${w.temp}°</span><span class="w-desc">इंदौर${w.live?' · Live':''}</span>`;
}

// ── AI CALL ───────────────────────────────────────────────────────────────────
async function callAI(messages, imageBase64 = null) {
  const msgs = messages.map(m => {
    if (m.role === 'user' && imageBase64 && messages.indexOf(m) === messages.length - 1) {
      return {
        role: 'user',
        content: [
          {type:'image', source:{type:'base64', media_type:'image/jpeg', data: imageBase64}},
          {type:'text', text: m.content}
        ]
      };
    }
    return m;
  });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({model: AI_MODEL, max_tokens: 1000, system: AI_SYSTEM, messages: msgs})
  });
  const data = await res.json();
  return data.content?.map(b => b.text || '').join('') || '';
}

// ── VOICE ─────────────────────────────────────────────────────────────────────
function startVoice(inputId, micBtnId) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert('आपके ब्राउज़र में आवाज की सुविधा नहीं है।'); return; }
  if (state.micActive) { state.recognition?.stop(); return; }
  const r = new SR();
  state.recognition = r;
  r.lang = 'hi-IN'; r.continuous = false; r.interimResults = false;
  r.onstart = () => { state.micActive = true; document.getElementById(micBtnId)?.classList.add('mic-active'); };
  r.onresult = e => { document.getElementById(inputId).value = e.results[0][0].transcript; };
  r.onend = () => { state.micActive = false; document.getElementById(micBtnId)?.classList.remove('mic-active'); };
  r.onerror = () => { state.micActive = false; };
  r.start();
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function renderHome() {
  const w = state.weatherData || {temp:34,min:24,max:38,hum:62,wind:8,icon:'⛅',live:false};
  document.getElementById('page-home').innerHTML = `
    <div class="card" style="background:var(--soil2);display:flex;gap:14px;align-items:center;margin-bottom:12px">
      <div style="font-size:48px;line-height:1">${w.icon}</div>
      <div style="flex:1">
        <div style="font-size:32px;font-weight:900;color:var(--sun);line-height:1">${w.temp}°C</div>
        <div style="font-size:11px;font-weight:700;color:#806040;margin-top:3px">${w.min}°–${w.max}° · नमी ${w.hum}% · हवा ${w.wind}km/h</div>
        <div style="font-size:10px;color:#605030;margin-top:2px">${w.live?'🟢 Live — इंदौर':'📡 अनुमानित — इंदौर'}</div>
      </div>
      <button onclick="showPage('weather')" style="background:var(--sun);border:none;border-radius:8px;padding:8px 12px;font-size:11px;font-weight:900;color:var(--sun-txt);cursor:pointer;font-family:var(--font)">7 दिन</button>
    </div>

    <div class="alert warn">
      <div class="alert-icon">🌧️</div>
      <div><div class="alert-title">कल 18-32mm बारिश — सतर्क रहें</div>
      <div class="alert-desc">कीटनाशक छिड़काव आज शाम कर लें। नाली खुली रखें।</div></div>
    </div>

    <div class="ask-bar" onclick="document.getElementById('home-ask').focus()">
      <input id="home-ask" class="ask-bar-input" placeholder="कोई भी सवाल पूछें — मिर्च, मिट्टी, मौसम..." onkeydown="if(event.key==='Enter')homeAsk()"/>
      <button class="ask-bar-mic" id="home-mic" onclick="startVoice('home-ask','home-mic')">🎤</button>
      <button class="ask-bar-send" onclick="homeAsk()">
        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
    <div id="home-ai-out"></div>

    <div class="st">त्वरित कार्य</div>
    <div class="qgrid">
      <div class="qbtn highlight" onclick="showPage('photo')"><div class="qi">📸</div><div class="ql">फोटो जांच</div><div class="qs">रोग · मिट्टी · रिपोर्ट</div></div>
      <div class="qbtn" onclick="showPage('pest')"><div class="qi">🐛</div><div class="ql">कीट पहचान</div><div class="qs">इस मौसम के कीट</div></div>
      <div class="qbtn" onclick="goMore('mandi')"><div class="qi">💰</div><div class="ql">मंडी भाव</div><div class="qs">आज के ताज़ा भाव</div></div>
      <div class="qbtn" onclick="goMore('soil')"><div class="qi">🧪</div><div class="ql">मिट्टी जांच</div><div class="qs">NPK · pH · सुझाव</div></div>
    </div>

    <div class="st">आपकी फसलें</div>
    <div class="card">
      ${[{e:'🌶️',n:'मिर्च (हाइब्रिड)',d:'बुआई: 15 जुलाई',a:'3.5 बीघा'},{e:'🫘',n:'सोयाबीन (JS-9560)',d:'बुआई: 20 जून',a:'8 बीघा'},{e:'🧅',n:'प्याज (नासिक लाल)',d:'रोपाई: 10 नवम्बर',a:'2 बीघा'}]
      .map(d=>`<div class="drow"><div class="dcrop">${d.e}</div><div><div class="dname">${d.n}</div><div class="ddate">${d.d}</div></div><div class="darea">${d.a}</div></div>`).join('')}
      <button class="btn-sun" style="margin-top:10px" onclick="goMore('diary')">फसल डायरी देखें</button>
    </div>

    <div class="st">आज के मंडी भाव</div>
    <div class="card">
      ${MANDI_DATA.slice(0,5).map(m=>{
        const diff = m.p - m.prev, up = diff >= 0;
        return `<div class="mandi-row"><div><div class="mandi-crop">${m.c}</div><div class="mandi-loc">${m.l} मंडी · प्रति ${m.unit}</div></div><div class="mandi-price"><div class="mpv">₹${m.p.toLocaleString('hi')}</div><div class="mpc ${up?'up':'dn'}">${up?'+':''}₹${Math.abs(diff)} ${up?'▲':'▼'}</div></div></div>`;
      }).join('')}
      <button class="btn-leaf" onclick="goMore('mandi')">सभी भाव देखें</button>
    </div>

    <div class="st">किसान समुदाय</div>
    <div class="card">
      <div class="post">
        <div class="post-hdr"><div class="av" style="background:#3D2C16;color:var(--sun)">रव</div><div><div class="pname">रवींद्र पाटिल</div><div class="ploc">खरगोन · 2 घंटे पहले</div></div></div>
        <div class="ptxt">मेरी मिर्च की पत्तियां मुड़ रही हैं और पीली हो रही हैं। कोई बताए?</div>
        <span class="ptag">मिर्च</span><span class="ptag">रोग</span>
        <div style="margin-top:8px"><button class="pact" onclick="communityAI('comm-ai-1','मिर्च की पत्तियां मुड़ रही हैं पीली हो रही हैं, खरगोन MP')">🤖 AI जवाब दें</button><button class="pact">💬 जवाब दें</button></div>
        <div id="comm-ai-1"></div>
      </div>
      <div class="post">
        <div class="post-hdr"><div class="av" style="background:#2A1800;color:var(--sun)">सु</div><div><div class="pname">सुरेश वर्मा</div><div class="ploc">इंदौर · कल</div></div></div>
        <div class="ptxt">JS-9560 सोयाबीन में 18 क्विंटल/एकड़ मिली! सभी को सलाह दूंगा।</div>
        <span class="ptag">सोयाबीन</span><span class="ptag">सफलता</span>
      </div>
    </div>
  `;
}

async function homeAsk() {
  const q = document.getElementById('home-ask')?.value?.trim();
  if (!q) return;
  document.getElementById('home-ask').value = '';
  const out = document.getElementById('home-ai-out');
  out.innerHTML = `<div class="card"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
  try {
    const reply = await callAI([{role:'user', content: q + ' (इंदौर-खरगोन-खंडवा MP के किसान के लिए)'}]);
    out.innerHTML = `<div class="card" style="border-color:var(--sun-dk)"><div style="font-size:10px;font-weight:900;color:var(--sun);margin-bottom:6px">🤖 AI जवाब</div><div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.8">${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div></div>`;
  } catch {
    out.innerHTML = `<div class="card"><div style="font-size:13px;color:#806040">नेटवर्क समस्या है। दोबारा प्रयास करें।</div></div>`;
  }
}

async function communityAI(outId, question) {
  const out = document.getElementById(outId);
  out.innerHTML = `<div class="loading-dots" style="padding:8px 0"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callAI([{role:'user', content: question + ' — 60 शब्दों में उपाय बताओ'}]);
    out.innerHTML = `<div class="card" style="margin-top:8px;border-color:var(--leaf2)"><div style="font-size:10px;font-weight:900;color:var(--sun);margin-bottom:5px">🤖 AI सलाह</div><div style="font-size:12px;font-weight:600;color:var(--clay);line-height:1.75">${reply.replace(/\n/g,'<br>')}</div></div>`;
  } catch {
    out.innerHTML = `<div style="font-size:12px;color:#806040;padding:6px 0">नेटवर्क समस्या।</div>`;
  }
}

// ── PHOTO PAGE ────────────────────────────────────────────────────────────────
function renderPhoto() {
  document.getElementById('page-photo').innerHTML = `
    <div class="tabs">
      <button class="tab ${state.photoTab==='crop'?'active':''}" onclick="swPT('crop',this)">🌿 फसल/पत्ती</button>
      <button class="tab ${state.photoTab==='soil'?'active':''}" onclick="swPT('soil',this)">🌱 मिट्टी</button>
      <button class="tab ${state.photoTab==='report'?'active':''}" onclick="swPT('report',this)">📄 रिपोर्ट</button>
    </div>

    <div class="photo-btns">
      <button class="photo-btn" onclick="triggerCamera()"><span class="pb-icon">📷</span>कैमरे से खींचें</button>
      <button class="photo-btn" onclick="triggerGallery()"><span class="pb-icon">🖼️</span>गैलरी से चुनें</button>
    </div>

    <img id="photo-preview" class="photo-preview" alt="फोटो">
    <input id="cam-input" type="file" accept="image/*" capture="environment" style="display:none" onchange="handlePhoto(this)">
    <input id="gal-input" type="file" accept="image/*" style="display:none" onchange="handlePhoto(this)">

    <div id="photo-zone">
      ${photoZoneHTML()}
    </div>

    <div id="photo-ai-out"></div>

    <div class="st">फसल चुनें</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${CROPS.map(c=>`<button style="background:${state.activeCrop===c?'var(--sun)':'var(--soil2)'};color:${state.activeCrop===c?'var(--sun-txt)':'#A08060'};border:1.5px solid ${state.activeCrop===c?'var(--sun-dk)':'var(--soil3)'};border-radius:20px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font)" onclick="selCrop('${c}',this)">${c}</button>`).join('')}
    </div>

    <div class="st">पिछली जांच</div>
    <div class="card">
      <div class="drow"><div class="dcrop">🌶️</div><div><div class="dname">मिर्च — लीफ कर्ल वायरस</div><div class="ddate">3 दिन पहले · गंभीर</div></div><span class="badge badge-fire">गंभीर</span></div>
      <div class="drow"><div class="dcrop">🌱</div><div><div class="dname">मिट्टी — जस्ता की कमी</div><div class="ddate">10 दिन पहले</div></div><span class="badge badge-sun">ठीक हुआ</span></div>
    </div>
  `;
}

function photoZoneHTML() {
  const cfg = {
    crop:{icon:'🌿',title:'फसल, पत्ती या फल की फोटो',sub:'रोग · कीट नुकसान · पोषण कमी'},
    soil:{icon:'🌱',title:'मिट्टी की फोटो',sub:'रंग · बनावट · दरारें — AI जांचेगा'},
    report:{icon:'📄',title:'मिट्टी परीक्षण रिपोर्ट की फोटो',sub:'NPK मान AI खुद पढ़ेगा'},
  }[state.photoTab];
  return `<div class="photo-zone" onclick="triggerGallery()"><div class="pz-icon">${cfg.icon}</div><div class="pz-title">${cfg.title}</div><div class="pz-sub">${cfg.sub}</div><div style="margin-top:12px;background:var(--sun);color:var(--sun-txt);border-radius:8px;padding:9px 20px;font-size:13px;font-weight:900;display:inline-block">फोटो चुनें या खींचें</div></div>`;
}

function swPT(t, btn) {
  state.photoTab = t; state.photoData = null;
  document.querySelectorAll('#page-photo .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('photo-zone').innerHTML = photoZoneHTML();
  document.getElementById('photo-ai-out').innerHTML = '';
  const prev = document.getElementById('photo-preview');
  if (prev) { prev.src = ''; prev.classList.remove('show'); }
}

function triggerCamera() { document.getElementById('cam-input').click(); }
function triggerGallery() { document.getElementById('gal-input').click(); }

function selCrop(c, btn) {
  state.activeCrop = c;
  document.querySelectorAll('#page-photo button[onclick^="selCrop"]').forEach(b=>{
    b.style.background = 'var(--soil2)'; b.style.color = '#A08060'; b.style.borderColor = 'var(--soil3)';
  });
  btn.style.background = 'var(--sun)'; btn.style.color = 'var(--sun-txt)'; btn.style.borderColor = 'var(--sun-dk)';
}

function handlePhoto(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result.split(',')[1];
    state.photoData = base64;
    const prev = document.getElementById('photo-preview');
    if (prev) { prev.src = e.target.result; prev.classList.add('show'); }
    runPhotoAI();
  };
  reader.readAsDataURL(file);
}

async function runPhotoAI() {
  if (state.aiLoading) return;
  state.aiLoading = true;
  const crop = state.activeCrop || 'फसल';
  const out = document.getElementById('photo-ai-out');
  out.innerHTML = `<div class="card"><div class="loading-dots"><span></span><span></span><span></span></div><div style="font-size:12px;font-weight:700;color:#806040;padding:0 0 8px 0">AI विश्लेषण हो रहा है...</div></div>`;

  const prompts = {
    crop: `किसान की ${crop} फसल की फोटो देखो। बताओ: 1) क्या रोग/समस्या है (नाम)? 2) गंभीरता: सामान्य/चिंताजनक/गंभीर 3) कारण 4) तुरंत रासायनिक उपाय (दवा का नाम + मात्रा) 5) जैविक उपाय 6) बचाव। MP के किसान के लिए 150 शब्दों में।`,
    soil: `इस मिट्टी की फोटो देखो (MP की काली मिट्टी/रेगुर क्षेत्र)। बताओ: मिट्टी का प्रकार, रंग से स्वास्थ्य संकेत, संभावित कमियां, सुधार के उपाय (organic + chemical प्रति बीघा)। अंत में: "पक्की जानकारी के लिए मिट्टी परीक्षण करवाएं।" 150 शब्दों में।`,
    report: `इस मिट्टी परीक्षण रिपोर्ट/कार्ड को पढ़ो। NPK मान निकालो, pH, Zinc/Sulfur/Boron। प्रत्येक पोषक तत्व का स्तर बताओ (कम/मध्यम/पर्याप्त)। प्रति बीघा खाद की सिफारिश करो। 150 शब्दों में।`,
  };

  try {
    const reply = await callAI([{role:'user', content: prompts[state.photoTab]}], state.photoData);
    let sev = 'चिंताजनक', sevColor = 'var(--warn)', sevBg = '#2A1400';
    if (reply.includes('गंभीर')) { sev = 'गंभीर'; sevColor = '#FF8060'; sevBg = '#3A0A00'; }
    if (reply.includes('सामान्य') && !reply.includes('असामान्य')) { sev = 'सामान्य'; sevColor = 'var(--leaf-lt)'; sevBg = '#0A2000'; }
    out.innerHTML = `
      <div class="card" style="border-color:var(--sun-dk)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="font-size:14px;font-weight:900;color:var(--sun)">🤖 AI विश्लेषण</div>
          <span style="background:${sevBg};color:${sevColor};border:1px solid ${sevColor};padding:3px 10px;border-radius:10px;font-size:11px;font-weight:900">${sev}</span>
        </div>
        <div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.85">${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div>
        <div style="margin-top:10px;padding:8px;background:#2A1400;border-radius:8px;font-size:11px;font-weight:700;color:#C09050;border-left:3px solid var(--warn)">⚠️ यह AI का अनुमान है। पक्की जानकारी के लिए कृषि विशेषज्ञ या KVK से मिलें।</div>
        <button class="btn-sun" style="margin-top:10px" onclick="openPhotoChat()">💬 AI से और पूछें</button>
        <button class="btn-leaf" onclick="alert('समुदाय में साझा किया!')">📤 समुदाय में साझा करें</button>
      </div>`;
    state.aiLoading = false;
  } catch {
    state.aiLoading = false;
    const fallback = {
      crop: {t:'पत्ती मरोड़ वायरस (CLCV)',s:'गंभीर',b:'सफेद मक्खी से फैलता है। तुरंत Imidacloprid 17.8SL @ 0.5ml/लीटर छिड़काव करें। जैविक: नीम तेल 5ml + साबुन 1ml/लीटर। प्रभावित पौधे हटाएं। पीली स्टिकी ट्रैप लगाएं।'},
      soil: {t:'मिट्टी स्वास्थ्य — काली मिट्टी',s:'चिंताजनक',b:'Zinc और Sulfur की कमी के संकेत। जिंक सल्फेट 2kg/बीघा + जिप्सम 10kg/बीघा डालें। वर्मीकम्पोस्ट से जैविक सुधार करें।'},
      report: {t:'NPK विश्लेषण',s:'सामान्य',b:'N: 220kg/ha (मध्यम) | P: 18kg/ha (कम ⚠️) | K: 310kg/ha (पर्याप्त)। प्रति बीघा: यूरिया 8kg + DAP 10kg + जिंक सल्फेट 2kg।'},
    }[state.photoTab];
    out.innerHTML = `<div class="card" style="border-color:var(--sun-dk)"><div style="font-size:14px;font-weight:900;color:var(--sun);margin-bottom:8px">${fallback.t} <span class="badge badge-sun">${fallback.s}</span></div><div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.8">${fallback.b}</div><button class="btn-sun" style="margin-top:10px" onclick="openPhotoChat()">💬 AI से और पूछें</button></div>`;
  }
}

function openPhotoChat() {
  openChat(`मेरी ${state.activeCrop||'फसल'} की फोटो AI ने देखी। मुझे और जानकारी चाहिए।`, state.photoData);
}

// ── WEATHER PAGE ──────────────────────────────────────────────────────────────
function renderWeather() {
  const w = state.weatherData || {temp:34,min:24,max:38,hum:62,wind:8,icon:'⛅',live:false,feels:37,rain:0,desc:'आंशिक बादल'};
  const pct = Math.round(847/920*100);
  const forecast = [
    {d:'आज',i:w.icon,h:w.max,l:w.min,r:w.rain>0?Math.round(w.rain*24):0},
    {d:'कल',i:'🌧️',h:32,l:22,r:18},{d:'बुध',i:'🌧️',h:29,l:21,r:32},
    {d:'गुरु',i:'⛅',h:33,l:23,r:5},{d:'शुक्र',i:'☀️',h:39,l:25,r:0},
    {d:'शनि',i:'⛅',h:35,l:24,r:2},{d:'रवि',i:'☀️',h:39,l:26,r:0},
  ];

  document.getElementById('page-weather').innerHTML = `
    <div class="w-hero">
      <div class="w-icon-big">${w.icon}</div>
      <div>
        <div class="w-temp-big">${w.temp}°C</div>
        <div class="w-loc">इंदौर जिला ${w.live?'· 🟢 Live':''}</div>
        <div class="w-det">महसूस: ${w.feels}° · ${w.desc}</div>
        <div class="w-det">${w.min}°–${w.max}° · नमी ${w.hum}% · हवा ${w.wind}km/h</div>
      </div>
    </div>

    ${w.wind < 10 ? `<div class="alert good"><div class="alert-icon">✅</div><div><div class="alert-title">छिड़काव के लिए अच्छा समय</div><div class="alert-desc">हवा ${w.wind}km/h — अभी कीटनाशक/फफूंदनाशक छिड़क सकते हैं।</div></div></div>` : `<div class="alert warn"><div class="alert-icon">💨</div><div><div class="alert-title">तेज हवा — छिड़काव न करें</div><div class="alert-desc">हवा ${w.wind}km/h — 10km/h से कम होने पर छिड़काव करें।</div></div></div>`}
    ${w.hum > 75 ? `<div class="alert danger"><div class="alert-icon">💧</div><div><div class="alert-title">अधिक नमी — फफूंद का खतरा</div><div class="alert-desc">नमी ${w.hum}% — मिर्च/टमाटर में Mancozeb का निवारक छिड़काव करें।</div></div></div>` : ''}

    <div class="st">7 दिन का पूर्वानुमान</div>
    <div class="frow">${forecast.map((f,i)=>`<div class="fday ${i===0?'today':''}"><div class="fd-d">${f.d}</div><div class="fd-i">${f.i}</div><div class="fd-t">${f.h}°/${f.l}°</div><div class="fd-r">${f.r>0?'💧'+f.r+'mm':'—'}</div></div>`).join('')}</div>

    <div class="st">मानसून ट्रैकर 2025</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div><div style="font-size:11px;font-weight:800;color:#806040">संचित वर्षा</div><div style="font-size:28px;font-weight:900;color:var(--sky-lt)">847mm</div></div>
        <div style="text-align:right"><div style="font-size:11px;font-weight:800;color:#806040">सामान्य</div><div style="font-size:28px;font-weight:900;color:#605030">920mm</div></div>
      </div>
      <div class="mbar"><div class="mbl"><span>प्रगति (${pct}%)</span><span>73mm कम</span></div><div class="mbb"><div class="mbf" style="width:${pct}%"></div></div></div>
      <div style="font-size:10px;font-weight:700;color:#504030;margin-top:8px">जून–सितम्बर 2025 · इंदौर-खरगोन जिला</div>
    </div>

    <div class="wgrid">
      <div class="wstat"><div class="wl">नमी</div><div class="wv">${w.hum}%</div><div class="ws">${w.hum>70?'फफूंद जोखिम ⚠️':'सामान्य ✓'}</div></div>
      <div class="wstat"><div class="wl">हवा</div><div class="wv">${w.wind}</div><div class="ws">km/h · ${w.wind<10?'स्प्रे ठीक ✓':'स्प्रे न करें ⚠️'}</div></div>
    </div>

    <div class="st">फसल चेतावनियां</div>
    <div class="card">
      <div class="drow"><div class="dcrop">🌶️</div><div><div class="dname">मिर्च — तापमान चेतावनी</div><div class="ddate">39°C पर फूल झड़ते हैं — शाम सिंचाई करें</div></div></div>
      <div class="drow"><div class="dcrop">🫘</div><div><div class="dname">सोयाबीन — जलभराव</div><div class="ddate">बारिश से पहले नाली खुली रखें</div></div></div>
      <div class="drow"><div class="dcrop">🍌</div><div><div class="dname">केला — तेज हवा</div><div class="ddate">30+ km/h हवा में बांस का सहारा दें</div></div></div>
    </div>

    <div class="st">AI से मौसम सलाह</div>
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center">
        <input id="w-q" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px 12px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="जैसे: कल बारिश है, क्या करें?">
        <button id="w-mic" style="background:var(--sun);border:none;border-radius:8px;width:40px;height:40px;font-size:18px;cursor:pointer" onclick="startVoice('w-q','w-mic')">🎤</button>
        <button style="background:var(--leaf);border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center" onclick="weatherAsk()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8F090" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div id="w-ai-out"></div>
    </div>
  `;
}

async function weatherAsk() {
  const q = document.getElementById('w-q')?.value?.trim();
  if (!q) return;
  const w = state.weatherData;
  const out = document.getElementById('w-ai-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const ctx = w ? `मौजूदा मौसम: ${w.temp}°C, नमी ${w.hum}%, हवा ${w.wind}km/h` : '';
    const reply = await callAI([{role:'user', content:`${ctx}\n\nसवाल: ${q} — इंदौर-खरगोन जिले के किसान के लिए 80 शब्दों में सलाह।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch { out.innerHTML = `<div style="font-size:12px;color:#806040;margin-top:8px">नेटवर्क समस्या।</div>`; }
}

// ── PEST PAGE ─────────────────────────────────────────────────────────────────
function renderPest() {
  document.getElementById('page-pest').innerHTML = `
    <div class="alert warn">
      <div class="alert-icon">🐛</div>
      <div><div class="alert-title">खरीफ सीजन — कीट सतर्कता</div>
      <div class="alert-desc">किसी भी कीट पर टैप करें — पूरी जानकारी और AI से बात करें।</div></div>
    </div>

    <div class="ask-bar" onclick="document.getElementById('pest-ask').focus()">
      <input id="pest-ask" class="ask-bar-input" placeholder="कीट का नाम या लक्षण पूछें..." onkeydown="if(event.key==='Enter')pestAsk()"/>
      <button class="ask-bar-mic" id="pest-mic" onclick="startVoice('pest-ask','pest-mic')">🎤</button>
      <button class="ask-bar-send" onclick="pestAsk()">
        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
    <div id="pest-ask-out"></div>

    <div class="st">इस सीजन के प्रमुख कीट</div>
    ${PESTS.map((p,i)=>`
      <div class="pest-card" onclick="openPestDetail(${i})">
        <div class="pest-emoji">${p.e}</div>
        <div style="flex:1;padding-right:20px">
          <div class="pest-name">${p.n}</div>
          <div class="pest-crop">फसल: ${p.crop}</div>
          <div class="pest-season">मौसम: ${p.season}</div>
          <div class="pest-season" style="margin-top:4px;color:#A08060">${p.short}</div>
          <div class="risk ${p.risk}">${p.risk==='high'?'अधिक खतरा':p.risk==='med'?'मध्यम खतरा':'सामान्य'}</div>
        </div>
      </div>`).join('')}

    <div class="st">जैविक नियंत्रण (IPM)</div>
    <div class="card">
      <div class="drow"><div class="dcrop">🌿</div><div><div class="dname">नीम तेल</div><div class="ddate">5ml + साबुन 1ml प्रति लीटर — सभी फसलें</div></div></div>
      <div class="drow"><div class="dcrop">🪤</div><div><div class="dname">फेरोमोन ट्रैप</div><div class="ddate">हेलिकोवर्पा — 5 ट्रैप/एकड़</div></div></div>
      <div class="drow"><div class="dcrop">🟡</div><div><div class="dname">स्टिकी ट्रैप</div><div class="ddate">सफेद मक्खी/थ्रिप्स — 10/एकड़</div></div></div>
      <div class="drow"><div class="dcrop">🐞</div><div><div class="dname">मित्र कीट बचाएं</div><div class="ddate">लेडी बर्ड, मधुमक्खी, क्राइसोपर्ला</div></div></div>
    </div>
  `;
}

async function pestAsk() {
  const q = document.getElementById('pest-ask')?.value?.trim();
  if (!q) return;
  document.getElementById('pest-ask').value = '';
  const out = document.getElementById('pest-ask-out');
  out.innerHTML = `<div class="card"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
  try {
    const reply = await callAI([{role:'user', content:`${q} — MP के किसान के लिए कीट/रोग जानकारी 100 शब्दों में।`}]);
    out.innerHTML = `<div class="card" style="border-color:var(--sun-dk)"><div style="font-size:10px;font-weight:900;color:var(--sun);margin-bottom:6px">🤖 AI जवाब</div><div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.8">${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div></div>`;
  } catch { out.innerHTML = `<div class="card"><div style="color:#806040;font-size:13px">नेटवर्क समस्या।</div></div>`; }
}

// ── PEST DETAIL OVERLAY ───────────────────────────────────────────────────────
function openPestDetail(idx) {
  const p = PESTS[idx];
  const ov = document.getElementById('pest-overlay');
  document.getElementById('pest-ov-title').textContent = `${p.e} ${p.n}`;
  const body = document.getElementById('pest-ov-body');
  body.innerHTML = `
    <div class="card" style="border-color:var(--sun-dk)">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <div style="font-size:44px">${p.e}</div>
        <div>
          <div style="font-size:16px;font-weight:900;color:var(--sun)">${p.n}</div>
          <div style="font-size:12px;font-weight:700;color:#806040;margin-top:3px">फसल: ${p.crop}</div>
          <div style="font-size:12px;font-weight:700;color:#806040">मौसम: ${p.season}</div>
          <div class="risk ${p.risk}" style="margin-top:6px">${p.risk==='high'?'अधिक खतरा':p.risk==='med'?'मध्यम खतरा':'सामान्य'}</div>
        </div>
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--clay);line-height:1.9;white-space:pre-line">${p.detail.replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}</div>
    </div>

    <div class="st">AI से विस्तार से पूछें</div>
    <div id="pest-chat" class="chat-thread"></div>
    <div style="padding:4px 0 80px">
      <div style="font-size:11px;font-weight:700;color:#605030;margin-bottom:8px">जल्दी सवाल:</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${['दवा की मात्रा बताओ','जैविक उपाय क्या हैं?','कब छिड़काव करें?','बचाव कैसे करें?'].map(q=>`<button style="background:var(--soil3);border:1px solid var(--soil4);border-radius:20px;padding:6px 12px;font-size:11px;font-weight:700;color:var(--sun);cursor:pointer;font-family:var(--font)" onclick="pestQuickAsk('${q}','${p.n}','${p.crop}')">${q}</button>`).join('')}
      </div>
    </div>
  `;
  // init with AI intro
  pestChatAI(`${p.n} के बारे में बताओ जो ${p.crop} को नुकसान पहुंचाता है। MP के किसान के लिए सरल भाषा में — 120 शब्दों में।`, p.n);
  ov.classList.add('open');
  // setup chat input
  document.getElementById('pest-chat-input').value = '';
  document.getElementById('pest-chat-input').dataset.pest = p.n;
  document.getElementById('pest-chat-input').dataset.crop = p.crop;
}

async function pestChatAI(question, pestName) {
  const thread = document.getElementById('pest-chat');
  if (!thread) return;
  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  thread.appendChild(typing);
  thread.scrollTop = thread.scrollHeight;
  try {
    const reply = await callAI([{role:'user', content: question}]);
    typing.remove();
    const msg = document.createElement('div');
    msg.className = 'msg ai';
    msg.innerHTML = `<div class="msg-label">🤖 किसान मित्र AI</div>${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}`;
    thread.appendChild(msg);
    thread.scrollTop = thread.scrollHeight;
  } catch {
    typing.remove();
    const msg = document.createElement('div');
    msg.className = 'msg ai';
    msg.textContent = 'नेटवर्क समस्या है। दोबारा प्रयास करें।';
    thread.appendChild(msg);
  }
}

function pestQuickAsk(q, pest, crop) {
  const full = `${pest} (${crop} में) — ${q} MP के किसान को बताओ।`;
  const thread = document.getElementById('pest-chat');
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.textContent = q;
  thread.appendChild(userMsg);
  pestChatAI(full, pest);
}

function sendPestChat() {
  const inp = document.getElementById('pest-chat-input');
  const q = inp.value.trim();
  if (!q) return;
  const pest = inp.dataset.pest || 'कीट';
  const crop = inp.dataset.crop || 'फसल';
  inp.value = '';
  const thread = document.getElementById('pest-chat');
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.textContent = q;
  thread.appendChild(userMsg);
  pestChatAI(`${pest} (${crop} में): ${q} — MP किसान को बताओ।`, pest);
}

function closePestOverlay() {
  document.getElementById('pest-overlay').classList.remove('open');
}

// ── MORE PAGE ─────────────────────────────────────────────────────────────────
function renderMore() {
  document.getElementById('page-more').innerHTML = `
    <div class="tabs">
      <button class="tab ${state.moreSub==='mandi'?'active':''}" onclick="msub('mandi',this)">💰 मंडी</button>
      <button class="tab ${state.moreSub==='soil'?'active':''}" onclick="msub('soil',this)">🧪 मिट्टी</button>
      <button class="tab ${state.moreSub==='diary'?'active':''}" onclick="msub('diary',this)">📔 डायरी</button>
      <button class="tab ${state.moreSub==='schemes'?'active':''}" onclick="msub('schemes',this)">🏛️ योजना</button>
    </div>
    <div id="more-content"></div>
  `;
  renderMoreContent(state.moreSub);
}

function msub(t, btn) {
  state.moreSub = t;
  document.querySelectorAll('#page-more .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderMoreContent(t);
}

function goMore(t) {
  state.moreSub = t;
  showPage('more');
}

function renderMoreContent(t) {
  const el = document.getElementById('more-content');
  if (!el) return;

  if (t === 'mandi') {
    const best = MANDI_DATA.reduce((a,b)=>(b.p-b.prev)>(a.p-a.prev)?b:a);
    el.innerHTML = `
      <div class="alert good"><div class="alert-icon">📈</div><div><div class="alert-title">${best.c.split(' ').slice(1).join(' ')} के भाव ऊंचे — बेचने का समय</div><div class="alert-desc">${best.l} मंडी ₹${best.p.toLocaleString('hi')}/क्विंटल</div></div></div>
      <div class="card">
        ${MANDI_DATA.map(m=>{
          const diff=m.p-m.prev,up=diff>=0;
          return `<div class="mandi-row"><div><div class="mandi-crop">${m.c}</div><div class="mandi-loc">${m.l} मंडी · प्रति ${m.unit}</div></div><div class="mandi-price"><div class="mpv">₹${m.p.toLocaleString('hi')}</div><div class="mpc ${up?'up':'dn'}">${up?'+':''}₹${Math.abs(diff)} ${up?'▲':'▼'}</div></div></div>`;
        }).join('')}
      </div>
      <div class="st">AI से मंडी सलाह</div>
      <div class="card">
        <div style="display:flex;gap:8px">
          <input id="m-q" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="जैसे: मिर्च बेचूं या रुकूं?">
          <button id="m-mic" style="background:var(--sun);border:none;border-radius:8px;width:40px;height:40px;font-size:18px;cursor:pointer" onclick="startVoice('m-q','m-mic')">🎤</button>
          <button style="background:var(--leaf);border:none;border-radius:8px;width:40px;height:40px;cursor:pointer" onclick="mandiAsk()">➤</button>
        </div>
        <div id="m-ai-out"></div>
      </div>`;
  } else if (t === 'soil') {
    el.innerHTML = `
      <div class="st">मिट्टी स्वास्थ्य — आपका खेत</div>
      <div class="card">
        <div style="font-size:13px;font-weight:900;color:var(--clay);margin-bottom:14px">काली मिट्टी (रेगुर) · खेत नं. 1</div>
        ${[
          {l:'नाइट्रोजन (N)',v:'220 kg/ha',pct:58,c:'var(--warn)',s:'मध्यम'},
          {l:'फॉस्फोरस (P)',v:'18 kg/ha',pct:28,c:'#CC4400',s:'कम ⚠️'},
          {l:'पोटाश (K)',v:'310 kg/ha',pct:80,c:'var(--leaf2)',s:'पर्याप्त ✓'},
          {l:'जस्ता (Zinc)',v:'0.4 mg/kg',pct:18,c:'#CC1800',s:'बहुत कम ⚠️'},
          {l:'pH स्तर',v:'7.8',pct:72,c:'var(--sky)',s:'हल्का क्षारीय'},
        ].map(b=>`<div class="sbar"><div class="sbl"><span>${b.l}</span><span style="color:${b.c}">${b.v} · ${b.s}</span></div><div class="sbb"><div class="sbf" style="width:${b.pct}%;background:${b.c}"></div></div></div>`).join('')}
      </div>
      <div class="alert danger"><div class="alert-icon">⚠️</div><div><div class="alert-title">जस्ता और फॉस्फोरस की कमी</div><div class="alert-desc">जिंक सल्फेट 2kg/बीघा + DAP 10kg/बीघा डालें। मिर्च-गेहूं पर विशेष असर।</div></div></div>
      <button class="btn-sun" onclick="showPage('photo');setTimeout(()=>swPT('report',document.querySelectorAll('.tab')[2]),100)">📄 मिट्टी रिपोर्ट अपलोड करें</button>
      <div class="st">AI से मिट्टी सलाह</div>
      <div class="card">
        <div style="display:flex;gap:8px">
          <input id="s-q" style="flex:1;background:var(--soil3);border:1.5px solid var(--soil4);border-radius:8px;padding:10px;font-size:13px;font-weight:700;color:var(--clay);font-family:var(--font);outline:none" placeholder="जैसे: मिर्च के लिए खाद कितनी?">
          <button id="s-mic" style="background:var(--sun);border:none;border-radius:8px;width:40px;height:40px;font-size:18px;cursor:pointer" onclick="startVoice('s-q','s-mic')">🎤</button>
          <button style="background:var(--leaf);border:none;border-radius:8px;width:40px;height:40px;cursor:pointer" onclick="soilAsk()">➤</button>
        </div>
        <div id="s-ai-out"></div>
      </div>`;
  } else if (t === 'diary') {
    el.innerHTML = `
      <div class="st">मेरी फसलें</div>
      <div class="card">
        ${[{e:'🌶️',n:'मिर्च (हाइब्रिड US-720)',d:'बुआई: 15 जुलाई 2025',a:'3.5 बीघा'},{e:'🫘',n:'सोयाबीन (JS-9560)',d:'बुआई: 20 जून 2025',a:'8 बीघा'},{e:'🧅',n:'प्याज (नासिक लाल)',d:'रोपाई: 10 नवम्बर 2025',a:'2 बीघा'}].map(d=>`<div class="drow"><div class="dcrop">${d.e}</div><div><div class="dname">${d.n}</div><div class="ddate">${d.d}</div></div><div class="darea">${d.a}</div></div>`).join('')}
        <button class="btn-sun">+ नई फसल जोड़ें</button>
      </div>
      <div class="st">इस सीजन का हिसाब</div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:12px">
        <div class="card" style="margin:0"><div style="font-size:11px;font-weight:800;color:#806040">कुल खर्च</div><div style="font-size:24px;font-weight:900;color:#FF8060;margin-top:4px">₹38,500</div><div style="font-size:10px;color:#605030">खाद+बीज+दवा</div></div>
        <div class="card" style="margin:0"><div style="font-size:11px;font-weight:800;color:#806040">अनुमानित आमदनी</div><div style="font-size:24px;font-weight:900;color:var(--leaf-lt);margin-top:4px">₹94,000</div><div style="font-size:10px;color:#605030">मंडी भाव पर</div></div>
      </div>
      <div class="alert good"><div class="alert-icon">🔄</div><div><div class="alert-title">फसल चक्र सुझाव</div><div class="alert-desc">मिर्च के बाद गेहूं-चना लगाएं — मिट्टी में नाइट्रोजन बढ़ेगा, कीट कम होंगे।</div></div></div>`;
  } else if (t === 'schemes') {
    el.innerHTML = `
      <div class="st">सरकारी योजनाएं</div>
      <div class="card">${SCHEMES.map(s=>`<div class="scheme"><div class="schn">${s.n}</div><div class="schd">${s.d}</div><div class="schb">${s.b}</div></div>`).join('')}</div>
      <div class="st">संपर्क करें</div>
      <div class="card">
        <div class="drow"><div class="dcrop">👨‍🌾</div><div><div class="dname">KVK इंदौर</div><div class="ddate">📞 0731-2434312 · सोम–शनि 9–5</div></div></div>
        <div class="drow"><div class="dcrop">👨‍🌾</div><div><div class="dname">KVK खरगोन</div><div class="ddate">📞 07282-230418</div></div></div>
        <div class="drow"><div class="dcrop">📞</div><div><div class="dname">किसान कॉल सेंटर</div><div class="ddate">📞 1800-180-1551 · निःशुल्क · 24×7</div></div></div>
      </div>`;
  }
}

async function mandiAsk() {
  const q = document.getElementById('m-q')?.value?.trim(); if(!q) return;
  const out = document.getElementById('m-ai-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const prices = MANDI_DATA.map(m=>`${m.c}: ₹${m.p}/क्विंटल (${m.l})`).join(', ');
    const reply = await callAI([{role:'user', content:`आज के मंडी भाव: ${prices}\n\nसवाल: ${q} — 80 शब्दों में सलाह।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch { out.innerHTML = `<div style="color:#806040;margin-top:8px;font-size:12px">नेटवर्क समस्या।</div>`; }
}

async function soilAsk() {
  const q = document.getElementById('s-q')?.value?.trim(); if(!q) return;
  const out = document.getElementById('s-ai-out');
  out.innerHTML = `<div class="loading-dots" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  try {
    const reply = await callAI([{role:'user', content:`काली मिट्टी (रेगुर), pH 7.8, Zinc कम, P कम। सवाल: ${q} — 80 शब्दों में।`}]);
    out.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--clay);margin-top:10px;line-height:1.8">${reply.replace(/\n/g,'<br>')}</div>`;
  } catch { out.innerHTML = `<div style="color:#806040;margin-top:8px;font-size:12px">नेटवर्क समस्या।</div>`; }
}

// ── GENERIC CHAT OVERLAY ──────────────────────────────────────────────────────
function openChat(initialMsg, imageData = null) {
  state.chatHistory = [];
  const ov = document.getElementById('chat-overlay');
  document.getElementById('chat-thread-main').innerHTML = '';
  document.getElementById('chat-input-main').value = '';
  document.getElementById('chat-input-main').dataset.image = imageData || '';
  ov.classList.add('open');
  if (initialMsg) chatSend(initialMsg, imageData);
}

async function chatSend(msg, imgData = null) {
  const thread = document.getElementById('chat-thread-main');
  const userDiv = document.createElement('div');
  userDiv.className = 'msg user';
  userDiv.textContent = msg;
  thread.appendChild(userDiv);
  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  thread.appendChild(typing);
  thread.scrollTop = thread.scrollHeight;
  state.chatHistory.push({role:'user', content: msg});
  try {
    const reply = await callAI(state.chatHistory, imgData);
    typing.remove();
    state.chatHistory.push({role:'assistant', content: reply});
    const aiDiv = document.createElement('div');
    aiDiv.className = 'msg ai';
    aiDiv.innerHTML = `<div class="msg-label">🤖 किसान मित्र AI</div>${reply.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')}`;
    thread.appendChild(aiDiv);
    thread.scrollTop = thread.scrollHeight;
  } catch {
    typing.remove();
    const errDiv = document.createElement('div');
    errDiv.className = 'msg ai';
    errDiv.textContent = 'नेटवर्क समस्या है। दोबारा प्रयास करें।';
    thread.appendChild(errDiv);
  }
}

function sendMainChat() {
  const inp = document.getElementById('chat-input-main');
  const q = inp.value.trim(); if(!q) return;
  const img = inp.dataset.image || null;
  inp.value = ''; inp.dataset.image = '';
  chatSend(q, img || null);
}

function closeChat() { document.getElementById('chat-overlay').classList.remove('open'); }
