
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
const BASE = 'https://cdn.brandfetch.io/';

const BRANDS = [
  { name: 'Toyota',     count: '28 cars', logo: `${BASE}toyota.com/w/400/h/400` },
  { name: 'Honda',      count: '18 cars', logo: `${BASE}honda.com/w/400/h/400` },
  { name: 'Hyundai',    count: '22 cars', logo: `${BASE}hyundai.com/w/400/h/400` },
  { name: 'Kia',        count: '16 cars', logo: `${BASE}kia.com/w/400/h/400` },
  { name: 'Suzuki',     count: '20 cars', logo: `${BASE}suzuki.com/w/400/h/400` },
  { name: 'MG',         count: '8 cars',  logo: `${BASE}mgmotor.co.uk/w/400/h/400` },
  { name: 'BYD',        count: '6 cars',  logo: `${BASE}byd.com/w/400/h/400` },
  { name: 'BMW',        count: '12 cars', logo: `${BASE}bmw.com/w/400/h/400` },
  { name: 'Mercedes',   count: '14 cars', logo: `${BASE}mercedes-benz.com/w/400/h/400` },
  { name: 'Audi',       count: '10 cars', logo: `${BASE}audi.com/w/400/h/400` },
  { name: 'Skoda',      count: '6 cars',  logo: `${BASE}skoda.com/w/400/h/400` },
  { name: 'Volkswagen', count: '8 cars',  logo: `${BASE}vw.com/w/400/h/400` },
  { name: 'Ford',       count: '5 cars',  logo: `${BASE}ford.com/w/400/h/400` },
  { name: 'Jeep',       count: '4 cars',  logo: `${BASE}jeep.com/w/400/h/400` },
  { name: 'Tata',       count: '9 cars',  logo: `${BASE}tata.com/w/400/h/400` },
  { name: 'Mahindra',   count: '7 cars',  logo: `${BASE}mahindra.com/w/400/h/400` },
  { name: 'Nissan',     count: '5 cars',  logo: `${BASE}nissan.com/w/400/h/400` },
  { name: 'Mitsubishi', count: '6 cars',  logo: `${BASE}mitsubishi.com/w/400/h/400` },
  { name: 'Subaru',     count: '4 cars',  logo: `${BASE}subaru.com/w/400/h/400` },
  { name: 'Lexus',      count: '7 cars',  logo: `${BASE}lexus.com/w/400/h/400` },
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
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 43.49" width="44" height="22" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M103.94,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76c-5.39,0-9.76-4.37-9.76-9.76C94.18,28.34,98.55,23.97,103.94,23.97L103.94,23.97z M23,29.07v3.51h3.51C26.09,30.86,24.73,29.49,23,29.07L23,29.07z M26.52,34.87H23v3.51C24.73,37.97,26.09,36.6,26.52,34.87L26.52,34.87z M20.71,38.39v-3.51H17.2C17.62,36.6,18.99,37.96,20.71,38.39L20.71,38.39z M17.2,32.59h3.51v-3.51C18.99,29.49,17.62,30.86,17.2,32.59L17.2,32.59z M105.09,29.07v3.51h3.51C108.18,30.86,106.82,29.49,105.09,29.07L105.09,29.07z M108.6,34.87h-3.51v3.51C106.82,37.97,108.18,36.6,108.6,34.87L108.6,34.87z M102.8,38.39v-3.51h-3.51C99.71,36.6,101.07,37.96,102.8,38.39L102.8,38.39z M99.28,32.59h3.51v-3.51C101.07,29.49,99.71,30.86,99.28,32.59L99.28,32.59z M49.29,12.79c-1.54-0.35-3.07-0.35-4.61-0.28C56.73,6.18,61.46,2.07,75.57,2.9l-1.94,12.87L50.4,16.65c0.21-0.61,0.33-0.94,0.37-1.55C50.88,13.36,50.86,13.15,49.29,12.79L49.29,12.79z M79.12,3.13L76.6,15.6l24.13-0.98c2.48-0.1,2.91-1.19,1.41-3.28c-0.68-0.95-1.44-1.89-2.31-2.82C93.59,1.86,87.38,3.24,79.12,3.13L79.12,3.13z M0.46,27.28H1.2c0.46-2.04,1.37-3.88,2.71-5.53c2.94-3.66,4.28-3.2,8.65-3.99l24.46-4.61c5.43-3.86,11.98-7.3,19.97-10.2C64.4,0.25,69.63-0.01,77.56,0c4.54,0.01,9.14,0.28,13.81,0.84c2.37,0.15,4.69,0.47,6.97,0.93c2.73,0.55,5.41,1.31,8.04,2.21l9.8,5.66c2.89,1.67,3.51,3.62,3.88,6.81l1.38,11.78h1.43v6.51c-0.2,2.19-1.06,2.52-2.88,2.52h-2.37c0.92-20.59-28.05-24.11-27.42,1.63H34.76c3.73-17.75-14.17-23.91-22.96-13.76c-2.67,3.09-3.6,7.31-3.36,12.3H2.03c-0.51-0.24-0.91-0.57-1.21-0.98c-1.05-1.43-0.82-5.74-0.74-8.23C0.09,27.55-0.12,27.28,0.46,27.28L0.46,27.28z M21.86,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76c-5.39,0-9.76-4.37-9.76-9.76C12.1,28.34,16.47,23.97,21.86,23.97L21.86,23.97z"/></svg>`,
          label:'SUV', filter:'suv', color:'#b8900e'
        },
    
     {
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="324 750 4376 1530" width="44" height="22" fill="currentColor"><path fill-rule="evenodd" d="M3407.121094 2198.683594 L3311.25 2198.683594 C3302.96875 2198.683594 3296.25 2205.40625 3296.25 2213.683594 C3296.25 2221.964844 3302.96875 2228.683594 3311.25 2228.683594 L3407.121094 2228.683594 C3415.398438 2228.683594 3422.121094 2221.964844 3422.121094 2213.683594 C3422.121094 2205.40625 3415.398438 2198.683594 3407.121094 2198.683594 Z M1461.21875 2228.683594 L1557.089844 2228.683594 C1565.371094 2228.683594 1572.089844 2221.964844 1572.089844 2213.683594 C1572.089844 2205.40625 1565.371094 2198.683594 1557.089844 2198.683594 L1461.21875 2198.683594 C1452.941406 2198.683594 1446.21875 2205.40625 1446.21875 2213.683594 C1446.21875 2221.964844 1452.941406 2228.683594 1461.21875 2228.683594 Z M673.34375 2021.839844 C675.476562 2021.996094 677.679688 2021.695312 679.804688 2020.882812 L680.046875 2020.785156 L680.136719 2020.75 L711.527344 2007.828125 C748.550781 2093.179688 817.117188 2161.714844 902.484375 2198.683594 L668.613281 2198.683594 C660.332031 2198.683594 653.613281 2205.40625 653.613281 2213.683594 C653.613281 2221.964844 660.332031 2228.683594 668.613281 2228.683594 L1399.171875 2228.683594 C1407.449219 2228.683594 1414.171875 2221.964844 1414.171875 2213.683594 C1414.171875 2205.40625 1407.449219 2198.683594 1399.171875 2198.683594 L1193.140625 2198.683594 L1193.429688 2198.558594 C1200.910156 2195.304688 1208.28125 2191.8125 1215.53125 2188.074219 C1229.109375 2181.058594 1242.261719 2173.1875 1254.871094 2164.527344 C1284.339844 2144.289062 1310.820312 2119.738281 1333.25 2091.898438 C1347.671875 2073.992188 1360.421875 2054.738281 1371.238281 2034.453125 C1377.621094 2022.511719 1383.308594 2010.214844 1388.328125 1997.640625 L1388.410156 1997.441406 L1414.589844 2006.078125 L1424.359375 2030.570312 C1426.648438 2036.316406 1432.238281 2040.066406 1438.429688 2040.011719 L3392.589844 2022.640625 C3393.078125 2022.644531 3393.589844 2022.625 3394.089844 2022.578125 L3394.339844 2022.554688 C3394.851562 2022.496094 3395.359375 2022.414062 3395.871094 2022.304688 L3395.929688 2022.292969 C3397.011719 2022.058594 3398.039062 2021.707031 3399.019531 2021.253906 L3429.488281 2007.738281 C3466.488281 2093.117188 3535.078125 2161.695312 3620.488281 2198.683594 L3469.171875 2198.683594 C3460.890625 2198.683594 3454.171875 2205.40625 3454.171875 2213.683594 C3454.171875 2221.964844 3460.890625 2228.683594 3469.171875 2228.683594 L4199.730469 2228.683594 C4208.011719 2228.683594 4214.730469 2221.964844 4214.730469 2213.683594 C4214.730469 2205.40625 4208.011719 2198.683594 4199.730469 2198.683594 L3911.140625 2198.683594 L3911.429688 2198.558594 C3921.789062 2194.050781 3931.941406 2189.082031 3941.839844 2183.644531 C3959.730469 2173.8125 3976.789062 2162.484375 3992.808594 2149.820312 C4011.78125 2134.816406 4029.261719 2117.945312 4044.941406 2099.523438 C4060.421875 2081.324219 4074.128906 2061.625 4085.789062 2040.773438 C4095.660156 2023.121094 4104.070312 2004.648438 4110.878906 1985.601562 C4114.929688 1974.28125 4118.410156 1962.761719 4121.328125 1951.089844 L4121.339844 1951.03125 L4155.851562 1956.511719 L4155.898438 1956.519531 C4156.019531 1956.539062 4156.128906 1956.550781 4156.25 1956.570312 L4156.441406 1956.589844 C4158.28125 1956.820312 4160.089844 1956.699219 4161.800781 1956.28125 L4581.75 1861.601562 C4584 1861.089844 4586.101562 1860.070312 4587.890625 1858.628906 L4614.289062 1837.269531 C4616.21875 1835.699219 4617.730469 1833.691406 4618.691406 1831.390625 C4691.441406 1657.53125 4711.621094 1489.730469 4574.191406 1340.199219 C4582.519531 1299.898438 4578.300781 1262.480469 4560.609375 1228.179688 C4560.789062 1210.570312 4561.53125 1137.921875 4561.53125 1137.921875 C4561.601562 1130.890625 4556.789062 1124.761719 4549.941406 1123.160156 C4492.648438 1109.78125 4435.351562 1103.191406 4378.058594 1103.769531 C4101.488281 999.441406 3381.828125 743.421875 2768.421875 773.808594 C2359.371094 794.078125 2092.980469 883.480469 1661.429688 1178.828125 C1225.011719 1192.828125 809.933594 1258.148438 435.585938 1421.128906 C377.449219 1446.441406 344.164062 1499.261719 331.320312 1565.96875 C313.757812 1657.191406 334.867188 1775 379.261719 1878.039062 L331.933594 1906.058594 C327.34375 1908.769531 324.539062 1913.71875 324.570312 1919.050781 C324.605469 1924.390625 327.464844 1929.300781 332.085938 1931.960938 C428.898438 1987.730469 544.996094 2014.203125 673.34375 2021.839844 Z M1047.808594 1525.960938 C1233.449219 1525.960938 1384.171875 1676.679688 1384.171875 1862.320312 C1384.171875 2047.96875 1233.449219 2198.683594 1047.808594 2198.683594 C862.171875 2198.683594 711.453125 2047.96875 711.453125 1862.320312 C711.453125 1676.679688 862.171875 1525.960938 1047.808594 1525.960938 Z M3765.808594 1525.960938 C3951.449219 1525.960938 4102.171875 1676.679688 4102.171875 1862.320312 C4102.171875 2047.96875 3951.449219 2198.683594 3765.808594 2198.683594 C3580.171875 2198.683594 3429.449219 2047.96875 3429.449219 1862.320312 C3429.449219 1676.679688 3580.171875 1525.960938 3765.808594 1525.960938 Z M1047.808594 1579.960938 C891.972656 1579.960938 765.453125 1706.488281 765.453125 1862.320312 C765.453125 2018.164062 891.972656 2144.683594 1047.808594 2144.683594 C1203.648438 2144.683594 1330.171875 2018.164062 1330.171875 1862.320312 C1330.171875 1706.488281 1203.648438 1579.960938 1047.808594 1579.960938 Z M3558.640625 1670.46875 C3452.761719 1784.808594 3459.621094 1963.609375 3573.960938 2069.492188 C3688.300781 2175.382812 3867.089844 2168.519531 3972.980469 2054.179688 C4078.871094 1939.839844 4072.011719 1761.039062 3957.671875 1655.160156 C3843.328125 1549.269531 3664.53125 1556.128906 3558.640625 1670.46875 Z M1047.808594 1793.078125 C1009.601562 1793.078125 978.570312 1824.109375 978.570312 1862.320312 C978.570312 1900.539062 1009.601562 1931.558594 1047.808594 1931.558594 C1086.03125 1931.558594 1117.050781 1900.539062 1117.050781 1862.320312 C1117.050781 1824.109375 1086.03125 1793.078125 1047.808594 1793.078125 Z M3715.011719 1815.28125 C3689.039062 1843.320312 3690.730469 1887.160156 3718.769531 1913.128906 C3746.800781 1939.089844 3790.648438 1937.410156 3816.609375 1909.371094 C3842.578125 1881.328125 3840.898438 1837.488281 3812.859375 1811.519531 C3784.820312 1785.558594 3740.980469 1787.238281 3715.011719 1815.28125 Z M1047.808594 1823.078125 C1069.46875 1823.078125 1087.050781 1840.671875 1087.050781 1862.320312 C1087.050781 1883.980469 1069.46875 1901.558594 1047.808594 1901.558594 C1026.160156 1901.558594 1008.570312 1883.980469 1008.570312 1862.320312 C1008.570312 1840.671875 1026.160156 1823.078125 1047.808594 1823.078125 Z M3737.019531 1835.660156 C3751.738281 1819.769531 3776.578125 1818.820312 3792.46875 1833.53125 C3808.359375 1848.25 3809.320312 1873.101562 3794.601562 1888.988281 C3779.890625 1904.878906 3755.039062 1905.828125 3739.148438 1891.121094 C3723.261719 1876.398438 3722.308594 1851.550781 3737.019531 1835.660156 Z"/></svg>`,
  label: 'Sedan',
  filter: 'sedan',
  color: '#b8900e'
},
       {
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="645 121 5709 2855" width="44" height="22" fill="currentColor"><path fill-rule="evenodd" d="M5037.148438 1854.429688 C5110.871094 1802.589844 5200.660156 1772.160156 5297.5 1772.160156 C5394.351562 1772.160156 5484.140625 1802.589844 5557.851562 1854.429688 C5683.429688 1934.550781 5766.121094 2070.941406 5766.121094 2225.445312 C5766.121094 2379.953125 5683.429688 2516.347656 5557.851562 2596.460938 C5484.140625 2648.300781 5394.351562 2678.734375 5297.5 2678.734375 C5200.660156 2678.734375 5110.871094 2648.300781 5037.148438 2596.460938 C4911.578125 2516.347656 4828.878906 2379.953125 4828.878906 2225.445312 C4828.878906 2070.941406 4911.578125 1934.550781 5037.148438 1854.429688 Z M1056.949219 1850.949219 C1129.679688 1801.238281 1217.601562 1772.160156 1312.269531 1772.160156 C1411.390625 1772.160156 1503.121094 1804.039062 1577.75 1858.101562 C1700.160156 1938.679688 1780.371094 2073.28125 1780.371094 2225.445312 C1780.371094 2377.617188 1700.160156 2512.214844 1577.75 2592.796875 C1503.121094 2646.851562 1411.390625 2678.734375 1312.269531 2678.734375 C1217.601562 2678.734375 1129.679688 2649.652344 1056.949219 2599.945312 C928.261719 2520.339844 843.128906 2382.21875 843.128906 2225.445312 C843.128906 2068.671875 928.261719 1930.550781 1056.949219 1850.949219 Z M5409.441406 2549.324219 C5408.609375 2548.074219 5407.859375 2546.769531 5407.191406 2545.417969 L5318.371094 2365.503906 C5314.679688 2358.039062 5306.699219 2353.421875 5298.019531 2353.421875 C5289.351562 2353.421875 5281.371094 2358.039062 5277.679688 2365.503906 C5248.769531 2424.070312 5207.890625 2506.859375 5188.851562 2545.417969 C5188.128906 2546.875 5187.320312 2548.277344 5186.410156 2549.613281 C5221.25 2561.566406 5258.628906 2568.058594 5297.5 2568.058594 C5336.699219 2568.058594 5374.371094 2561.460938 5409.441406 2549.324219 Z M1423.789062 2549.46875 C1422.921875 2548.175781 1422.128906 2546.820312 1421.441406 2545.417969 L1332.609375 2365.503906 C1328.929688 2358.039062 1320.941406 2353.421875 1312.269531 2353.421875 C1303.601562 2353.421875 1295.621094 2358.039062 1291.929688 2365.503906 C1263.011719 2424.070312 1222.140625 2506.859375 1203.101562 2545.417969 C1202.410156 2546.820312 1201.621094 2548.175781 1200.761719 2549.46875 C1235.730469 2561.515625 1273.238281 2568.058594 1312.269531 2568.058594 C1351.300781 2568.058594 1388.808594 2561.515625 1423.789062 2549.46875 Z M5629.058594 2312.046875 C5628.859375 2307.578125 5625.308594 2303.703125 5620.46875 2302.625 C5577.359375 2293.027344 5483.78125 2272.195312 5418.570312 2257.675781 C5400.550781 2253.664062 5386.628906 2240.132812 5382.449219 2222.992188 C5378.210938 2205.617188 5384.601562 2187.417969 5399.121094 2176.125 C5451.808594 2135.140625 5527.929688 2075.929688 5562.269531 2049.230469 C5566.410156 2046 5567.210938 2040.230469 5563.910156 2036.199219 C5561.960938 2033.820312 5559.058594 2032.339844 5555.910156 2032 C5552.691406 2031.660156 5549.441406 2032.53125 5546.929688 2034.480469 C5512.421875 2061.328125 5439.308594 2118.191406 5387.488281 2158.5 C5373.191406 2169.625 5353.429688 2171.960938 5336.730469 2164.4375 C5319.648438 2156.738281 5308.910156 2140.261719 5308.910156 2122.289062 C5308.910156 2056.738281 5308.910156 1963.210938 5308.910156 1920.621094 C5308.910156 1918.121094 5307.820312 1915.75 5305.960938 1913.980469 C5303.859375 1911.980469 5300.988281 1910.898438 5298.019531 1910.898438 C5295.050781 1910.898438 5292.191406 1911.980469 5290.089844 1913.980469 C5288.230469 1915.75 5287.128906 1918.121094 5287.128906 1920.621094 C5287.128906 1963.210938 5287.128906 2056.738281 5287.128906 2122.289062 C5287.128906 2140.261719 5276.398438 2156.738281 5259.308594 2164.4375 C5242.621094 2171.960938 5222.859375 2169.625 5208.558594 2158.5 C5156.730469 2118.191406 5083.628906 2061.328125 5049.109375 2034.480469 C5046.601562 2032.53125 5043.359375 2031.660156 5040.140625 2032 C5036.988281 2032.339844 5034.078125 2033.820312 5032.140625 2036.199219 C5028.839844 2040.230469 5029.628906 2046 5033.78125 2049.230469 C5068.109375 2075.929688 5144.230469 2135.140625 5196.929688 2176.125 C5211.441406 2187.417969 5217.828125 2205.617188 5213.601562 2222.992188 C5209.421875 2240.132812 5195.5 2253.664062 5177.480469 2257.675781 C5112.269531 2272.195312 5018.679688 2293.027344 4975.578125 2302.625 C4969.871094 2303.894531 4965.949219 2309.0625 4967.21875 2314.503906 C4967.859375 2317.238281 4969.679688 2319.570312 4972.171875 2321.054688 C4974.921875 2322.695312 4978.238281 2323.203125 4981.390625 2322.5 C5024.589844 2312.882812 5116.511719 2292.421875 5181.238281 2278.011719 C5199.140625 2274.023438 5217.828125 2280.226562 5229.398438 2293.808594 C5241.320312 2307.800781 5243.730469 2327.050781 5235.679688 2343.351562 C5206.378906 2402.703125 5164.160156 2488.214844 5145.210938 2526.582031 C5144.339844 2528.355469 5144.140625 2530.246094 5144.5 2532.027344 C5149.5 2534.53125 5154.570312 2536.914062 5159.710938 2539.175781 C5162.289062 2538.1875 5164.429688 2536.351562 5165.621094 2533.945312 C5184.648438 2495.390625 5225.53125 2412.597656 5254.441406 2354.03125 C5262.390625 2337.933594 5279.320312 2327.503906 5298.019531 2327.503906 C5316.730469 2327.503906 5333.648438 2337.933594 5341.601562 2354.03125 L5430.429688 2533.945312 C5431.539062 2536.183594 5433.460938 2537.925781 5435.800781 2538.953125 C5441.160156 2536.585938 5446.441406 2534.085938 5451.640625 2531.457031 C5451.859375 2529.847656 5451.621094 2528.167969 5450.828125 2526.582031 C5431.890625 2488.214844 5389.671875 2402.703125 5360.371094 2343.351562 C5352.320312 2327.050781 5354.730469 2307.800781 5366.648438 2293.808594 C5378.21875 2280.226562 5396.910156 2274.023438 5414.808594 2278.011719 C5479.539062 2292.421875 5571.449219 2312.882812 5614.648438 2322.5 C5617.808594 2323.203125 5621.128906 2322.695312 5623.871094 2321.054688 C5625.410156 2320.136719 5626.699219 2318.894531 5627.601562 2317.4375 C5628.101562 2315.644531 5628.589844 2313.847656 5629.058594 2312.046875 Z M1465.851562 2531.742188 C1466.128906 2530.042969 1465.910156 2528.261719 1465.078125 2526.582031 C1446.140625 2488.214844 1403.921875 2402.703125 1374.609375 2343.351562 C1366.558594 2327.050781 1368.96875 2307.800781 1380.890625 2293.808594 C1392.46875 2280.226562 1411.160156 2274.023438 1429.058594 2278.011719 C1493.789062 2292.421875 1585.699219 2312.882812 1628.898438 2322.5 C1632.050781 2323.203125 1635.378906 2322.695312 1638.121094 2321.054688 C1640.609375 2319.570312 1642.429688 2317.238281 1643.070312 2314.507812 C1644.339844 2309.0625 1640.429688 2303.894531 1634.71875 2302.625 C1591.609375 2293.027344 1498.019531 2272.195312 1432.808594 2257.675781 C1414.800781 2253.664062 1400.878906 2240.132812 1396.691406 2222.992188 C1392.460938 2205.617188 1398.851562 2187.417969 1413.371094 2176.125 C1466.058594 2135.140625 1542.179688 2075.929688 1576.511719 2049.230469 C1580.660156 2046 1581.449219 2040.230469 1578.160156 2036.199219 C1576.210938 2033.820312 1573.308594 2032.339844 1570.160156 2032 C1566.929688 2031.660156 1563.691406 2032.53125 1561.179688 2034.480469 C1526.660156 2061.328125 1453.558594 2118.191406 1401.738281 2158.5 C1387.429688 2169.625 1367.679688 2171.960938 1350.980469 2164.4375 C1333.890625 2156.738281 1323.160156 2140.261719 1323.160156 2122.289062 C1323.160156 2056.738281 1323.160156 1963.210938 1323.160156 1920.621094 C1323.160156 1918.121094 1322.058594 1915.75 1320.210938 1913.980469 C1318.109375 1911.980469 1315.238281 1910.898438 1312.269531 1910.898438 C1309.300781 1910.898438 1306.441406 1911.980469 1304.339844 1913.980469 C1302.480469 1915.75 1301.378906 1918.121094 1301.378906 1920.621094 C1301.378906 1963.210938 1301.378906 2056.738281 1301.378906 2122.289062 C1301.378906 2140.261719 1290.640625 2156.738281 1273.558594 2164.4375 C1256.859375 2171.960938 1237.109375 2169.625 1222.808594 2158.5 C1170.980469 2118.191406 1097.878906 2061.328125 1063.359375 2034.480469 C1060.851562 2032.53125 1057.609375 2031.660156 1054.378906 2032 C1051.230469 2032.339844 1048.328125 2033.820312 1046.390625 2036.199219 C1043.089844 2040.230469 1043.878906 2046 1048.03125 2049.230469 C1082.359375 2075.929688 1158.480469 2135.140625 1211.171875 2176.125 C1225.691406 2187.417969 1232.078125 2205.617188 1227.839844 2222.992188 C1223.671875 2240.132812 1209.738281 2253.664062 1191.730469 2257.675781 C1126.519531 2272.195312 1032.929688 2293.027344 989.824219 2302.625 C984.113281 2303.894531 980.195312 2309.0625 981.46875 2314.503906 C982.109375 2317.238281 983.929688 2319.570312 986.417969 2321.054688 C989.164062 2322.695312 992.484375 2323.203125 995.640625 2322.5 C1038.839844 2312.882812 1130.75 2292.421875 1195.480469 2278.011719 C1213.390625 2274.023438 1232.070312 2280.226562 1243.640625 2293.808594 C1255.570312 2307.800781 1257.980469 2327.050781 1249.929688 2343.351562 C1220.621094 2402.703125 1178.398438 2488.214844 1159.460938 2526.582031 C1158.628906 2528.261719 1158.410156 2530.042969 1158.691406 2531.742188 C1163.800781 2534.308594 1168.980469 2536.753906 1174.230469 2539.066406 C1176.691406 2538.054688 1178.71875 2536.265625 1179.859375 2533.945312 C1198.898438 2495.390625 1239.78125 2412.597656 1268.691406 2354.03125 C1276.640625 2337.933594 1293.570312 2327.503906 1312.269531 2327.503906 C1330.96875 2327.503906 1347.898438 2337.933594 1355.851562 2354.03125 L1444.679688 2533.945312 C1445.820312 2536.265625 1447.859375 2538.054688 1450.308594 2539.066406 C1455.570312 2536.75 1460.75 2534.304688 1465.851562 2531.742188 Z M5120.429688 2518.742188 C5120.871094 2517.519531 5121.378906 2516.308594 5121.980469 2515.109375 C5140.921875 2476.742188 5183.140625 2391.230469 5212.441406 2331.878906 C5215.898438 2324.878906 5214.789062 2316.625 5209.671875 2310.617188 C5204.199219 2304.199219 5195.328125 2301.421875 5186.871094 2303.304688 C5122.140625 2317.714844 5030.230469 2338.175781 4987.03125 2347.796875 C4983.96875 2348.476562 4980.859375 2348.777344 4977.769531 2348.707031 C5005.269531 2419.914062 5055.890625 2479.667969 5120.429688 2518.742188 Z M1632 2348.714844 C1629.089844 2348.742188 1626.148438 2348.4375 1623.269531 2347.792969 C1580.070312 2338.175781 1488.160156 2317.714844 1423.429688 2303.304688 C1414.96875 2301.421875 1406.089844 2304.199219 1400.621094 2310.617188 C1395.5 2316.625 1394.390625 2324.878906 1397.851562 2331.878906 C1427.148438 2391.230469 1469.371094 2476.742188 1488.320312 2515.109375 C1488.871094 2516.222656 1489.351562 2517.351562 1489.769531 2518.484375 C1554.089844 2479.425781 1604.550781 2419.78125 1632 2348.714844 Z M1134.769531 2518.484375 C1135.191406 2517.351562 1135.671875 2516.222656 1136.21875 2515.109375 C1155.171875 2476.742188 1197.390625 2391.230469 1226.691406 2331.878906 C1230.148438 2324.878906 1229.039062 2316.625 1223.921875 2310.617188 C1218.449219 2304.199219 1209.570312 2301.421875 1201.121094 2303.304688 C1136.390625 2317.714844 1044.46875 2338.175781 1001.269531 2347.796875 C998.386719 2348.4375 995.457031 2348.742188 992.539062 2348.714844 C1019.988281 2419.777344 1070.460938 2479.425781 1134.769531 2518.484375 Z M5617.230469 2348.71875 C5614.488281 2348.703125 5611.730469 2348.398438 5609.019531 2347.792969 C5565.820312 2338.175781 5473.910156 2317.714844 5409.179688 2303.304688 C5400.71875 2301.421875 5391.839844 2304.199219 5386.378906 2310.617188 C5381.261719 2316.625 5380.148438 2324.878906 5383.601562 2331.878906 C5412.910156 2391.230469 5455.128906 2476.742188 5474.070312 2515.109375 C5474.578125 2516.140625 5475.03125 2517.179688 5475.429688 2518.226562 C5539.550781 2479.148438 5589.851562 2419.613281 5617.230469 2348.71875 Z M873.011719 1406.488281 C872.570312 1405.230469 872.167969 1403.640625 871.929688 1401.78125 C871.277344 1396.609375 871.386719 1386.300781 871.621094 1381.550781 C872.46875 1364.628906 874.914062 1327.101562 878.738281 1300.011719 C888.878906 1228.25 910.652344 1156.101562 951.570312 1095.578125 C1000.660156 1022.960938 1120.5 915.320312 1174.761719 860.160156 C1191.300781 843.339844 1211.378906 828.601562 1230.25 813.339844 C1247.519531 799.359375 1263.800781 785.019531 1274.378906 767.550781 C1280.5 757.449219 1282.820312 744.410156 1283.558594 730.261719 C1284.808594 706.160156 1281.171875 679.019531 1278.949219 655.21875 C1277.328125 637.800781 1276.5 622.011719 1278.210938 609.929688 C1279.738281 599.148438 1283.421875 590.808594 1288.921875 585.269531 C1301.808594 572.289062 1330.511719 562.988281 1367.980469 557.488281 C1447 545.878906 1567.328125 547.46875 1639.5 538.140625 C1731.449219 526.25 1822.710938 508.5 1915.210938 501.539062 C2050.570312 491.351562 2272.75 476.210938 2451.828125 477 C2738.328125 478.261719 3251.761719 417.410156 3633.890625 509.410156 C4036.199219 606.261719 4624.21875 952.929688 4866.769531 1058.21875 C4938.460938 1089.328125 5010.78125 1120.851562 5086.929688 1140.101562 C5222.058594 1174.261719 5495.238281 1177.171875 5674.550781 1262.511719 C5773.320312 1309.511719 5904.730469 1354.359375 6020.570312 1420.289062 C6139.128906 1487.761719 6241.25 1577.269531 6278.488281 1711.828125 C6300.339844 1790.769531 6296.691406 1869.398438 6285.710938 1947.75 C6275 2024.121094 6257.320312 2100.21875 6250.78125 2176.074219 C6247.140625 2218.316406 6262.871094 2275.8125 6282.601562 2329.691406 C6312.921875 2412.484375 6353.339844 2486.761719 6353.339844 2486.761719 L6341.960938 2505.910156 L5811.671875 2505.910156 L5813.351562 2491.457031 C5813.351562 2491.457031 5836.800781 2291.4375 5830.898438 2231.117188 C5815.609375 2074.71875 5765.730469 1947.921875 5678.070312 1860.378906 C5590.660156 1773.089844 5465.808594 1725.21875 5301.429688 1725.21875 C5136.769531 1725.21875 5006.839844 1764.941406 4914.789062 1848.308594 C4822.738281 1931.671875 4768.941406 2058.378906 4755.140625 2230.890625 C4749.089844 2306.539062 4785.738281 2456.871094 4789.058594 2486.367188 C4789.609375 2491.226562 4789.210938 2494.488281 4788.808594 2495.957031 C4787.851562 2499.445312 4785.988281 2501.527344 4784.410156 2502.847656 C4782.058594 2504.804688 4779.421875 2505.769531 4776.550781 2505.898438 C4711.460938 2508.847656 1876.839844 2505.910156 1876.839844 2505.910156 L1866.191406 2505.902344 L1864.140625 2495.460938 C1864.140625 2495.460938 1809.890625 2219.476562 1809.671875 2180.980469 C1808.398438 1964.449219 1601.339844 1742.839844 1303.019531 1735.710938 C1153.171875 1732.128906 1026.621094 1776.578125 939.40625 1861.199219 C852.320312 1945.691406 804.789062 2070.039062 811.773438 2225.359375 C813.058594 2253.941406 826.421875 2342.851562 830.183594 2396.601562 C830.617188 2402.785156 828.386719 2406.476562 826.574219 2408.542969 C824.332031 2411.105469 821.53125 2412.632812 818.183594 2413.140625 C815.789062 2413.503906 812.699219 2413.375 809.1875 2411.644531 C807.109375 2410.617188 804.085938 2408.429688 800.652344 2404.796875 C781.039062 2384.03125 728.21875 2297.984375 712.191406 2252.855469 C685.277344 2177.058594 645.109375 2052.589844 645.085938 1949.140625 C645.058594 1839.449219 673.660156 1687.199219 712.296875 1594.679688 C732.367188 1546.621094 788.097656 1500.210938 829.851562 1460.441406 C845.210938 1445.820312 858.53125 1432.191406 866.660156 1419.628906 C869.660156 1414.988281 871.976562 1410.648438 873.011719 1406.488281 Z M6320.578125 2479.996094 C6306.421875 2452.199219 6279.839844 2397.511719 6258.269531 2338.605469 C6237.121094 2280.875 6221.058594 2219.109375 6224.960938 2173.847656 C6231.539062 2097.539062 6249.28125 2020.980469 6260.039062 1944.148438 C6270.53125 1869.300781 6274.390625 1794.171875 6253.519531 1718.738281 C6218.171875 1591.011719 6120.300781 1506.859375 6007.75 1442.808594 C5892.488281 1377.210938 5761.691406 1332.671875 5663.421875 1285.910156 C5485.609375 1201.289062 5214.570312 1199.101562 5080.578125 1165.21875 C5003.070312 1145.628906 4929.410156 1113.660156 4856.449219 1081.988281 C4614.710938 977.050781 4028.800781 631.128906 3627.828125 534.601562 C3247.628906 443.070312 2736.769531 504.171875 2451.710938 502.921875 C2273.320312 502.128906 2052 517.230469 1917.160156 527.378906 C1825.109375 534.308594 1734.308594 552.011719 1642.820312 563.839844 C1570.78125 573.160156 1450.640625 571.539062 1371.738281 583.128906 C1352.550781 585.949219 1335.921875 589.519531 1323.320312 594.378906 C1316.449219 597.03125 1310.910156 599.898438 1307.308594 603.53125 C1304.28125 606.578125 1303.808594 612 1303.371094 618.519531 C1302.730469 628.25 1303.570312 640.03125 1304.761719 652.820312 C1307.078125 677.800781 1310.75 706.300781 1309.441406 731.609375 C1308.460938 750.410156 1304.679688 767.550781 1296.550781 780.96875 C1284.488281 800.890625 1266.238281 817.550781 1246.550781 833.488281 C1228.441406 848.128906 1209.109375 862.191406 1193.230469 878.328125 C1139.769531 932.691406 1021.421875 1038.519531 973.039062 1110.089844 C934.320312 1167.359375 913.992188 1235.738281 904.398438 1303.640625 C900.683594 1329.949219 898.324219 1366.410156 897.507812 1382.839844 C897.3125 1386.691406 897.679688 1398.789062 897.679688 1398.789062 C897.679688 1398.789062 893.902344 1392.789062 892.609375 1391.949219 C889.902344 1390.210938 887.035156 1389.648438 884.066406 1390.039062 C882.050781 1390.308594 877.453125 1390.671875 874.792969 1396.5 L899.539062 1401.878906 C899.539062 1411.679688 895.722656 1422.429688 888.414062 1433.710938 C879.386719 1447.660156 864.78125 1462.96875 847.726562 1479.210938 C808.445312 1516.621094 755.089844 1559.449219 736.210938 1604.671875 C698.664062 1694.570312 670.976562 1842.539062 671 1949.140625 C671.023438 2049.660156 710.457031 2170.527344 736.613281 2244.1875 C747.910156 2276.003906 778.554688 2329.351562 801.085938 2362.554688 C795.6875 2311.167969 786.914062 2249.472656 785.882812 2226.523438 C778.515625 2062.648438 829.480469 1931.738281 921.359375 1842.601562 C1013.109375 1753.578125 1145.988281 1706.039062 1303.640625 1709.800781 C1617.890625 1717.308594 1834.25 1952.738281 1835.578125 2180.828125 C1835.78125 2214.28125 1877.671875 2429.824219 1887.511719 2480.007812 C2070.25 2480.195312 4548.980469 2482.6875 4761.96875 2480.261719 C4754.53125 2436.140625 4723.609375 2300.007812 4729.308594 2228.824219 C4743.738281 2048.378906 4801.109375 1916.289062 4897.390625 1829.101562 C4993.660156 1741.910156 5129.21875 1699.308594 5301.429688 1699.308594 C5473.941406 1699.308594 5604.648438 1750.429688 5696.378906 1842.039062 C5787.871094 1933.390625 5840.730469 2065.378906 5856.691406 2228.597656 C5861.75 2280.265625 5845.929688 2432.34375 5840.699219 2479.996094 Z M5004.570312 2047.769531 C4973.050781 2099.601562 4954.890625 2160.417969 4954.890625 2225.445312 C4954.890625 2244.488281 4956.449219 2263.167969 4959.441406 2281.347656 C4962.621094 2279.550781 4966.140625 2278.175781 4969.941406 2277.328125 C5013.050781 2267.734375 5106.640625 2246.898438 5171.851562 2232.382812 C5180.019531 2230.5625 5186.53125 2224.628906 5188.421875 2216.851562 C5190.261719 2209.3125 5187.308594 2201.480469 5181.011719 2196.578125 C5128.320312 2155.59375 5052.199219 2096.390625 5017.871094 2069.679688 C5010.488281 2063.941406 5006 2056.078125 5004.570312 2047.769531 Z M1018.941406 2048.429688 C987.667969 2100.089844 969.660156 2160.683594 969.660156 2225.445312 C969.660156 2244.394531 971.199219 2262.984375 974.164062 2281.085938 C977.21875 2279.414062 980.578125 2278.132812 984.191406 2277.328125 C1027.300781 2267.734375 1120.890625 2246.898438 1186.089844 2232.382812 C1194.269531 2230.5625 1200.769531 2224.628906 1202.671875 2216.851562 C1204.511719 2209.3125 1201.558594 2201.480469 1195.261719 2196.578125 C1142.570312 2155.59375 1066.449219 2096.390625 1032.121094 2069.679688 C1024.929688 2064.089844 1020.488281 2056.5 1018.941406 2048.429688 Z M1605.601562 2048.429688 C1604.050781 2056.5 1599.609375 2064.089844 1592.421875 2069.679688 C1558.089844 2096.390625 1481.96875 2155.59375 1429.28125 2196.578125 C1422.980469 2201.480469 1420.03125 2209.3125 1421.871094 2216.851562 C1423.769531 2224.628906 1430.28125 2230.5625 1438.449219 2232.382812 C1503.660156 2246.898438 1597.238281 2267.734375 1640.351562 2277.328125 C1643.960938 2278.132812 1647.320312 2279.414062 1650.378906 2281.085938 C1653.339844 2262.984375 1654.878906 2244.394531 1654.878906 2225.445312 C1654.878906 2160.683594 1636.871094 2100.089844 1605.601562 2048.429688 Z M5591.230469 2049.070312 C5589.570312 2056.898438 5585.171875 2064.238281 5578.179688 2069.679688 C5543.839844 2096.390625 5467.71875 2155.59375 5415.03125 2196.578125 C5408.730469 2201.480469 5405.789062 2209.3125 5407.628906 2216.851562 C5409.519531 2224.628906 5416.03125 2230.5625 5424.199219 2232.382812 C5489.410156 2246.898438 5582.988281 2267.734375 5626.101562 2277.328125 C5629.53125 2278.09375 5632.730469 2279.28125 5635.648438 2280.828125 C5638.589844 2262.796875 5640.109375 2244.300781 5640.109375 2225.445312 C5640.109375 2160.964844 5622.261719 2100.621094 5591.230469 2049.070312 Z M5561 2006.550781 C5498.128906 1930.980469 5403.390625 1882.839844 5297.5 1882.839844 C5191.5 1882.839844 5096.671875 1931.078125 5033.820312 2006.78125 C5034.988281 2006.539062 5036.179688 2006.359375 5037.378906 2006.230469 C5047.320312 2005.171875 5057.28125 2008 5065.019531 2014.019531 C5099.539062 2040.871094 5172.640625 2097.730469 5224.46875 2138.039062 C5231.289062 2143.351562 5240.710938 2144.398438 5248.660156 2140.808594 C5256.230469 2137.398438 5261.21875 2130.25 5261.21875 2122.289062 C5261.21875 2056.738281 5261.21875 1963.210938 5261.21875 1920.621094 C5261.21875 1911.089844 5265.148438 1901.941406 5272.230469 1895.199219 C5279.078125 1888.691406 5288.339844 1884.988281 5298.019531 1884.988281 C5307.710938 1884.988281 5316.96875 1888.691406 5323.820312 1895.199219 C5330.898438 1901.941406 5334.828125 1911.089844 5334.828125 1920.621094 C5334.828125 1963.210938 5334.828125 2056.738281 5334.828125 2122.289062 C5334.828125 2130.25 5339.808594 2137.398438 5347.378906 2140.808594 C5355.339844 2144.398438 5364.761719 2143.351562 5371.578125 2138.039062 C5423.398438 2097.730469 5496.5 2040.871094 5531.019531 2014.019531 C5538.769531 2008 5548.730469 2005.171875 5558.671875 2006.230469 C5559.449219 2006.320312 5560.230469 2006.421875 5561 2006.550781 Z M1575.859375 2006.660156 C1513 1931.03125 1418.21875 1882.839844 1312.269531 1882.839844 C1206.320312 1882.839844 1111.539062 1931.03125 1048.691406 2006.660156 C1049.648438 2006.480469 1050.640625 2006.339844 1051.621094 2006.230469 C1061.558594 2005.171875 1071.53125 2008 1079.269531 2014.019531 C1113.789062 2040.871094 1186.890625 2097.730469 1238.71875 2138.039062 C1245.53125 2143.351562 1254.960938 2144.398438 1262.910156 2140.808594 C1270.480469 2137.398438 1275.460938 2130.25 1275.460938 2122.289062 C1275.460938 2056.738281 1275.460938 1963.210938 1275.460938 1920.621094 C1275.460938 1911.089844 1279.390625 1901.941406 1286.480469 1895.199219 C1293.320312 1888.691406 1302.589844 1884.988281 1312.269531 1884.988281 C1321.949219 1884.988281 1331.21875 1888.691406 1338.058594 1895.199219 C1345.148438 1901.941406 1349.078125 1911.089844 1349.078125 1920.621094 C1349.078125 1963.210938 1349.078125 2056.738281 1349.078125 2122.289062 C1349.078125 2130.25 1354.058594 2137.398438 1361.628906 2140.808594 C1369.589844 2144.398438 1379.011719 2143.351562 1385.828125 2138.039062 C1437.648438 2097.730469 1510.75 2040.871094 1545.269531 2014.019531 C1553.011719 2008 1562.980469 2005.171875 1572.921875 2006.230469 C1573.910156 2006.339844 1574.890625 2006.480469 1575.859375 2006.660156 Z M5529.648438 1318.960938 C5601.011719 1378.671875 5825.898438 1529 6111.691406 1715.269531 C6129.609375 1726.949219 6175.871094 1628.351562 6053.230469 1530.699219 C5972.679688 1466.558594 5770.839844 1392.320312 5683.570312 1357.03125 C5634.941406 1337.359375 5487.921875 1284.039062 5529.648438 1318.960938 Z M2660.351562 654.019531 L2661.660156 565.371094 L2674.378906 565.320312 C2674.378906 565.320312 3449.488281 562.53125 3809.378906 679.890625 C3906.378906 711.519531 4028.839844 767.898438 4157.601562 834.441406 C4548.25 1002.660156 4856.511719 1206.058594 4934.820312 1291.269531 C4956.769531 1305.390625 4968.890625 1313.328125 4968.890625 1313.328125 L4960.71875 1337.078125 L4944.039062 1335.699219 L4943.960938 1335.738281 C4938.109375 1338.878906 4931.640625 1340.78125 4925.210938 1342.28125 C4916.550781 1344.300781 4907.71875 1345.558594 4898.890625 1346.53125 C4885.808594 1347.96875 4872.660156 1348.710938 4859.519531 1349.160156 C4843.550781 1349.699219 4827.578125 1349.78125 4811.609375 1349.609375 C4790.710938 1349.398438 4769.808594 1348.75 4748.921875 1347.871094 C4725.738281 1346.890625 4702.578125 1345.609375 4679.429688 1344.148438 C4627.101562 1340.839844 4574.820312 1336.628906 4522.589844 1332.011719 C4441.25 1324.828125 4360.011719 1316.648438 4278.800781 1308.089844 C4187.539062 1298.480469 4096.339844 1288.359375 4005.160156 1278.070312 C3903.28125 1266.570312 3801.429688 1254.839844 3699.578125 1243.109375 C3589.128906 1230.398438 3478.691406 1217.691406 3368.21875 1205.140625 L3363.089844 1204.558594 L2653.050781 1145.660156 L2653.320312 1127.871094 C2643.660156 1126.890625 2633.960938 1125.921875 2624.25 1124.949219 Z M1502.019531 923.851562 L1499.828125 910.949219 C1500.820312 916.78125 1504.761719 923.679688 1512.960938 930.429688 C1525.441406 940.679688 1550 952.691406 1584.300781 965.289062 C1770.398438 1033.609375 2254.230469 1128.480469 2571.390625 1137.898438 L2584.511719 1138.289062 L2594.160156 565.699219 L2581.378906 565.308594 C2581.378906 565.308594 2258.261719 555.410156 1761.71875 713 C1700.179688 732.53125 1614.429688 765.238281 1558.769531 806.679688 C1517.789062 837.179688 1493.371094 873.070312 1499.828125 910.949219 Z M2083.390625 653.378906 C1989.351562 673.96875 1884.121094 701.339844 1769.558594 737.699219 C1710.378906 756.488281 1627.769531 787.621094 1574.238281 827.460938 C1572.828125 828.519531 1571.429688 829.570312 1570.050781 830.640625 C1667.570312 775.261719 1873.828125 705.550781 2083.390625 653.378906"/></svg>`,
  label: 'Hatchback',
  filter: 'hatchback',
  color: '#b8900e'
},
        {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18"/><rect x="5" y="6" width="8" height="4" rx="0.5"/><path d="M15 7l3.5 1.5V16a1.5 1.5 0 0 1-3 0V9"/><line x1="2" y1="22" x2="20" y2="22"/></svg>`,
          label:'Petrol', filter:'petrol', color:'#1a6b2a'
        },
        {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"/><line x1="12" y1="12" x2="12" y2="15"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>`,
          label:'Diesel', filter:'diesel', color:'#444'
        },


        {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
          label:'Hybrid', filter:'hybrid', color:'#6b35c7'
        },
        
        {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M11 3L7.5 9 12 22M13 3l3.5 6L12 22"/></svg>`,
          label:'Luxury', filter:'luxury', color:'#9b7f4a'
        },
        {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20 L8.5 8 L12 13 L15.5 7 L21 20 Z"/><path d="M1 20h22"/><path d="M9.5 20 a2.5 2.5 0 0 1 5 0"/></svg>`,
          label:'Off-Road', filter:'suv', color:'#5a3e2b'
        },
        {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 28" width="38" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18 L2 6 L5 4 L37 4 L44 8 L46 13 L46 18 Q42 24 36 24 Q30 24 27 18 L21 18 Q18 24 12 24 Q6 24 2 18 Z"/><circle cx="12" cy="23" r="3.5"/><circle cx="36" cy="23" r="3.5"/><line x1="19" y1="4" x2="19" y2="18"/><line x1="33" y1="4" x2="33" y2="18"/></svg>`,
          label:'Family MPV', filter:'hybrid', color:'#0e8577'
        },
      ].map(c=>`<div class="strip-item" onclick="AV.goTo('cars',{filter:'${c.filter}'})">
        <div class="strip-icon" style="background:${c.color}18;color:${c.color};display:flex;align-items:center;justify-content:center;">${c.svg}</div>
        <span class="strip-label">${c.label}</span>
      </div>`).join('')}
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
      <div class="cars-grid" id="home-grid">${db.map(c=>carCard(c)).join('')}</div>
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

<div class="feature-banner">
  <div class="banner-inner">

    <!-- LEFT -->
    <div class="banner-left">
      <div class="badge"><span class="badge-dot"></span> NEW FEATURE</div>
      <h2 class="banner-title">What Car Can<br>You <span>Afford?</span></h2>
      <p class="banner-desc">Enter your monthly salary and we'll instantly show you which cars fit your budget — with EMI plans, down payment breakdowns, and smart recommendations for Nepal.</p>
      <a href="#" class="btn-primary"><span class="btn-icon">◎</span> Try Salary Test &nbsp;→</a>
      <div class="stats-row">
        <div class="stat-item"><div class="stat-num">500<em>+</em></div><div class="stat-label">Cars<br>Listed</div></div>
        <div class="stat-item"><div class="stat-num">50<em>+</em></div><div class="stat-label">Top<br>Brands</div></div>
        <div class="stat-item"><div class="stat-num">10K<em>+</em></div><div class="stat-label">Happy<br>Buyers</div></div>
        <div class="stat-item"><div class="stat-num">4.8<em>★</em></div><div class="stat-label">Avg Rating</div></div>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="banner-right">
      <div class="salary-label">Salary → Car Matches</div>
      <div class="car-card">
        <div class="card-top"><span class="card-salary">RS. 40K–60K / MO</span><span class="badge-popular">POPULAR</span></div>
        <div class="card-name">Suzuki Swift · Alto K10</div>
        <div class="card-range range-gold">Rs. 28L – 46L range</div>
        <div class="progress-track"><div class="progress-fill fill-gold"></div></div>
      </div>
      <div class="car-card">
        <div class="card-top"><span class="card-salary">RS. 80K–1.2L / MO</span><span class="badge-mid">MID RANGE</span></div>
        <div class="card-name">Hyundai Creta · Kia Seltos</div>
        <div class="card-range range-green">Rs. 48L – 75L range</div>
        <div class="progress-track"><div class="progress-fill fill-green-mid"></div></div>
      </div>
      <div class="car-card">
        <div class="card-top"><span class="card-salary">RS. 1.5L+ / MO</span><span class="badge-ev">EV / PREMIUM</span></div>
        <div class="card-name">Riddara RD6 · Grand Vitara</div>
        <div class="card-range range-green">Rs. 80L – 1Cr+ range</div>
        <div class="progress-track"><div class="progress-fill fill-green-ev"></div></div>
      </div>
    </div>

  </div>

  <!-- FOOTER STRIP -->
  <div class="banner-footer">
    <div class="footer-tip"> <strong>Banks recommend:</strong> keep EMI under 40% of monthly take-home pay</div>
    <button class="btn-how">How it works ↗</button>
  </div>
</div>

 <section class="section offers-section">
  <div class="wrap">
    <div class="sec-hd" style="text-align:center;flex-direction:column;align-items:center">
      <div class="sec-hd-left" style="align-items:center">
        <div class="eyebrow" style="justify-content:center">Current Promotions</div>
        <h2 class="sec-title">Exclusive Offers & Deals</h2>
        <div class="sec-sub">Benefits you get when you buy through AutoViindu</div>
      </div>
    </div>
    <div class="offers-scroll-wrap">
      <div class="offers-chip-rail">
        ${OFFERS.map(o => `
          <div class="offer-chip" onclick="AV.goTo('cars')">
            <div class="offer-chip-icon" style="background:${o.iconBg};color:${o.color}">${o.icon}</div>
            <span class="offer-chip-lbl">${o.title}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</section>

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
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="28" height="28"><rect x="2" y="3" width="8" height="18" rx="1.5"/><rect x="14" y="3" width="8" height="18" rx="1.5"/><line x1="11" y1="12" x2="13" y2="12"/></svg>
        </div>
        <div class="compare-promo-text">
          <div class="compare-promo-title">Compare Cars Side-by-Side</div>
          <div class="compare-promo-sub">Up to 3 cars at once — specs, prices, variants, pros & cons. Make the smarter choice with AutoViindu Compare.</div>
        </div>
        <button onclick="AV.goTo('compare')" class="btn btn-primary">Compare Now</button>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g3)" stroke-width="1.8" width="22" height="22"><rect x="4" y="3" width="16" height="18" rx="2"/><polyline points="8 9 16 9"/><polyline points="8 13 16 13"/><polyline points="8 17 12 17"/></svg>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g3)" stroke-width="1.8" width="22" height="22"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l2.9-2.9a5 5 0 0 1-5.9 7.4L7.4 20.3a2.12 2.12 0 0 1-3-3l6.2-6.2a5 5 0 0 1 7.4-5.9l-2.9 2.9z"/></svg>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g3)" stroke-width="1.8" width="22" height="22"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g3)" stroke-width="1.8" width="22" height="22"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="7" y1="15" x2="10" y2="15"/><line x1="14" y1="15" x2="17" y2="15"/></svg>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g3)" stroke-width="1.8" width="22" height="22"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
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
            <button class="dp-tab" onclick="AV.dpTab(this,'pane-pc')">Pros &amp; Cons</button>
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
              <div class="dp-pc-title" style="color:#16a34a">What we love</div>
              ${car.pros.map(p=>`
                <div class="dp-pc-item">
                  <span style="color:#16a34a;flex-shrink:0">${IC.check}</span>${p}
                </div>`).join('')}
            </div>
            <div class="dp-cons">
              <div class="dp-pc-title" style="color:#dc2626">Could be better</div>
              ${car.cons.map(c=>`
                <div class="dp-pc-item">
                  <span style="color:#dc2626;flex-shrink:0">${IC.x}</span>${c}
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

/* ─ CARS LISTING ─ */
function renderCars(filter,opts={}){
  clearInterval(heroTimer);
  document.title='New Cars Nepal — AutoViindu';
  let cars=CARS_DB;
  const fm={electric:c=>c.type==='Electric',hybrid:c=>c.type==='Hybrid',petrol:c=>c.type==='Petrol',diesel:c=>c.type==='Diesel',suv:c=>c.body==='SUV',sedan:c=>c.body==='Sedan',hatchback:c=>c.body==='Hatchback'};
  if(filter&&fm[filter])cars=cars.filter(fm[filter]);
  if(opts.brand)cars=cars.filter(c=>c.brand.toLowerCase()===opts.brand.toLowerCase());
  if(opts.q){const q=opts.q.toLowerCase();cars=cars.filter(c=>`${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase().includes(q))}
  const fl={electric:'Electric Cars',hybrid:'Hybrid Cars',petrol:'Petrol Cars',diesel:'Diesel Cars',suv:'SUVs',sedan:'Sedans',hatchback:'Hatchbacks'};
  const title=filter?(fl[filter]||filter):'New Cars in Nepal 2024–25';
  setNav(filter==='electric'?'electric':'cars');
  document.getElementById('app-root').innerHTML=`
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
  
  <div style="display:flex;justify-content:center;align-items:center;margin-bottom:16px;">
    <div class="car-icon-wrap">
      <i data-lucide="car" stroke-width="2"></i>
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
          <div class="dp-cons">
            <div class="dp-pc-title" style="color:#dc2626">Needs attention</div>
            ${car.inspection.filter(i=>!i.ok).length
              ? car.inspection.filter(i=>!i.ok).map(i=>`<div class="dp-pc-item"><span style="color:#dc2626;flex-shrink:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>${i.label} — ${i.status}</div>`).join('')
              : '<div class="dp-pc-item" style="color:var(--g3)">All checks passed ✓</div>'}
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


})();