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

  // material calculator: area -> bricks (~64/m², +5% reserve) + glue bags (1 per 500)
  function calcMaterial(){
    var area=parseFloat(document.getElementById('calc-area').value)||0;
    var bricks=area>0?Math.ceil(area*64*1.05):0;
    var bags=area>0?Math.ceil(bricks/500):0;
    document.getElementById('calc-bricks').textContent=bricks?bricks.toLocaleString('ru-RU'):'—';
    document.getElementById('calc-bags').textContent=bags?bags:'—';
    var body='Здравствуйте! Рассчитайте цену:\nПлощадь облицовки: '+area+' м²\nКирпич: ~'+bricks+' шт\nКлей: ~'+bags+' мешков';
    document.getElementById('calc-wa').href='https://wa.me/77781114923?text='+encodeURIComponent(body);
  }

  // form -> WhatsApp deep link
  function sendWhatsApp(e){
    e.preventDefault();
    var name = document.getElementById('f-name').value.trim();
    var phone = document.getElementById('f-phone').value.trim();
    var msg = document.getElementById('f-msg').value.trim();
    var body = 'Заявка с сайта LEGOBLOCK\n'
      + 'Имя: ' + name + '\n'
      + 'Телефон: ' + phone + '\n'
      + 'Сообщение: ' + msg;
    window.open('https://wa.me/77781114923?text=' + encodeURIComponent(body), '_blank');
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
