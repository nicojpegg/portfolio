// Photography page script extracted from inline <script>
// Data model (extend here)
const PHOTOS = [
  { src: '/media/images/cat-nicojpeg-tech.jpeg', title: 'Cat • studio light test', desc: 'Playful portrait while testing lighting & texture.' },
  { src: '/media/images/tousend-me.jpeg', title: 'Self • thousand me', desc: 'Experimental multiple exposure inspired composite.' }
];

const gridEl = document.getElementById('gallery-grid');
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
const btnPrev = document.getElementById('lb-prev');
const btnNext = document.getElementById('lb-next');
const btnClose = document.getElementById('lb-close');
let index = 0;
let lightboxOpen = false;

function createCard(photo, i){
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'gallery-card';
  card.setAttribute('data-index', i);
  card.innerHTML = `\n      <div class="img-wrap shimmer">\n        <img loading="lazy" src="${photo.src}" alt="${photo.title}" />\n      </div>\n      <div class="card-meta">\n        <h2>${photo.title}</h2>\n      </div>`;
  card.addEventListener('click', ()=> openLightbox(i));
  const img = card.querySelector('img');
  img.addEventListener('load', ()=>{ card.querySelector('.img-wrap').classList.remove('shimmer'); card.classList.add('loaded'); });
  img.addEventListener('error', ()=>{ card.querySelector('.img-wrap').classList.add('error'); });
  return card;
}

function render(){ PHOTOS.forEach((p,i)=> gridEl.appendChild(createCard(p,i))); }

function openLightbox(i){
  lightboxOpen = true;
  index = i;
  updateLightbox();
  lb.hidden = false;
  document.body.classList.add('no-scroll');
}
function closeLightbox(){ lb.hidden = true; document.body.classList.remove('no-scroll'); lightboxOpen = false; }
function next(){ index = (index + 1) % PHOTOS.length; updateLightbox(true); }
function prev(){ index = (index - 1 + PHOTOS.length) % PHOTOS.length; updateLightbox(true); }
function updateLightbox(animate){
  const p = PHOTOS[index];
  if(animate){ lbImg.classList.add('swap'); requestAnimationFrame(()=>{ lbImg.classList.remove('swap'); }); }
  lbImg.src = p.src; lbImg.alt = p.title; lbCap.textContent = `${index+1}/${PHOTOS.length} — ${p.title}`;
  preload(index+1); preload(index-1);
}
function preload(i){ const p = PHOTOS[(i + PHOTOS.length) % PHOTOS.length]; const img = new Image(); img.src = p.src; }

// Accessibility & controls
// (Keep listeners after definitions so referenced functions exist)
document.addEventListener('keydown', e=>{
  if(lb.hidden) return;
  if(e.key === 'Escape') { closeLightbox(); }
  if(e.key === 'ArrowRight') { next(); }
  if(e.key === 'ArrowLeft') { prev(); }
});
btnPrev.addEventListener('click', prev);
btnNext.addEventListener('click', next);
btnClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', e=>{ if(e.target === lb) closeLightbox(); });

// Touch swipe
let touchX = 0;
lb.addEventListener('touchstart', e=>{ touchX = e.changedTouches[0].clientX; }, {passive:true});
lb.addEventListener('touchend', e=>{ const dx = e.changedTouches[0].clientX - touchX; if(Math.abs(dx) > 42){ dx < 0 ? next() : prev(); } });

// Init
render();
