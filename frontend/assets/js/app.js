
/* ══════════════════════════════
   AUTOVIINDU — APP ENGINE
══════════════════════════════ */
/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — MASTER CARS DATABASE
   Updated: March 2026
   • Images: assets/images/cars/[slug]-[01-04].jpg
   • Prices: NPR (from CG Motorcorp dealer price sheet)
   • budgetTier: Under 20L / Under 30L / Under 40L /
                 Under 50L / Above 50L  (1L = NPR 100,000)
═══════════════════════════════════════════════════════ */


(function(){
'use strict';
const USED = window.USED_CARS_DB || [];

const Rs=n=>n>=100000?`Rs. ${(n/100000).toFixed(2)}L`:`Rs. ${n.toLocaleString()}`;
const calcEMI=(p,ar,m)=>{const r=ar/12/100;return r===0?p/m:p*(r*Math.pow(1+r,m))/(Math.pow(1+r,m)-1)};
const carBySlug=s=>CARS_DB.find(c=>c.slug===s);
const fmtR=r=>r.toFixed(1);
const IC={
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  chevR:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>`,
  star:`<svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
  phone:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>`,
  bolt:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  cmp:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  calc:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="9.5" y2="11"/><line x1="12" y1="11" x2="13.5" y2="11"/><line x1="8" y1="15" x2="9.5" y2="15"/><line x1="12" y1="15" x2="13.5" y2="15"/><line x1="8" y1="19" x2="16" y2="19"/></svg>`,
  x:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

let compareList=[];
let wishlist=[];
let galIdx=0;
let activeVariant={};
let heroTimer=null;

/* ─ TOAST ─ */
function toast(msg,type=''){
  const wrap=document.getElementById('toast-wrap');
  if(!wrap)return;
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span>${type==='success'?'✓':'ℹ'}</span>${msg}`;
  wrap.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

/* ─ COMPARE ─ */
function toggleCompare(slug){
  const car=carBySlug(slug);if(!car)return;
  const idx=compareList.indexOf(slug);
  if(idx>-1){compareList.splice(idx,1);toast(`${car.brand} ${car.model} removed`)}
  else{if(compareList.length>=3){toast('Max 3 cars','error');return}compareList.push(slug);toast(`${car.brand} ${car.model} added to compare`,'success')}
  updateCompareTray();updateCmpBtns();
}
function clearCompare(){compareList.splice(0);updateCompareTray();updateCmpBtns()}
function updateCompareTray(){
  const tray=document.getElementById('cmp-tray'),slots=document.getElementById('cmp-slots');
  if(!tray||!slots)return;
  if(!compareList.length){tray.classList.remove('show');return}
  tray.classList.add('show');
  let h=compareList.map(s=>{const c=carBySlug(s);if(!c)return'';return`<div class="cmp-slot"><img src="${c.images[0]}" alt=""><span>${c.brand} ${c.model}</span><span class="cmp-rm" onclick="AV.toggleCompare('${s}')">✕</span></div>`}).join('');
  if(compareList.length<3)h+=`<div class="cmp-add">+ Add car</div>`;
  slots.innerHTML=h;
}
function updateCmpBtns(){
  document.querySelectorAll('[data-cmp]').forEach(b=>{
    const inList=compareList.includes(b.dataset.cmp);
    b.textContent=inList?'✓ Added':'+ Compare';
    b.classList.toggle('added',inList);
  });
}

(function () {
    var menus = ['cars', 'used', 'compare', 'services', 'videos'];
 
    menus.forEach(function (id) {
      var btn = document.getElementById('mm-' + id + '-btn');
      var sub = document.getElementById('mm-' + id + '-sub');
      if (!btn || !sub) return;
 
      btn.addEventListener('click', function () {
        var isOpen = sub.classList.contains('open');
 
        // Close all open submenus
        menus.forEach(function (otherId) {
          var otherSub = document.getElementById('mm-' + otherId + '-sub');
          var otherBtn = document.getElementById('mm-' + otherId + '-btn');
          if (otherSub) otherSub.classList.remove('open');
          if (otherBtn) otherBtn.classList.remove('open');
        });
 
        // Open this one if it was closed
        if (!isOpen) {
          sub.classList.add('open');
          btn.classList.add('open');
        }
      });
    });
  })();
/* ─ WISHLIST ─ */
function toggleWish(slug,btn){
  const idx=wishlist.indexOf(slug);
  if(idx>-1)wishlist.splice(idx,1);else wishlist.push(slug);
  if(btn)btn.classList.toggle('active',wishlist.includes(slug));
}

/* ─ CAR CARD ─ */
const badgeCls={ev:'badge-ev',hybrid:'badge-hybrid',popular:'badge-popular',new:'badge-new',trending:'badge-trending'};
const badgeLbl={ev:'Electric',hybrid:'Hybrid',popular:'Popular',new:'New',trending:'Trending'};
function carCard(car){
  const inCmp=compareList.includes(car.slug);
  return`<div class="car-card" onclick="AV.openDetail('${car.slug}')">
    <div class="cc-img">
      <img src="${car.images[0]}" alt="${car.brand} ${car.model}" loading="lazy">
      <div class="cc-badges"><span class="cc-badge ${badgeCls[car.badge]||'badge-popular'}">${badgeLbl[car.badge]||''}</span></div>
      <button class="cc-wish ${wishlist.includes(car.slug)?'active':''}" onclick="event.stopPropagation();AV.toggleWish('${car.slug}',this)">${IC.heart}</button>
      <div class="cc-score">${IC.star} ${car.expertScore}/10</div>
      <button class="cc-cmp ${inCmp?'added':''}" data-cmp="${car.slug}" onclick="event.stopPropagation();AV.toggleCompare('${car.slug}')">${inCmp?'✓ Added':'+ Compare'}</button>
    </div>
    <div class="cc-body">
      <div class="cc-meta"><span class="cc-rating">${IC.star} ${fmtR(car.rating)}</span><span class="cc-reviews">${car.reviews} reviews</span></div>
      <div class="cc-name">${car.brand} ${car.model}</div>
      <div class="cc-variant">${car.year} · ${car.body} · ${car.variants.length} variants</div>
      <div class="cc-specs">
        <span class="spec-pill">${car.type}</span>
        <span class="spec-pill">${car.specs['Fuel Efficiency']||car.specs['Range (WLTP)']||''}</span>
      </div>
      <div class="cc-colors">
        ${car.colors.slice(0,4).map(c=>`<span class="color-dot" style="background:${c.hex}" title="${c.name}"></span>`).join('')}
        <span class="colors-more">${car.colors.length} colors · ${car.variants.length} vars</span>
      </div>
      <div class="cc-price-row">
        <div class="cc-from">Starting from</div>
        <div class="cc-price">${car.variants[0].label}</div>
        <div class="cc-emi">EMI from <strong>Rs. ${car.baseEMI.toLocaleString()}/mo</strong></div>
        <div class="cc-actions">
          <button class="cc-btn-o" onclick="event.stopPropagation();alert('Call: +977-9701076240')">Get Price</button>
          <button class="cc-btn-f" onclick="event.stopPropagation();AV.openDetail('${car.slug}')">Details</button>
        </div>
      </div>
    </div>
    
  </div>`;
}


/* ─ HOME ─ */

const HERO_SLIDES=[
  {
    bg:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&h',
    badge:'New Arrival 2024',
    title:'Hyundai<br><em>IONIQ 5</em>',
    sub:'Nepal\'s best EV. 481 km range, V2L for load-shedding, 800V ultra-fast charging.',
    offer:{
      icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M14.615 1.595a.75.75 0 0 1 .36.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143z"/>
      </svg>`,
      label:'EV Offer',val:'Zero road tax + Free home charger'
    },
    slug:'hyundai-ioniq5'
  },
  {
    bg:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1400&h=700&fit=crop',
    badge:'Best Seller',
    title:'Hyundai<br><em>Creta</em>',
    sub:'Nepal\'s #1 mid-size SUV. 160 bhp, dual 10.25" screens, Level 2 ADAS.',
    offer:{
      icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 12v10H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>`,
      label:'Festival Offer',val:'Rs. 2L cashback + Free accessories'
    },
    slug:'hyundai-creta'
  },
  {
    bg:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&h=700&fit=crop',
    badge:'Hill Conqueror',
    title:'Toyota<br><em>Fortuner</em>',
    sub:'221mm ground clearance, 500 Nm diesel torque. No road is too rough.',
    offer:{
      icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 20 L8.5 8 L12 13 L15.5 7 L21 20 Z"/>
        <path d="M1 20h22"/>
      </svg>`,
      label:'Nepal Special',val:'5-year extended warranty'
    },
    slug:'toyota-fortuner'
  },
  {
    bg:'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1400&h=700&fit=crop',
    badge:'Fuel Champion',
    title:'Toyota<br><em>Prius PHEV</em>',
    sub:'40+ km/l with solar roof. 26 km pure EV range for your daily commute.',
    offer:{
      icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>`,
      label:'Green Deal',val:'Free solar charging installation'
    },
    slug:'toyota-prius'
  },
];
const BASE = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/';

const BRANDS = [
  { name: 'Hyundai',       count: '165 cars', logo: `${BASE}hyundai.png` },
  { name: 'Suzuki',        count: '81 cars',  logo: `${BASE}suzuki.png` },
  { name: 'Tata',          count: '64 cars',  logo: `${BASE}tata.png` },
  { name: 'Ford',          count: '57 cars',  logo: `${BASE}ford.png` },
  { name: 'Kia',           count: '50 cars',  logo: `${BASE}kia.png` },
  { name: 'Toyota',        count: '28 cars',  logo: `${BASE}toyota.png` },
  { name: 'Nissan',        count: '28 cars',  logo: `${BASE}nissan.png` },
  { name: 'Maruti Suzuki', count: '21 cars',  logo: `${BASE}maruti-suzuki.png` },
  { name: 'Volkswagen',    count: '20 cars',  logo: `${BASE}volkswagen.png` },
  { name: 'Renault',       count: '20 cars',  logo: `${BASE}renault.png` },
  { name: 'Mahindra',      count: '20 cars',  logo: `${BASE}mahindra.png` },
  { name: 'BYD',           count: '15 cars',  logo: `${BASE}byd.png` },
  { name: 'MG',            count: '14 cars',  logo: `${BASE}mg.png` },
  { name: 'Skoda',         count: '13 cars',  logo: `${BASE}skoda.png` },
  { name: 'Honda',         count: '10 cars',  logo: `${BASE}honda.png` },
  { name: 'Deepal',        count: '3 cars',   logo: `${BASE}deepal.png` },
  { name: 'Chery',         count: '6 cars',   logo: `${BASE}chery.png` },
  { name: 'Proton',        count: '4 cars',   logo: `${BASE}proton.png` },
  { name: 'Haval',         count: '5 cars',   logo: `${BASE}haval.png` },
  { name: 'Geely',         count: '5 cars',   logo: `${BASE}geely.png` },
  { name: 'Mazda',         count: '4 cars',   logo: `${BASE}mazda.png` },
  { name: 'Maxus',         count: '3 cars',   logo: `${BASE}maxus.png` },
  { name: 'Mercedes',      count: '14 cars',  logo: `${BASE}mercedes-benz.png` },
  { name: 'BMW',           count: '12 cars',  logo: `${BASE}bmw.png` },
  { name: 'Audi',          count: '10 cars',  logo: `${BASE}audi.png` },
  { name: 'Lexus',         count: '7 cars',   logo: `${BASE}lexus.png` },
];
const BUDGETS = [
  {
    label: 'Under Rs. 30L',
    count: '12 cars',
    filter: 'budget-30',
    examples: 'Tata Tiago EV · MG Comet · Alto K10',
    bg: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=220&fit=crop', // compact hatchback
    overlay: 'linear-gradient(135deg,rgba(15,118,110,.88),rgba(6,78,59,.75))',   // teal-green (budget/eco)
  },
  {
    label: 'Rs. 30L–50L',
    count: '34 cars',
    filter: 'budget-50',
    examples: 'Hyundai Venue · Tata Nexon · Kia Sonet',
    bg: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=400&h=220&fit=crop', // compact SUV
    overlay: 'linear-gradient(135deg,rgba(37,99,235,.88),rgba(29,78,216,.75))',   // royal blue (mid range)
  },
  {
    label: 'Rs. 50L–80L',
    count: '28 cars',
    filter: 'budget-80',
    examples: 'Hyundai Creta · Kia Seltos · MG Hector',
    bg: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=220&fit=crop', // mid SUV
    overlay: 'linear-gradient(135deg,rgba(202,138,4,.88),rgba(161,98,7,.75))',    // amber-gold (popular segment)
  },
  {
    label: 'Rs. 80L–1.2Cr',
    count: '18 cars',
    filter: 'budget-120',
    examples: 'Toyota Fortuner · Hyundai Tucson · Kia Sportage',
    bg: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=220&fit=crop', // full-size SUV
    overlay: 'linear-gradient(135deg,rgba(124,45,18,.88),rgba(154,52,18,.75))',   // burnt orange (premium)
  },
  {
    label: 'Rs. 1.2Cr–2Cr',
    count: '11 cars',
    filter: 'budget-200',
    examples: 'BMW 3 Series · Mercedes C-Class · Audi A4',
    bg: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=220&fit=crop', // luxury sedan
    overlay: 'linear-gradient(135deg,rgba(30,27,75,.9),rgba(49,46,129,.78))',     // deep indigo (luxury)
  },
  {
    label: 'Above Rs. 2Cr',
    count: '9 cars',
    filter: 'budget-2cr+',
    examples: 'BMW X5 · Mercedes GLE · Land Cruiser 300',
    bg: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=220&fit=crop', // ultra-luxury
    overlay: 'linear-gradient(135deg,rgba(15,15,15,.92),rgba(40,40,40,.82))',     // near-black carbon (ultra-lux)
  },
];

const OFFERS = [
  {
    title: 'Extended Warranty',
    color: '#4CAF72', iconBg: 'rgba(76,175,114,.18)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
  },
  {
    title: 'Free Pickup / Drop',
    color: '#6aadff', iconBg: 'rgba(100,160,255,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
  },
  {
    title: 'Ceramic / Underbody',
    color: '#FFBE50', iconBg: 'rgba(255,190,80,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
  },
  {
    title: 'Dashcam Install',
    color: '#c882ff', iconBg: 'rgba(200,130,255,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`
  },
  {
    title: 'Paint Film (PPF)',
    color: '#50d2b4', iconBg: 'rgba(80,210,180,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  },
  {
    title: 'Loan Fee Waiver',
    color: '#ff6464', iconBg: 'rgba(255,100,100,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
  },
  {
    title: 'Festival Bonus',
    color: '#FFC83C', iconBg: 'rgba(255,200,60,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  },
  {
    title: 'Fuel Voucher',
    color: '#4CAF72', iconBg: 'rgba(76,175,114,.18)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14"/><path d="M2 22h14M13 6V2h2l4 4v10a2 2 0 0 1-2 2v0"/><path d="M13 10h4"/></svg>`
  },
  {
    title: 'Free Accessories',
    color: '#6aadff', iconBg: 'rgba(100,160,255,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
  },
  {
    title: 'Referral Bonus',
    color: '#FFBE50', iconBg: 'rgba(255,190,80,.15)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  }
];
let heroIdx=0;

function renderHome(){
  document.title='AutoViindu — Find Your Perfect Car in Nepal';
  setNav('home');
  const db=CARS_DB;
  const evCars=db.filter(c=>c.type==='Electric');
  document.getElementById('app-root').innerHTML=`
  <!-- HERO CAROUSEL -->
  <div class="hero" id="hero">
    <div class="hero-slides" id="hero-slides">
      ${HERO_SLIDES.map((s,i)=>`
      <div class="hero-slide" data-idx="${i}">
        <div class="slide-bg" style="background-image:url('${s.bg}')"></div>
        <div class="wrap slide-content">
          <div class="slide-badge"><span class="dot"></span>${s.badge}</div>
          <h1 class="slide-title">${s.title}</h1>
          <p class="slide-sub">${s.sub}</p>
          <div class="offer-pill" style="color:#fff">
  ${s.offer.icon}
  <strong>${s.offer.label}</strong> — ${s.offer.val}
</div>
          <div class="slide-actions">
            <button class="slide-action-primary" onclick="AV.openDetail('${s.slug}')">View Car Details</button>
            <button class="slide-action-ghost" onclick="alert('Call: +977-9701076240')">Get Best Price</button>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <button class="hero-prev" onclick="AV.heroNav(-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></button>
    <button class="hero-next" onclick="AV.heroNav(1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg></button>
    <div class="hero-dots" id="hero-dots">
      ${HERO_SLIDES.map((_,i)=>`<div class="hero-dot ${i===0?'active':''}" onclick="AV.heroGo(${i})"></div>`).join('')}
    </div>
    <div class="hero-progress" id="hero-progress"></div>
  </div>

  <!-- QUICK CATEGORY STRIP -->
<div class="hero-strip">
  <div class="wrap" style="padding:0">
    <div class="strip-scroll">
      ${[
     {
  svg: `
  <svg viewBox="0 0 110 110" width="84" height="84" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.164,55.966c-5.021,0-9.092,4.07-9.092,9.092s4.071,9.092,9.092,9.092s9.092-4.07,9.092-9.092S26.186,55.966,21.164,55.966z M21.164,69.316c-2.352,0-4.259-1.906-4.259-4.259s1.907-4.259,4.259-4.259s4.259,1.906,4.259,4.259S23.516,69.316,21.164,69.316z"/>
    <path d="M85.664,55.966c-5.021,0-9.092,4.07-9.092,9.092s4.07,9.092,9.092,9.092s9.093-4.07,9.093-9.092S90.686,55.966,85.664,55.966z M85.664,69.316c-2.352,0-4.259-1.906-4.259-4.259s1.907-4.259,4.259-4.259s4.259,1.906,4.259,4.259S88.016,69.316,85.664,69.316z"/>
    <path d="M107.934,59.775c0-0.227,0.265-1.361,0.228-1.779c-0.037-0.416-1.06-2.232-1.247-2.27s-0.04-2.271-0.002-3.595s-0.605-1.93-0.605-1.93s-0.038-0.983-0.151-1.665l-0.263-1.574c0-0.207-2.44-1.714-2.44-1.714l-4.985-5.037l1.143-0.675l-0.467-0.728c0,0-0.208,0-1.039,0.104c-0.033,0.004-0.059,0.008-0.079,0.012c-0.083-0.084-1.054-0.367-6.879-1.103c-9.451-1.194-27.265-1.973-28.304-1.973s-8.152,0.312-10.956,0.883s-10.125,3.738-11.216,4.361s-9.665,5.144-9.665,5.144s-5.712,0.416-12.047,1.246S8.676,49.509,7.793,49.873s-2.804,1.402-2.908,1.714s-0.675,2.597-0.883,3.012s-1.454,2.597-1.454,2.597l0.016,2.391l0.509,0.758l0.038,2.271l-0.378,0.605c0,0-0.378-0.531,0,1.324c0.378,1.854,2.99,2.535,2.99,2.535l3.179,0.379l0.189,0.68l1.635-0.014c-0.276-0.947-0.432-1.948-0.432-2.986c0-5.881,4.768-10.649,10.649-10.649s10.649,4.768,10.649,10.649c0,0.977-0.142,1.916-0.388,2.814l0.365-0.004h21.305h22.473c-0.245-0.896-0.387-1.836-0.387-2.811c0-5.881,4.768-10.649,10.648-10.649c5.882,0,10.649,4.768,10.649,10.649c0,0.748-0.078,1.477-0.225,2.18l2.705-0.088c0,0,3.292-0.379,4.654-0.568s2.232-0.643,3.178-1.514c0.945-0.869,1.594-3.746,1.594-3.746S107.934,60.002,107.934,59.775z M32.191,47.14c1.203-0.635,8.478-4.474,9.479-5.045c1.091-0.623,8.413-3.79,11.216-4.361s9.917-0.883,10.956-0.883c0.123,0,0.487,0.011,1.04,0.033l-6.441,9.266L32.191,47.14z M85.19,45.14l-24.639,0.93l6.081-9.113c4.896,0.22,15.124,0.77,22.562,1.532L85.19,45.14z"/>
  </svg>
  `,
  label: 'SUV',
  filter: 'suv',
  color: {
  bg: '#FEF7E6',
  border: '#E8A820',
  icon: '#C4840A',
  text: '#7A5200'
}
},

{
  svg: `
  <svg viewBox="0 0 512.005 512.005" width="84" height="84" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M503.422,257.578v-40.648c0-0.273-0.325-1.88-0.496-2.435c-0.171-0.564-0.376-1.076-0.649-1.589c-0.128-0.231-34.463-51.977-34.463-51.977c-1.307-1.956-3.366-3.298-5.698-3.691c-214.023-35.924-268.879-0.145-271.382,1.598L124.387,208.6l-108.583,8.347c-3.076,0.239-5.784,2.119-7.082,4.904c-0.325,0.683-3.545,7.92-5.989,20.7l-2.247,17.086c-1.35,17.941-0.231,41.793,7.757,70.677c1.008,3.656,4.425,6.211,8.219,6.211h25.629c4.741,0,8.535-3.896,8.543-8.637c0-0.043,0.009-0.085,0.009-0.137c0.128-32.917,26.843-59.571,59.794-59.571c33.028,0,59.802,26.774,59.802,59.802c-0.615,5.186,3.477,8.543,8.543,8.543h153.777c4.741,0,8.535-3.896,8.543-8.637c0-0.051,0.009-0.094,0.009-0.145c0.137-32.917,26.843-59.554,59.794-59.554c33.028,0,59.802,26.774,59.802,59.802c-0.615,5.186,3.477,8.543,8.543,8.543h25.629c2.982,0,5.844-1.538,7.321-4.126C521.098,299.063,507.608,266.198,503.422,257.578z M272.757,204.123c0,2.358-1.914,4.272-4.272,4.272l-102.561,0.009c-4.101,0-5.844-5.228-2.563-7.689l37.052-27.799c0.128-0.103,0.231-0.171,0.376-0.256c1.939-1.111,19.615-10.474,67.38-13.387c2.452-0.154,4.588,1.82,4.588,4.28V204.123z M361.768,208.395l-67.662,0.009c-2.358,0-4.272-1.914-4.272-4.272v-41.409c0-2.349,1.828-4.272,4.178-4.289c13.327-0.094,28.363,0.282,45.304,1.307c1.461,0.085,2.811,0.897,3.528,2.178c3.81,6.817,16.403,29.081,22.656,40.127C367.124,204.892,365.04,208.386,361.768,208.395z M470.932,208.386l-79.682,0.009c-1.529,0-2.947-0.82-3.708-2.153l-21.537-37.692c-1.717-2.999,0.607-6.715,4.049-6.39c24.519,2.324,52.267,5.852,83.714,11.021c1.17,0.196,2.247,0.871,2.913,1.862l17.804,26.706C476.374,204.585,474.341,208.386,470.932,208.386z M400.904,285.275c-23.554,0-42.716,19.162-42.716,42.716c0,23.554,19.162,42.716,42.716,42.716c23.553,0,42.716-19.162,42.716-42.716C443.62,304.437,424.449,285.275,400.904,285.275z M400.904,353.62c-14.13,0-25.63-11.499-25.63-25.63s11.499-25.629,25.63-25.629c14.13,0,25.629,11.499,25.629,25.629S415.034,353.62,400.904,353.62z M110.437,285.275c-23.554,0-42.716,19.162-42.716,42.716c0,23.554,19.162,42.716,42.716,42.716c23.553,0,42.716-19.162,42.716-42.716C153.152,304.437,133.981,285.275,110.437,285.275z M110.437,353.62c-14.13,0-25.63-11.499-25.63-25.63s11.499-25.629,25.63-25.629c14.13,0,25.629,11.499,25.629,25.629S124.567,353.62,110.437,353.62z"/>
  </svg>
  `,
  label: 'Hatchback',
  filter: 'hatchback',
  color: {
  bg: '#FEF7E6',
  border: '#E8A820',
  icon: '#C4840A',
  text: '#7A5200'
  
}
},
{
  svg: `
  <svg viewBox="0 0 50 50" width="84" height="84" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M48.8,23.8c-0.1-1-0.4-1.9-1-2.7c-1.5-1.8-2.4-4.2-5.3-4.6c-4.7-0.6-16.1-1.5-19.8,0.2c-12.7,5.9-6.9,3.7-19.5,6.9c-0.6,0.2-1.1,0.6-1.4,1.1c-0.8,1.5-1.1,3.8-0.2,5.2C2,30.6,2.7,31,3.6,31h0.9c-0.1-0.4-0.1-0.9-0.1-1.3c0-3.6,3-6.6,6.6-6.6c3.6,0,6.6,3,6.6,6.6c0,0.4,0,0.9-0.1,1.3h15.1c-0.1-0.4-0.1-0.9-0.1-1.3c0-3.6,3-6.6,6.6-6.6s6.6,3,6.6,6.6c0,0.4,0,0.8-0.1,1.2c0.9-0.2,1.8-0.7,2.4-1.4c0.8-0.9,1.3-2.1,1.2-3.4L48.8,23.8z M27,21.3l-8.2,0.6c-0.6,0-1.1-0.1-1.6-0.4l6.3-3c0.6-0.3,1.1-0.4,3.5-0.6V21.3z M34,20.8l-5,0.4v-3.4c1.7-0.1,3.4-0.1,5,0V20.8z M40.3,19.7c-0.1,0.4-0.4,0.6-0.8,0.7L36,20.6v-2.8c1.6,0.1,3.1,0.3,4.6,0.4L40.3,19.7z"/>
    <ellipse cx="10.9" cy="29.7" rx="4.6" ry="4.6"/>
    <path d="M43.5,29.7c0,2.5-2.1,4.6-4.6,4.6c-2.5,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6C41.5,25.1,43.5,27.2,43.5,29.7z"/>
  </svg>
  `,
  label: 'Crossover',
  filter: 'crossover',
  color: {
  bg: '#FEF7E6', 
  border: '#E8A820',
  icon: '#C4840A',
  text: '#7A5200'
}
},
   {
  svg: `
  <svg viewBox="0 0 98.967 98.967" width="84" height="84" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.275,52.156c-4.124,0-7.468,3.343-7.468,7.468c0,0.318,0.026,0.631,0.066,0.938c0.463,3.681,3.596,6.528,7.401,6.528c3.908,0,7.112-3.004,7.437-6.83c0.017-0.209,0.031-0.422,0.031-0.637C24.743,55.499,21.4,52.156,17.275,52.156z M13.537,56.81l1.522,1.523c-0.118,0.203-0.211,0.422-0.271,0.656h-2.146C12.752,58.177,13.063,57.435,13.537,56.81z M12.632,60.282h2.163c0.061,0.23,0.151,0.448,0.271,0.648l-1.526,1.525C13.067,61.835,12.749,61.093,12.632,60.282z M16.629,64.263c-0.809-0.113-1.544-0.43-2.166-0.899l1.518-1.519c0.2,0.117,0.419,0.203,0.648,0.263V64.263z M16.629,57.14c-0.235,0.062-0.455,0.154-0.66,0.275l-1.521-1.521c0.625-0.475,1.367-0.789,2.181-0.902V57.14z M17.922,54.99c0.814,0.113,1.557,0.429,2.181,0.903l-1.52,1.521c-0.204-0.121-0.426-0.213-0.66-0.275L17.922,54.99z M17.922,64.261v-2.152c0.23-0.061,0.447-0.146,0.647-0.264l1.519,1.519C19.466,63.833,18.73,64.148,17.922,64.261z M21.014,62.462l-1.531-1.533c0.12-0.201,0.217-0.416,0.278-0.646h2.146C21.793,61.091,21.488,61.839,21.014,62.462z M19.764,58.989c-0.061-0.234-0.153-0.453-0.271-0.656l1.524-1.523c0.471,0.625,0.782,1.367,0.894,2.18H19.764z M79.284,52.156c-4.124,0-7.468,3.343-7.468,7.468c0,0.318,0.026,0.631,0.066,0.938c0.463,3.681,3.596,6.528,7.4,6.528c3.908,0,7.112-3.004,7.438-6.83c0.017-0.209,0.031-0.422,0.031-0.637C86.753,55.499,83.409,52.156,79.284,52.156z M75.546,56.81l1.521,1.523c-0.118,0.203-0.211,0.422-0.271,0.656H74.65C74.761,58.177,75.072,57.435,75.546,56.81z M74.642,60.282h2.163c0.061,0.23,0.151,0.448,0.271,0.648l-1.525,1.525C75.076,61.835,74.757,61.093,74.642,60.282z M78.638,64.263c-0.809-0.113-1.544-0.43-2.166-0.899l1.518-1.519c0.2,0.117,0.419,0.203,0.648,0.263V64.263z M78.638,57.14c-0.235,0.062-0.455,0.154-0.66,0.275l-1.521-1.521c0.625-0.475,1.366-0.789,2.181-0.902V57.14z M79.932,54.99c0.814,0.113,1.557,0.429,2.181,0.903l-1.521,1.521c-0.204-0.121-0.426-0.215-0.66-0.275V54.99z M79.932,64.261v-2.152c0.23-0.061,0.447-0.146,0.647-0.264l1.519,1.519C81.476,63.833,80.739,64.148,79.932,64.261z M83.023,62.462l-1.531-1.531c0.12-0.202,0.218-0.416,0.278-0.647h2.146C83.802,61.091,83.498,61.839,83.023,62.462z M81.773,58.989c-0.061-0.234-0.152-0.453-0.271-0.656l1.523-1.523c0.472,0.625,0.782,1.367,0.895,2.18H81.773z M97.216,48.29v-5.526c0-0.889-0.646-1.642-1.524-1.779c-2.107-0.33-5.842-0.953-7.52-1.47c-2.406-0.742-11.702-4.678-14.921-5.417c-3.22-0.739-17.738-4.685-31.643,0.135c-2.353,0.815-12.938,5.875-19.162,8.506c-1.833,0.04-19.976,3.822-20.942,6.414c-0.966,2.593-1.269,3.851-1.447,4.509c-0.178,0.658,0,3.807,1.348,6c1.374,0.777,4.019,1.299,7.077,1.649c-0.035-0.187-0.073-0.371-0.097-0.56c-0.053-0.404-0.078-0.773-0.078-1.125c0-4.945,4.022-8.969,8.968-8.969s8.968,4.023,8.968,8.969c0,0.254-0.017,0.506-0.036,0.754c-0.047,0.555-0.147,1.094-0.292,1.613c0.007,0,0.024,0,0.024,0l44.516-0.896c-0.02-0.115-0.046-0.229-0.061-0.346c-0.053-0.402-0.078-0.772-0.078-1.125c0-4.945,4.022-8.968,8.968-8.968c4.946,0,8.969,4.022,8.969,8.968c0,0.019-0.002,0.035-0.003,0.053l0.19-0.016l7.611-1.433c0,0,2.915-1.552,2.915-5.822C98.967,49.56,97.216,48.29,97.216,48.29z M53.057,43.051L36.432,43.56c0.306-2.491-1.169-3.05-1.169-3.05c6.609-5.999,19.929-6.202,19.929-6.202L53.057,43.051z M71.715,42.29l-15.15,0.509l1.373-8.49c7.83-0.102,12.303,1.626,12.303,1.626l2.237,3.61L71.715,42.29z M80.256,42.238h-4.221l-4.22-5.795c3.166,1.26,5.7,2.502,7.209,3.287C79.94,40.206,80.44,41.223,80.256,42.238z"/>
  </svg>
  `,
  label: 'Sedan',
  filter: 'sedan',
  color: {
  bg: '#FEF7E6',
  border: '#E8A820',
  icon: '#C4840A',
  text: '#7A5200'
}
},
{
  svg: `
  <svg viewBox="0 0 74.955 29.927" width="84" height="84" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M68.697,25.833c0.04-0.117,0.074-0.236,0.105-0.357c0.017-0.055,0.03-0.105,0.045-0.162c0.021-0.102,0.045-0.205,0.064-0.311c0.017-0.092,0.03-0.182,0.038-0.273c0.014-0.08,0.025-0.16,0.033-0.242c0.018-0.178,0.028-0.363,0.028-0.547c-0.006-3.307-2.681-5.98-5.986-5.986c-3.305,0.006-5.98,2.68-5.987,5.986c0,0.184,0.011,0.369,0.028,0.547c0.008,0.082,0.021,0.162,0.03,0.242c0.012,0.092,0.027,0.182,0.041,0.273c0.021,0.105,0.046,0.209,0.067,0.311c0.013,0.057,0.025,0.107,0.042,0.162c0.032,0.121,0.062,0.24,0.104,0.357c0,0.002,0,0.002,0,0.004l0,0c0.796,2.375,3.031,4.086,5.674,4.09c2.642-0.004,4.877-1.715,5.672-4.09l0,0C68.697,25.835,68.697,25.835,68.697,25.833z"/>
    <path d="M14.047,17.955c-3.308,0.006-5.98,2.68-5.988,5.986c0.002,0.736,0.142,1.441,0.388,2.096c0.851,2.268,3.033,3.887,5.6,3.891c2.568-0.004,4.746-1.623,5.598-3.891c0.246-0.654,0.386-1.359,0.388-2.096C20.027,20.634,17.354,17.96,14.047,17.955z"/>
    <path d="M71.389,10.68c-4.437-3.543-6.607-6.354-7.55-7.814c1.15,0,1.683-0.408,1.774-0.531c0.355-0.495-15.896-3.345-29.295-1.588c-2.331,0.305-7.435,2.028-14.909,6.566C17.271,9.823,10.349,8.23,5.637,11.834c-4.29,3.281-5.667,5.453-5.545,7.054c0.158,2.025,1.018,2.559,0.093,3.482c-1.307,1.305,4.684,3.512,6.653,3.512h0.461c-0.175-0.617-0.276-1.266-0.276-1.941c0-3.879,3.144-7.023,7.024-7.023c3.876,0,7.023,3.145,7.023,7.023c0,0.676-0.102,1.324-0.28,1.941h3.421c1.199,0,13.862-0.186,13.862-0.186h18.159C56.089,25.134,56,24.548,56,23.941c0.002-3.881,3.146-7.023,7.025-7.023s7.02,3.143,7.02,7.023c0,0.607-0.083,1.193-0.227,1.756h0.786c0,0,1.848-1.664,2.678-1.664C74.855,24.033,76.657,14.885,71.389,10.68z M40.14,23.08l1.546-8.381h-5.019l8.366-11.735l-1.545,8.381h5.018L40.14,23.08z"/>
  </svg>
  `,
  label: 'Electric Vehicle',
  filter: 'electric',
  color: {
  bg: '#FEF7E6',
  border: '#E8A820',
  icon: '#C4840A',
  text: '#7A5200'
}
},


{
  svg: `
  <svg viewBox="0 0 99.442 99.443" width="52" height="52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.097,54.071c-4.175,0-7.561,3.383-7.561,7.56c0,0.324,0.026,0.641,0.066,0.951c0.469,3.729,3.642,6.611,7.494,6.611c3.959,0,7.202-3.042,7.53-6.916c0.018-0.214,0.033-0.428,0.033-0.646C26.66,57.454,23.275,54.071,19.097,54.071z M15.31,58.782l1.543,1.543c-0.121,0.206-0.214,0.429-0.274,0.665h-2.174C14.518,60.165,14.833,59.415,15.31,58.782z M14.397,62.298h2.189c0.062,0.233,0.153,0.454,0.274,0.656L15.314,64.5C14.838,63.871,14.513,63.119,14.397,62.298z M18.443,66.328c-0.818-0.112-1.564-0.434-2.193-0.908l1.537-1.538c0.202,0.118,0.424,0.205,0.656,0.266V66.328z M18.443,59.116c-0.238,0.062-0.461,0.157-0.668,0.279l-1.541-1.541c0.633-0.48,1.385-0.8,2.209-0.913V59.116z M19.752,56.941c0.826,0.113,1.577,0.433,2.209,0.914l-1.54,1.54c-0.207-0.122-0.43-0.218-0.669-0.279V56.941z M19.752,66.328v-2.182c0.233-0.061,0.454-0.147,0.657-0.268l1.538,1.54C21.317,65.894,20.572,66.214,19.752,66.328z M22.885,64.504l-1.551-1.551c0.12-0.203,0.22-0.42,0.282-0.655h2.172C23.673,63.119,23.364,63.875,22.885,64.504z M21.617,60.99c-0.06-0.236-0.153-0.459-0.274-0.665l1.543-1.543c0.478,0.633,0.792,1.383,0.905,2.208H21.617z M83.965,54.071c-4.176,0-7.561,3.383-7.561,7.56c0,0.324,0.025,0.641,0.065,0.951c0.468,3.729,3.643,6.611,7.494,6.611c3.958,0,7.201-3.042,7.53-6.916c0.018-0.214,0.031-0.428,0.031-0.646C91.526,57.454,88.142,54.071,83.965,54.071z M80.177,58.782l1.543,1.543c-0.12,0.206-0.214,0.429-0.273,0.665h-2.175C79.385,60.165,79.7,59.415,80.177,58.782z M79.265,62.298h2.19c0.062,0.233,0.152,0.454,0.272,0.656L80.182,64.5C79.705,63.871,79.38,63.119,79.265,62.298z M83.31,66.328c-0.818-0.112-1.563-0.434-2.192-0.908l1.537-1.538c0.201,0.118,0.424,0.205,0.655,0.266V66.328z M83.31,59.116c-0.237,0.062-0.461,0.157-0.669,0.279L81.1,57.854c0.634-0.48,1.385-0.8,2.209-0.913L83.31,59.116z M84.62,56.941c0.824,0.113,1.576,0.433,2.209,0.914l-1.541,1.54c-0.207-0.122-0.431-0.218-0.668-0.279V56.941z M84.62,66.328v-2.182c0.231-0.061,0.454-0.147,0.655-0.268l1.538,1.54C86.184,65.894,85.438,66.214,84.62,66.328z M87.752,64.504l-1.551-1.551c0.12-0.203,0.22-0.42,0.281-0.655h2.174C88.54,63.119,88.23,63.875,87.752,64.504z M86.483,60.99c-0.06-0.236-0.152-0.459-0.272-0.665l1.542-1.543c0.478,0.633,0.792,1.383,0.906,2.208H86.483z M99.091,47.939c-0.056-1.67-0.516-3.301-1.339-4.754l-5.43-9.581c-0.89-1.569-2.521-2.573-4.322-2.664c-9.1-0.456-37.002-1.618-45.786,0.744C36.272,33.283,21.278,43.14,21.278,43.14S4.781,45.695,1.634,53.219c0,0-1.358,0.793-1.605,2.826c-0.127,1.046,0.183,2.634,0.525,3.965c0.375,1.456,1.582,2.552,3.067,2.783l7.16,1.122c-0.107-0.391-0.196-0.788-0.248-1.198c-0.045-0.354-0.075-0.716-0.075-1.087c0-4.763,3.875-8.637,8.639-8.637c4.765,0,8.64,3.874,8.64,8.637c0,0.249-0.016,0.493-0.036,0.735c-0.072,0.844-0.268,1.651-0.567,2.408l0.842,0.045l47.568-1.287c-0.061-0.268-0.109-0.538-0.145-0.814c-0.046-0.354-0.074-0.716-0.074-1.087c0-4.763,3.875-8.637,8.638-8.637c4.765,0,8.64,3.874,8.64,8.637c0,0.249-0.016,0.493-0.037,0.735c-0.013,0.16-0.041,0.315-0.062,0.473L96.609,62c1.693-0.346,2.891-1.86,2.831-3.589L99.091,47.939z M71.715,32.71l1.093,10.911l-16.774,0.686V32.655C60.938,32.542,66.536,32.593,71.715,32.71z M29.387,45.087l-1.659,0.093c-0.451,0.025-0.864-0.249-1.016-0.675c-0.152-0.424-0.005-0.897,0.358-1.164c0.975-0.712,2.169-1.563,3.499-2.462v2.784C29.759,44.348,29.387,45.087,29.387,45.087z M33.498,42.533c-0.105,0.004-0.191,0.03-0.291,0.04V39.15c3.382-2.144,7.215-4.273,10.511-5.34c1.5-0.485,4.236-0.795,7.636-0.98v11.668l-14.412,0.589C36.942,45.087,36.442,42.423,33.498,42.533z M91.768,41.475c-0.503,0.874-1.419,1.429-2.426,1.471L77.49,43.43l-1.062-10.594c4.898,0.149,8.99,0.333,11.063,0.445c0.959,0.051,1.824,0.604,2.271,1.454l2.057,3.903C92.29,39.531,92.27,40.603,91.768,41.475z"/>
  </svg>
  `,
  label: 'Van / Microvan',
  filter: 'van',
  color: {
  bg: '#FEF7E6',
  border: '#E8A820',
  icon: '#C4840A',
  text: '#7A5200'
}
},

{
  svg: `
  <svg viewBox="0 0 99.288 99.288" width="52" height="52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.794,50.41c-4.363,0-7.902,3.535-7.902,7.899c0,0.34,0.027,0.67,0.07,0.994c0.49,3.896,3.806,6.91,7.832,6.91c4.139,0,7.527-3.179,7.871-7.229c0.018-0.225,0.034-0.446,0.034-0.676C25.699,53.945,22.161,50.41,17.794,50.41z M13.836,55.333l1.613,1.612c-0.126,0.216-0.225,0.447-0.287,0.695h-2.271C13.008,56.779,13.337,55.995,13.836,55.333z M12.882,59.008h2.288c0.065,0.244,0.161,0.476,0.287,0.688l-1.616,1.613C13.343,60.652,13.003,59.866,12.882,59.008z M17.11,63.221c-0.854-0.117-1.635-0.453-2.292-0.949l1.607-1.607c0.21,0.123,0.442,0.214,0.685,0.276V63.221z M17.11,55.682c-0.248,0.064-0.48,0.164-0.698,0.291l-1.609-1.609c0.66-0.503,1.447-0.835,2.308-0.955L17.11,55.682z M18.479,53.409c0.863,0.12,1.648,0.452,2.31,0.956l-1.609,1.608c-0.217-0.127-0.45-0.227-0.7-0.291L18.479,53.409z M18.479,63.221v-2.28c0.244-0.063,0.475-0.154,0.687-0.279l1.606,1.61C20.115,62.766,19.336,63.102,18.479,63.221z M21.753,61.313l-1.62-1.619c0.125-0.213,0.229-0.439,0.294-0.686h2.271C22.578,59.866,22.254,60.657,21.753,61.313z M20.428,57.641c-0.062-0.248-0.16-0.479-0.285-0.695l1.611-1.612c0.5,0.661,0.829,1.445,0.947,2.308H20.428z M74.758,50.41c-4.363,0-7.901,3.535-7.901,7.899c0,0.34,0.026,0.67,0.067,0.994c0.49,3.896,3.808,6.91,7.834,6.91c4.139,0,7.526-3.179,7.87-7.229c0.02-0.225,0.034-0.446,0.034-0.676C82.662,53.945,79.124,50.41,74.758,50.41z M70.799,55.333l1.613,1.612c-0.126,0.216-0.224,0.447-0.287,0.695h-2.271C69.971,56.779,70.301,55.995,70.799,55.333z M69.846,59.008h2.288c0.064,0.244,0.16,0.476,0.286,0.688l-1.616,1.613C70.308,60.652,69.967,59.866,69.846,59.008z M74.074,63.221c-0.855-0.117-1.635-0.453-2.293-0.949l1.606-1.607c0.211,0.123,0.443,0.214,0.687,0.276V63.221z M74.074,55.682c-0.25,0.064-0.482,0.164-0.699,0.291l-1.608-1.609c0.66-0.503,1.446-0.835,2.309-0.955L74.074,55.682z M75.441,53.409c0.862,0.12,1.647,0.452,2.31,0.956l-1.608,1.608c-0.218-0.127-0.45-0.227-0.7-0.291L75.441,53.409z M75.441,63.221v-2.28c0.244-0.063,0.475-0.154,0.687-0.279l1.607,1.61C77.078,62.766,76.299,63.102,75.441,63.221z M78.716,61.313l-1.62-1.619c0.125-0.213,0.229-0.439,0.295-0.686h2.271C79.54,59.866,79.217,60.657,78.716,61.313z M77.392,57.641c-0.062-0.248-0.16-0.479-0.285-0.695l1.611-1.612c0.499,0.661,0.828,1.445,0.945,2.308H77.392z M97.999,52.649H96.44l-0.4-9.369c-0.024-0.578-0.504-1.032-1.082-1.027L73.422,42.45v-7.78c0-0.724-0.587-1.31-1.311-1.31h-1.027c-0.723,0-1.31,0.586-1.31,1.31v7.814l-2.86,0.026l-0.574-6.886c-0.12-1.44-1.324-2.549-2.77-2.549H37.414c-0.913,0-1.79,0.353-2.448,0.984l-8.782,8.428L9.373,44.261c-2.33,0.245-4.463,1.421-5.915,3.261l-1.731,2.194c-1.316,0.813-1.975,2.373-1.64,3.885l0.521,2.356c0.225,1.021,1.023,1.815,2.044,2.036l5.737,1.248c-0.033-0.322-0.064-0.639-0.064-0.932c0-5.221,4.248-9.468,9.47-9.468c5.224,0,9.473,4.248,9.473,9.468c0,0.272-0.018,0.539-0.039,0.806c-0.006,0.069-0.02,0.136-0.027,0.204h38.157c-0.04-0.354-0.07-0.692-0.07-1.01c0-5.221,4.248-9.468,9.471-9.468c5.225,0,9.473,4.248,9.473,9.468c0,0.272-0.019,0.539-0.039,0.806c-0.006,0.069-0.021,0.136-0.027,0.204h4.808l4.356-2.401h4.672c0.711,0,1.287-0.575,1.287-1.286v-1.695C99.286,53.223,98.71,52.649,97.999,52.649z M33.071,43.002c0,0,0.559-1.347,0-2.89l3.467-4.299c0.198-0.245,0.496-0.388,0.81-0.388h10.375v7.576L33.071,43.002z M51.563,43.002v-7.576h9.415c0.558,0,1.017,0.44,1.04,0.997l0.273,6.579H51.563z"/>
  </svg>
  `,
  label: 'Pickup',
  filter: 'pickup',
 color: {
  bg: '#FEF7E6',
  border: '#E8A820',
  icon: '#C4840A',
  text: '#7A5200'
}
}




// Replace your existing .map function with this cleaner structure
].map(c => `
  <div class="strip-item" onclick="AV.goTo('cars',{filter:'${c.filter}'})">
    <div class="strip-icon-wrapper">
      ${c.svg}
    </div>
    <span class="strip-label">${c.label}</span>
  </div>
`).join('')}
    </div>
  </div>
</div>


  <!-- SEARCH WIDGET -->
  <div class="section" style="padding:32px 0">
    <div class="wrap">
      <div class="search-widget">
       <div class="sw-tabs">
 <div class="sw-tab active" onclick="...">
  <i data-lucide="car" style="width:28px;height:20px;color:grey;"></i>
  New Cars
</div>
  <div class="sw-tab" onclick="AV.goTo('used');this.parentElement.querySelectorAll('.sw-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 16V4m0 0L3 8m4-4 4 4"/>
      <path d="M17 8v12m0 0 4-4m-4 4-4-4"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke-dasharray="3 3"/>
    </svg>
    Used Cars
  </div>
  <div class="sw-tab" onclick="AV.goTo('cars',{filter:'electric'});this.parentElement.querySelectorAll('.sw-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M14.615 1.595a.75.75 0 0 1 .36.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143z"/>
    </svg>
    Electric
  </div>
  <div class="sw-tab" onclick="AV.goTo('compare');this.parentElement.querySelectorAll('.sw-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="5" width="8" height="14" rx="1.5"/>
      <rect x="14" y="5" width="8" height="14" rx="1.5"/>
      <line x1="10" y1="9" x2="14" y2="9"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
      <line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
    Compare
  </div>
</div>
        <div class="sw-body">
          <div class="sw-grid">
            <div class="sw-field">
              <label>Brand</label>
              <select class="sw-select" id="sw-brand">
                <option value="">All Brands</option>
                ${[...new Set(CARS_DB.map(c=>c.brand))].map(b=>`<option>${b}</option>`).join('')}
                ${['Mercedes','Audi','BMW','Lexus','Land Rover'].map(b=>`<option>${b}</option>`).join('')}
              </select>
            </div>
            <div class="sw-field">
              <label>Budget</label>
              <select class="sw-select" id="sw-budget">
                <option value="">Any Budget</option>
                <option value="15">Under Rs. 15L</option>
                <option value="25">Rs. 15L – 25L</option>
                <option value="40">Rs. 25L – 40L</option>
                <option value="60">Rs. 40L – 60L</option>
                <option value="100">Rs. 60L – 1Cr</option>
                <option value="999">Above Rs. 1Cr</option>
              </select>
            </div>
            <div class="sw-field">
              <label>Fuel Type</label>
              <select class="sw-select" id="sw-fuel">
                <option value="">All Types</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric (EV)</option>
                <option value="hybrid">Hybrid / PHEV</option>
              </select>
            </div>
            <button class="sw-btn" onclick="AV.swSearch()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search Cars
            </button>
          </div>
        </div>
        <div class="sw-popular">
          <span class="sw-popular-label">Popular:</span>
          ${['MG Hector','IONIQ 5','Toyota Prius','Honda City','Kia Seltos','BYD Atto 3','Swift 2024','Fortuner Diesel'].map(t=>`<span class="sw-pop-tag" onclick="AV.goTo('cars')">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  </div>



  <!-- FEATURED CARS -->
  <section class="section" style="background:var(--white)">
    <div class="wrap">
      <div class="sec-hd">
        <div class="sec-hd-left">
          <div class="eyebrow">Handpicked for Nepal</div>
          <h2 class="sec-title">Featured New Cars</h2>
          <div class="sec-sub">${db.length} cars · Full specs, variants & EMI</div>
        </div>
        <button class="view-all" onclick="AV.goTo('cars')">All Cars ${IC.chevR}</button>
      </div>
      <div class="filter-chips" id="home-chips">
        ${['All','Electric','Hybrid','Petrol','Diesel','SUV','Sedan','Hatchback'].map((t,i)=>`<span class="chip ${i===0?'active':''}" onclick="AV.homeFilter('${t}',this)">${t}</span>`).join('')}
      </div>
     <div class="cars-grid" id="home-grid">${db.slice(0,8).map(c=>carCard(c)).join('')}</div>
<div id="home-grid-more" style="display:${db.length>8?'block':'none'}">
 
  </div>
</div>
      <div style="text-align:center;margin-top:28px"><button class="btn btn-ghost" onclick="AV.goTo('cars')">Browse All ${db.length} Cars →</button></div>
    </div>
  </section>

  <!-- BROWSE BY BRAND -->
  <section class="section brands-section">
    <div class="wrap">
      <div class="sec-hd">
        <div class="sec-hd-left">
          <div class="eyebrow">All Manufacturers</div>
          <h2 class="sec-title">Browse by Brand</h2>
          <div class="sec-sub">Find your favourite marque</div>
        </div>
        <button class="view-all" onclick="AV.goTo('cars')">All Brands ${IC.chevR}</button>
      </div>
      <div class="brands-grid">
${BRANDS.map(b=>`<div class="brand-card" onclick="AV.goTo('cars',{brand:'${b.name}'})">
  <div class="brand-logo" style="background:#f8f8f8;padding:4px">
    <img src="${b.logo}" alt="${b.name}" style="width:100%;height:100%;object-fit:contain" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\'font-family:var(--font-d);font-size:12px;font-weight:700;color:var(--ink2)\'>${b.name[0]}</span>'">
  </div>
  <span class="brand-name">${b.name}</span>
  <span class="brand-count">${b.count}</span>
</div>`).join('')}
      </div>
    </div>
  </section>
   <!-- TRENDING CAROUSEL -->
  <section class="section" style="background:var(--white)">
    <div class="wrap">
      <div class="sec-hd">
        <div class="sec-hd-left">
          <div class="eyebrow">Recently Listed</div>
          <h2 class="sec-title">Featured Used Cars</h2>
          <div class="sec-sub">Find perfect pre-owned cars on sale</div>
        </div>
        <button class="view-all" onclick="AV.goTo('#Used')">All Cars ${IC.chevR}</button>
      </div>
      <div class="car-carousel">
        ${[...db].sort((a,b)=>b.reviews-a.reviews).slice(0,8).map(c=>carCard(c)).join('')}
      </div>
    </div>
  </section>
  <!-- Header -->
    <div class="svc-hd">
      <div class="svc-eyebrow">After-Sales Care</div>
      <div class="svc-title">Services We offer</div>
      <div class="svc-sub">From buying your first car to maintaining its peak performance, we are with you at every step of the journey.</div>
    </div>

    <!-- 4-card grid -->
    <div class="svc-grid">

      <!-- 1: DOTM -->
      <div class="svc-card" onclick="window.location.href='dotm-services.html'">
        <div class="svc-icon">
         <svg fill="#000000" viewBox="0 0 846.66 846.66" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style type="text/css">  .fil0 {fill:black;fill-rule:nonzero}  </style> </defs> <g id="Layer_x0020_1"> <path class="fil0" d="M94.63 9.1l483.79 0c4.99,0.04 9.19,1.59 12.96,4.56l171.53 121.21c5.9,3.65 9.84,10.18 9.84,17.63l0 664.35c0,11.44 -9.28,20.71 -20.71,20.71l-657.41 0c-11.44,0 -20.72,-9.27 -20.72,-20.71l0 -787.04c0,-11.44 9.28,-20.71 20.72,-20.71zm137.12 519.85c-27.24,0 -27.24,-41.42 0,-41.42l383.16 0c27.25,0 27.25,41.42 0,41.42l-383.16 0zm0 205.05c-27.24,0 -27.24,-41.42 0,-41.42l383.16 0c27.25,0 27.25,41.42 0,41.42l-383.16 0zm0 -102.52c-27.24,0 -27.24,-41.43 0,-41.43l383.16 0c27.25,0 27.25,41.43 0,41.43l-383.16 0zm131.55 -328.81c30.97,23.15 49.31,59.43 49.31,98.21 0,11.44 -9.27,20.71 -20.71,20.71l-203.63 0c-11.44,0 -20.72,-9.27 -20.72,-20.71 0,-38.78 18.35,-75.06 49.31,-98.21 -10.99,-15.01 -17.49,-33.53 -17.49,-53.56 0,-50.09 40.62,-90.71 90.71,-90.71 50.1,0 90.71,40.62 90.71,90.71 0,20.03 -6.49,38.55 -17.49,53.56zm-113.46 27.76c-18.9,10.8 -32.7,28.69 -38.21,49.74l156.91 0c-5.51,-21.05 -19.31,-38.94 -38.22,-49.74 -12.12,6.01 -25.79,9.39 -40.24,9.39 -14.45,0 -28.11,-3.38 -40.24,-9.39zm40.24 -130.6c-27.22,0 -49.28,22.06 -49.28,49.28 0,27.23 22.06,49.29 49.28,49.29 27.22,0 49.29,-22.06 49.29,-49.29 0,-27.22 -22.06,-49.28 -49.29,-49.28zm441.25 -26.62l-152.91 0c-11.43,0 -20.71,-9.28 -20.71,-20.71l0 -101.98 -442.37 0 0 745.62 615.99 0 0 -622.93zm-132.2 -103.45l0 62.03 87.78 0 -87.78 -62.03z"></path> </g> </g></svg>
        </div>
        <div class="svc-name">DOTM Services</div>
        <div class="svc-desc">Bluebook renewal, ownership transfer, and fitness test.</div>
        <a class="svc-learn" href="dotm-services.html">Learn More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <!-- 2: Maintenance -->
      <div class="svc-card" onclick="window.location.href='maintenance-repairs.html'">
        <div class="svc-icon">
          <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.002 512.002" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M433.134,297.372c-21.066,0-38.143,17.077-38.143,38.143c0,21.066,17.077,38.143,38.143,38.143 c21.066,0,38.143-17.077,38.143-38.143S454.2,297.372,433.134,297.372z M433.133,350.966c-8.532,0-15.45-6.918-15.45-15.45 c0-8.532,6.918-15.45,15.45-15.45c8.534,0,15.45,6.918,15.45,15.45C448.584,344.048,441.667,350.966,433.133,350.966z"></path> </g> </g> <g> <g> <path d="M220.254,297.372c-21.066,0-38.143,17.077-38.143,38.143c0,21.066,17.077,38.143,38.143,38.143 s38.143-17.077,38.143-38.143S241.32,297.372,220.254,297.372z M220.254,350.966c-8.532,0-15.45-6.918-15.45-15.45 c0-8.532,6.918-15.45,15.45-15.45s15.45,6.918,15.45,15.45C235.704,344.048,228.787,350.966,220.254,350.966z"></path> </g> </g> <g> <g> <path d="M163.018,256.557c-0.794-5.902-6.217-10.036-12.119-9.251l-36.96,4.964L85.123,219.42l27.85,16.16l4.11-0.552l0.026-0.097 c2.313-8.571-2.761-17.393-11.331-19.706l-27.675-7.467c-8.571-2.313-17.394,2.761-19.706,11.333 c-0.999,3.702-14.25,54.094-19.173,72.816c-1.195,4.545-1.239,9.339-0.104,13.898c1.939,7.797,5.504,22.014,10.639,41.985 l-36.753-0.192c-0.022,0-0.047,0-0.069,0c-7.114,0-12.898,5.748-12.935,12.87c-0.038,7.144,5.723,13.154,12.868,13.191h53.559 c0.022,0,0.046,0,0.068,0c8.765,0,14.59-8.112,12.523-16.088l-12.228-47.195l37.023,5.426l7.34,47.01 c1.104,7.071,7.731,11.887,14.777,10.785c7.06-1.102,11.889-7.719,10.786-14.777l-8.81-56.434 c-0.875-5.602-5.296-9.982-10.906-10.804l-4.095-0.6l-6.438,0.865c-7.309,0.982-14.561-3.078-17.46-10.023l-20.092-48.188 l32.626,37.196c0.04,0.045,0.084,0.083,0.124,0.128c2.436,2.684,5.973,3.906,9.415,3.448l42.688-5.732 C159.669,267.884,163.81,262.458,163.018,256.557z"></path> </g> </g> <g> <g> <circle cx="104.016" cy="177.861" r="23.795"></circle> </g> </g> <g> <g> <path d="M493.826,155.222c-2.164-9.836-11.044-16.975-21.115-16.975H318.495c-7.818,0-15.046,4.237-18.864,11.057l-40.775,72.814 l-58.266-62.456c-4.832-5.179-12.945-5.462-18.126-0.629c-5.18,4.832-5.46,12.946-0.629,18.125l54.418,58.331h-49.008 c-5.157,0-10.077,1.002-14.592,2.802c4.493,5.218,7.241,11.965,7.241,19.26c0,17.199-15.216,31.311-32.595,29.578 c-9.446,3.573-16.171,12.683-16.171,23.38c0,13.812,11.196,25.007,25.007,25.007h6.213c0-31.931,25.977-57.908,57.908-57.908 s57.908,25.977,57.908,57.908h97.064c0-31.931,25.978-57.908,57.908-57.908s57.908,25.977,57.908,57.908h12.762 c4.528,0,8.198-3.67,8.198-8.198v-91.829L493.826,155.222z M367.091,268.754h-25.813c-5.458,0-9.882-4.425-9.882-9.882 c0-5.458,4.424-9.882,9.882-9.882h25.813c5.458,0,9.882,4.424,9.882,9.882C376.972,264.33,372.548,268.754,367.091,268.754z M391.905,234.597h-0.001H279.475l40.468-72.263h71.963V234.597z M417.551,234.597v-72.263h53.175l15.898,72.263H417.551z"></path> </g> </g> </g></svg>
        </div>
        <div class="svc-name">Maintenance & Repairs</div>
        <div class="svc-desc">Expert servicing, engine diagnostics, and AC repair.</div>
        <a class="svc-learn" href="maintenance-repairs.html">Learn More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <!-- 3: Genuine Parts -->
      <div class="svc-card" onclick="window.location.href='parts-accessories.html'">
        <div class="svc-icon">
          <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" d="M4.22182541,19.7781746 C3.29761276,18.8539619 3.03246659,17.4441845 3.32230899,15.5944173 C1.80937652,14.4913839 1,13.3070341 1,12 C1,10.6929659 1.80937652,9.50861611 3.32230899,8.40558269 C3.03246659,6.55581547 3.29761276,5.14603806 4.22182541,4.22182541 C5.14603806,3.29761276 6.55581547,3.03246659 8.40558269,3.32230899 C9.50861611,1.80937652 10.6929659,1 12,1 C13.3070341,1 14.4913839,1.80937652 15.5944173,3.32230899 C17.4441845,3.03246659 18.8539619,3.29761276 19.7781746,4.22182541 C20.7023872,5.14603806 20.9675334,6.55581547 20.677691,8.40558269 C22.1906235,9.50861611 23,10.6929659 23,12 C23,13.3070341 22.1906235,14.4913839 20.677691,15.5944173 C20.9675334,17.4441845 20.7023872,18.8539619 19.7781746,19.7781746 C18.8539619,20.7023872 17.4441845,20.9675334 15.5944173,20.677691 C14.4913839,22.1906235 13.3070341,23 12,23 C10.6929659,23 9.50861611,22.1906235 8.40558269,20.677691 C6.55581547,20.9675334 5.14603806,20.7023872 4.22182541,19.7781746 Z M8.65258332,18.5979847 C9.05851175,18.5110507 9.47593822,18.6839544 9.70150129,19.0324608 C10.582262,20.3932808 11.3676332,21 12,21 C12.6323668,21 13.417738,20.3932808 14.2984987,19.0324608 C14.5240618,18.6839544 14.9414883,18.5110507 15.3474167,18.5979847 C16.9324536,18.9374379 17.9168102,18.8111119 18.363961,18.363961 C18.8111119,17.9168102 18.9374379,16.9324536 18.5979847,15.3474167 C18.5110507,14.9414883 18.6839544,14.5240618 19.0324608,14.2984987 C20.3932808,13.417738 21,12.6323668 21,12 C21,11.3676332 20.3932808,10.582262 19.0324608,9.70150129 C18.6839544,9.47593822 18.5110507,9.05851175 18.5979847,8.65258332 C18.9374379,7.06754643 18.8111119,6.08318982 18.363961,5.63603897 C17.9168102,5.18888812 16.9324536,5.06256208 15.3474167,5.40201528 C14.9414883,5.48894934 14.5240618,5.31604564 14.2984987,4.96753923 C13.417738,3.60671924 12.6323668,3 12,3 C11.3676332,3 10.582262,3.60671924 9.70150129,4.96753923 C9.47593822,5.31604564 9.05851175,5.48894934 8.65258332,5.40201528 C7.06754643,5.06256208 6.08318982,5.18888812 5.63603897,5.63603897 C5.18888812,6.08318982 5.06256208,7.06754643 5.40201528,8.65258332 C5.48894934,9.05851175 5.31604564,9.47593822 4.96753923,9.70150129 C3.60671924,10.582262 3,11.3676332 3,12 C3,12.6323668 3.60671924,13.417738 4.96753923,14.2984987 C5.31604564,14.5240618 5.48894934,14.9414883 5.40201528,15.3474167 C5.06256208,16.9324536 5.18888812,17.9168102 5.63603897,18.363961 C6.08318982,18.8111119 7.06754643,18.9374379 8.65258332,18.5979847 Z M11,12.5857864 L15.2928932,8.29289322 L16.7071068,9.70710678 L11,15.4142136 L7.29289322,11.7071068 L8.70710678,10.2928932 L11,12.5857864 Z"></path> </g></svg>
        </div>
        <div class="svc-name">Genuine Parts & Accessories</div>
        <div class="svc-desc">OEM parts and high-quality accessories for all brands.</div>
        <a class="svc-learn" href="parts-accessories.html">Learn More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <!-- 4: Insurance -->
      <div class="svc-card" onclick="window.location.href='insurance-services.html'">
        <div class="svc-icon">
         <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612.051 612.051" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M601.406,425.926l-102.4,87.199v31.301c0,6.699-5.7,11.3-12.4,11.3h-68.3c-6.7,0-12.399-4.8-12.399-11.3v-70.2 c0-3.7,1.899-7.601,4.8-9.5l125.1-77.7l12.4-165c0-14.3,11.3-25.6,25.6-25.6s25.601,11.3,25.601,24.6l12.399,178.3 C612.806,413.726,611.006,418.325,601.406,425.926z M110.206,364.426v-14.301v-109c0-12.4,1.9-20.9,7.6-33.2l60.7-126.1 c6.7-14.3,25.6-26.5,41.7-26.5h171.7c17,0,36.1,11.3,42.6,26.5l60.7,126.1c5.7,12.4,7.6,21.8,7.6,33.2v109.1v14.3 c0,4.8-4.8,9.5-9.5,9.5h-48.3c-5.7,0-9.5-4.8-9.5-9.5v-14.3v-16.2h-258v16.1v14.301c0,4.8-4.8,9.5-9.5,9.5h-48.3 C115.006,373.926,110.206,369.125,110.206,364.426z M439.306,236.325c-17,0-30.399,14.3-30.399,30.4c0,16.1,13.3,30.4,30.399,30.4 c17,0,30.4-13.3,30.4-30.4C469.706,249.625,456.306,236.325,439.306,236.325z M165.206,204.125h282.6l-41.7-87.2 c-8.5-17-16.1-20.9-33.199-20.9H239.306c-17,0-24.6,3.7-32.2,20.9L165.206,204.125z M143.406,266.625c0,16.1,13.3,30.4,30.4,30.4 c17.1,0,30.4-13.3,30.4-30.4s-13.3-30.4-30.4-30.4C156.706,236.226,143.406,250.525,143.406,266.625z M202.206,465.726l-125.1-77.7 l-12.4-165c0.9-15.2-11.3-26.5-25.6-26.5c-14.3,0-26.5,11.3-26.5,25.5l-12.4,178.4c-0.9,14.3,0.9,18.899,10.4,26.5l102.4,87.199 v31.301c0,6.699,5.7,11.3,12.4,11.3h69.3c6.7,0,12.4-4.8,12.4-11.3v-70.2C206.906,471.525,205.006,467.825,202.206,465.726z"></path> </g> </g></svg>
         </div>
        <div class="svc-name">Insurance & Financing</div>
        <div class="svc-desc">Best insurance plans and easy EMI financing options.</div>
        <a class="svc-learn" href="insurance-services.html">Learn More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      
       <!-- 5: Other Services -->
      <div class="svc-card" onclick="window.location.href='other-services.html'">
        <div class="svc-icon">
          <svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 240.467 240.467" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M198.874,97.947c0-5.307-3.958-9.159-9.411-9.159c-1.108,0-2.251,0.16-3.395,0.475l-3.865,1.065l-5.941-14.472 c-3.492-8.506-13.814-15.426-23.009-15.426h-66.15c-9.196,0-19.518,6.92-23.009,15.427l-5.93,14.444l-3.767-1.038 c-1.144-0.315-2.286-0.475-3.394-0.475c-5.453,0-9.411,3.852-9.411,9.159c0,5.191,3.808,9.578,9.001,10.965 c-2.852,8.015-5.053,19.832-5.053,27.631v30.994c0,6.893,5.607,12.5,12.5,12.5h4.029c6.893,0,12.5-5.607,12.5-12.5v-5.622h91.216 v5.622c0,6.893,5.607,12.5,12.5,12.5h4.029c6.893,0,12.5-5.607,12.5-12.5v-30.994c0-7.792-2.198-19.593-5.045-27.607 C195.016,107.579,198.874,103.172,198.874,97.947z M65.878,100.908l9.762-23.779c2.089-5.088,8.298-9.251,13.798-9.251h61.483 c5.5,0,11.709,4.163,13.798,9.251l9.762,23.779c2.089,5.088-0.702,9.251-6.202,9.251H72.08 C66.58,110.159,63.789,105.996,65.878,100.908z M92.124,140.347c0,2.75-2.25,5-5,5H67.08c-2.75,0-5-2.25-5-5v-7.859 c0-2.75,2.25-5,5-5h20.044c2.75,0,5,2.25,5,5V140.347z M178.055,140.347c0,2.75-2.25,5-5,5h-20.044c-2.75,0-5-2.25-5-5v-7.859 c0-2.75,2.25-5,5-5h20.044c2.75,0,5,2.25,5,5V140.347z"></path> <path d="M7.134,75.471c1.376,0.834,2.896,1.231,4.395,1.231c2.875,0,5.681-1.459,7.279-4.098C39.896,37.787,76.756,17,117.409,17 c33.999,0,65.928,14.95,87.706,40.525c-3.557-0.3-7.058,1.673-8.533,5.136c-1.839,4.319,0.171,9.311,4.49,11.151l13.918,5.928 c2.224,0.947,4.504,1.417,6.721,1.417c2.761,0,5.425-0.729,7.761-2.175c4.212-2.608,6.812-7.21,7.133-12.626l0.81-13.645 c0.278-4.686-3.296-8.71-7.982-8.988c-4.027-0.245-7.563,2.372-8.652,6.089C195.777,18.449,157.871,0,117.409,0 c-23.15,0-45.933,6.074-65.885,17.565C32.178,28.707,15.837,44.694,4.267,63.797C1.835,67.812,3.119,73.038,7.134,75.471z"></path> <path d="M233.333,164.997c-4.016-2.432-9.243-1.147-11.674,2.867c-21.087,34.817-57.948,55.604-98.602,55.604 c-33.998,0-65.927-14.95-87.705-40.525c3.555,0.299,7.057-1.674,8.532-5.136c1.839-4.319-0.171-9.311-4.49-11.151l-13.918-5.928 c-4.992-2.126-10.269-1.85-14.481,0.758c-4.212,2.608-6.812,7.21-7.133,12.626l-0.81,13.645c-0.278,4.686,3.295,8.711,7.982,8.988 c0.171,0.01,0.342,0.016,0.511,0.016c3.815-0.001,7.098-2.548,8.141-6.105c25.004,31.363,62.91,49.812,103.372,49.812 c23.15,0,45.933-6.074,65.885-17.565c19.347-11.143,35.688-27.129,47.258-46.232C238.632,172.655,237.349,167.429,233.333,164.997z "></path> </g> </g></svg>
        </div>
        <div class="svc-name">Other Services</div>
        <div class="svc-desc">Additional services to keep your vehicle in top condition.</div>
        <a class="svc-learn" href="other-services.html">Learn More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div><!-- /svc-grid -->

  </div>
</section>

  <!-- BROWSE BY BUDGET -->
  <section class="section" style="background:var(--bg)">
    <div class="wrap">
      <div class="sec-hd">
        <div class="sec-hd-left">
          <div class="eyebrow">Find by Price</div>
          <h2 class="sec-title">Browse by Budget</h2>
          <div class="sec-sub">Cars for every price range in Nepal</div>
        </div>
      </div>
      <div class="budget-grid">
        ${BUDGETS.map(b=>`<div class="budget-card" onclick="AV.goTo('cars')">
          <div class="budget-bg" style="background-image:url('${b.bg}')"></div>
          <div class="budget-overlay" style="background:${b.overlay}"></div>
          <div class="budget-content">
            <div class="budget-label">${b.label}</div>
            <div class="budget-count">${b.count}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&display=swap" rel="stylesheet">

  <!-- EV SPOTLIGHT -->
  <section class="section ev-section">
    <div class="wrap">
      <div class="ev-hero">
        <div class="ev-hero-in">
          <div>
            <div class="ev-badge">⚡ Going Green</div>
            <h2 class="ev-title">Electric Cars<br>Built for Nepal</h2>
            <p class="ev-sub">Range that handles hills. V2L for load-shedding. Fast charging for your lifestyle. The future is electric — and it's here.</p>
            <div class="ev-stats">
              <div class="ev-stat"><div class="num">${evCars.length}</div><div class="lbl">EV Models</div></div>
              <div class="ev-stat"><div class="num">481km</div><div class="lbl">Max Range</div></div>
              <div class="ev-stat"><div class="num">V2L</div><div class="lbl">Load-shedding</div></div>
            </div>
            <div class="ev-tags">
              ${evCars.map(c=>`<span class="ev-tag" onclick="AV.openDetail('${c.slug}')">${c.brand} ${c.model}</span>`).join('')}
            </div>
            <button onclick="AV.goTo('cars',{filter:'electric'})" class="btn btn-primary" style="margin-top:20px;background:#0d8566;box-shadow:0 3px 12px rgba(13,133,102,.3)">View All EVs ${IC.chevR}</button>
          </div>
          <div class="ev-cards">
            ${evCars.slice(0,4).map(c=>`<div class="ev-mini" onclick="AV.openDetail('${c.slug}')">
              <img src="${c.images[0]}" class="ev-mini-img" alt="${c.brand} ${c.model}" loading="lazy">
              <div class="ev-mini-name">${c.brand} ${c.model}</div>
              <div class="ev-mini-price">${c.variants[0].label}</div>
              <div class="ev-mini-range">${c.specs['Range (WLTP)']||''}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TRENDING CAROUSEL -->
  <section class="section" style="background:var(--white)">
    <div class="wrap">
      <div class="sec-hd">
        <div class="sec-hd-left">
          <div class="eyebrow">Most Viewed</div>
          <h2 class="sec-title">Trending Cars</h2>
          <div class="sec-sub">What Nepal is looking at right now</div>
        </div>
        <button class="view-all" onclick="AV.goTo('cars')">All Cars ${IC.chevR}</button>
      </div>
      <div class="car-carousel">
        ${[...db].sort((a,b)=>b.reviews-a.reviews).slice(0,8).map(c=>carCard(c)).join('')}
      </div>
    </div>
  </section>

  <!-- COMPARE PROMO -->
  <section class="section" style="background:var(--bg)">
    <div class="wrap">
      <div class="compare-promo">
        <div class="compare-promo-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2 4h9v1H3v15h8v1H2zm10 19h1V2h-1zM8.283 10.283l-.566-.566L4.934 12.5l2.783 2.783.566-.566L6.566 13H11v-1H6.566zM14 12h4.08l-1.54-1.54.92-.92 2.96 2.96-2.96 2.96-.92-.92L18.08 13H14v8h9V4h-9z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>
        </div>
        <div class="compare-promo-text">
          <div class="compare-promo-title">Compare Cars Side-by-Side</div>
          <div class="compare-promo-sub">Up to 3 cars at once — specs, prices, variants, pros & cons. Make the smarter choice with AutoViindu Compare.</div>
        </div>
        <button onclick="AV.goTo('compare')" class="btn btn-primary">Compare Now</button>
      </div>
    </div>
  </section>



    
<!-- WHY AUTOVIINDU -->
<section class="section why-section" style="background:var(--bg)">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:32px">
      <div class="eyebrow" style="justify-content:center">Why AutoViindu?</div>
      <h2 class="sec-title">Nepal's most trusted car platform</h2>
    </div>
    <div class="why-rows">

      <!-- New Cars → #newcars anchor -->
      <div class="why-row-item" onclick="window.location.href='#cars'" style="cursor:pointer">
        <div class="why-row-img">
          <svg viewBox="0 0 120 80" width="120" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="80" rx="10" fill="#e8f5ec"/><rect x="10" y="14" width="100" height="52" rx="6" fill="#fff" stroke="#c4daca" stroke-width="1"/><rect x="18" y="22" width="60" height="6" rx="3" fill="#2ea84a"/><rect x="18" y="32" width="45" height="4" rx="2" fill="#b8cdbf"/><rect x="18" y="40" width="50" height="4" rx="2" fill="#b8cdbf"/><circle cx="94" cy="42" r="14" fill="#e8f5ec" stroke="#2ea84a" stroke-width="1.5"/><path d="M88 42l4 4 8-8" stroke="#2ea84a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="18" y="50" width="30" height="10" rx="3" fill="#1a6b2a"/><rect x="52" y="50" width="30" height="10" rx="3" fill="#e8f5ec" stroke="#2ea84a" stroke-width="1"/></svg>
        </div>
        <div class="why-row-body">
          <div class="why-row-title">New Cars <span class="why-arr">›</span></div>
          <div class="why-row-desc">Get exclusive pricing and full specs across all brands in Nepal. Explore EMI plans tailored to your budget.</div>
        </div>
      </div>

      <!-- Used Cars → #usedcars anchor -->
      <div class="why-row-item" onclick="window.location.href='#used'" style="cursor:pointer">
        <div class="why-row-img">
          <svg viewBox="0 0 120 80" width="120" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="80" rx="10" fill="#e8f5ec"/><rect x="10" y="10" width="45" height="60" rx="6" fill="#fff" stroke="#c4daca" stroke-width="1"/><rect x="65" y="10" width="45" height="60" rx="6" fill="#fff" stroke="#2ea84a" stroke-width="1.5"/><rect x="16" y="18" width="33" height="5" rx="2.5" fill="#b8cdbf"/><rect x="16" y="27" width="25" height="3" rx="1.5" fill="#dde8e2"/><rect x="16" y="33" width="28" height="3" rx="1.5" fill="#dde8e2"/><rect x="16" y="39" width="22" height="3" rx="1.5" fill="#dde8e2"/><rect x="71" y="18" width="33" height="5" rx="2.5" fill="#2ea84a"/><rect x="71" y="27" width="25" height="3" rx="1.5" fill="#b8cdbf"/><rect x="71" y="33" width="28" height="3" rx="1.5" fill="#b8cdbf"/><rect x="71" y="39" width="22" height="3" rx="1.5" fill="#b8cdbf"/><path d="M55 40h10" stroke="#c4daca" stroke-width="1.5" stroke-dasharray="2 2"/><circle cx="60" cy="40" r="4" fill="#e8f5ec" stroke="#2ea84a" stroke-width="1"/><path d="M57.5 40l2 2 3-4" stroke="#2ea84a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="why-row-body">
          <div class="why-row-title">Used Cars <span class="why-arr">›</span></div>
          <div class="why-row-desc">Browse verified pre-owned listings and instantly connect with trusted sellers — all with one click.</div>
        </div>
      </div>

      <!-- EMI → insurance-finance.html -->
      <div class="why-row-item" onclick="window.location.href='insurance-finance.html'" style="cursor:pointer">
        <div class="why-row-img">
          <svg viewBox="0 0 120 80" width="120" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="80" rx="10" fill="#e8f5ec"/><rect x="20" y="12" width="80" height="56" rx="6" fill="#fff" stroke="#c4daca" stroke-width="1"/><rect x="28" y="20" width="64" height="8" rx="3" fill="#e8f5ec"/><text x="60" y="27" text-anchor="middle" font-size="7" fill="#1a6b2a" font-weight="700" font-family="sans-serif">EMI CALCULATOR</text><rect x="28" y="32" width="40" height="4" rx="2" fill="#dde8e2"/><rect x="28" y="32" width="26" height="4" rx="2" fill="#2ea84a"/><rect x="28" y="40" width="40" height="4" rx="2" fill="#dde8e2"/><rect x="28" y="40" width="34" height="4" rx="2" fill="#2ea84a"/><rect x="72" y="32" width="20" height="4" rx="2" fill="#f4fbf6" stroke="#2ea84a" stroke-width="1"/><rect x="72" y="40" width="20" height="4" rx="2" fill="#f4fbf6" stroke="#2ea84a" stroke-width="1"/><rect x="34" y="50" width="52" height="10" rx="4" fill="#1a6b2a"/><text x="60" y="57.5" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif">Rs. 42,000 / month</text></svg>
        </div>
        <div class="why-row-body">
          <div class="why-row-title">Auto Loans & EMI <span class="why-arr">›</span></div>
          <div class="why-row-desc">Calculate your EMI instantly. Connect with partner banks for financing on almost any credit situation.</div>
        </div>
      </div>

    </div>
  </div>
  <!-- ══ EVENTS SECTION ══ -->
<section class="events-section">
  <div class="wrap">

    <div class="sec-hd">
      <div class="sec-hd-left">
        <div class="eyebrow">Upcoming Events</div>
        <h2 class="sec-title">Auto Events in Nepal</h2>
        <p class="sec-sub">Car shows, test drive days, and launch events near you</p>
      </div>
      <a href="#" class="view-all">View All →</a>
    </div>

    <!-- Filter tabs -->
    <div class="ev-tabs">
      <button class="ev-tab-btn active">All</button>
      <button class="ev-tab-btn">Car Shows</button>
      <button class="ev-tab-btn">Test Drives</button>
      <button class="ev-tab-btn">Launches</button>
      <button class="ev-tab-btn">Exhibitions</button>
    </div>

    <!-- Cards grid -->
    <div class="events-grid">

      <!-- Featured card (spans 2 cols on desktop) -->
      <div class="event-card featured-event">
        <div class="event-card-date-bar">
          <div class="ecd-day">18</div>
          <div class="ecd-month-year">APR 2025</div>
          <div class="ecd-type">Featured</div>
        </div>
        <div class="event-card-img">
          <img src="your-image.jpg" alt="Nepal Auto Expo">
          <span class="event-fee-badge free">Free Entry</span>
        </div>
        <div class="event-card-body">
          <div class="event-card-title">Nepal Auto Expo 2025</div>
          <div class="event-card-meta">
            <div class="event-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Bhrikutimandap, Kathmandu
            </div>
            <div class="event-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              10:00 AM – 6:00 PM
            </div>
          </div>
          <p class="event-card-desc">Nepal's biggest annual automobile showcase featuring 50+ brands, live test drives, and exclusive launch reveals. Don't miss it.</p>
        </div>
        <div class="event-card-footer">
          <div class="event-seats"><span class="event-seats-dot low"></span> 120 seats left</div>
          <button class="event-rsvp-btn">RSVP Now →</button>
        </div>
      </div>

      <!-- Regular card -->
      <div class="event-card">
        <div class="event-card-date-bar">
          <div class="ecd-day">22</div>
          <div class="ecd-month-year">APR 2025</div>
          <div class="ecd-type">Test Drive</div>
        </div>
        <div class="event-card-img">
          <img src="your-image.jpg" alt="Suzuki Test Drive">
          <span class="event-fee-badge free">Free</span>
        </div>
        <div class="event-card-body">
          <div class="event-card-title">Suzuki Swift Test Drive Day</div>
          <div class="event-card-meta">
            <div class="event-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              CG Autocorp, New Road
            </div>
            <div class="event-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              9:00 AM – 4:00 PM
            </div>
          </div>
          <p class="event-card-desc">Book a slot and experience the all-new Swift firsthand with a certified Suzuki instructor.</p>
        </div>
        <div class="event-card-footer">
          <div class="event-seats"><span class="event-seats-dot"></span> 40 seats left</div>
          <button class="event-rsvp-btn">RSVP Now →</button>
        </div>
      </div>

      <!-- Regular card — Full -->
      <div class="event-card">
        <div class="event-card-date-bar" style="background:var(--gold);">
          <div class="ecd-day">05</div>
          <div class="ecd-month-year">MAY 2025</div>
          <div class="ecd-type">Launch</div>
        </div>
        <div class="event-card-img">
          <img src="your-image.jpg" alt="EV Launch">
          <span class="event-fee-badge invite">Invite Only</span>
        </div>
        <div class="event-card-body">
          <div class="event-card-title">Riddara RD6 Official Nepal Launch</div>
          <div class="event-card-meta">
            <div class="event-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Hotel Yak & Yeti, KTM
            </div>
            <div class="event-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              6:00 PM – 9:00 PM
            </div>
          </div>
          <p class="event-card-desc">Be the first to see Nepal's most anticipated EV launch with live unveil and pricing announcement.</p>
        </div>
        <div class="event-card-footer">
          <div class="event-seats"><span class="event-seats-dot full"></span> Fully Booked</div>
          <button class="event-rsvp-btn full" disabled>Waitlist</button>
        </div>
      </div>

    </div>
    <!-- /.events-grid -->

  </div>
</section>
</section>


  <!-- CTA BANNER -->
  <section class="section" style="background:var(--bg)">
    <div class="wrap">
      <div class="cta-banner">
        <div class="cta-in">
          <div class="cta-label">Start your journey</div>
          <h2 class="cta-title">Find Your Perfect Car Today</h2>
          <p class="cta-sub">Complete specs, EMI calculator, expert reviews and side-by-side comparisons for Nepal's market.</p>
          <div class="cta-btns">
            <button onclick="AV.goTo('cars')" class="btn btn-primary text-white" style="font-size:14px;padding:13px 28px;color:#fff">Browse All Cars</button>
            <button onclick="window.location.href='services.html'" class="btn" style="background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);border:1.5px solid rgba(255,255,255,.12);font-size:14px;padding:13px 28px">Book a Service</button>
          </div>
        </div>
      </div>
    </div>
  </section>`;

  updateCompareTray();updateCmpBtns();
  startHeroTimer();
}
/*car honk */
(function () {
  var wrapper = document.getElementById('honk-wrapper');
  var logoImg = document.getElementById('logo-img');
  var clicks = 0, timer = null, honkIndex = 0;

  // ── noise buffer (used by some horns for grit) ──
  function makeNoise(ctx, dur) {
    var sr = ctx.sampleRate;
    var buf = ctx.createBuffer(1, sr * dur, sr);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  // ── core tone helper ──
  function tone(ctx, type, freq, detune, start, dur, vol, dest) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(dest || ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    osc.detune.setValueAtTime(detune || 0, ctx.currentTime + start);
    gain.gain.setValueAtTime(0, ctx.currentTime + start);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.018);
    gain.gain.setValueAtTime(vol, ctx.currentTime + start + dur - 0.04);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur + 0.05);
  }

  var honks = [

    // ── 1. Classic taxi horn (old-school ahh-oogah feel) ──
    {
      label: '🚕 Taxi Horn',
      play: function(ctx) {
        // Rich fundamental + 2nd harmonic + slight detuning = reedy brass feel
        tone(ctx, 'sawtooth', 294, 0,    0,    0.55, 0.38);
        tone(ctx, 'sawtooth', 294, 18,   0,    0.55, 0.18);
        tone(ctx, 'sawtooth', 588, -12,  0,    0.55, 0.12);
        tone(ctx, 'square',   294, 0,    0,    0.55, 0.07);
      }
    },

    // ── 2. Small hatchback — cheerful double beep ──
    {
      label: '🚗 Hatchback Beep',
      play: function(ctx) {
        function beep(start) {
          tone(ctx, 'sine',     1046, 0,   start, 0.13, 0.35);
          tone(ctx, 'sine',     1318, 0,   start, 0.13, 0.18);
          tone(ctx, 'triangle', 1046, -8,  start, 0.13, 0.10);
        }
        beep(0);
        beep(0.19);
      }
    },

    // ── 3. Big truck air horn — long bassy blast ──
    {
      label: '🚛 Truck Air Horn',
      play: function(ctx) {
        // Air horns use a chord: A2 + E3 + A3
        tone(ctx, 'sawtooth', 110,  0,   0, 0.7, 0.30);
        tone(ctx, 'sawtooth', 165,  0,   0, 0.7, 0.25);
        tone(ctx, 'sawtooth', 220,  0,   0, 0.7, 0.20);
        tone(ctx, 'sawtooth', 330,  0,   0, 0.7, 0.10);
        // slight noise layer for air rush
        var noise = makeNoise(ctx, 0.75);
        var nf = ctx.createBiquadFilter();
        nf.type = 'bandpass';
        nf.frequency.value = 200;
        nf.Q.value = 0.5;
        var ng = ctx.createGain();
        ng.gain.setValueAtTime(0.04, ctx.currentTime);
        ng.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
        noise.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
        noise.start(); noise.stop(ctx.currentTime + 0.75);
      }
    },

    // ── 4. European sedan — elegant two-tone (Eb + Bb) ──
    {
      label: '🚙 Sedan Horn',
      play: function(ctx) {
        // Real car horns are tuned to musical intervals
        // Eb4 (311 Hz) + Bb4 (466 Hz) — a perfect fifth apart
        tone(ctx, 'sawtooth', 311, 0,  0, 0.5, 0.28);
        tone(ctx, 'sawtooth', 311, 22, 0, 0.5, 0.14); // chorus detuning
        tone(ctx, 'sawtooth', 466, 0,  0, 0.5, 0.22);
        tone(ctx, 'sawtooth', 466, -18,0, 0.5, 0.10);
        tone(ctx, 'square',   311, 0,  0, 0.5, 0.05);
      }
    },

    // ── 5. Scooter / motorbike — high nasal toot ──
   {
  label: '🚗 Car Horn (Real)',
  play: function(ctx) {
    // Extracted from real recording via FFT analysis
    // Fundamental: 453 Hz — dominant harmonics at 906, 1359, 1812 Hz
    // Attack: ~0.06s, sustain: 0.60s, decay: ~0.08s

    // Fundamental — body of the horn
    tone(ctx, 'sine',     453,  0,   0,    0.20, 0.65);

    // 2nd harmonic — strongest peak, gives the nasal "honk" character
    tone(ctx, 'sawtooth', 906,  0,   0,    0.22, 0.65);

    // 3rd harmonic — brassy bite
    tone(ctx, 'sawtooth', 1359, 0,   0,    0.10, 0.65);

    // 4th harmonic — shimmer/air
    tone(ctx, 'sine',     1812, 0,   0,    0.05, 0.65);
  }
},

{
  label: '🚨 Traffic Horn (Urgent)',
  play: function(ctx) {
    // Extracted from ElevenLabs traffic jam horn recording
    // Fundamental: 807 Hz (G5) — sharp, aggressive urban horn
    // Strong harmonics at 1212 Hz and 1614 Hz give it urgency
    // Attack: ~55ms, sustain: 1.5s, decay: ~55ms

    // Fundamental — high sharp tone
    tone(ctx, 'sine',     807,  0,   0,    0.20, 1.55);

    // 2nd harmonic — nearly equal strength to fundamental
    tone(ctx, 'sawtooth', 1614, 0,   0,    0.18, 1.55);

    // 3rd harmonic — adds the "blaring" midrange urgency
    tone(ctx, 'sawtooth', 1212, 0,   0,    0.13, 1.55);

    // Sub-harmonic body (404 Hz) — perceived low-end weight
    tone(ctx, 'sine',     404,  0,   0,    0.07, 1.55);
  }
},

    // ── 7. SUV / luxury — deep authoritative double blast ──
    {
      label: '🚐 SUV Horn',
      play: function(ctx) {
        function blast(start, dur) {
          tone(ctx, 'sawtooth', 196,  0,   start, dur, 0.30);
          tone(ctx, 'sawtooth', 196,  25,  start, dur, 0.15);
          tone(ctx, 'sawtooth', 392,  0,   start, dur, 0.18);
          tone(ctx, 'sawtooth', 392, -20,  start, dur, 0.08);
          tone(ctx, 'square',   196,  0,   start, dur, 0.06);
        }
        blast(0,    0.22);
        blast(0.28, 0.38);
      }
    },

  ];

  function playHonk() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      // master limiter so nothing clips
      var limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -3;
      limiter.ratio.value = 20;
      limiter.connect(ctx.destination);
      // redirect destination → limiter for this honk
      var origDest = ctx.destination;
      honks[honkIndex].play(ctx);
    } catch(e) {}
  }

  function wiggle() {
    if (!logoImg) return;
    var frames = ['-8deg','8deg','-6deg','6deg','-3deg','0deg'];
    var i = 0;
    logoImg.style.transition = 'transform 0.05s';
    var iv = setInterval(function() {
      logoImg.style.transform = 'rotate(' + frames[i++] + ')';
      if (i >= frames.length) { clearInterval(iv); logoImg.style.transform = ''; }
    }, 55);
  }

  function toast(label) {
    var old = document.getElementById('honk-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.id = 'honk-toast';
    t.textContent = label + ' 📯';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(16px);background:#111;color:#fff;padding:8px 22px;border-radius:999px;font-size:14px;font-weight:600;opacity:0;transition:all 0.3s;z-index:99999;pointer-events:none';
    document.body.appendChild(t);
    requestAnimationFrame(function() {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function() {
      t.style.opacity = '0';
      setTimeout(function() { t.remove(); }, 350);
    }, 2000);
  }

  wrapper.addEventListener('click', function() {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(function() { clicks = 0; }, 700);
    if (clicks >= 4) {
      clicks = 0;
      clearTimeout(timer);
      var current = honks[honkIndex];
      playHonk();
      wiggle();
      toast(current.label);
      honkIndex = (honkIndex + 1) % honks.length;
    }
  });
})();

function swSearch(){
  const brand=document.getElementById('sw-brand')?.value;
  const fuel=document.getElementById('sw-fuel')?.value;
  const opts={};
  if(fuel)opts.filter=fuel;
  if(brand)opts.brand=brand;
  AV.goTo('cars',opts);
}

function homeFilter(type,btn){
  document.querySelectorAll('#home-chips .chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  const filtered=type==='All'?CARS_DB:CARS_DB.filter(c=>{
    if(type==='Electric')return c.type==='Electric';
    if(type==='Hybrid')return c.type==='Hybrid';
    if(type==='Petrol')return c.type==='Petrol';
    if(type==='Diesel')return c.type==='Diesel';
    if(type==='SUV')return c.body==='SUV';
    if(type==='Sedan')return c.body==='Sedan';
    if(type==='Hatchback')return c.body==='Hatchback';
    return true;
  });
  const g=document.getElementById('home-grid');
  if(g)g.innerHTML=filtered.map(c=>carCard(c)).join('');
  updateCmpBtns();
}

/* ─ HERO CAROUSEL ─ */
function heroNav(dir){heroGo((heroIdx+dir+HERO_SLIDES.length)%HERO_SLIDES.length)}
function heroGo(idx){
  heroIdx=idx;
  const slides=document.getElementById('hero-slides');
  if(slides)slides.style.transform=`translateX(-${idx*100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
  resetHeroTimer();
}
function startHeroTimer(){
  clearInterval(heroTimer);
  let pct=0;
  const prog=document.getElementById('hero-progress');
  heroTimer=setInterval(()=>{
    pct+=1;
    if(prog)prog.style.width=pct+'%';
    if(pct>=100){pct=0;heroNav(1);if(prog)prog.style.width='0%'}
  },50);
}
function resetHeroTimer(){
  clearInterval(heroTimer);
  const prog=document.getElementById('hero-progress');
  if(prog)prog.style.width='0%';
  startHeroTimer();
}

/* ─ GALLERY ─ */
function buildGallery(car,containerId){
  galIdx=0;
  const el=document.getElementById(containerId);if(!el)return;
  const imgs=car.images;
  el.innerHTML=`
    <div class="gallery-main" id="gal-main">
      <img id="gal-img" src="${imgs[0]}" alt="${car.brand} ${car.model}">
      ${imgs.length>1?`
        <button class="gal-prev" onclick="AV.galNav(-1,'${car.slug}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button class="gal-next" onclick="AV.galNav(1,'${car.slug}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>`:''}
      <div class="gal-count" id="gal-count">${galIdx+1}/${imgs.length}</div>
    </div>
    <div class="gallery-thumbs">
      ${imgs.map((img,i)=>`<div class="g-thumb ${i===0?'active':''}" onclick="AV.galSet(${i},'${car.slug}')"><img src="${img}" loading="lazy"></div>`).join('')}
    </div>`;
}
function galNav(dir,slug){
  const car=carBySlug(slug);if(!car)return;
  galIdx=(galIdx+dir+car.images.length)%car.images.length;
  const img=document.getElementById('gal-img');
  if(img){img.style.opacity='0';setTimeout(()=>{img.src=car.images[galIdx];img.style.opacity='1'},200)}
  document.querySelectorAll('.g-thumb').forEach((t,i)=>t.classList.toggle('active',i===galIdx));
  const c=document.getElementById('gal-count');if(c)c.textContent=`${galIdx+1}/${car.images.length}`;
}
function galSet(idx,slug){
  const car=carBySlug(slug);if(!car)return;
  galIdx=idx;
  const img=document.getElementById('gal-img');
  if(img){img.style.opacity='0';setTimeout(()=>{img.src=car.images[idx];img.style.opacity='1'},200)}
  document.querySelectorAll('.g-thumb').forEach((t,i)=>t.classList.toggle('active',i===idx));
  const c=document.getElementById('gal-count');if(c)c.textContent=`${idx+1}/${car.images.length}`;
}


/* ─ VARIANT ─ */
function selectVariant(slug,vi){
  activeVariant[slug]=vi;
  const car=carBySlug(slug);if(!car)return;
  const vr=car.variants[vi];
  document.querySelectorAll('.variant-tab').forEach((t,i)=>t.classList.toggle('active',i===vi));
  document.querySelectorAll('.pcv-item').forEach((t,i)=>t.classList.toggle('active',i===vi));
  document.querySelectorAll('[data-price-d]').forEach(el=>el.textContent=vr.label);
  const pa=document.getElementById('price-amount');if(pa)pa.textContent=vr.label;
  const vdp=document.getElementById('vdp');
  if(vdp&&vr.specs)vdp.innerHTML=Object.entries(vr.specs).map(([k,v])=>`<div class="vdp-item" style="background:rgba(255,255,255,.7);border-radius:var(--r8);padding:10px;text-align:center"><div style="font-family:var(--font-d);font-size:14px;font-weight:700;color:var(--g3)">${v}</div><div style="font-size:10px;color:var(--ink4);margin-top:2px">${k}</div></div>`).join('');
  const downEl=document.getElementById('emi-down');
  const tenEl=document.getElementById('emi-ten-val');
  const rateEl=document.getElementById('emi-rate');
  if(downEl&&tenEl&&rateEl)updateEMI(slug,vi,+downEl.value,+tenEl.textContent,+rateEl.value);
}
function selectColor(el,name){
  document.querySelectorAll('.color-swatch').forEach(s=>s.style.boxShadow='');
  el.style.boxShadow=`0 0 0 2px #fff,0 0 0 4px var(--g3)`;
  const d=document.getElementById('color-display');if(d)d.textContent=name;
}
// EMI Calculator
function buildEmiHTML(car, vi){
  const vr = car.variants[vi];
  const dp=20, dt=60, dr=10.5;
  const loan = vr.price*(1-dp/100);
  const emi  = calcEMI(loan,dr,dt);
  const tot  = emi*dt;
  const intr = tot-loan;
  return `
    <div class="dp-emi-title">EMI estimate</div>
    <div class="dp-emi-field">
      <div class="dp-emi-label">Down payment <span class="val" id="emi-dp-val">${dp}%</span></div>
      <input type="range" min="10" max="60" step="5" value="${dp}" id="emi-dp"
        oninput="document.getElementById('emi-dp-val').textContent=this.value+'%';AV.recalcEmi('${car.slug}',${vi})">
    </div>
    <div class="dp-emi-field">
      <div class="dp-emi-label">Tenure <span class="val"><span id="emi-ten-val">${dt}</span> months</span></div>
      <div class="tenure-btns">
        ${[12,24,36,48,60,72,84].map(m=>`
          <button class="ten-btn ${m===dt?'active':''}" onclick="AV.setTenure2(${m},'${car.slug}',${vi})">${m}m</button>`
        ).join('')}
      </div>
    </div>
    <div class="dp-emi-field">
      <div class="dp-emi-label">Interest rate <span class="val" id="emi-rate-val">${dr}%</span></div>
      <input type="range" min="7" max="18" step="0.5" value="${dr}" id="emi-rate"
        oninput="document.getElementById('emi-rate-val').textContent=this.value+'%';AV.recalcEmi('${car.slug}',${vi})">
    </div>
    <div class="dp-emi-result">
      <div style="font-size:10px;color:var(--ink4);margin-bottom:2px">Monthly EMI</div>
      <div class="dp-emi-amount" id="emi-amount">Rs. ${Math.round(emi).toLocaleString()}</div>
      <div style="font-size:11px;color:var(--ink4)">/month</div>
    </div>
    <div class="dp-emi-break">
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-loan">${Rs(Math.round(loan))}</div><div class="dp-emi-bd-lbl">Loan amount</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-int">${Rs(Math.round(intr))}</div><div class="dp-emi-bd-lbl">Interest</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-tot">${Rs(Math.round(tot))}</div><div class="dp-emi-bd-lbl">Total payable</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val">${vr.label}</div><div class="dp-emi-bd-lbl">Vehicle price</div></div>
    </div>
    <button onclick="alert('Finance: +977-9701076240')" class="dp-cta-ghost" style="margin-top:10px">Apply for finance</button>`;
}
function updateEMI(slug,vi,dp,ten,rate){
  const car=carBySlug(slug);if(!car)return;
  const vr=car.variants[vi];
  const loan=vr.price*(1-dp/100);
  const emi=calcEMI(loan,rate,ten);
  const total=emi*ten;
  const interest=total-loan;
  const s=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  s('emi-amount',`Rs. ${Math.round(emi).toLocaleString()}`);
  s('emi-loan',Rs(Math.round(loan)));
  s('emi-int',Rs(Math.round(interest)));
  s('emi-tot',Rs(Math.round(total)));
}
function setTenure(m,slug){
  document.getElementById('emi-ten-val').textContent=m;
  document.querySelectorAll('.ten-btn').forEach(b=>b.classList.toggle('active',parseInt(b.textContent)===m));
  const vi=activeVariant[slug]||0;
  updateEMI(slug,vi,+document.getElementById('emi-down').value,m,+document.getElementById('emi-rate').value);
}
function getVI(slug){return activeVariant[slug]||0}

function recalcEmi(slug, vi){
  const car = carBySlug(slug); if(!car) return;
  const vr  = car.variants[vi];
  const dp  = +(document.getElementById('emi-dp')?.value||20);
  const ten = +(document.getElementById('emi-ten-val')?.textContent||60);
  const r   = +(document.getElementById('emi-rate')?.value||10.5);
  const loan = vr.price*(1-dp/100);
  const emi  = calcEMI(loan,r,ten);
  const tot  = emi*ten;
  const s=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  s('emi-amount',`Rs. ${Math.round(emi).toLocaleString()}`);
  s('emi-loan',Rs(Math.round(loan)));
  s('emi-int',Rs(Math.round(tot-loan)));
  s('emi-tot',Rs(Math.round(tot)));
}

function setTenure2(m, slug, vi){
  document.getElementById('emi-ten-val').textContent = m;
  document.querySelectorAll('.ten-btn').forEach(b=>b.classList.toggle('active', parseInt(b.textContent)===m));
  recalcEmi(slug, vi);
}
function renderDetail(slug){
  const car = carBySlug(slug);
  if(!car){ goTo('cars'); return; }
  clearInterval(heroTimer);
  if(activeVariant[slug] == null) activeVariant[slug] = 0;
  document.title = `${car.brand} ${car.model} ${car.year} — AutoViindu`;
  window.scrollTo({top:0,behavior:'smooth'});
  setNav('');

  const vi = () => activeVariant[slug];
  const vr = () => car.variants[vi()];

  /* build the variant spec panel (shows under dropdown) */
  function specPanel(v){
    const sp = v.specs ? `
      <div class="vspec-grid">
        ${Object.entries(v.specs).map(([k,val])=>`
          <div class="vspec-cell">
            <div class="vspec-val">${val}</div>
            <div class="vspec-lbl">${k}</div>
          </div>`).join('')}
      </div>` : '';
    const feats = (v.features||[]).map(f=>`
      <div class="vspec-feat"><div class="vspec-feat-dot"></div>${f}</div>`).join('');
    return `<div class="vspec-panel">
      ${sp}
      <div class="vspec-features">${feats}</div>
    </div>`;
  }

  /* base spec table */
  function baseSpecTable(){
    return Object.entries(car.specs).map(([k,v])=>`
      <tr><td>${k}</td><td>${v}</td></tr>`).join('');
  }

  /* full sidebar HTML */
  function sidebarHTML(){
    const v = vr();
    return `
      <div class="dp-sidebar-inner">

        <!-- variant dropdown -->
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:6px">
          Choose variant
        </div>
        <div class="vdrop-wrap">
          <select class="vdrop-select" id="vdrop" onchange="AV.switchVariant('${slug}',this.value)">
            ${car.variants.map((v,i)=>`
              <option value="${i}" ${i===vi()?'selected':''}>${v.name} — ${v.label}${v.popular?' ★ Best value':''}</option>`
            ).join('')}
          </select>
          <div class="vdrop-arrow">
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="2 4 6 8 10 4"/>
            </svg>
          </div>
        </div>

        <!-- variant spec panel -->
        <div id="vspec-panel">${specPanel(v)}</div>

        <!-- price -->
        <div class="dp-price-row">
          <div class="dp-price" id="dp-price">${v.label}</div>
        </div>
        <div class="dp-price-note" id="dp-variant-name">Ex-showroom · ${v.name} — contact for on-road price</div>

        <!-- CTAs -->
        <div class="dp-cta-stack">
          <button class="dp-cta-primary" onclick="alert('+977-9701076240')">Get best price</button>
          <button class="dp-cta-gold" onclick="alert('Test drive: +977-9701076240')">Book test drive</button>
          <button class="dp-cta-ghost" data-cmp="${slug}" onclick="AV.toggleCompare('${slug}')">
            ${compareList.includes(slug)?'✓ In compare':'Add to compare'}
          </button>
        </div>

        <div class="dp-contact">
          <a href="tel:+9779701076240">+977-9701076240</a> &nbsp;·&nbsp;
          Nayabazar, Kathmandu · Mon–Sat 9am–6pm
        </div>
      </div>

      <!-- EMI calculator -->
      <div class="dp-emi" id="dp-emi-wrap">
        ${buildEmiHTML(car, vi())}
      </div>`;
  }

  /* main content left col */
  function mainHTML(){
    const v = vr();
    return `
      <div class="dp-main">
        <div id="gal-wrap"></div>

        <div class="dp-tabs-wrap">
          <div class="dp-tabs">
            <button class="dp-tab active" onclick="AV.dpTab(this,'pane-ov')">Overview</button>
            <button class="dp-tab" onclick="AV.dpTab(this,'pane-sp')">Specifications</button>
            <button class="dp-tab" onclick="AV.dpTab(this,'pane-col')">Colours</button>
            <button class="dp-tab" onclick="AV.dpTab(this,'pane-pc')">Highlights</button>
          </div>
        </div>

        <!-- OVERVIEW -->
        <div class="dp-pane active" id="pane-ov">
          <div class="dp-tagline">"${car.tagline}"</div>
          <div class="dp-overview">${car.overview}</div>
          <div class="dp-qs-grid">
            ${[['Power',car.specs['Power']||car.specs['Motor Power']],
               ['Torque',car.specs['Torque']],
               ['Efficiency',car.specs['Fuel Efficiency']||car.specs['Range (WLTP)']],
               ['0–100',car.specs['0–100 km/h']],
               ['Seating',car.specs['Seating']],
               ['Boot',car.specs['Boot Space']]]
              .filter(([,v])=>v)
              .map(([l,v])=>`
                <div class="dp-qs-cell">
                  <div class="dp-qs-val">${v}</div>
                  <div class="dp-qs-lbl">${l}</div>
                </div>`).join('')}
          </div>
          <div class="dp-highlights">
            ${(car.highlights||[]).map(h=>`<span class="dp-hl-tag">${h}</span>`).join('')}
          </div>
        </div>

        <!-- SPECS -->
        <div class="dp-pane" id="pane-sp">
          <table class="dp-spec-table" id="dp-spec-table">
            ${baseSpecTable()}
          </table>
        </div>

        <!-- COLOURS -->
        <div class="dp-pane" id="pane-col">
          <div style="font-size:12.5px;color:var(--ink4);margin-bottom:14px">
            ${car.colors.length} colours available — tap to preview
          </div>
          <div class="dp-colors">
            ${car.colors.map((c,i)=>`
              <div class="dp-color-swatch ${i===0?'active':''}"
                onclick="AV.pickColor(this,'${c.name}')">
                <div class="dp-color-dot" style="background:${c.hex}"></div>
                <div class="dp-color-name">${c.name}</div>
              </div>`).join('')}
          </div>
          <div style="font-size:13px;color:var(--ink3);margin-top:4px">
            Selected: <strong id="dp-color-name">${car.colors[0].name}</strong>
          </div>
        </div>

        <!-- PROS & CONS -->
        <div class="dp-pane" id="pane-pc">
          <div class="dp-pc-grid">
            <div class="dp-pros">
              <div class="dp-pc-title" style="color:#16a34a">Best features</div>
              ${car.pros.map(p=>`
                <div class="dp-pc-item">
                  <span style="color:#16a34a;flex-shrink:0">${IC.check}</span>${p}
                </div>`).join('')}
            </div>
           
          </div>
          <div class="dp-score-bar">
            <div class="dp-score-num">${car.expertScore}</div>
            <div class="dp-score-track">
              <div style="font-size:12.5px;font-weight:700;color:var(--ink);margin-bottom:6px">AutoViindu expert score</div>
              <div style="height:6px;background:var(--bg3);border-radius:var(--pill);overflow:hidden">
                <div class="dp-score-fill" style="width:${car.expertScore*10}%"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--ink5);margin-top:3px">
                <span>Poor</span><span>Good</span><span>Excellent</span>
              </div>
            </div>
          </div>
        </div>

        <!-- similar cars -->
        <div style="padding:20px;border-top:1px solid var(--border)">
          <div style="font-family:var(--font-d);font-size:19px;font-weight:700;color:var(--ink);margin-bottom:12px">
            Similar cars
          </div>
          <div class="cars-grid" style="grid-template-columns:repeat(2,1fr)">
            ${CARS_DB.filter(c=>c.slug!==slug&&(c.body===car.body||c.type===car.type)).slice(0,4).map(c=>carCard(c)).join('')}
          </div>
        </div>
      </div>`;
  }

  /* render */
  document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb">
        <a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span>
        <a onclick="AV.goTo('cars')">Cars</a><span class="bc-sep">/</span>
        <span style="color:rgba(255,255,255,.75)">${car.brand} ${car.model}</span>
      </div>
      <h1 style="font-family:var(--font-d);font-size:clamp(22px,4vw,34px);color:#fff;font-weight:700;line-height:1.1;margin-bottom:6px">
        ${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span>
      </h1>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:12px;color:rgba(255,255,255,.4)">${car.type} · ${car.body} · ${car.variants.length} variants</span>
        <span class="cc-rating">${IC.star} ${fmtR(car.rating)}</span>
        <span style="font-size:11.5px;color:rgba(255,255,255,.3)">${car.reviews} reviews</span>
      </div>
    </div>
  </div>

  <div class="detail-layout">
    <!-- on mobile: sidebar (price+variant) comes first, gallery below -->
    <div class="detail-sidebar" style="order:0">
      ${sidebarHTML()}
    </div>
    <div style="order:1;min-width:0">
      ${mainHTML()}
    </div>
  </div>`;

  /* on desktop flip order: gallery left, sidebar right */
  const mq = window.matchMedia('(min-width:900px)');
  function applyOrder(e){
    const sidebar = document.querySelector('.detail-sidebar');
    const main    = document.querySelector('.detail-layout > div:last-child');
    if(sidebar && main){
      sidebar.style.order = e.matches ? '2' : '0';
      main.style.order    = e.matches ? '1' : '1';
    }
  }
  applyOrder(mq);
  mq.addEventListener('change', applyOrder);

  buildGallery(car, 'gal-wrap');
  updateCompareTray();
  updateCmpBtns();

  /* ── variant switch ── */
  AV.switchVariant = function(s, idx){
    if(s !== slug) return;
    const i = parseInt(idx);
    activeVariant[slug] = i;
    const v = car.variants[i];

    /* dropdown stays in sync if called programmatically */
    const dd = document.getElementById('vdrop');
    if(dd) dd.value = i;

    /* price label */
    const dp = document.getElementById('dp-price');
    const dn = document.getElementById('dp-variant-name');
    if(dp) dp.textContent = v.label;
    if(dn) dn.textContent = `Ex-showroom · ${v.name} — contact for on-road price`;

    /* spec panel */
    const sp = document.getElementById('vspec-panel');
    if(sp) sp.innerHTML = specPanel(v);

    /* compare button label */
    updateCmpBtns();

    /* gallery — swap if variant has own images */
    buildGallery(v.images ? {...car, images:v.images} : car, 'gal-wrap');

    /* emi */
    const ew = document.getElementById('dp-emi-wrap');
    if(ew) ew.innerHTML = buildEmiHTML(car, i);
  };

  /* colour picker */
  AV.pickColor = function(el, name){
    document.querySelectorAll('.dp-color-swatch').forEach(s=>s.classList.remove('active'));
    el.classList.add('active');
    const cn = document.getElementById('dp-color-name');
    if(cn) cn.textContent = name;
  };
}

/* ── tab switcher ── */
function dpTab(btn, paneId){
  document.querySelectorAll('.dp-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.dp-pane').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(paneId)?.classList.add('active');
}

/* keep old dtab working for anything still calling it */
function dtab(btn, paneId){ dpTab(btn, paneId); }

function renderCars(filter, opts={}) {
  clearInterval(heroTimer);
  document.title = 'New Cars Nepal — AutoViindu';
  let cars = CARS_DB;

  const fm = {
    electric:   c => c.type?.toLowerCase().includes('electric'),
    hybrid:     c => c.type?.toLowerCase().includes('hybrid'),
    petrol:     c => c.type?.toLowerCase().includes('petrol'),
    diesel:     c => c.type?.toLowerCase().includes('diesel'),
    suv:        c => c.body?.toLowerCase().includes('suv'),
    sedan:      c => c.body?.toLowerCase().includes('sedan'),
    hatchback:  c => c.body?.toLowerCase().includes('hatchback'),
    crossover:  c => c.body?.toLowerCase().includes('crossover'),
    van:        c => c.body?.toLowerCase().includes('van'),
    pickup:     c => c.body?.toLowerCase().includes('pickup'),
  };

  if (filter && fm[filter]) cars = cars.filter(fm[filter]);
  if (opts.brand) cars = cars.filter(c => c.brand.toLowerCase() === opts.brand.toLowerCase());
  if (opts.q) {
    const q = opts.q.toLowerCase();
    cars = cars.filter(c => `${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase().includes(q));
  }

  const fl = {
    electric:  'Electric Cars',
    hybrid:    'Hybrid Cars',
    petrol:    'Petrol Cars',
    diesel:    'Diesel Cars',
    suv:       'SUVs',
    sedan:     'Sedans',
    hatchback: 'Hatchbacks',
    crossover: 'Crossovers',
    van:       'Vans & Microvans',
    pickup:    'Pickup Trucks',
  };

  const title = filter ? (fl[filter] || filter) : 'New Cars in Nepal 2024–25';
  setNav(filter === 'electric' ? 'electric' : 'cars');
  document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.7)">${title}</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:#fff;font-weight:700;margin-bottom:6px">${title}</h1>
      <div style="font-size:13px;color:rgba(255,255,255,.4)">${cars.length} cars available · Full specs & EMI</div>
    </div>
  </div>
  <div class="wrap" style="padding-top:24px;padding-bottom:64px">
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:18px">
      <div style="flex:1;min-width:220px;position:relative">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink4)">${IC.search}</span>
        <input type="text" placeholder="Search brand, model…" id="list-search" style="width:100%;padding:10px 14px 10px 36px;border:1.5px solid var(--border);border-radius:var(--pill);font-size:13.5px;outline:none;font-family:var(--font-b);background:var(--white);color:var(--ink);transition:all var(--ease)" oninput="AV.filterList(this.value,'${filter||''}')" onfocus="this.style.borderColor='var(--g3)'" onblur="this.style.borderColor='var(--border)'">
      </div>
      <select id="list-sort" onchange="AV.sortList(this.value)" style="padding:10px 30px 10px 12px;border:1.5px solid var(--border);border-radius:var(--pill);font-family:var(--font-b);font-size:13px;outline:none;background:var(--white);appearance:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237a9483%22 stroke-width=%222.5%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 10px center;cursor:pointer;color:var(--ink)">
        <option value="">Sort: Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Best Rated</option>
      </select>
    </div>
    <div class="filter-chips">
      ${['All','Electric','Hybrid','Petrol','Diesel','SUV','Sedan','Hatchback'].map(t=>`<span class="chip ${(!filter&&t==='All')||(filter&&filter===t.toLowerCase())?'active':''}" onclick="AV.goTo('cars',{filter:'${t.toLowerCase()==='all'?'':t.toLowerCase()}'})">${t}</span>`).join('')}
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r10);margin-bottom:18px">
      <div style="font-size:13px;font-weight:700;color:var(--ink)">Showing <span style="color:var(--g3)" id="list-count">${cars.length}</span> cars</div>
      <div style="font-size:12px;color:var(--ink4)">Nepal prices</div>
    </div>
    <div class="cars-grid" id="list-grid">
      ${cars.map(c=>carCard(c)).join('')||`<div style="grid-column:1/-1;text-align:center;padding:60px;background:var(--bg);border-radius:var(--r20)"><div style="font-size:40px;margin-bottom:12px">🔍</div><div style="font-size:18px;font-weight:800;margin-bottom:8px">No cars found</div><button onclick="AV.goTo('cars')" class="btn btn-primary" style="margin-top:8px">Browse all</button></div>`}
    </div>
  </div>`;
  window._lCars=cars;window._lFilter=filter;
  updateCompareTray();updateCmpBtns();
}
function filterList(q,filter){
  let cars=CARS_DB;
  const fm={electric:c=>c.type==='Electric',hybrid:c=>c.type==='Hybrid',petrol:c=>c.type==='Petrol',diesel:c=>c.type==='Diesel',suv:c=>c.body==='SUV',sedan:c=>c.body==='Sedan',hatchback:c=>c.body==='Hatchback'};
  if(filter&&fm[filter])cars=cars.filter(fm[filter]);
  if(q){const ql=q.toLowerCase();cars=cars.filter(c=>`${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase().includes(ql))}
  const g=document.getElementById('list-grid');const cnt=document.getElementById('list-count');
  if(g)g.innerHTML=cars.map(c=>carCard(c)).join('');
  if(cnt)cnt.textContent=cars.length;
  updateCmpBtns();
}
function sortList(val){
  let cars=[...(window._lCars||CARS_DB)];
  if(val==='price-asc')cars.sort((a,b)=>a.variants[0].price-b.variants[0].price);
  else if(val==='price-desc')cars.sort((a,b)=>b.variants[0].price-a.variants[0].price);
  else if(val==='rating')cars.sort((a,b)=>b.rating-a.rating);
  const g=document.getElementById('list-grid');
  if(g)g.innerHTML=cars.map(c=>carCard(c)).join('');
  updateCmpBtns();
}

/* ─ COMPARE ─ */
function renderCompare(){
  clearInterval(heroTimer);
  document.title='Compare Cars — AutoViindu';
  setNav('compare');
  const cols=compareList.slice(0,3);
  document.getElementById('app-root').innerHTML=`
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.7)">Compare Cars</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:#fff;font-weight:700;margin-bottom:6px">Compare Cars Side-by-Side</h1>
      <div style="font-size:13px;color:rgba(255,255,255,.4)">${cols.length} of 3 cars selected</div>
    </div>
  </div>
  <div class="wrap compare-layout">
    <div>
      <div class="cmp-picker-title">Select cars to compare (max 3)</div>
      <div style="max-height:420px;overflow-y:auto;scrollbar-width:thin">
        ${CARS_DB.map(car=>`<div class="cmp-car-pick ${compareList.includes(car.slug)?'in':''}" onclick="AV.toggleCompare('${car.slug}')">
          <img src="${car.images[0]}" alt="${car.brand}">
          <div style="flex:1;min-width:0"><div class="cmp-car-pick-name">${car.brand} ${car.model}</div><div class="cmp-car-pick-price">${car.variants[0].label}</div></div>
          <span style="font-size:18px;color:${compareList.includes(car.slug)?'var(--g3)':'var(--ink5)'}">${compareList.includes(car.slug)?'✓':'+'}</span>
        </div>`).join('')}
      </div>
    </div>
    <div>
      ${cols.length>=2?renderCmpTable(cols):`
     <div style="text-align:center;padding:60px 20px;background:var(--bg);border:2px dashed var(--border2);border-radius:var(--r200)">
  
 <div class="track" id="track">
  <div class="road-dashes"></div>
  <div class="road"></div>
  <div class="shadow" id="shadow"></div>
  <div class="speed-lines" id="speedLines">
    <div class="speed-line" style="width:22px"></div>
    <div class="speed-line" style="width:14px"></div>
    <div class="speed-line" style="width:18px"></div>
  </div>
  <div class="car-wrapper" id="car">
    <svg fill="#000000" height="52px" width="100px" viewBox="0 0 58.938 58.938" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)">
      <g><path d="M45.392,28.92V21H33.831v15.233h9.18L45.392,28.92z M34.84,22.428h9.546v5.116H34.84L34.84,22.428L34.84,22.428z M56.574,23.928l-7.225-2.62l4.066-6.103l-0.354-0.234l-4.126,6.188l-4.101-1.485H21.071l-2.721,7.92 c-5.41-0.627-15.802,1.481-15.802,1.481v-0.826H0v6.707h2.547v0.836l0.76-0.648c-0.481,0.826-0.76,1.783-0.76,2.805 c0,3.096,2.507,5.604,5.599,5.604c3.091,0,5.598-2.51,5.598-5.604c0-3.092-2.508-5.6-5.598-5.6c-0.555,0-1.086,0.084-1.592,0.23 c0.387-0.293,0.657-0.529,0.657-0.633l5.834,0.15l1.272,5.391h18.348l12.404,0.025h0.395c-0.043,0.281-0.071,0.564-0.071,0.855 c0,3.094,2.509,5.6,5.601,5.6c3.09,0,5.602-2.506,5.602-5.6c0-3.092-2.51-5.604-5.602-5.604c-1.338,0-2.562,0.473-3.522,1.252 l0.397-1.611h6.504l2.543,5.146l1.843,0.004l0.104-8.098C58.863,29.467,59.579,25.83,56.574,23.928z M8.146,35.42 c1.395-0.002,2.53,1.135,2.53,2.525c0,1.398-1.134,2.531-2.53,2.531c-1.395,0-2.531-1.135-2.531-2.531 C5.616,36.553,6.751,35.42,8.146,35.42z M21.02,36.176l-0.071-0.123l0.12,0.123H21.02z M32.933,32.123l-0.02,4.479H21.494 l-0.423-0.424h11.456V32V21.027h-9.818l-2.627,7.623v5.938l0.866,1.463l-1.289-1.289l0.012-6.214l2.736-7.943h10.544L32.933,32.123 z M22.697,27.546v-5.117h8.697v5.117H22.697z M45.807,29.016l-2.485,7.642H33.41V20.575h12.41L45.807,29.016z M50.992,35.842 c1.396,0,2.531,1.137,2.531,2.529c0,1.395-1.136,2.529-2.531,2.529c-1.395,0-2.528-1.137-2.528-2.529 C48.458,36.979,49.597,35.842,50.992,35.842z"/></g>
    </svg>
  </div>
</div>

  <div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px">
    Pick 2+ cars from the left to compare
  </div>

  <div style="color:var(--ink4)">
    Select cars and see a detailed comparison
  </div>

</div>
      `}
    </div>
  </div>`;
  updateCompareTray();
}
function renderCmpTable(cols){
  const cars=cols.map(s=>carBySlug(s)).filter(Boolean);
  const specs=['Base Price','Rating','Reviews Score','Power','Torque','Efficiency','0–100','Boot','Ground Clearance','Seating'];
  const getVal=(car,s)=>{
    if(s==='Base Price')return car.variants[0].label;
    if(s==='Rating')return fmtR(car.rating)+'★';
    if(s==='Reviews Score')return car.expertScore+'/10';
    const map={Power:['Power','Motor Power','Combined Power'],Torque:['Torque'],Efficiency:['Fuel Efficiency','Range (WLTP)'],'0–100':['0–100 km/h'],Boot:['Boot Space'],'Ground Clearance':['Ground Clearance'],Seating:['Seating']};
    for(const k of(map[s]||[s])){const v=car.specs[k];if(v)return v}
    return'—';
  };
  return`<div style="overflow-x:auto;border-radius:var(--r20);box-shadow:var(--sh2)">
    <table style="width:100%;border-collapse:collapse;min-width:380px">
      <thead>
        <tr>
          <th style="background:#0a1a0d;padding:14px;color:rgba(255,255,255,.4);font-size:11px;font-weight:700;text-align:left;border:none">Spec</th>
          ${cars.map(c=>`<th style="background:var(--ink2);padding:14px;text-align:center;vertical-align:top;border:none">
            <img src="${c.images[0]}" style="width:100%;height:72px;object-fit:cover;border-radius:var(--r8);margin-bottom:8px;display:block">
            <div style="font-size:10px;color:rgba(255,255,255,.35)">${c.brand}</div>
            <div style="font-size:15px;font-weight:700;color:#fff;font-family:var(--font-d)">${c.model}</div>
            <div style="font-size:13px;font-weight:700;color:var(--gold-t);margin-top:4px">${c.variants[0].label}</div>
            <div style="display:flex;gap:6px;justify-content:center;margin-top:9px">
              <button onclick="AV.openDetail('${c.slug}')" style="padding:5px 10px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border:none;border-radius:var(--r6);font-family:var(--font-b);font-size:10.5px;font-weight:700;cursor:pointer">Details</button>
              <button onclick="AV.toggleCompare('${c.slug}')" style="padding:5px 10px;background:rgba(214,48,49,.2);color:#ff8a80;border:none;border-radius:var(--r6);font-family:var(--font-b);font-size:10.5px;font-weight:700;cursor:pointer">Remove</button>
            </div>
          </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${specs.map((s,i)=>`<tr style="${i%2===0?'':'background:var(--bg)'}">
          <td style="padding:10px 14px;font-weight:700;color:var(--ink3);font-size:12.5px;border-bottom:1px solid var(--border)">${s}</td>
          ${cars.map(c=>`<td style="padding:10px 14px;text-align:center;font-size:13px;color:var(--ink2);border-bottom:1px solid var(--border)">${getVal(c,s)}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}


/* ─ SERVICES ─ */
function renderServices(){
  clearInterval(heroTimer);
  document.title='Services — AutoViindu';
  setNav('services');
  const svcs=[
    {id:'cosmetic',name:'Cosmetic Car Care',color:'#1a6b2a',bg:'#eef7f0',icon:'✨',items:['Basic Washing & Cleaning','Interior Vacuum & Polish','Paint Protection Film (PPF)','Scratch & Dent Correction','Headlight Restoration','Underbody Anti-Rust Coating','Alloy & Tyre Shine','Engine Bay Cleaning','Ceramic Coating (9H)','Odour & Sanitization','Nano-coating Application','Full Body Detailing']},
    {id:'workshop',name:'Workshop Services',color:'#b8900e',bg:'#fdf6e0',icon:'🔧',items:['Wiring & Electrical Diagnosis','Hybrid / EV Electrical Work','Sensor / ECU Troubleshooting','Transmission Repair','Air Conditioning Overhaul','Body Work & Panel Repair','Wheel Alignment & Balancing','Suspension Inspection','Software Updates & Calibration','Brake Inspection & Service','Engine Tune-up','Pre-purchase Inspection']},
    {id:'telematics',name:'Telematics & GPS',color:'#1a4db8',bg:'#eef3fc',icon:'📡',items:['GPS Tracking Units','Remote Immobilizer Systems','Geo-fencing & Alerts','OBD Plug Diagnostics','Dashcam & Security Kits','Fuel Monitoring Sensors','TPMS Installation','Fleet Management Solutions']},
    {id:'roadside',name:'Roadside Assistance',color:'#d63031',bg:'#fff0ef',icon:'🚨',items:['Emergency Towing','Battery Jumpstart','Flat Tyre Change','Emergency Fuel Delivery','Lock-Out Service','Minor Mechanical Help','24/7 SOS Support']},
  ];
  document.getElementById('app-root').innerHTML=`
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.7)">Services</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:#fff;font-weight:700;margin-bottom:6px">Our Services</h1>
      <div style="font-size:13px;color:rgba(255,255,255,.4)">Complete automotive care from our Kathmandu centre</div>
    </div>
  </div>
  <div style="background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:var(--nav);z-index:40;overflow-x:auto;scrollbar-width:none">
    <div class="wrap" style="display:flex;gap:7px;padding:10px 0;white-space:nowrap">
      ${svcs.map(s=>`<a href="#svc-${s.id}" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border:1.5px solid ${s.color}22;border-radius:var(--pill);font-size:12.5px;font-weight:700;color:${s.color};background:${s.bg};flex-shrink:0">${s.icon} ${s.name}</a>`).join('')}
    </div>
  </div>
  <div class="wrap" style="padding-top:32px;padding-bottom:64px">
    ${svcs.map(s=>`
    <section id="svc-${s.id}" style="margin-bottom:52px;scroll-margin-top:calc(var(--nav) + 52px)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:${s.color};margin-bottom:6px">${s.items.length} services</div>
          <h2 style="font-family:var(--font-d);font-size:24px;font-weight:700;color:var(--ink)">${s.icon} ${s.name}</h2>
        </div>
        <button onclick="document.getElementById('svc-form-${s.id}').scrollIntoView({behavior:'smooth'})" 
        style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:${s.color};color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-b);font-size:13px;font-weight:700;cursor:pointer">
  <i data-lucide="calendar" style="width:16px;height:16px;"></i>
  Book Now
</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:24px">
        ${s.items.map(item=>`<div style="display:flex;align-items:flex-start;gap:9px;padding:12px 14px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--r10);cursor:pointer;transition:all var(--ease)" onmouseenter="this.style.borderColor='${s.color}';this.style.background='${s.bg}'" onmouseleave="this.style.borderColor='var(--border)';this.style.background='var(--white)'">
          <div style="width:7px;height:7px;background:${s.color};border-radius:50%;flex-shrink:0;margin-top:4px"></div>
          <span style="font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.4">${item}</span>
        </div>`).join('')}
      </div>
      <div id="svc-form-${s.id}" style="background:var(--white);border:1px solid var(--border);border-left:3px solid ${s.color};border-radius:var(--r16);padding:22px;box-shadow:var(--sh1)">
        <div style="font-family:var(--font-d);font-size:19px;font-weight:700;color:${s.color};margin-bottom:4px">Book ${s.name}</div>
        <div style="font-size:13px;color:var(--ink4);margin-bottom:18px">We'll confirm within 2 hours</div>
        <div id="form-ok-${s.id}" style="display:none;background:var(--g-ll);border:1.5px solid rgba(26,107,42,.22);border-radius:var(--r12);padding:20px;text-align:center">
          <div style="font-size:32px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
  <i data-lucide="check" stroke-width="2.5"></i>
</div>
          <div style="font-size:16px;font-weight:800;color:var(--g3);margin-bottom:4px">Booking Request Received!</div>
          <div style="font-size:13px;color:var(--ink3)">We'll call you within 2 hours to confirm.</div>
        </div>
        <form onsubmit="AV.submitForm(event,'${s.id}')" id="form-${s.id}" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Name *</label><input class="sw-input" type="text" placeholder="Full name" required style="padding:10px 12px"></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Phone *</label><input class="sw-input" type="tel" placeholder="+977 98XXXXXXXX" required style="padding:10px 12px"></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Vehicle Brand</label><select class="sw-select" style="padding:10px 28px 10px 12px"><option>Select brand</option>${['Toyota','Honda','Hyundai','Kia','Suzuki','MG','BYD','BMW','Other'].map(b=>`<option>${b}</option>`).join('')}</select></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Service</label><select class="sw-select" style="padding:10px 28px 10px 12px"><option>Select service</option>${s.items.map(i=>`<option>${i}</option>`).join('')}</select></div>
          <div style="grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:4px">
           <div style="font-size:11.5px;color:var(--ink4);display:flex;align-items:center;gap:4px;">
  <i data-lucide="lock" style="width:12px;height:12px;"></i>
  Your info is private & secure
</div> 
       <button type="submit" 
        style="display:inline-flex;align-items:center;gap:4px;padding:11px 26px;background:${s.color};color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-b);font-size:14px;font-weight:700;cursor:pointer">
  <i data-lucide="calendar" style="width:16px;height:16px;"></i>
  Book Appointment
</button>
          </div>
        </form>
      </div>
      <div style="height:1px;background:var(--border);margin-top:48px"></div>
    </section>`).join('')}
  </div>`;
}
function submitForm(e,id){
  e.preventDefault();
  const form=document.getElementById(`form-${id}`);
  const ok=document.getElementById(`form-ok-${id}`);
  if(form)form.style.display='none';
  if(ok)ok.style.display='block';
  toast('Booking submitted!','success');
}


/* ─ USED ─ */

 

 
/* ── USED CARD helper ── */
function usedCard(car){
  const fuelColors={Petrol:'var(--g3)',Diesel:'#1a4db8',Hybrid:'#6b35c7',Electric:'#0e8577'};
  const starSVG=`<svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const heartSVG=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;
  const speedSVG=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>`;
  return `<div class="used-card" onclick="AV.openUsedDetail('${car.id}')">
    <div class="uc-img">
      <img src="${car.img}" alt="${car.brand} ${car.model}" loading="lazy">
      <div class="uc-badges">
        ${car.certified?`<span class="uc-badge uc-badge-cert">✓ Certified</span>`:''}
        <span class="uc-badge uc-badge-fuel" style="background:${fuelColors[car.type]||'var(--ink2)'}">${car.type}</span>
        ${car.owners===1?`<span class="uc-badge uc-badge-owner">1 Owner</span>`:''}
      </div>
      <button class="uc-wish" onclick="event.stopPropagation();this.classList.toggle('active')">${heartSVG}</button>
      <div class="uc-km">${speedSVG} ${car.km} km</div>
    </div>
    <div class="uc-body">
      <div class="uc-meta-top">
        <span class="uc-rating">${starSVG} ${car.rating}</span>
        <span class="uc-year">${car.year} · ${car.transmission}</span>
      </div>
      <div class="uc-name">${car.brand} ${car.model}</div>
      <div class="uc-variant">${car.variant}</div>
      <div class="uc-specs">
        <span class="uc-spec-pill">${car.type}</span>
        <span class="uc-spec-pill">${car.specs.Efficiency||''}</span>
        <span class="uc-spec-pill">${car.specs.Drive||''}</span>
      </div>
      <div class="uc-price-row">
        <div class="uc-from">Asking price</div>
        <div class="uc-price">${car.price}</div>
        <div class="uc-emi">EMI from <strong>Rs. ${car.emiEst.toLocaleString()}/mo</strong></div>
        <div class="uc-actions">
          <button class="uc-btn-o" onclick="event.stopPropagation();alert('Call: +977-9701076240')">Get Price</button>
          <button class="uc-btn-f" onclick="event.stopPropagation();AV.openUsedDetail('${car.id}')">Details</button>
        </div>
      </div>
    </div>
  </div>`;
}
 
/* ── USED LISTING PAGE ── */
function renderUsed(){
  clearInterval(heroTimer);
  document.title='Used Cars — AutoViindu';
  setNav('used');
 
  const trustItems=[
    {color:'var(--g3)',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`,title:'140-Point Inspection',sub:'Every car verified'},
    {color:'#1a4db8',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,title:'Verified Ownership',sub:'DOTM cleared'},
    {color:'#b8900e',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="14" height="14"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,title:'Fair Market Price',sub:'No hidden charges'},
    {color:'#7c3aed',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,title:'Full Service History',sub:'Stamped records'},
  ];
 
  document.getElementById('app-root').innerHTML=`
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.75)">Used Cars</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:#fff;font-weight:700;margin-bottom:6px">Certified Pre-Owned Cars</h1>
      <div style="font-size:13px;color:rgba(255,255,255,.4)">${USED.length} verified vehicles · Full inspection reports</div>
    </div>
  </div>
 
  <div class="wrap" style="padding-top:24px;padding-bottom:64px">
 
    <!-- Trust badges -->
    <div class="uc-trust-strip" style="margin-bottom:22px">
      ${trustItems.map(t=>`<div class="uc-trust-item">
        <div class="uc-trust-icon" style="background:${t.color}">${t.icon}</div>
        <div><div class="uc-trust-title">${t.title}</div><div class="uc-trust-sub">${t.sub}</div></div>
      </div>`).join('')}
    </div>
 
    <!-- Search + filter row -->
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px">
      <div style="flex:1;min-width:200px;position:relative">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink4)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
        <input type="text" placeholder="Search brand, model…" id="used-search" style="width:100%;padding:10px 14px 10px 36px;border:1.5px solid var(--border);border-radius:var(--pill);font-size:13.5px;outline:none;font-family:var(--font-b);background:var(--white);color:var(--ink);transition:all var(--ease)" oninput="AV.filterUsed(this.value)" onfocus="this.style.borderColor='var(--g3)'" onblur="this.style.borderColor='var(--border)'">
      </div>
      <select id="used-sort" onchange="AV.sortUsed(this.value)" style="padding:10px 30px 10px 12px;border:1.5px solid var(--border);border-radius:var(--pill);font-family:var(--font-b);font-size:13px;outline:none;background:var(--white);appearance:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237a9483%22 stroke-width=%222.5%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 10px center;cursor:pointer;color:var(--ink)">
        <option value="">Sort: Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="km-asc">Lowest KM</option>
        <option value="year-desc">Newest First</option>
      </select>
    </div>
 
    <!-- Chips -->
    <div class="filter-chips">
      ${['All','Certified','Petrol','Diesel','Hybrid','Under 30L','Under 50L','1 Owner'].map((t,i)=>`<span class="chip ${i===0?'active':''}" onclick="AV.chipFilterUsed('${t}',this)">${t}</span>`).join('')}
    </div>
 
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r10);margin-bottom:18px">
      <div style="font-size:13px;font-weight:700;color:var(--ink)">Showing <span style="color:var(--g3)" id="used-count">${USED.length}</span> cars</div>
      <div style="font-size:12px;color:var(--ink4)">All prices negotiable</div>
    </div>
 
    <div class="used-grid" id="used-grid">
      ${USED.map(c=>usedCard(c)).join('')}
    </div>
 
    <!-- Sell CTA -->
    <div style="margin-top:36px;background:linear-gradient(135deg,#040b06,#071209);border-radius:var(--r20);padding:32px 24px;position:relative;overflow:hidden">
      <div style="position:relative;z-index:1;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:var(--g5);margin-bottom:6px">Sell your car</div>
          <div style="font-family:var(--font-d);font-size:22px;color:#fff;font-weight:700;margin-bottom:6px">Get the best price for your car</div>
          <div style="font-size:13px;color:rgba(255,255,255,.38)">Free valuation · Instant offers · We handle all DOTM paperwork</div>
        </div>
        <button onclick="alert('+977-9701076240')" style="padding:12px 28px;background:var(--g3);color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-b);font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(26,107,42,.35)">Get Free Valuation</button>
      </div>
    </div>
  </div>`;
 
  window._usedCars=[...USED];
}
 
/* ── USED DETAIL PAGE ── */
function renderUsedDetail(id){
  const car=USED.find(c=>c.id===id);
  if(!car){renderUsed();return}
  clearInterval(heroTimer);
  document.title=`${car.brand} ${car.model} ${car.year} — AutoViindu`;
  window.scrollTo({top:0,behavior:'smooth'});
  setNav('used');
 
  const Rs=n=>n>=100000?`Rs. ${(n/100000).toFixed(2)}L`:`Rs. ${n.toLocaleString()}`;
  const calcEMI=(p,ar,m)=>{const r=ar/12/100;return r===0?p/m:p*(r*Math.pow(1+r,m))/(Math.pow(1+r,m)-1)};
  const checkIcon=(ok)=>ok
    ?`<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>`
    :`<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
 
  let galIdx=0;
  const imgs=car.images||[car.img];
 
  function buildEMI(price){
    const dp=20,ten=60,rate=10.5;
    const loan=price*(1-dp/100);
    const emi=calcEMI(loan,rate,ten);
    const tot=emi*ten;
    return `<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:10px">EMI Calculator</div>
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:var(--ink4);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px"><span>Down payment</span><span id="ud-dp-val">20%</span></div>
      <input type="range" min="10" max="60" step="5" value="20" id="ud-dp" oninput="document.getElementById('ud-dp-val').textContent=this.value+'%';window._udRecalc()" style="width:100%">
    </div>
    <div style="margin-bottom:12px">
      <div style="font-size:10px;font-weight:700;color:var(--ink4);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">Tenure</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${[12,24,36,48,60,72].map(m=>`<button onclick="window._udSetTen(${m})" id="ud-ten-${m}" style="padding:5px 9px;background:${m===60?'var(--g3)':'var(--bg2)'};color:${m===60?'#fff':'var(--ink3)'};border:1.5px solid ${m===60?'var(--g3)':'var(--border)'};border-radius:var(--r6);font-size:11.5px;font-weight:700;cursor:pointer;font-family:var(--font-b)">${m}m</button>`).join('')}
      </div>
    </div>
    <div style="background:var(--g-ll);border:1px solid rgba(26,107,42,.15);border-radius:var(--r10);padding:12px;margin-bottom:10px">
      <div style="font-size:10px;color:var(--ink4);margin-bottom:2px">Monthly EMI</div>
      <div id="ud-emi" style="font-family:var(--font-d);font-size:26px;font-weight:700;color:var(--g3)">Rs. ${Math.round(emi).toLocaleString()}</div>
      <div style="font-size:11px;color:var(--ink4)">/month</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
      <div style="background:var(--bg);border-radius:8px;padding:8px 10px"><div id="ud-loan" style="font-size:12px;font-weight:800;color:var(--ink)">${Rs(Math.round(loan))}</div><div style="font-size:10px;color:var(--ink4)">Loan amount</div></div>
      <div style="background:var(--bg);border-radius:8px;padding:8px 10px"><div id="ud-tot" style="font-size:12px;font-weight:800;color:var(--ink)">${Rs(Math.round(tot))}</div><div style="font-size:10px;color:var(--ink4)">Total payable</div></div>
    </div>`;
  }
 
  document.getElementById('app-root').innerHTML=`
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb">
        <a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span>
        <a onclick="AV.renderUsed()">Used Cars</a><span class="bc-sep">/</span>
        <span style="color:rgba(255,255,255,.75)">${car.brand} ${car.model}</span>
      </div>
      <h1 style="font-family:var(--font-d);font-size:clamp(22px,4vw,34px);color:#fff;font-weight:700;line-height:1.1;margin-bottom:6px">
        ${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span>
      </h1>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:12px;color:rgba(255,255,255,.4)">${car.type} · ${car.transmission} · ${car.km} km</span>
        <span class="cc-rating"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${car.rating}</span>
        <span style="font-size:11.5px;color:rgba(255,255,255,.3)">${car.reviews} reviews</span>
        ${car.certified?`<span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:var(--pill);background:rgba(26,107,42,.3);color:#4dd870;border:1px solid rgba(26,107,42,.45)">✓ AutoViindu Certified</span>`:''}
      </div>
    </div>
  </div>
 
  <div class="detail-layout">
 
    <!-- SIDEBAR -->
    <div class="detail-sidebar" style="order:0">
      <div class="dp-sidebar-inner">
        <!-- Price -->
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:4px">Asking price</div>
        <div style="font-family:var(--font-d);font-size:32px;font-weight:700;color:var(--g3);line-height:1;margin-bottom:2px">${car.price}</div>
        <div style="font-size:11px;color:var(--ink4);margin-bottom:16px">${car.variant} · Negotiable</div>
 
        <!-- CTAs -->
        <div class="dp-cta-stack">
          <button class="dp-cta-primary" onclick="alert('+977-9701076240')">Call / WhatsApp Seller</button>
          <button class="dp-cta-gold" onclick="alert('Test drive: +977-9701076240')">Book Test Drive</button>
          <button class="dp-cta-ghost" onclick="alert('EMI enquiry: +977-9701076240')">Apply for Finance</button>
        </div>
 
        <!-- Quick specs -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:16px 0">
          ${[['KM Driven',car.km+' km'],['Owners',car.owners+' owner'],['Color',car.color],['Year',car.year],['Fuel',car.type],['Transmission',car.transmission]].map(([k,v])=>`
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 10px;text-align:center">
            <div style="font-family:var(--font-d);font-size:12px;font-weight:700;color:var(--g3)">${v}</div>
            <div style="font-size:10px;color:var(--ink4);margin-top:1px">${k}</div>
          </div>`).join('')}
        </div>
 
        <div class="dp-contact">
          <a href="tel:+9779701076240">+977-9701076240</a> &nbsp;·&nbsp; Nayabazar, Kathmandu
        </div>
      </div>
 
      <!-- EMI block -->
      <div class="dp-emi" id="ud-emi-wrap">
        ${buildEMI(car.priceNum)}
      </div>
 
      <!-- Seller card -->
      <div style="padding:0 20px 20px">
        <div class="uc-seller-card">
          <div class="uc-seller-head">
            <div class="uc-seller-avatar">A</div>
            <div>
              <div class="uc-seller-name">${car.seller.name}</div>
              ${car.seller.verified?`<span class="uc-seller-badge">✓ Verified Dealer</span>`:''}
            </div>
          </div>
          <div class="uc-seller-stats">
            <div class="uc-ss-cell"><div class="uc-ss-val">${car.seller.sold}+</div><div class="uc-ss-lbl">Cars sold</div></div>
            <div class="uc-ss-cell"><div class="uc-ss-val">${car.seller.rating}★</div><div class="uc-ss-lbl">Rating</div></div>
            <div class="uc-ss-cell"><div class="uc-ss-val">4yr</div><div class="uc-ss-lbl">On AutoViindu</div></div>
          </div>
          <button onclick="alert('+977-9701076240')" style="width:100%;padding:10px;background:var(--g3);color:#fff;border:none;border-radius:var(--r8);font-family:var(--font-b);font-size:13px;font-weight:700;cursor:pointer">Contact Seller</button>
        </div>
      </div>
    </div>
 
    <!-- MAIN CONTENT -->
    <div style="order:1;min-width:0">
 
      <!-- Gallery -->
      <div id="ud-gal-wrap">
        <div style="position:relative;height:240px;overflow:hidden;background:var(--bg2)" id="ud-gal-main">
          <img id="ud-gal-img" src="${imgs[0]}" style="width:100%;height:100%;object-fit:cover;transition:opacity .2s" alt="${car.brand} ${car.model}">
          ${imgs.length>1?`
          <button onclick="window._udGalNav(-1)" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);width:34px;height:34px;background:rgba(255,255,255,.95);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
          <button onclick="window._udGalNav(1)"  style="position:absolute;top:50%;right:10px;transform:translateY(-50%);width:34px;height:34px;background:rgba(255,255,255,.95);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>`:''}
          <div style="position:absolute;bottom:8px;right:10px;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:var(--pill)" id="ud-gal-cnt">1/${imgs.length}</div>
        </div>
        ${imgs.length>1?`<div style="display:flex;gap:6px;padding:10px 14px;overflow-x:auto;background:var(--white);border-bottom:1px solid var(--border)">
          ${imgs.map((img,i)=>`<div onclick="window._udGalSet(${i})" style="width:58px;height:40px;border-radius:6px;overflow:hidden;border:2px solid ${i===0?'var(--g3)':'transparent'};cursor:pointer;flex-shrink:0;background:var(--bg2);transition:border-color var(--ease)" id="ud-thumb-${i}"><img src="${img}" style="width:100%;height:100%;object-fit:cover"></div>`).join('')}
        </div>`:''}
      </div>
 
      <!-- Tabs -->
      <div class="dp-tabs-wrap">
        <div class="dp-tabs">
          <button class="dp-tab active" onclick="AV.dpTab(this,'ud-pane-ov')">Overview</button>
          <button class="dp-tab" onclick="AV.dpTab(this,'ud-pane-sp')">Specs</button>
          <button class="dp-tab" onclick="AV.dpTab(this,'ud-pane-inspect')">Inspection</button>
        </div>
      </div>
 
      <!-- OVERVIEW -->
      <div class="dp-pane active" id="ud-pane-ov">
        <div style="font-size:13.5px;color:var(--ink3);line-height:1.85;margin-bottom:16px">${car.overview}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px">
          ${(car.highlights||[]).map(h=>`<span class="dp-hl-tag">${h}</span>`).join('')}
        </div>
        <div class="dp-qs-grid" style="margin-bottom:18px">
          ${Object.entries(car.specs).map(([k,v])=>`<div class="dp-qs-cell"><div class="dp-qs-val">${v}</div><div class="dp-qs-lbl">${k}</div></div>`).join('')}
        </div>
      </div>
 
      <!-- SPECS -->
      <div class="dp-pane" id="ud-pane-sp">
        <table class="dp-spec-table" style="width:100%;border-collapse:collapse">
          ${[['Brand',car.brand],['Model',car.model],['Year',car.year],['Variant',car.variant],['KM Driven',car.km+' km'],['Fuel Type',car.type],['Transmission',car.transmission],['Owners',car.owners],['Color',car.color],...Object.entries(car.specs)].map(([k,v],i)=>`<tr style="${i%2===0?'':'background:var(--bg)'}"><td style="padding:9px 12px;border-bottom:1px solid var(--border);font-size:13px;font-weight:700;color:var(--ink2);width:45%">${k}</td><td style="padding:9px 12px;border-bottom:1px solid var(--border);font-size:13px;color:var(--ink3)">${v}</td></tr>`).join('')}
        </table>
      </div>
 
      <!-- INSPECTION -->
      <div class="dp-pane" id="ud-pane-inspect">
        <div style="display:flex;align-items:center;gap:10px;background:var(--g-ll);border:1.5px solid rgba(26,107,42,.18);border-radius:var(--r12);padding:14px 16px;margin-bottom:16px">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g3)" stroke-width="2.5" width="22" height="22"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          <div><div style="font-size:13px;font-weight:800;color:var(--g3)">140-Point AutoViindu Inspection</div><div style="font-size:11.5px;color:var(--ink4)">Checked by certified AutoViindu technician</div></div>
        </div>
        <div class="uc-check-grid">
          ${car.inspection.map(item=>`<div class="uc-check-item">
            <div class="uc-check-dot" style="background:${item.ok?'#16a34a':'#dc2626'}"></div>
            <div>
              <div class="uc-check-label">${item.label}</div>
              <div style="font-size:10px;color:var(--ink4)">${item.status}</div>
            </div>
            <span style="margin-left:auto">${checkIcon(item.ok)}</span>
          </div>`).join('')}
        </div>
 
        <!-- Pros / Cons from inspection -->
        <div class="dp-pc-grid" style="margin-top:16px">
          <div class="dp-pros">
            <div class="dp-pc-title" style="color:#16a34a">Passed checks</div>
            ${car.inspection.filter(i=>i.ok).map(i=>`<div class="dp-pc-item"><span style="color:#16a34a;flex-shrink:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg></span>${i.label} — ${i.status}</div>`).join('')}
          </div>
          
        </div>
      </div>
 
      <!-- Similar used cars -->
      <div style="padding:20px;border-top:1px solid var(--border)">
        <div style="font-family:var(--font-d);font-size:19px;font-weight:700;color:var(--ink);margin-bottom:12px">Similar used cars</div>
        <div class="used-grid" style="grid-template-columns:repeat(2,1fr)">
          ${USED.filter(c=>c.id!==id).slice(0,4).map(c=>usedCard(c)).join('')}
        </div>
      </div>
 
    </div>
  </div>`;
 
  /* desktop: gallery left, sidebar right */
  const mq=window.matchMedia('(min-width:900px)');
  function applyOrder(e){
    const sb=document.querySelector('.detail-sidebar');
    const main=document.querySelector('.detail-layout > div:last-child');
    if(sb&&main){sb.style.order=e.matches?'2':'0';main.style.order='1'}
  }
  applyOrder(mq);
  mq.addEventListener('change',applyOrder);
 
  /* gallery controls */
  let gi=0;
  window._udGalNav=function(dir){
    gi=(gi+dir+imgs.length)%imgs.length;
    const img=document.getElementById('ud-gal-img');
    if(img){img.style.opacity='0';setTimeout(()=>{img.src=imgs[gi];img.style.opacity='1'},200)}
    document.querySelectorAll('[id^="ud-thumb-"]').forEach((t,i)=>t.style.borderColor=i===gi?'var(--g3)':'transparent');
    const c=document.getElementById('ud-gal-cnt');if(c)c.textContent=`${gi+1}/${imgs.length}`;
  };
  window._udGalSet=function(idx){
    gi=idx;
    const img=document.getElementById('ud-gal-img');
    if(img){img.style.opacity='0';setTimeout(()=>{img.src=imgs[idx];img.style.opacity='1'},200)}
    document.querySelectorAll('[id^="ud-thumb-"]').forEach((t,i)=>t.style.borderColor=i===idx?'var(--g3)':'transparent');
    const c=document.getElementById('ud-gal-cnt');if(c)c.textContent=`${idx+1}/${imgs.length}`;
  };
 
  /* EMI calculator */
  let _udTen=60;
  window._udSetTen=function(m){
    _udTen=m;
    [12,24,36,48,60,72].forEach(x=>{
      const b=document.getElementById(`ud-ten-${x}`);
      if(b){b.style.background=x===m?'var(--g3)':'var(--bg2)';b.style.color=x===m?'#fff':'var(--ink3)';b.style.borderColor=x===m?'var(--g3)':'var(--border)'}
    });
    window._udRecalc();
  };
  window._udRecalc=function(){
    const dp=+(document.getElementById('ud-dp')?.value||20);
    const rate=10.5;
    const loan=car.priceNum*(1-dp/100);
    const emi=calcEMI(loan,rate,_udTen);
    const tot=emi*_udTen;
    const s=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
    s('ud-emi',`Rs. ${Math.round(emi).toLocaleString()}`);
    s('ud-loan',Rs(Math.round(loan)));
    s('ud-tot',Rs(Math.round(tot)));
  };
}
 
/* ── FILTER / SORT helpers for listing ── */
function filterUsed(q){
  const ql=q.toLowerCase();
  const res=USED.filter(c=>`${c.brand} ${c.model} ${c.type} ${c.variant}`.toLowerCase().includes(ql));
  const g=document.getElementById('used-grid');
  const cnt=document.getElementById('used-count');
  if(g)g.innerHTML=res.map(c=>usedCard(c)).join('');
  if(cnt)cnt.textContent=res.length;
}
function sortUsed(val){
  let cars=[...USED];
  if(val==='price-asc')cars.sort((a,b)=>a.priceNum-b.priceNum);
  else if(val==='price-desc')cars.sort((a,b)=>b.priceNum-a.priceNum);
  else if(val==='km-asc')cars.sort((a,b)=>parseInt(a.km.replace(/,/g,''))-parseInt(b.km.replace(/,/g,'')));
  else if(val==='year-desc')cars.sort((a,b)=>b.year-a.year);
  const g=document.getElementById('used-grid');
  if(g)g.innerHTML=cars.map(c=>usedCard(c)).join('');
}
function chipFilterUsed(label,btn){
  document.querySelectorAll('.filter-chips .chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  let cars=USED;
  if(label==='Certified')cars=cars.filter(c=>c.certified);
  else if(label==='Petrol')cars=cars.filter(c=>c.type==='Petrol');
  else if(label==='Diesel')cars=cars.filter(c=>c.type==='Diesel');
  else if(label==='Hybrid')cars=cars.filter(c=>c.type==='Hybrid');
  else if(label==='Under 30L')cars=cars.filter(c=>c.priceNum<3000000);
  else if(label==='Under 50L')cars=cars.filter(c=>c.priceNum<5000000);
  else if(label==='1 Owner')cars=cars.filter(c=>c.owners===1);
  const g=document.getElementById('used-grid');
  const cnt=document.getElementById('used-count');
  if(g)g.innerHTML=cars.map(c=>usedCard(c)).join('');
  if(cnt)cnt.textContent=cars.length;
}
 
function openUsedDetail(id){
  clearInterval(heroTimer);
  renderUsedDetail(id);
  history.pushState({page:'used-detail',id},'',`#used/${id}`);
}



/* ─ NAV ─ */
function setNav(p){
  document.querySelectorAll('.hn-link').forEach(n=>n.classList.remove('active'));
  const m={home:'nav-home',cars:'nav-cars',electric:'nav-electric',used:'nav-used',compare:'nav-compare',services:'nav-services'};
  if(m[p])document.getElementById(m[p])?.classList.add('active');
}
function goTo(page,opts={}){
  clearInterval(heroTimer);
  window.scrollTo({top:0,behavior:'smooth'});
  closeMM();
  const p=page||'home';
  if(p==='home')renderHome();
  else if(p==='cars')renderCars(opts.filter||null,opts);
  else if(p==='electric')renderCars('electric');
  else if(p==='hybrid')renderCars('hybrid');
  else if(p==='used')renderUsed();
  else if(p==='compare')renderCompare();
  else if(p==='services')renderServices();
  else renderHome();
  history.pushState({page:p,opts},'',`#${p}`);
}
function openDetail(slug){
  clearInterval(heroTimer);
  renderDetail(slug);
  history.pushState({page:'detail',slug},'',`#car/${slug}`);
}

/* ─ SEARCH ─ */
let searchIdx=CARS_DB.map(c=>({slug:c.slug,display:`${c.brand} ${c.model}`,searchText:`${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase(),image:c.images[0],year:c.year,type:c.type,body:c.body,price:c.variants[0].label}));
let searchTimer=null;
const hsInput=document.getElementById('hs-input');
const searchDD=document.getElementById('search-dd');
if(hsInput){
  hsInput.addEventListener('input',e=>{
    const v=e.target.value;
    clearTimeout(searchTimer);
    searchTimer=setTimeout(()=>{
      if(v.length<2){showQS();return}
      const q=v.toLowerCase();
      const res=searchIdx.filter(c=>c.searchText.includes(q)).slice(0,6);
      if(!res.length){searchDD.innerHTML=`<div style="padding:18px;text-align:center;font-size:13px;color:var(--ink4)">No results for "<strong>${v}</strong>"</div>`;searchDD.classList.add('open')}
      else{searchDD.innerHTML=`<div class="sdd-hd">${res.length} results</div>${res.map(r=>`<div class="sdd-item" onclick="AV.openDetail('${r.slug}');closeSD()"><img class="sdd-img" src="${r.image}" alt=""><div style="flex:1;min-width:0"><div class="sdd-name">${r.display}</div><div class="sdd-meta">${r.year} · ${r.type} · ${r.body}</div></div><div class="sdd-price">${r.price}</div></div>`).join('')}`;searchDD.classList.add('open')}
    },180);
  });
  hsInput.addEventListener('focus',()=>showQS());
  hsInput.addEventListener('keydown',e=>{if(e.key==='Escape')closeSD();if(e.key==='Enter'){AV.goTo('cars',{q:hsInput.value});closeSD()}});
  document.addEventListener('click',e=>{if(!e.target.closest('#header-search-wrap'))closeSD()});
}
function showQS(){if(!searchDD)return;searchDD.innerHTML=`<div class="sdd-hd">Popular Searches</div><div class="sdd-chip-row">${['MG Hector','IONIQ 5','Toyota Prius','Honda City','Kia Seltos','BYD Atto 3','Swift 2024','Electric Cars'].map(t=>`<span class="sdd-chip" onclick="AV.goTo('cars');closeSD()">${t}</span>`).join('')}</div>`;searchDD.classList.add('open')}
function closeSD(){if(searchDD)searchDD.classList.remove('open')}
window.closeSD=closeSD;

/* ─ HEADER SCROLL ─ */
window.addEventListener('scroll',()=>{document.getElementById('site-header')?.classList.toggle('scrolled',window.scrollY>20)},{passive:true});

/* ─ MOBILE ─ */
const burger=document.getElementById('burger');
const mm=document.getElementById('mm');
function closeMM(){if(mm)mm.classList.remove('open');if(burger)burger.classList.remove('open');document.body.style.overflow=''}
if(burger)burger.addEventListener('click',()=>{const open=mm.classList.contains('open');if(open)closeMM();else{mm.classList.add('open');burger.classList.add('open');document.body.style.overflow='hidden'}});
const mmCarsBtn=document.getElementById('mm-cars-btn');
const mmCarsSub=document.getElementById('mm-cars-sub');
if(mmCarsBtn)mmCarsBtn.addEventListener('click',()=>{const open=mmCarsSub.classList.contains('open');mmCarsSub.classList.toggle('open',!open)});
window.closeMM=closeMM;

/* ─ KEYBOARD ─ */
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!e.target.matches('input,textarea,select')){e.preventDefault();hsInput?.focus()}
  if(e.key==='Escape'){closeSD();closeMM()}
});

/* ─ POPSTATE ─ */
window.addEventListener('popstate',e=>{
  const hash=location.hash;
  if(!hash||hash==='#home')renderHome();
  else if(hash.startsWith('#car/'))renderDetail(hash.replace('#car/',''));
  else if(hash.startsWith('#used/'))renderUsedDetail(hash.replace('#used/',''));
  else if(hash==='#cars')renderCars();
  else if(hash==='#electric')renderCars('electric');
  else if(hash==='#compare')renderCompare();
  else if(hash==='#services')renderServices();
  else if(hash==='#used')renderUsed();
  else renderHome();
});

/* ─ PUBLIC API ─ */
window.AV={
  goTo,openDetail,toggleCompare,toggleWish,clearCompare,
  galNav,galSet,selectVariant,selectColor,dtab,
  updateEMI,setTenure,getVI,
  homeFilter,filterList,sortList,
  swSearch,submitForm,
  heroNav,heroGo,updateCompareTray,dpTab, recalcEmi, setTenure2,
   openUsedDetail, filterUsed, sortUsed, chipFilterUsed, renderUsed,
};


/* ─ INIT ─ */
function init(){
  const hash=location.hash;
  if(hash.startsWith('#car/'))renderDetail(hash.replace('#car/',''));
  else if(hash==='#cars')renderCars();
  else if(hash==='#electric')renderCars('electric');
  else if(hash==='#compare')renderCompare();
  else if(hash==='#services')renderServices();
  else if(hash==='#used')renderUsed();
  else renderHome();
  lucide.createIcons();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();


const track = document.getElementById('track');
const car = document.getElementById('car');
const shadow = document.getElementById('shadow');
const speedLines = document.getElementById('speedLines');

const CAR_WIDTH = 100;
let pos = 0;
let direction = 1;
let turning = false;
let scaleX = -1;
let scaleY = 1;
let bouncePhase = 0;
let speed = 1.6;
let turnProgress = 0;

function getTrackWidth() {
  return track.offsetWidth;
}

function setCarTransform(x, scX, scY, bounce) {
  car.style.left = x + 'px';
  car.style.transform = `scaleX(${scX}) scaleY(${scY}) translateY(${bounce}px)`;
  car.style.transformOrigin = 'center bottom';
  shadow.style.left = (x + CAR_WIDTH / 2 - 30) + 'px';
  shadow.style.transform = `scaleX(${Math.abs(scX) * (1 + Math.abs(bounce) * 0.04)})`;
  speedLines.style.left = direction === 1
    ? (x - 28) + 'px'
    : (x + CAR_WIDTH + 4) + 'px';
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animate() {
  const trackW = getTrackWidth();
  const maxX = trackW - CAR_WIDTH - 8;
  bouncePhase += 0.08;
  const bounce = -Math.abs(Math.sin(bouncePhase)) * 2.5;

  if (turning) {
    turnProgress += 0.045;
    const t = easeInOut(Math.min(turnProgress, 1));
    const midScale = Math.cos(t * Math.PI);
    const currentScaleX = direction === 1 ? -midScale : midScale;
    const squish = 1 + Math.abs(midScale < 0 ? midScale * 0.08 : 0);
    setCarTransform(pos, currentScaleX, squish, bounce * 0.3);
    shadow.style.opacity = 0.5 + Math.abs(midScale) * 0.5;
    if (turnProgress >= 1) {
      turning = false;
      turnProgress = 0;
      scaleX = direction === 1 ? 1 : -1;
    }
    speedLines.style.opacity = 0;
  } else {
    pos += direction * speed;
    setCarTransform(pos, scaleX, scaleY, bounce);
    shadow.style.opacity = '0.7';
    speedLines.style.opacity = speed > 1 ? '0.7' : '0';

    if (pos >= maxX) {
      pos = maxX;
      direction = -1;
      turning = true;
      turnProgress = 0;
      speed = 1.6 + Math.random() * 0.4;
    } else if (pos <= 4) {
      pos = 4;
      direction = 1;
      turning = true;
      turnProgress = 0;
      speed = 1.6 + Math.random() * 0.4;
    }
  }

  requestAnimationFrame(animate);
}

pos = 4;
scaleX = 1; 
animate();


})();