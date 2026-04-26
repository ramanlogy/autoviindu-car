/**
 * AutoViindu – SEO Structured Data (JSON-LD)
 * Include this file in <head> of each page for rich snippets.
 * Usage: <script src="assets/js/seo-schema.js"></script>
 *        Then call: SEO.injectSchema('home') or SEO.injectCarSchema(carData)
 */

window.SEO = (function () {

  const SITE = {
    name: "AutoViindu",
    url: "https://www.autoviindu.com",
    logo: "https://www.autoviindu.com/assets/images/cars/brands/logo.png",
    phone: "+977-9701076240",
    email: "info@autoviindu.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nayabazar",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati Province",
      postalCode: "44600",
      addressCountry: "NP"
    }
  };

  // ── Organization schema (inject on every page) ──
  function organizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "AutoDealer",
      "name": SITE.name,
      "url": SITE.url,
      "logo": SITE.logo,
      "image": SITE.url + "/assets/images/og/home.jpg",
      "telephone": SITE.phone,
      "email": SITE.email,
      "address": SITE.address,
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/autoviindu",
        "https://www.instagram.com/autoviindu",
        "https://www.youtube.com/@autoviindu"
      ],
      "description": "Nepal's most trusted automotive platform. Compare 500+ cars, find the best price, calculate EMI, and book services.",
      "areaServed": {
        "@type": "Country",
        "name": "Nepal"
      }
    };
  }

  // ── WebSite schema with Sitelinks Searchbox ──
  function websiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE.name,
      "url": SITE.url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": SITE.url + "/new-cars?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  // ── BreadcrumbList schema ──
  function breadcrumbSchema(items) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map(function (item, i) {
        return {
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "item": SITE.url + item.path
        };
      })
    };
  }

  // ── Car product schema ──
  function carSchema(car) {
    var lowestVariant = car.variants ? car.variants.reduce(function (min, v) {
      return v.price < min.price ? v : min;
    }, car.variants[0]) : null;

    return {
      "@context": "https://schema.org",
      "@type": "Car",
      "name": car.brand + " " + car.model + " " + car.year,
      "brand": { "@type": "Brand", "name": car.brand },
      "model": car.model,
      "modelDate": String(car.year),
      "description": car.overview || (car.brand + " " + car.model + " price in Nepal with specs and variants"),
      "image": car.images ? car.images[0] : SITE.url + "/assets/images/cars/" + car.slug + "-1.jpg",
      "url": SITE.url + "/cars/" + car.slug,
      "fuelType": car.type,
      "vehicleTransmission": (car.variants && car.variants[0]) ? car.variants[0].specs.transmission : "",
      "numberOfDoors": "4",
      "offers": lowestVariant ? {
        "@type": "AggregateOffer",
        "priceCurrency": "NPR",
        "lowPrice": car.variants.reduce(function (m, v) { return Math.min(m, v.price); }, Infinity),
        "highPrice": car.variants.reduce(function (m, v) { return Math.max(m, v.price); }, 0),
        "offerCount": car.variants.length,
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "AutoDealer", "name": SITE.name, "url": SITE.url }
      } : undefined,
      "aggregateRating": car.rating ? {
        "@type": "AggregateRating",
        "ratingValue": car.rating,
        "bestRating": "10",
        "worstRating": "1",
        "reviewCount": car.reviews || 1
      } : undefined
    };
  }

  // ── FAQ schema (pass array of {q, a}) ──
  function faqSchema(pairs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": pairs.map(function (p) {
        return {
          "@type": "Question",
          "name": p.q,
          "acceptedAnswer": { "@type": "Answer", "text": p.a }
        };
      })
    };
  }

  // ── Service schema ──
  function serviceSchema(name, desc, price) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": name,
      "description": desc,
      "provider": { "@type": "AutoDealer", "name": SITE.name, "url": SITE.url },
      "areaServed": { "@type": "City", "name": "Kathmandu" },
      "offers": price ? {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "NPR",
        "availability": "https://schema.org/InStock"
      } : undefined
    };
  }

  // ── Inject a JSON-LD block ──
  function inject(schemaObj) {
    var el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(el);
  }

  // ── Convenience: inject base schemas for a page type ──
  function injectSchema(pageType, data) {
    inject(organizationSchema());
    inject(websiteSchema());

    if (pageType === "home") {
      inject(faqSchema([
        { q: "What is AutoViindu?", a: "AutoViindu is Nepal's most trusted automotive platform where you can compare 500+ cars, check prices, calculate EMI, and book car services in Kathmandu." },
        { q: "How do I buy a car through AutoViindu?", a: "Browse cars on AutoViindu, compare models, choose a variant, and contact us via phone at +977-9701076240 or book a test drive directly through the website." },
        { q: "Does AutoViindu offer car services?", a: "Yes, AutoViindu offers cosmetic car care (ceramic coating, PPF, detailing), workshop repairs, EV diagnostics, GPS installation, and 24/7 roadside assistance in Kathmandu." },
        { q: "Can I calculate car EMI on AutoViindu?", a: "Yes, every car page has a built-in EMI calculator. You can enter your down payment and loan tenure to estimate monthly installments." }
      ]));
    }

    if (pageType === "car" && data) {
      inject(carSchema(data));
      inject(breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "New Cars", path: "/new-cars" },
        { name: data.brand, path: "/brands/" + data.brand.toLowerCase() },
        { name: data.brand + " " + data.model, path: "/cars/" + data.slug }
      ]));
    }

    if (pageType === "services") {
      inject(serviceSchema("Ceramic Coating", "Professional ceramic coating for cars in Kathmandu. Long-lasting paint protection.", 15000));
      inject(serviceSchema("Car Detailing", "Full interior and exterior car detailing service in Nayabazar, Kathmandu.", 5000));
    }
  }

  // ── Public API ──
  return {
    injectSchema: injectSchema,
    injectCarSchema: function (car) { inject(carSchema(car)); },
    injectFAQ: function (pairs) { inject(faqSchema(pairs)); },
    injectBreadcrumb: function (items) { inject(breadcrumbSchema(items)); }
  };
})();

// Auto-inject base schemas on page load
document.addEventListener("DOMContentLoaded", function () {
  if (!window._seoInjected) {
    window._seoInjected = true;
    window.SEO.injectSchema("home");
  }
});