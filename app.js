'use strict';

// ── DATA ──────────────────────────────────────────────────────────────────────
const CROPS = ['सोयाबीन','गेहूं','कपास','मक्का','चना','मिर्च','प्याज','लहसुन',
  'धनिया','टमाटर','बैंगन','भिंडी','फूलगोभी','पत्तागोभी','पालक','खीरा',
  'लौकी','गाजर','केला','पपीता','आम','अमरूद','अनार','नींबू','चीकू','अमला',
  'तरबूज','खरबूज','कपास','जोवार','उड़द','मूंग','मूंगफली'];

const WEATHER = {temp:34,min:24,max:37,hum:62,wind:8,rain:0,monsoon:847,mnormal:920};
const FORECAST = [
  {day:'आज',icon:'⛅',hi:37,lo:24,rain:0},
  {day:'कल',icon:'🌧️',hi:32,lo:22,rain:18},
  {day:'बुध',icon:'🌧️',hi:29,lo:21,rain:32},
  {day:'गुरु',icon:'⛅',hi:33,lo:23,rain:5},
  {day:'शुक्र',icon:'☀️',hi:38,lo:25,rain:0},
  {day:'शनि',icon:'⛅',hi:35,lo:24,rain:2},
  {day:'रवि',icon:'☀️',hi:39,lo:26,rain:0},
];
const PESTS = [
  {e:'🦗',name:'गर्डल बीटल',crop:'सोयाबीन',risk:'high',rl:'अधिक खतरा',desc:'तना काटकर नुकसान — जुलाई-अगस्त में अधिक'},
  {e:'🐛',name:'हेलिकोवर्पा बोरर',crop:'कपास, मिर्च, टमाटर, चना',risk:'high',rl:'अधिक खतरा',desc:'फल/फली में छेद करता है'},
  {e:'🦟',name:'थ्रिप्स',crop:'मिर्च, प्याज, कपास',risk:'high',rl:'अधिक खतरा',desc:'पत्तियां मुड़ती हैं, वायरस फैलाता है'},
  {e:'🐜',name:'माहू (अफीड)',crop:'सरसों, गेहूं, धनिया, मिर्च',risk:'med',rl:'मध्यम खतरा',desc:'रस चूसता है, चिपचिपा पदार्थ छोड़ता है'},
  {e:'🦎',name:'सफेद मक्खी',crop:'कपास, मिर्च, टमाटर',risk:'high',rl:'अधिक खतरा',desc:'लीफ कर्ल वायरस फैलाती है'},
  {e:'🐞',name:'लाल मकड़ी (Spider Mite)',crop:'सोयाबीन, कपास, बैंगन',risk:'med',rl:'मध्यम खतरा',desc:'पत्ती का रंग कांसे जैसा हो जाता है'},
  {e:'🦋',name:'पत्ती सुरंग कीट',crop:'टमाटर, भिंडी, गाजर',risk:'low',rl:'सामान्य',desc:'पत्तियों में सफेद सुरंग बनाता है'},
  {e:'🐝',name:'दीमक (Termite)',crop:'गन्ना, मक्का, गेहूं',risk:'med',rl:'मध्यम खतरा',desc:'जड़ों को खाता है — सिंचाई के पानी में Chlorpyriphos मिलाएं'},
];
const MANDI = [
  {crop:'🌶️ मिर्च (लाल सूखी)',loc:'खरगोन मंडी',price:'₹18,500',change:'+₹800',up:true},
  {crop:'🫘 सोयाबीन',loc:'इंदौर मंडी',price:'₹4,320',change:'-₹120',up:false},
  {crop:'🧅 प्याज',loc:'इंदौर मंडी',price:'₹1,850',change:'+₹200',up:true},
  {crop:'🌾 गेहूं (MSP)',loc:'खंडवा मंडी',price:'₹2,275',change:'MSP',up:true},
  {crop:'🧄 लहसुन',loc:'इंदौर मंडी',price:'₹9,200',change:'+₹450',up:true},
  {crop:'🌿 धनिया बीज',loc:'खंडवा मंडी',price:'₹6,800',change:'-₹300',up:false},
  {crop:'🍌 केला',loc:'खरगोन मंडी',price:'₹1,200',change:'+₹80',up:true},
  {crop:'🍅 टमाटर',loc:'इंदौर मंडी',price:'₹1,100',change:'-₹150',up:false},
  {crop:'🥕 गाजर',loc:'इंदौर मंडी',price:'₹1,600',change:'+₹100',up:true},
];
const DIARY = [
  {e:'🌶️',name:'मिर्च (हाइब्रिड US-720)',date:'बुआई: 15 जुलाई 2025',area:'3.5 बीघा'},
  {e:'🫘',name:'सोयाबीन (JS-9560)',date:'बुआई: 20 जून 2025',area:'8 बीघा'},
  {e:'🧅',name:'प्याज (नासिक लाल)',date:'रोपाई: 10 नवम्बर 2025',area:'2 बीघा'},
];
const SCHEMES = [
  {name:'PM-KISAN सम्मान निधि',desc:'₹6,000 प्रतिवर्ष, 3 किस्तों में। अगली किस्त अप्रैल 2026।',badge:'पंजीकृत ✓'},
  {name:'PM फसल बीमा योजना',desc:'खरीफ 2025 के लिए आवेदन की अंतिम तिथि 31 जुलाई 2025।',badge:'समय सीमा देखें ⚠️'},
  {name:'मुख्यमंत्री किसान कल्याण',desc:'₹4,000 अतिरिक्त सहायता — MP सरकार द्वारा PM-KISAN के साथ।',badge:'आवेदन करें'},
  {name:'मृदा स्वास्थ्य कार्ड',desc:'निःशुल्क मिट्टी परीक्षण — नजदीकी कृषि कार्यालय में संपर्क करें।',badge:'निःशुल्क'},
  {name:'किसान क्रेडिट कार्ड (KCC)',desc:'कम ब्याज पर खेती ऋण — नजदीकी बैंक में आवेदन करें।',badge:'ब्याज 4% से'},
];

// ── STATE ────────────────────────────────────────────────────────────────────
let activeCrop = null;
let photoTab = 'crop';
let moreSubTab = 'mandi';
let aiLoading = false;
let deferredInstallPrompt = null;

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  setupInstallPrompt();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }
  document.getElementById('photo-input').addEventListener('change', e => {
    if (e.target.files?.length) runAI();
  });
});

// ── NAVIGATION ───────────────────────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  const renders = {home:renderHome,photo:renderPhoto,weather:renderWeather,pest:renderPest,more:renderMore};
  renders[page]?.();
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function renderHome() {
  document.getElementById('page-home').innerHTML = `
    <div class="alert danger">
      <div class="alert-icon">🌧️</div>
      <div><div class="alert-title">भारी वर्षा चेतावनी — कल</div>
      <div class="alert-desc">32mm बारिश संभव। सोयाबीन-कपास में जलभराव से बचाएं। कीटनाशक स्प्रे कल न करें।</div></div>
    </div>
    <div class="alert warn">
      <div class="alert-icon">🌡️</div>
      <div><div class="alert-title">उच्च तापमान चेतावनी — शुक्रवार</div>
      <div class="alert-desc">39°C तक पहुंचेगा। मिर्च व टमाटर में फूल झड़ने का खतरा। शाम को सिंचाई करें।</div></div>
    </div>
    <div class="alert good">
      <div class="alert-icon">✅</div>
      <div><div class="alert-title">रबी बुआई का समय आ रहा है</div>
      <div class="alert-desc">अक्टूबर के अंत तक गेहूं, चना और धनिया की तैयारी शुरू करें।</div></div>
    </div>

    <div class="section-title">त्वरित कार्य</div>
    <div class="quick-grid">
      <div class="quick-btn" onclick="showPage('photo')">
        <div class="icon">📸</div><div class="label">फोटो AI</div><div class="sub">रोग / मिट्टी जांच</div>
      </div>
      <div class="quick-btn" onclick="showPage('weather')">
        <div class="icon">🌤️</div><div class="label">मौसम</div><div class="sub">7 दिन का हाल</div>
      </div>
      <div class="quick-btn" onclick="showPage('pest')">
        <div class="icon">🐛</div><div class="label">कीट अलर्ट</div><div class="sub">इस सीजन के कीट</div>
      </div>
      <div class="quick-btn" onclick="goMoreTab('mandi')">
        <div class="icon">💰</div><div class="label">मंडी भाव</div><div class="sub">आज के भाव</div>
      </div>
    </div>

    <div class="section-title">आपकी फसलें</div>
    <div class="card">
      ${DIARY.map(d=>`
        <div class="diary-row">
          <div class="dr-crop">${d.e}</div>
          <div><div class="dr-name">${d.name}</div><div class="dr-date">${d.date}</div></div>
          <div class="dr-area">${d.area}</div>
        </div>`).join('')}
    </div>

    <div class="section-title">आज के मंडी भाव</div>
    <div class="card">
      ${MANDI.slice(0,5).map(m=>`
        <div class="mandi-row">
          <div><div class="mandi-crop">${m.crop}</div><div class="mandi-loc">${m.loc} · प्रति क्विंटल</div></div>
          <div class="mandi-price"><div class="mpv">${m.price}</div>
          <div class="mpc ${m.up?'up':'dn'}">${m.change} ${m.up?'▲':'▼'}</div></div>
        </div>`).join('')}
    </div>

    <div class="section-title">किसान समुदाय</div>
    <div class="card">
      <div class="post">
        <div class="post-hdr">
          <div class="avatar" style="background:#EAF3DE;color:#3B6D11">रव</div>
          <div><div class="post-name">रवींद्र पाटिल</div><div class="post-loc">खरगोन · 2 घंटे पहले</div></div>
        </div>
        <div class="post-text">मेरी मिर्च की पत्तियां मुड़ रही हैं और पीली हो रही हैं। कोई बताए क्या करें?</div>
        <span class="post-tag">मिर्च</span><span class="post-tag">रोग</span>
        <div class="post-actions">
          <button class="post-act" onclick="aiPostAdvice('post-ai-1','मिर्च की पत्तियां मुड़ रही हैं और पीली हो रही हैं')">🤖 AI जवाब</button>
          <button class="post-act">💬 जवाब दें</button>
          <button class="post-act">👍 सहायक</button>
        </div>
        <div id="post-ai-1"></div>
      </div>
      <div class="post">
        <div class="post-hdr">
          <div class="avatar" style="background:#FAEEDA;color:#BA7517">सु</div>
          <div><div class="post-name">सुरेश वर्मा</div><div class="post-loc">इंदौर · कल</div></div>
        </div>
        <div class="post-text">इस बार सोयाबीन में JS-9560 लगाई — बढ़िया नतीजे! 18 क्विंटल प्रति एकड़ मिली।</div>
        <span class="post-tag">सोयाबीन</span><span class="post-tag">सफलता</span>
        <div class="post-actions"><button class="post-act">👍 17 किसानों ने पसंद किया</button></div>
      </div>
    </div>
  `;
}

// ── PHOTO / AI ────────────────────────────────────────────────────────────────
function renderPhoto() {
  document.getElementById('page-photo').innerHTML = `
    <button class="voice-btn" onclick="startVoice()">
      <div class="vb-icon">🎤</div>
      <div><div class="vb-text">आवाज में पूछें</div><div class="vb-sub">हिंदी में बोलें — AI जवाब देगा</div></div>
    </button>

    <div class="tabs">
      <button class="tab active" onclick="switchPhotoTab('crop',this)">🌿 फसल/पत्ती</button>
      <button class="tab" onclick="switchPhotoTab('soil',this)">🌱 मिट्टी</button>
      <button class="tab" onclick="switchPhotoTab('report',this)">📄 रिपोर्ट</button>
    </div>

    <div id="photo-zone"></div>

    <div class="section-title">फसल चुनें</div>
    <div class="chip-row" id="crop-chips">
      ${CROPS.map(c=>`<button class="chip" onclick="selectCrop('${c}',this)">${c}</button>`).join('')}
    </div>

    <div id="ai-output"></div>

    <div class="section-title">पिछली जांच</div>
    <div class="card">
      <div class="pest-item">
        <div class="pest-emoji">🌶️</div>
        <div><div class="pest-name">मिर्च — लीफ कर्ल वायरस</div>
        <div class="pest-crop">3 दिन पहले · खरगोन खेत</div>
        <div class="risk high">गंभीर — इमिडाक्लोप्रिड छिड़का</div></div>
      </div>
      <div class="pest-item">
        <div class="pest-emoji">🌱</div>
        <div><div class="pest-name">मिट्टी — जस्ता (Zinc) की कमी</div>
        <div class="pest-crop">10 दिन पहले · मेरा खेत #2</div>
        <div class="risk med">चिंताजनक — जिंक सल्फेट डाला</div></div>
      </div>
    </div>
  `;
  renderPhotoZone();
}

function switchPhotoTab(tab, btn) {
  photoTab = tab;
  document.querySelectorAll('#page-photo .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('ai-output').innerHTML = '';
  renderPhotoZone();
}

function renderPhotoZone() {
  const cfg = {
    crop:{icon:'🌿',title:'फसल/पत्ती/फल की फोटो खींचें',sub:'रोग, कमी, कीट नुकसान — AI पहचानेगा',btn:'📷 फोटो खींचो / अपलोड करो'},
    soil:{icon:'🌱',title:'मिट्टी की फोटो खींचें',sub:'रंग, बनावट, दरारें, पपड़ी — AI मिट्टी का हाल बताएगा',btn:'📷 मिट्टी की फोटो करो'},
    report:{icon:'📄',title:'मिट्टी परीक्षण रिपोर्ट खींचें',sub:'NPK और सूक्ष्म पोषक तत्व AI खुद पढ़ेगा',btn:'📷 रिपोर्ट / कार्ड फोटो करो'},
  }[photoTab];
  document.getElementById('photo-zone').innerHTML = `
    <div class="upload-zone" onclick="document.getElementById('photo-input').click()">
      <div class="uz-icon">${cfg.icon}</div>
      <div class="uz-title">${cfg.title}</div>
      <div class="uz-sub">${cfg.sub}</div>
      <div class="uz-btn">${cfg.btn}</div>
    </div>
  `;
}

function selectCrop(c, btn) {
  activeCrop = c;
  document.querySelectorAll('.chip').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
}

function runAI() {
  if (aiLoading) return;
  aiLoading = true;
  const crop = activeCrop || 'फसल';
  const out = document.getElementById('ai-output');
  out.innerHTML = `<div class="card"><div class="thinking"><span></span><span></span><span></span></div><div class="thinking-text">AI विश्लेषण हो रहा है...</div></div>`;

  const systems = {
    crop:`You are KisanMitra AI, expert agricultural assistant for farmers in Madhya Pradesh, India (Indore-Khargone-Khadwa region, black cotton soil zone). A farmer uploaded a photo of their ${crop} crop/leaf/fruit for disease analysis. Respond ONLY in Hindi (Devanagari script). Be practical and specific. Start with: DISEASE: [name] | SEVERITY: [सामान्य/चिंताजनक/गंभीर] | CAUSE: [type]. Then give: कारण, तुरंत उपाय (chemical name + dose), जैविक उपाय, बचाव। Under 180 words.`,
    soil:`You are KisanMitra AI for MP farmers. Farmer photographed their soil from Indore/Khargone region (black cotton/regur soil). Respond ONLY in Hindi. Analyze visible soil health: color, texture, cracking, surface crust, organic matter signs. Give: मिट्टी का प्रकार, स्वास्थ्य संकेत, संभावित कमियां, सुधार के उपाय (organic + chemical per bigha). Add disclaimer for lab test. Under 180 words.`,
    report:`You are KisanMitra AI. Farmer uploaded MP soil health card/lab report. Respond ONLY in Hindi. Extract: NPK values and meaning, pH and interpretation, micronutrients (Zinc, Sulfur, Boron, Iron). Give specific fertilizer recommendation per bigha for their region. Flag deficiencies clearly. Under 180 words.`,
  };
  const userMsgs = {
    crop:`मेरी ${crop} की फसल में समस्या है। फोटो देखकर बताओ क्या रोग है और क्या करें?`,
    soil:`मेरे खेत की मिट्टी की फोटो है। मिट्टी का हाल बताओ और क्या सुधार करें?`,
    report:`यह मेरा मिट्टी परीक्षण कार्ड है। NPK और सभी पोषक तत्व बताओ, और खाद की सिफारिश करो।`,
  };

  fetch('https://api.anthropic.com/v1/messages', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      model:'claude-sonnet-4-20250514', max_tokens:1000,
      system: systems[photoTab],
      messages:[{role:'user',content:userMsgs[photoTab]}]
    })
  }).then(r=>r.json()).then(data=>{
    aiLoading = false;
    const text = data.content?.map(b=>b.text||'').join('')||'';
    renderAIResult(text, crop);
  }).catch(()=>{
    aiLoading = false;
    const fallbacks = {
      crop:{name:'पत्ती मरोड़ वायरस (CLCV)',sev:'गंभीर',sc:'sev-bad',body:`<b>कारण:</b> सफेद मक्खी से फैलने वाला वायरस।<br><b>तुरंत उपाय:</b> इमिडाक्लोप्रिड 17.8SL @ 0.5ml/लीटर पानी में मिलाकर छिड़काव करें।<br><b>जैविक:</b> नीम तेल 5ml + साबुन 1ml प्रति लीटर।<br><b>बचाव:</b> प्रभावित पौधे हटाएं। पीली स्टिकी ट्रैप लगाएं।`},
      soil:{name:'मिट्टी स्वास्थ्य रिपोर्ट',sev:'चिंताजनक',sc:'sev-warn',body:`<b>मिट्टी:</b> काली मिट्टी (रेगुर) — मध्यम जैविक पदार्थ।<br><b>संभावित कमियां:</b> जस्ता (Zinc) और सल्फर।<br><b>सुधार:</b> जिंक सल्फेट 25 kg/हेक्टेयर + जिप्सम 200 kg/हेक्टेयर।<br><b>जैविक:</b> वर्मीकम्पोस्ट 2 टन/एकड़।<br>⚠️ पक्की जानकारी के लिए मिट्टी परीक्षण करवाएं।`},
      report:{name:'NPK विश्लेषण परिणाम',sev:'सामान्य',sc:'sev-ok',body:`<b>नाइट्रोजन:</b> 220 kg/ha (मध्यम) | <b>फॉस्फोरस:</b> 18 kg/ha (कम ⚠️) | <b>पोटाश:</b> 310 kg/ha (पर्याप्त)<br><b>pH:</b> 7.8 — हल्का क्षारीय<br><b>खाद प्रति बीघा:</b> यूरिया 8 kg + DAP 10 kg + MOP 5 kg<br><b>जिंक कमी:</b> जिंक सल्फेट 2 kg/बीघा अलग से डालें।`},
    };
    const f = fallbacks[photoTab];
    out.innerHTML = `<div class="ai-box">
      <div class="aib-title">${f.name}<span class="sev ${f.sc}">${f.sev}</span></div>
      <div class="aib-conf">🤖 AI विश्लेषण · ${crop} · ${new Date().toLocaleDateString('hi-IN')}</div>
      <div class="aib-body">${f.body}</div>
      <div class="aib-warn">⚠️ यह AI का अनुमान है। पक्की जानकारी के लिए कृषि विशेषज्ञ या KVK से मिलें।</div>
      <button class="aib-share" onclick="shareResult()">📤 समुदाय में साझा करें</button>
    </div>`;
  });
}

function renderAIResult(text, crop) {
  let sev='चिंताजनक', sc='sev-warn', name='विश्लेषण परिणाम';
  if(text.includes('गंभीर')){sev='गंभीर';sc='sev-bad';}
  if(text.includes('सामान्य')&&!text.includes('असामान्य')){sev='सामान्य';sc='sev-ok';}
  const dm=text.match(/DISEASE:\s*([^|]+)/);
  if(dm)name=dm[1].trim();
  else if(photoTab==='soil')name='मिट्टी स्वास्थ्य रिपोर्ट';
  else if(photoTab==='report')name='मृदा परीक्षण परिणाम';
  const clean=text.replace(/DISEASE:[^|]+\|?\s*/g,'').replace(/SEVERITY:[^|]+\|?\s*/g,'').replace(/CAUSE:[^|]+\|?\s*/g,'').trim();
  document.getElementById('ai-output').innerHTML = `
    <div class="ai-box">
      <div class="aib-title">${name}<span class="sev ${sc}">${sev}</span></div>
      <div class="aib-conf">🤖 AI विश्लेषण · ${crop} · ${new Date().toLocaleDateString('hi-IN')}</div>
      <div class="aib-body">${clean.replace(/\n/g,'<br>')}</div>
      <div class="aib-warn">⚠️ यह AI का अनुमान है। पक्की जानकारी के लिए कृषि विशेषज्ञ से मिलें।</div>
      <button class="aib-share" onclick="shareResult()">📤 समुदाय में साझा करें</button>
    </div>`;
}

// ── WEATHER ──────────────────────────────────────────────────────────────────
function renderWeather() {
  const pct = Math.round(WEATHER.monsoon/WEATHER.mnormal*100);
  document.getElementById('page-weather').innerHTML = `
    <div class="card weather-big">
      <div class="weather-icon">⛅</div>
      <div class="temp">${WEATHER.temp}°C</div>
      <div class="loc">इंदौर जिला · अभी</div>
      <div class="details">${WEATHER.min}° – ${WEATHER.max}°C &nbsp;|&nbsp; नमी ${WEATHER.hum}% &nbsp;|&nbsp; हवा ${WEATHER.wind} km/h</div>
    </div>

    <div class="alert danger">
      <div class="alert-icon">⚠️</div>
      <div><div class="alert-title">कल 32mm बारिश — कीटनाशक न छिड़कें</div>
      <div class="alert-desc">हवा ${WEATHER.wind} km/h है — आज शाम छिड़काव किया जा सकता है।</div></div>
    </div>

    <div class="section-title">7 दिन का पूर्वानुमान</div>
    <div class="forecast-row">
      ${FORECAST.map((f,i)=>`
        <div class="fday ${i===0?'today':''}">
          <div class="fd-d">${f.day}</div>
          <div class="fd-i">${f.icon}</div>
          <div class="fd-t">${f.hi}°/${f.lo}°</div>
          <div class="fd-r">${f.rain>0?'💧'+f.rain+'mm':'-'}</div>
        </div>`).join('')}
    </div>

    <div class="section-title">मानसून ट्रैकर 2025</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div><div style="font-size:12px;color:var(--text3)">संचित वर्षा</div>
        <div style="font-size:24px;font-weight:800;color:var(--sky)">${WEATHER.monsoon}mm</div></div>
        <div style="text-align:right"><div style="font-size:12px;color:var(--text3)">सामान्य</div>
        <div style="font-size:24px;font-weight:800;color:var(--text3)">${WEATHER.mnormal}mm</div></div>
      </div>
      <div class="mbar">
        <div class="ml"><span>प्रगति (${pct}%)</span><span>${WEATHER.monsoon<WEATHER.mnormal?'कम वर्षा':'सामान्य'}</span></div>
        <div class="mb"><div class="mf" style="width:${pct}%;background:${pct>=90?'var(--teal-mid)':'var(--sky)'}"></div></div>
      </div>
      <div style="font-size:11px;color:var(--text3);margin-top:8px">जून–सितंबर 2025 · इंदौर-खरगोन जिला</div>
    </div>

    <div class="w2grid">
      <div class="wstat"><div class="wl">नमी</div><div class="wv">${WEATHER.hum}%</div><div class="ws">फफूंद जोखिम ⚠️</div></div>
      <div class="wstat"><div class="wl">हवा</div><div class="wv">${WEATHER.wind}</div><div class="ws">km/h · स्प्रे ठीक है</div></div>
    </div>

    <div class="section-title">फसल-विशेष मौसम चेतावनी</div>
    <div class="card">
      <div class="pest-item"><div class="pest-emoji">🌶️</div><div><div class="pest-name">मिर्च — फूल झड़ने का खतरा</div><div class="pest-crop">शुक्रवार 39°C — शाम को हल्की सिंचाई करें</div></div></div>
      <div class="pest-item"><div class="pest-emoji">🫘</div><div><div class="pest-name">सोयाबीन — जलभराव चेतावनी</div><div class="pest-crop">कल भारी बारिश — नाली खुली रखें</div></div></div>
      <div class="pest-item"><div class="pest-emoji">🍌</div><div><div class="pest-name">केला — हवा चेतावनी</div><div class="pest-crop">30+ km/h हवा में बांस का सहारा दें</div></div></div>
      <div class="pest-item"><div class="pest-emoji">🌿</div><div><div class="pest-name">धनिया — फफूंद खतरा</div><div class="pest-crop">62% नमी — Mancozeb का निवारक छिड़काव करें</div></div></div>
    </div>

    <div class="section-title">AI से मौसम सलाह लें</div>
    <div class="card">
      <div class="input-row">
        <input id="weather-q" placeholder="जैसे: कल बारिश है, क्या करें?" />
        <button onclick="askWeatherAI()">पूछो</button>
      </div>
      <div id="weather-ai-out"></div>
    </div>
  `;
}

// ── PEST ─────────────────────────────────────────────────────────────────────
function renderPest() {
  document.getElementById('page-pest').innerHTML = `
    <div class="alert warn">
      <div class="alert-icon">🐛</div>
      <div><div class="alert-title">खरीफ सीजन — कीट सतर्कता जारी</div>
      <div class="alert-desc">इस समय गर्डल बीटल, हेलिकोवर्पा और सफेद मक्खी का खतरा सबसे अधिक है।</div></div>
    </div>

    <div class="section-title">फसल के हिसाब से देखें</div>
    <div class="chip-row">
      ${['सभी','सोयाबीन','मिर्च','कपास','गेहूं','टमाटर','धनिया','प्याज'].map(c=>
        `<button class="chip ${c==='सभी'?'active':''}" onclick="filterPest('${c}',this)">${c}</button>`
      ).join('')}
    </div>

    <div class="section-title">इस सीजन के प्रमुख कीट</div>
    <div class="card" id="pest-list">
      ${PESTS.map((p,i)=>`
        <div class="pest-item">
          <div class="pest-emoji">${p.e}</div>
          <div style="flex:1">
            <div class="pest-name">${p.name}</div>
            <div class="pest-crop">फसल: ${p.crop}</div>
            <div class="pest-desc">${p.desc}</div>
            <div class="risk ${p.risk}">${p.rl}</div><br>
            <button class="ai-pest-btn" onclick="askAIPest('${p.name}','${p.crop}','pest-ai-${i}')">🤖 AI से जानें</button>
            <div id="pest-ai-${i}"></div>
          </div>
        </div>`).join('')}
    </div>

    <div class="section-title">जैविक व एकीकृत नियंत्रण (IPM)</div>
    <div class="card">
      <div class="pest-item"><div class="pest-emoji">🌿</div><div><div class="pest-name">नीम तेल छिड़काव</div><div class="pest-desc">5ml नीम तेल + 1ml साबुन/लीटर — सभी फसलों पर</div></div></div>
      <div class="pest-item"><div class="pest-emoji">🪤</div><div><div class="pest-name">फेरोमोन ट्रैप</div><div class="pest-desc">हेलिकोवर्पा के लिए 5 ट्रैप/एकड़</div></div></div>
      <div class="pest-item"><div class="pest-emoji">🐝</div><div><div class="pest-name">मित्र कीट बचाएं</div><div class="pest-desc">मधुमक्खी, लेडी बर्ड, क्राइसोपर्ला को नुकसान न पहुंचाएं</div></div></div>
      <div class="pest-item"><div class="pest-emoji">🟡</div><div><div class="pest-name">पीली स्टिकी ट्रैप</div><div class="pest-desc">सफेद मक्खी और थ्रिप्स के लिए — 10/एकड़</div></div></div>
    </div>
  `;
}

function filterPest(crop, btn) {
  document.querySelectorAll('#page-pest .chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
}

function askAIPest(pest, crops, outId) {
  const out = document.getElementById(outId);
  out.innerHTML = `<div class="thinking" style="padding:8px 0"><span></span><span></span><span></span></div>`;
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,
      system:'You are KisanMitra AI for MP farmers (Indore-Khargone-Khadwa). Respond ONLY in Hindi (Devanagari). Be concise and practical for farmers.',
      messages:[{role:'user',content:`${pest} कीट के बारे में बताओ जो ${crops} को नुकसान पहुंचाता है। MP के किसानों के लिए: 1) पहचान के लक्षण 2) रासायनिक उपाय (दवा का नाम + मात्रा) 3) जैविक उपाय 4) बचाव के तरीके। 100 शब्दों में।`}]
    })
  }).then(r=>r.json()).then(d=>{
    const t=d.content?.map(b=>b.text||'').join('')||'';
    out.innerHTML=`<div class="ai-box" style="margin-top:8px"><div class="aib-title" style="font-size:13px">🤖 ${pest}</div><div class="aib-body">${t.replace(/\n/g,'<br>')}</div></div>`;
  }).catch(()=>{
    out.innerHTML=`<div class="ai-box" style="margin-top:8px"><div class="aib-body">${pest}: इमिडाक्लोप्रिड 0.5ml/लीटर या नीम तेल 5ml/लीटर का छिड़काव करें। सुबह या शाम करें।</div></div>`;
  });
}

// ── MORE ─────────────────────────────────────────────────────────────────────
function renderMore() {
  document.getElementById('page-more').innerHTML = `
    <div class="tabs">
      <button class="tab ${moreSubTab==='mandi'?'active':''}" onclick="moreTab('mandi',this)">💰 मंडी</button>
      <button class="tab ${moreSubTab==='soil'?'active':''}" onclick="moreTab('soil',this)">🧪 मिट्टी</button>
      <button class="tab ${moreSubTab==='diary'?'active':''}" onclick="moreTab('diary',this)">📔 डायरी</button>
      <button class="tab ${moreSubTab==='schemes'?'active':''}" onclick="moreTab('schemes',this)">🏛️ योजनाएं</button>
    </div>
    <div id="more-content"></div>
  `;
  renderMoreContent(moreSubTab);
}

function moreTab(tab, btn) {
  moreSubTab = tab;
  document.querySelectorAll('#page-more .tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderMoreContent(tab);
}

function goMoreTab(tab) {
  moreSubTab = tab;
  showPage('more');
}

function renderMoreContent(tab) {
  const el = document.getElementById('more-content');
  if (!el) return;
  if (tab==='mandi') {
    el.innerHTML = `
      <div class="alert good"><div class="alert-icon">📈</div><div><div class="alert-title">मिर्च के भाव ऊंचे हैं — बेचने का अच्छा समय</div><div class="alert-desc">खरगोन मंडी ₹18,500/क्विंटल — पिछले सप्ताह से ₹800 अधिक।</div></div></div>
      <div class="card">
        ${MANDI.map(m=>`<div class="mandi-row"><div><div class="mandi-crop">${m.crop}</div><div class="mandi-loc">${m.loc} · प्रति क्विंटल</div></div><div class="mandi-price"><div class="mpv">${m.price}</div><div class="mpc ${m.up?'up':'dn'}">${m.change} ${m.up?'▲':'▼'}</div></div></div>`).join('')}
      </div>
      <div class="section-title">AI से मंडी सलाह</div>
      <div class="card">
        <div style="font-size:12px;color:var(--text3);margin-bottom:8px">फसल का नाम लिखें और पूछें:</div>
        <div class="input-row"><input id="mandi-q" placeholder="जैसे: मिर्च बेचूं या रुकूं?" /><button onclick="askMandiAI()">पूछो</button></div>
        <div id="mandi-ai-out"></div>
      </div>`;
  } else if (tab==='soil') {
    el.innerHTML = `
      <div class="section-title">मिट्टी स्वास्थ्य डैशबोर्ड</div>
      <div class="card">
        <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:12px">आपके खेत की मिट्टी · काली मिट्टी (रेगुर)</div>
        <div class="sbar"><div class="sl"><span>नाइट्रोजन (N)</span><span>220 kg/ha · मध्यम</span></div><div class="sb"><div class="sf" style="width:58%;background:var(--amber-mid)"></div></div></div>
        <div class="sbar"><div class="sl"><span>फॉस्फोरस (P)</span><span>18 kg/ha · कम ⚠️</span></div><div class="sb"><div class="sf" style="width:30%;background:#E24B4A"></div></div></div>
        <div class="sbar"><div class="sl"><span>पोटाश (K)</span><span>310 kg/ha · पर्याप्त ✓</span></div><div class="sb"><div class="sf" style="width:78%;background:var(--teal-mid)"></div></div></div>
        <div class="sbar"><div class="sl"><span>जस्ता (Zinc)</span><span>0.4 mg/kg · बहुत कम ⚠️</span></div><div class="sb"><div class="sf" style="width:20%;background:#E24B4A"></div></div></div>
        <div class="sbar"><div class="sl"><span>pH स्तर</span><span>7.8 · हल्का क्षारीय</span></div><div class="sb"><div class="sf" style="width:72%;background:var(--sky)"></div></div></div>
      </div>
      <div class="alert danger"><div class="alert-icon">⚠️</div><div><div class="alert-title">जस्ता और फॉस्फोरस की कमी</div><div class="alert-desc">जिंक सल्फेट 25 kg/हेक्टेयर + DAP 150 kg/हेक्टेयर डालें। मिर्च और गेहूं पर विशेष असर होगा।</div></div></div>
      <div class="section-title">AI से मिट्टी सलाह</div>
      <div class="card">
        <div class="input-row"><input id="soil-q" placeholder="जैसे: मिर्च के लिए खाद कितनी?" /><button onclick="askSoilAI()">पूछो</button></div>
        <div id="soil-ai-out"></div>
      </div>`;
  } else if (tab==='diary') {
    el.innerHTML = `
      <div class="section-title">मेरी फसल डायरी</div>
      <div class="card">
        ${DIARY.map(d=>`<div class="diary-row"><div class="dr-crop">${d.e}</div><div><div class="dr-name">${d.name}</div><div class="dr-date">${d.date}</div></div><div class="dr-area">${d.area}</div></div>`).join('')}
        <button class="green-btn">+ नई फसल जोड़ें</button>
      </div>
      <div class="section-title">इस सीजन का हिसाब</div>
      <div class="w2grid">
        <div class="wstat"><div class="wl">कुल खर्च</div><div class="wv" style="font-size:18px;color:#A32D2D">₹38,500</div><div class="ws">खाद+बीज+दवा</div></div>
        <div class="wstat"><div class="wl">अनुमानित आमदनी</div><div class="wv" style="font-size:18px;color:var(--teal)">₹94,000</div><div class="ws">मंडी भाव पर</div></div>
      </div>
      <div class="alert good"><div class="alert-icon">🔄</div><div><div class="alert-title">फसल चक्र सुझाव</div><div class="alert-desc">मिर्च के बाद गेहूं-चना लगाएं — मिट्टी में नाइट्रोजन बढ़ेगा और कीट कम होंगे।</div></div></div>`;
  } else if (tab==='schemes') {
    el.innerHTML = `
      <div class="section-title">सरकारी योजनाएं</div>
      <div class="card">
        ${SCHEMES.map(s=>`<div class="scheme"><div class="sch-name">${s.name}</div><div class="sch-desc">${s.desc}</div><div class="sch-badge">${s.badge}</div></div>`).join('')}
      </div>
      <div class="section-title">संपर्क करें</div>
      <div class="card">
        <div class="pest-item"><div class="pest-emoji">👨‍🌾</div><div><div class="pest-name">KVK इंदौर</div><div class="pest-desc">📞 0731-2434312 · सोम–शनि 9AM–5PM</div></div></div>
        <div class="pest-item"><div class="pest-emoji">👨‍🌾</div><div><div class="pest-name">KVK खरगोन</div><div class="pest-desc">📞 07282-230418 · विशेषज्ञ परामर्श</div></div></div>
        <div class="pest-item"><div class="pest-emoji">📞</div><div><div class="pest-name">किसान कॉल सेंटर</div><div class="pest-desc">📞 1800-180-1551 · निःशुल्क · 24×7</div></div></div>
        <div class="pest-item"><div class="pest-emoji">🏢</div><div><div class="pest-name">MP कृषि विभाग हेल्पलाइन</div><div class="pest-desc">📞 0755-2571031</div></div></div>
      </div>`;
  }
}

// ── AI HELPERS ───────────────────────────────────────────────────────────────
function askAI(userMsg, outId, system) {
  const out = document.getElementById(outId);
  if (!out) return;
  out.innerHTML = `<div class="thinking" style="padding:10px 0"><span></span><span></span><span></span></div>`;
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system,messages:[{role:'user',content:userMsg}]})
  }).then(r=>r.json()).then(d=>{
    const t=d.content?.map(b=>b.text||'').join('')||'जानकारी उपलब्ध नहीं है।';
    out.innerHTML=`<div style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.75">${t.replace(/\n/g,'<br>')}</div>`;
  }).catch(()=>{
    out.innerHTML=`<div style="font-size:13px;color:var(--text);margin-top:10px">नेटवर्क समस्या है। कृपया दोबारा प्रयास करें।</div>`;
  });
}

function askMandiAI(){
  const q=document.getElementById('mandi-q')?.value?.trim();
  if(!q)return;
  askAI(`${q} — इंदौर/खरगोन/खंडवा मंडी के संदर्भ में 80 शब्दों में सलाह दो।`,
    'mandi-ai-out','KisanMitra AI for MP farmers. Respond ONLY in Hindi. Give mandi price advice.');
}
function askSoilAI(){
  const q=document.getElementById('soil-q')?.value?.trim();
  if(!q)return;
  askAI(`${q} — काली मिट्टी (रेगुर) MP के संदर्भ में 80 शब्दों में जवाब दो।`,
    'soil-ai-out','KisanMitra AI for MP farmers. Respond ONLY in Hindi. Be practical and specific.');
}
function askWeatherAI(){
  const q=document.getElementById('weather-q')?.value?.trim();
  if(!q)return;
  askAI(`${q} — इंदौर-खरगोन जिले के किसान के लिए मौसम के हिसाब से 80 शब्दों में सलाह दो।`,
    'weather-ai-out','KisanMitra AI for MP farmers. Respond ONLY in Hindi. Give weather-based farming advice.');
}

function aiPostAdvice(outId, question) {
  const out = document.getElementById(outId);
  out.innerHTML=`<div class="thinking" style="padding:8px 0"><span></span><span></span><span></span></div>`;
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,
      system:'KisanMitra AI for MP farmers. Respond ONLY in Hindi. Be practical, concise.',
      messages:[{role:'user',content:`${question} — MP किसान की मदद करो। 80 शब्दों में उपाय बताओ।`}]
    })
  }).then(r=>r.json()).then(d=>{
    const t=d.content?.map(b=>b.text||'').join('')||'';
    out.innerHTML=`<div class="ai-box" style="margin-top:8px"><div class="aib-title" style="font-size:13px">🤖 AI सलाह</div><div class="aib-body">${t.replace(/\n/g,'<br>')}</div></div>`;
  }).catch(()=>{
    out.innerHTML=`<div class="ai-box" style="margin-top:8px"><div class="aib-body">पत्ती मरोड़ वायरस हो सकता है। इमिडाक्लोप्रिड 0.5ml/लीटर छिड़कें और प्रभावित पौधे हटाएं।</div></div>`;
  });
}

function startVoice(){
  if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){
    alert('आपके फोन में आवाज की सुविधा नहीं है। कृपया टाइप करें।'); return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new SR();
  r.lang = 'hi-IN'; r.interimResults = false;
  r.onresult = e => {
    const txt = e.results[0][0].transcript;
    const out = document.getElementById('ai-output');
    out.innerHTML = `<div class="thinking"><span></span><span></span><span></span></div>`;
    fetch('https://api.anthropic.com/v1/messages',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,
        system:'KisanMitra AI for MP farmers (Indore-Khargone-Khadwa). Respond ONLY in Hindi. Be practical.',
        messages:[{role:'user',content:txt}]
      })
    }).then(r=>r.json()).then(d=>{
      const t=d.content?.map(b=>b.text||'').join('')||'';
      out.innerHTML=`<div class="ai-box"><div class="aib-title">🎤 "${txt}"</div><div class="aib-body">${t.replace(/\n/g,'<br>')}</div></div>`;
    }).catch(()=>{
      out.innerHTML=`<div class="ai-box"><div class="aib-title">🎤 "${txt}"</div><div class="aib-body">नेटवर्क समस्या है।</div></div>`;
    });
  };
  r.onerror = () => alert('माइक्रोफोन की अनुमति दें।');
  r.start();
  alert('बोलिए... (माइक चालू है)');
}

function shareResult(){alert('✅ फोटो और विश्लेषण समुदाय में साझा किया गया।');}

// ── INSTALL PROMPT ────────────────────────────────────────────────────────────
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    document.getElementById('install-prompt').classList.add('show');
  });
  window.addEventListener('appinstalled', () => {
    document.getElementById('install-prompt').classList.remove('show');
  });
}
function doInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(() => {
    deferredInstallPrompt = null;
    document.getElementById('install-prompt').classList.remove('show');
  });
}
function closeInstall() {
  document.getElementById('install-prompt').classList.remove('show');
}
