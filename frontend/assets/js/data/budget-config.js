/* ═══════════════════════════════════════════════════
   AUTOVIINDU — BUDGET TIERS CONFIGURATION
   Add / edit tiers here → #budget/:slug auto-works.
   Cars link via car.budgetTier === tier.slug
═══════════════════════════════════════════════════ */
window.BUDGET_TIERS = [
  {
    slug: 'under-20L',
    label: 'Under Rs. 20 Lakh',
    shortLabel: 'Under 20L',
    min: 0,
    max: 2000000,
    heroText: 'Affordable & reliable daily drivers',
    targetBuyer: 'First-time buyers & city commuters',
    emoji: '🏁',
    color: '#1A6B2A',
    bgColor: '#EEF7F0',
  },
  {
    slug: '20-30L',
    label: 'Rs. 20–30 Lakh',
    shortLabel: '20–30L',
    min: 2000000,
    max: 3000000,
    heroText: 'Best value for money segment',
    targetBuyer: 'Young professionals & small families',
    emoji: '⭐',
    color: '#1A4DB8',
    bgColor: '#EEF3FC',
  },
  {
    slug: '30-50L',
    label: 'Rs. 30–50 Lakh',
    shortLabel: '30–50L',
    min: 3000000,
    max: 5000000,
    heroText: 'Feature-packed mid-range SUVs & sedans',
    targetBuyer: 'Growing families & business users',
    emoji: '🚀',
    color: '#B8900E',
    bgColor: '#FDF6E0',
  },
  {
    slug: '50-80L',
    label: 'Rs. 50–80 Lakh',
    shortLabel: '50–80L',
    min: 5000000,
    max: 8000000,
    heroText: 'Premium & electric vehicles',
    targetBuyer: 'Premium buyers & EV enthusiasts',
    emoji: '💎',
    color: '#7B2FBE',
    bgColor: '#F3EEFF',
  },
  {
    slug: '80L-plus',
    label: 'Rs. 80 Lakh & Above',
    shortLabel: '80L+',
    min: 8000000,
    max: Infinity,
    heroText: 'Luxury cars & flagship SUVs',
    targetBuyer: 'Luxury segment & performance buyers',
    emoji: '👑',
    color: '#C8271E',
    bgColor: '#FFF0EF',
  },
];

/* Helper: get tier by slug */
window.getBudgetTier = function (slug) {
  return (window.BUDGET_TIERS || []).find(t => t.slug === slug) || null;
};