// 海外旅游日常用语150句 · 6 语种
(async () => {
  const langsEl = document.getElementById('langs');
  const catsEl = document.getElementById('cats');
  const cardsEl = document.getElementById('cards');
  const statsEl = document.getElementById('stats');
  const titleEl = document.getElementById('app-title');
  const subtitleEl = document.getElementById('app-subtitle');
  const searchEl = document.getElementById('search');
  const searchClearEl = document.getElementById('search-clear');
  const tpl = document.getElementById('card-tpl');

  const RTL_LANGS = new Set(['ar']);

  // ============ TTS 声音管理 ============
  let _voicesCache = null;
  function ensureVoices() {
    if (_voicesCache) return Promise.resolve(_voicesCache);
    if (!('speechSynthesis' in window)) return Promise.resolve([]);
    return new Promise((resolve) => {
      const v = speechSynthesis.getVoices();
      if (v && v.length) { _voicesCache = v; resolve(v); return; }
      const handler = () => {
        _voicesCache = speechSynthesis.getVoices();
        resolve(_voicesCache);
      };
      speechSynthesis.addEventListener('voiceschanged', handler);
      setTimeout(() => {
        _voicesCache = speechSynthesis.getVoices();
        resolve(_voicesCache);
      }, 1000);
    });
  }

  function pickBestVoice(voices, langCode) {
    if (!voices || !voices.length) return null;
    const lang = langCode.toLowerCase().split('-')[0];
    // 1. 完全匹配
    let v = voices.find(x => x.lang === langCode);
    if (v) return v;
    // 2. 高质量声音（premium/neural/enhanced/natural/microsoft/google）
    const qualityRe = /(premium|neural|enhanced|natural|microsoft|google|samantha|tingting|meijia)/i;
    const qualified = voices.filter(x => x.lang.toLowerCase().startsWith(lang) && qualityRe.test(x.name));
    if (qualified.length) return qualified[0];
    // 3. 任何同语族声音
    const family = voices.filter(x => x.lang.toLowerCase().startsWith(lang));
    if (family.length) return family[0];
    return null;
  }

  ensureVoices(); // 预加载

  const LANGS = {
    en: { label: '英语海外旅游150句', sub: '文字+语音 · 英语母语发音 · 海外旅游日常 150 句', file: 'sentences-en.json', tts: 'speech', lang: 'en-US' },
    es: { label: '西语海外旅游150句', sub: '文字+语音 · 西语母语发音 · 海外旅游日常 150 句', file: 'sentences-es.json', tts: 'speech', lang: 'es-ES' },
    fr: { label: '法语海外旅游150句', sub: '文字+语音 · 法语母语发音 · 海外旅游日常 150 句', file: 'sentences-fr.json', tts: 'speech', lang: 'fr-FR' },
    ru: { label: '俄语海外旅游150句', sub: '文字+语音 · 俄语母语发音 · 海外旅游日常 150 句', file: 'sentences-ru.json', tts: 'speech', lang: 'ru-RU' },
    ja: { label: '日语海外旅游150句', sub: '文字+罗马字 · 日语假名发音 · 海外旅游日常 150 句', file: 'sentences-ja.json', tts: 'speech', lang: 'ja-JP' },
    ko: { label: '韩语海外旅游150句', sub: '文字+罗马字 · 韩语母语发音 · 海外旅游日常 150 句', file: 'sentences-ko.json', tts: 'speech', lang: 'ko-KR' },
    ar: { label: '阿语海外旅游150句', sub: '文字+罗马字 · 阿语母语发音 · 海外旅游日常 150 句', file: 'sentences-ar.json', tts: 'speech', lang: 'ar-SA' },
  };

  const catDefs = [
    { key: 'all', zh: '全部' },
    { key: 'greetings', zh: '问候' },
    { key: 'intro', zh: '自我介绍' },
    { key: 'airport', zh: '机场海关' },
    { key: 'visa', zh: '签证类型' },
    { key: 'hotel', zh: '宾馆入住' },
    { key: 'frontdesk', zh: '前台常用' },
    { key: 'food', zh: '饮食' },
    { key: 'transport', zh: '交通' },
    { key: 'shopping', zh: '购物' },
    { key: 'time', zh: '时间日期' },
    { key: 'directions', zh: '问路' },
    { key: 'numbers', zh: '数字' },
    { key: 'family', zh: '家庭' },
    { key: 'common', zh: '常用表达' },
    { key: 'restaurant', zh: '餐厅' },
    { key: 'medical', zh: '医疗' },
    { key: 'travel', zh: '旅游实用' },
  ];

  const CAT_ORDER = {};
  catDefs.forEach((c, i) => CAT_ORDER[c.key] = i);

  let currentLang = localStorage.getItem('waiyu-lang') || 'en';
  let allData = [];
  let currentCat = 'all';
  let currentSearch = '';
  let currentUtter = null;
  let currentCard = null;

  function matchesSearch(s, q) {
    if (!q) return true;
    const t = (s.text || '').toLowerCase();
    const r = (s.romanization || '').toLowerCase();
    const c = (s.translation || '').toLowerCase();
    return t.includes(q) || r.includes(q) || c.includes(q);
  }

  async function load(lang) {
    const cfg = LANGS[lang];
    try {
      const res = await fetch(cfg.file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      cardsEl.innerHTML = `<div style="padding:40px;text-align:center;color:#f87171">
        加载失败：${err.message}<br><br>
        请用 <code>python3 -m http.server 8000</code> 启动本地服务
      </div>`;
      return [];
    }
  }

  function renderCats() {
    catsEl.innerHTML = '';
    for (const cat of catDefs) {
      const btn = document.createElement('button');
      btn.className = 'chip' + (cat.key === 'all' ? ' active' : '');
      btn.textContent = cat.zh;
      btn.dataset.cat = cat.key;
      btn.addEventListener('click', () => filter(cat.key));
      catsEl.appendChild(btn);
    }
  }

  function filter(cat) {
    currentCat = cat;
    document.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('active', c.dataset.cat === cat);
    });
    render();
  }

  function render() {
    const cfg = LANGS[currentLang];
    titleEl.textContent = `${cfg.label}`;
    subtitleEl.textContent = cfg.sub;
    let list = currentCat === 'all' ? [...allData] : allData.filter(s => s.category === currentCat);
    if (currentSearch) list = list.filter(s => matchesSearch(s, currentSearch));
    list.sort((a, b) => (CAT_ORDER[a.category] - CAT_ORDER[b.category]) || (a.id - b.id));
    if (list.length === 0 && currentSearch) {
      cardsEl.innerHTML = `<div style="padding:48px 20px;text-align:center;color:#94a3b8">未找到匹配 “<strong style="color:#475569">${currentSearch}</strong>” 的句子</div>`;
      statsEl.textContent = `共 ${allData.length} 句 · 匹配 0`;
      return;
    }
    cardsEl.innerHTML = '';
    list.forEach(s => cardsEl.appendChild(makeCard(s, cfg)));
    const matchNote = currentSearch ? ` · 匹配 ${list.length}` : '';
    statsEl.textContent = `共 ${allData.length} 句 · 当前 ${list.length}${matchNote}`;
  }

  function makeCard(s, cfg) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = s.id;
    node.querySelector('.num').textContent = String(s.id).padStart(3, '0');
    const textEl = node.querySelector('.text');
    textEl.textContent = s.text;
    textEl.setAttribute('dir', RTL_LANGS.has(currentLang) ? 'rtl' : 'ltr');
    textEl.setAttribute('lang', currentLang);
    node.querySelector('.romanization').textContent = s.romanization;
    node.querySelector('.translation').textContent = s.translation;

    const playBtn = node.querySelector('.play');
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      play(s, node, cfg);
    });
    node.addEventListener('click', () => play(s, node, cfg));
    return node;
  }

  function stopCurrent() {
    if (currentUtter) {
      window.speechSynthesis.cancel();
    }
    if (currentCard) {
      currentCard.classList.remove('playing');
      const pb = currentCard.querySelector('.play');
      if (pb) pb.classList.remove('playing');
    }
  }

  async function play(s, node, cfg) {
    stopCurrent();

    const playBtn = node.querySelector('.play');
    node.classList.add('playing');
    playBtn.classList.add('playing');
    currentCard = node;

    if (!('speechSynthesis' in window)) {
      alert('当前浏览器不支持语音合成');
      stopCurrent();
      return;
    }

    const voices = await ensureVoices();
    const voice = pickBestVoice(voices, cfg.lang);

    const utter = new SpeechSynthesisUtterance(s.text);
    utter.lang = cfg.lang;
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang; // 使用 voice 自身的 lang，确保发音一致
    }
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    currentUtter = utter;
    utter.onend = stopCurrent;
    utter.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn(`TTS ${cfg.lang}: ${e.error}`);
      }
      stopCurrent();
    };

    if (!voice) {
      console.warn(`TTS ${cfg.lang}: 未找到匹配 voice，使用浏览器默认`);
    } else if (window._debugTTS) {
      console.log(`TTS ${cfg.lang} → ${voice.name} (${voice.lang})`);
    }

    window.speechSynthesis.speak(utter);
  }

  for (const btn of langsEl.querySelectorAll('.lang-chip')) {
    btn.addEventListener('click', async () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      stopCurrent();
      currentLang = lang;
      localStorage.setItem('waiyu-lang', lang);
      langsEl.querySelectorAll('.lang-chip').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
      });
      allData = await load(lang);
      currentCat = 'all';
      render();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      const first = cardsEl.querySelector('.card');
      if (first) first.click();
    }
  });

  searchEl.addEventListener('input', e => {
    currentSearch = e.target.value.trim().toLowerCase();
    searchClearEl.hidden = !currentSearch;
    render();
  });
  searchClearEl.addEventListener('click', () => {
    searchEl.value = '';
    currentSearch = '';
    searchClearEl.hidden = true;
    render();
    searchEl.focus();
  });

  langsEl.querySelectorAll('.lang-chip').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
  renderCats();
  allData = await load(currentLang);
  render();

  // === 悬浮打赏按钮 + 弹窗 ===
  const tipFab = document.getElementById('tip-fab');
  const tipModal = document.getElementById('tip-modal');
  tipFab.hidden = false;

  // 5 张卡片浏览后脉冲一次（每个用户只触发一次）
  const PULSE_KEY = 'waiyu-tip-pulse-v1';
  if (!localStorage.getItem(PULSE_KEY)) {
    const viewed = new Set();
    const cardObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.target.dataset.id) viewed.add(e.target.dataset.id);
      });
      if (viewed.size >= 5) {
        tipFab.classList.add('pulse');
        setTimeout(() => tipFab.classList.remove('pulse'), 3500);
        localStorage.setItem(PULSE_KEY, '1');
        cardObs.disconnect();
      }
    }, { threshold: 0.5 });
    const observeAll = () => cardsEl.querySelectorAll('.card').forEach(c => cardObs.observe(c));
    new MutationObserver(observeAll).observe(cardsEl, { childList: true });
    observeAll();
  }

  // FAB 点击 → 打开弹窗
  tipFab.addEventListener('click', () => { tipModal.hidden = false; });

  // 弹窗关闭（背景或关闭按钮）
  tipModal.addEventListener('click', e => {
    if (e.target.dataset && e.target.dataset.close !== undefined) tipModal.hidden = true;
  });

  // ESC 键关闭弹窗
  document.addEventListener('keydown', e => {
    if (e.code === 'Escape' && !tipModal.hidden) tipModal.hidden = true;
  });
})();