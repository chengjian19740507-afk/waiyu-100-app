// 外语日常生活100句 · 4 语种
(async () => {
  const langsEl = document.getElementById('langs');
  const catsEl = document.getElementById('cats');
  const cardsEl = document.getElementById('cards');
  const statsEl = document.getElementById('stats');
  const titleEl = document.getElementById('app-title');
  const subtitleEl = document.getElementById('app-subtitle');
  const tpl = document.getElementById('card-tpl');

  const LANGS = {
    en: { label: '英语日常生活用语', sub: '文字+语音 · 英语母语发音 · 初学者日常 100 句', file: 'sentences-en.json', tts: 'speech', lang: 'en-US' },
    es: { label: '西语日常生活用语', sub: '文字+语音 · 西语母语发音 · 初学者日常 100 句', file: 'sentences-es.json', tts: 'speech', lang: 'es-ES' },
    fr: { label: '法语日常生活用语', sub: '文字+语音 · 法语母语发音 · 初学者日常 100 句', file: 'sentences-fr.json', tts: 'speech', lang: 'fr-FR' },
    ru: { label: '俄语日常生活用语', sub: '文字+语音 · 俄语母语发音 · 初学者日常 100 句', file: 'sentences-ru.json', tts: 'speech', lang: 'ru-RU' },
  };

  const catDefs = [
    { key: 'all', zh: '全部' },
    { key: 'greetings', zh: '问候' },
    { key: 'intro', zh: '自我介绍' },
    { key: 'food', zh: '饮食' },
    { key: 'transport', zh: '交通' },
    { key: 'shopping', zh: '购物' },
    { key: 'time', zh: '时间' },
    { key: 'directions', zh: '问路' },
    { key: 'numbers', zh: '数字' },
    { key: 'family', zh: '家庭' },
    { key: 'common', zh: '常用' },
    { key: 'airport', zh: '机场海关' },
    { key: 'hotel', zh: '宾馆入住' },
    { key: 'visa', zh: '签证类型' },
    { key: 'frontdesk', zh: '前台常用' },
  ];

  let currentLang = localStorage.getItem('waiyu-lang') || 'en';
  let allData = [];
  let currentCat = 'all';
  let currentUtter = null;
  let currentCard = null;

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
    const list = currentCat === 'all' ? allData : allData.filter(s => s.category === currentCat);
    cardsEl.innerHTML = '';
    list.forEach(s => cardsEl.appendChild(makeCard(s, cfg)));
    statsEl.textContent = `共 ${allData.length} 句 · 当前 ${list.length}`;
  }

  function makeCard(s, cfg) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = s.id;
    node.querySelector('.num').textContent = String(s.id).padStart(2, '0');
    const textEl = node.querySelector('.text');
    textEl.textContent = s.text;
    textEl.setAttribute('dir', 'ltr');
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

  function play(s, node, cfg) {
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
    const utter = new SpeechSynthesisUtterance(s.text);
    utter.lang = cfg.lang;
    utter.rate = 0.9;
    currentUtter = utter;
    utter.onend = stopCurrent;
    utter.onerror = stopCurrent;
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

  langsEl.querySelectorAll('.lang-chip').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
  renderCats();
  allData = await load(currentLang);
  render();
})();