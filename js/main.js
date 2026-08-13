// Actualización del idioma también en el input oculto de Brevo
function setLang(lang){
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
  });
  document.getElementById('langBtnEn').classList.toggle('active', lang === 'en');
  document.getElementById('langBtnEs').classList.toggle('active', lang === 'es');
  document.documentElement.lang = lang;

  // Sincroniza el idioma con el formulario de Brevo
  const brevoLocale = document.getElementById('brevo-locale');
  if(brevoLocale) brevoLocale.value = lang;

  const brevoForm = document.getElementById('brevo-form');
  if(brevoForm){
    brevoForm.action = lang === 'es'
      ? 'https://53d630ad.sibforms.com/serve/MUIFAON632w0VBRWhFt9bUiUuF_96mTy0e1FeDIOJGFXNK8rNIYuVksFSv7jQjYW9cF7qoCf0Xcaldvfsa3_vthTlLqovRl2krNCnpVqEE17YfziWx7PAR62-wucBAC23ld4-Amcf4ysGtb3sVkSuezCXx4RC1t5DDrNJTqJwYUAUC2K4MZY246nudaPmo0ooNMJGxxgKwcxgvmr9g=='
      : 'https://53d630ad.sibforms.com/serve/MUIFAIllMdlpO4dKkoKUkz-Ns9BWsjLtZosZFQESohNwaRPekkc8RoPGWr-cKPNRDT8BDP8-yjRAPZLK1ouRusZb_dhoMFwk05c5vsV8FeeQ_XdqD0vNc7wl1mtRHPL5KfWtk54IggSy3ndyx1Nqw4B9-6ESY5x5IemyvR0R-i6AVRgf0X9Jd3NmvZJVunT1BmBQsZQhgwDSBFLFXQ==';
  }
}

const browserLang = (navigator.language || 'en').toLowerCase();
const initialLang = browserLang.startsWith('es') ? 'es' : 'en';
setLang(initialLang);

const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function openMobileNav(){
  sidebar.classList.add('mobile-open');
  overlay.classList.add('open');
}
function closeMobileNav(){
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('open');
}

hamburgerBtn.addEventListener('click', openMobileNav);
overlay.addEventListener('click', closeMobileNav);

function switchSection(id, btn){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  btn.classList.add('active');
  closeMobileNav();
}

const loreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.lore-chapter').forEach(ch => loreObserver.observe(ch));

function openLightbox(src){
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
}

document.querySelectorAll('.info-value.copyable').forEach(el => {
  const original = el.textContent;
  el.addEventListener('click', () => {
    navigator.clipboard.writeText(original).then(() => {
      el.textContent = 'Copied!';
      el.classList.add('copied');
      setTimeout(() => {
        el.textContent = original;
        el.classList.remove('copied');
      }, 1200);
    });
  });
});

// Control inteligente de estados según la URL (?confirm=sent o ?confirm=done)
function checkMailStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const confirmStatus = urlParams.get('confirm');

  const mailForm = document.getElementById('mail-form');
  const mailConfirm = document.getElementById('mail-confirm');
  const mailDone = document.getElementById('mail-done');

  if (!mailForm || !mailConfirm || !mailDone) return;

  if (confirmStatus === 'sent' || confirmStatus === 'done') {
    if (confirmStatus === 'sent') {
      mailForm.style.display = 'none';
      mailConfirm.style.display = 'block';
      mailDone.style.display = 'none';
    } else if (confirmStatus === 'done') {
      mailForm.style.display = 'none';
      mailConfirm.style.display = 'none';
      mailDone.style.display = 'block';
    }

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-mail').classList.add('active');

    const mailBtn = document.querySelector('.nav-item[data-target="mail"]');
    if (mailBtn) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      mailBtn.classList.add('active');
    }
  } else {
    mailForm.style.display = 'block';
    mailConfirm.style.display = 'none';
    mailDone.style.display = 'none';
  }
}

// Script del facade (yt)
document.getElementById('teaser-wrapper').addEventListener('click', function() {
  this.innerHTML = '<iframe width="100%" height="100%" style="position:absolute; inset:0; border:0;" src="https://www.youtube.com/embed/uwrKApJ9zuM?autoplay=1" title="$SIFO teaser" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
});

// Banner superior
const topBanner = document.getElementById('topBanner');
const topBannerClose = document.getElementById('topBannerClose');

if (sessionStorage.getItem('sifoBannerClosed') === 'true') {
  topBanner.style.display = 'none';
}

topBannerClose.addEventListener('click', () => {
  topBanner.style.display = 'none';
  sessionStorage.setItem('sifoBannerClosed', 'true');
});

// Se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const brevoForm = document.getElementById('brevo-form');
  if (brevoForm) {
    brevoForm.addEventListener('submit', () => {
      setTimeout(() => {
        window.location.href = window.location.pathname + '?confirm=sent';
      }, 300);
    });
  }

  // Si la URL trae un idioma explícito (venimos de Brevo), lo respetamos
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang === 'es' || urlLang === 'en') {
    setLang(urlLang);
  }

  checkMailStatus();
});
