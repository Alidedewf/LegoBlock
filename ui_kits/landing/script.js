// language toggle (RU default, KK = Kazakh)
  function setLang(lang){
    document.documentElement.lang = (lang==='kk')?'kk':'ru';
    document.querySelectorAll('[data-ru]').forEach(function(el){
      var v = el.getAttribute(lang==='kk'?'data-kk':'data-ru');
      if(v!=null) el.textContent = v;
    });
    document.getElementById('ru').classList.toggle('on', lang==='ru');
    document.getElementById('kk').classList.toggle('on', lang==='kk');
  }

  // mobile burger menu
  function toggleMenu(){
    var m=document.getElementById('mobileMenu');
    var open=m.classList.toggle('open');
    var b=document.querySelector('.burger');
    b.setAttribute('aria-expanded',open?'true':'false');
    b.querySelector('i').className='ph '+(open?'ph-x':'ph-list');
  }
  function closeMenu(){
    document.getElementById('mobileMenu').classList.remove('open');
    var b=document.querySelector('.burger');
    b.setAttribute('aria-expanded','false');
    b.querySelector('i').className='ph ph-list';
  }

  // material calculator: area -> bricks (64.1/m², rounded UP to the nearest 100)
  // + glue bags (1 per 500). Matches the reference spreadsheet: 7648 -> 7700.
  var BRICKS_PER_M2 = 64.1;
  var PRICE_PER_BRICK = 300;
  function bricksFromArea(area){
    return area > 0 ? Math.ceil(area * BRICKS_PER_M2 / 100) * 100 : 0;
  }
  function calcMaterial(){
    var area=parseFloat(document.getElementById('calc-area').value)||0;
    var bricks=bricksFromArea(area);
    var bags=area>0?Math.ceil(bricks/500):0;
    var cost=bricks*PRICE_PER_BRICK;
    document.getElementById('calc-bricks').textContent=bricks?bricks.toLocaleString('ru-RU'):'—';
    document.getElementById('calc-bags').textContent=bags?bags:'—';
    var costEl=document.getElementById('calc-cost');
    if(costEl) costEl.textContent=cost?cost.toLocaleString('ru-RU'):'—';
    var body='Здравствуйте! Рассчитайте стоимость:\nПлощадь: '+area+' м²\nКирпич: ~'+bricks+' шт\nКлей: ~'+bags+' мешков\nОриентировочно: ~'+cost.toLocaleString('ru-RU')+' ₸ за кирпич';
    document.getElementById('calc-wa').href='https://wa.me/77027210843?text='+encodeURIComponent(body);
  }

  // building dimensions -> net masonry area -> bricks (64.1/m², rounded up).
  // Writes the net area into the main area field so calcMaterial() recomputes
  // the "Количество кирпичей" card and cost with the same 64.1 coefficient.
  function calcDims(){
    var ids = ['dim-length','dim-width','dim-height','win-width','win-height','win-count','door-width','door-height','door-count'];
    var raw = {};
    ids.forEach(function(id){ raw[id] = document.getElementById(id).value.trim(); });

    var errPos = document.getElementById('dim-err-positive');
    var errInt = document.getElementById('dim-err-integer');
    var errOvf = document.getElementById('dim-err-overflow');
    var resEl  = document.getElementById('dim-result');
    var hideAll = function(){ errPos.hidden = true; errInt.hidden = true; errOvf.hidden = true; resEl.hidden = true; };

    // neutral state until ALL fields are filled — no nagging while the user types
    var allFilled = ids.every(function(id){ return raw[id] !== ''; });
    if(!allFilled){ hideAll(); return; }

    // counts must be integers
    var isIntField = function(v){ return /^\d+$/.test(v); };
    if(!isIntField(raw['win-count']) || !isIntField(raw['door-count'])){
      hideAll(); errInt.hidden = false; return;
    }

    var v = {};
    ids.forEach(function(id){ v[id] = parseFloat(raw[id]); });

    // all filled now — flag only genuinely invalid values (0 or negative)
    var allPositive = ids.every(function(id){ return v[id] > 0; });
    if(!allPositive){ hideAll(); errPos.hidden = false; return; }

    var wallArea    = (v['dim-length'] + v['dim-width']) * 2 * v['dim-height'];
    var windowsArea = v['win-width'] * v['win-height'] * v['win-count'];
    var doorsArea   = v['door-width'] * v['door-height'] * v['door-count'];

    if(windowsArea + doorsArea > wallArea){
      hideAll(); errOvf.hidden = false; return;
    }

    var netArea = wallArea - windowsArea - doorsArea;
    var bricks = bricksFromArea(netArea);

    // push net area into the main calculator input and recompute bricks + cost
    var areaEl = document.getElementById('calc-area');
    areaEl.value = Math.round(netArea * 100) / 100;
    calcMaterial();

    hideAll();
    var lang = (document.documentElement.lang === 'kk') ? 'kk' : 'ru';
    resEl.textContent = (lang === 'kk')
      ? 'Таза қалау ауданы: ' + netArea.toFixed(1) + ' м² · ' + bricks.toLocaleString('ru-RU') + ' кірпіш'
      : 'Чистая площадь кладки: ' + netArea.toFixed(1) + ' м² · ' + bricks.toLocaleString('ru-RU') + ' кирпичей';
    resEl.hidden = false;
  }

  // form -> WhatsApp deep link
  function sendWhatsApp(e){
    e.preventDefault();
    var name = document.getElementById('f-name').value.trim();
    var phone = document.getElementById('f-phone').value.trim();
    var body = 'Заявка с сайта LEGOBLOCK\n'
      + 'Имя: ' + name + '\n'
      + 'Телефон: ' + phone;
    window.open('https://wa.me/77027210843?text=' + encodeURIComponent(body), '_blank');
    return false;
  }

  // scroll reveal
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
  },{threshold:0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // lightbox — полноэкранный просмотр фото галерей
  (function(){
    var lb = document.getElementById('lightbox');
    if(!lb) return;
    var lbImg = document.getElementById('lightbox-img');
    var lbCap = document.getElementById('lightbox-cap');
    function openLightbox(src, cap){
      lbImg.src = src; lbImg.alt = cap || '';
      lbCap.textContent = cap || '';
      lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    window.closeLightbox = function(){
      lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
      document.body.style.overflow = ''; lbImg.src = '';
    };
    document.querySelectorAll('.app figure img, .objects figure img').forEach(function(img){
      img.addEventListener('click', function(){
        openLightbox(img.currentSrc || img.src, img.getAttribute('alt') || '');
      });
    });
    lb.addEventListener('click', function(e){ if(e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
    });
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
  calcMaterial();
