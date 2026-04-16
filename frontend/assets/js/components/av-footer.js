/*!
 * AutoViindu — Shared Footer Component
 * Usage: <script src="components/av-footer.js"></script>
 * Place this just before </body>
 */
(function () {
  'use strict';

  /* ── Inject footer CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    .av-footer { background:#050d07; padding:52px 0 0; margin-top:auto }
    .av-footer-wrap { max-width:1260px; margin:0 auto; padding:0 20px }
    @media(min-width:768px){ .av-footer-wrap { padding:0 32px } }

    .av-footer-grid {
      display:grid; grid-template-columns:1fr; gap:28px;
      padding-bottom:36px; border-bottom:1px solid rgba(255,255,255,.05);
    }
    @media(min-width:580px){ .av-footer-grid { grid-template-columns:1fr 1fr } }
    @media(min-width:900px){ .av-footer-grid { grid-template-columns:2fr 1fr 1fr 1.2fr; gap:40px } }

    .av-footer-logo-img {
      height:110px; width:auto; display:block;
      object-fit:contain; background:transparent;
    }
    @media(max-width:768px){ .av-footer-logo-img { height:80px } }

    .av-footer-desc {
      font-size:13px; color:rgba(255,255,255,.22); line-height:1.8;
      margin:12px 0 18px; max-width:270px;
    }

    /* Social icons */
    .av-footer-social { display:flex; gap:8px }
    .av-fsoc {
      width:34px; height:34px;
      background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.07);
      border-radius:8px; display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition:all .22s cubic-bezier(.4,0,.2,1);
      text-decoration:none;
    }
    .av-fsoc:hover { background:#1a6b2a; border-color:#1a6b2a }

    /* Columns */
    .av-fcol-title {
      font-size:10px; font-weight:800; color:rgba(255,255,255,.4);
      text-transform:uppercase; letter-spacing:.8px; margin-bottom:13px;
    }
    .av-fcol ul { list-style:none; display:flex; flex-direction:column; gap:8px; padding:0; margin:0 }
    .av-fcol a {
      font-size:13px; color:rgba(255,255,255,.22);
      transition:color .22s; cursor:pointer; text-decoration:none;
    }
    .av-fcol a:hover { color:rgba(255,255,255,.65) }

    /* Contact card */
    .av-footer-contact-card {
      margin-top:14px; padding:12px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.06); border-radius:10px;
    }
    .av-footer-contact-label {
      font-size:10px; font-weight:700; color:rgba(255,255,255,.3);
      text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px;
    }
    .av-footer-call {
      display:flex; align-items:center; gap:7px;
      font-size:13.5px; font-weight:700; color:#4dd870; text-decoration:none;
    }

    /* Bottom bar */
    .av-footer-bottom {
      padding:16px 0;
      display:flex; justify-content:space-between; align-items:center;
      font-size:11.5px; color:rgba(255,255,255,.13);
      flex-wrap:wrap; gap:7px;
    }
    .av-fbot-links { display:flex; gap:14px }
    .av-fbot-links a {
      color:rgba(255,255,255,.13); cursor:pointer;
      transition:color .22s; text-decoration:none;
    }
    .av-fbot-links a:hover { color:rgba(255,255,255,.4) }
  `;
  document.head.appendChild(style);

  /* ── Build footer HTML ── */
  const footerHTML = `
  <footer class="av-footer" id="av-footer">
    <div class="av-footer-wrap">
      <div class="av-footer-grid">

        <!-- Brand column -->
        <div>
          <a href="index.html">
            <img src="/frontend/assets/images/cars/brands/logo.png" alt="AutoViindu" class="av-footer-logo-img">
          </a>
          <p class="av-footer-desc">Nepal's most trusted automotive platform. Real prices, real specs, expert reviews.</p>
          <div class="av-footer-social">
            <a class="av-fsoc" href="https://www.facebook.com/profile.php?id=61576845804927" target="_blank" rel="noopener" title="Facebook">
              <svg viewBox="0 0 24 24" fill="rgba(255,255,255,.4)" width="14" height="14"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a class="av-fsoc" href="https://www.instagram.com/autoviindu/" target="_blank" rel="noopener" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a class="av-fsoc" href="https://www.youtube.com/@autoviindu" target="_blank" rel="noopener" title="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2" width="14" height="14"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="rgba(255,255,255,.4)" stroke="none"/></svg>
            </a>
          </div>
        </div>

        <!-- Navigate -->
        <div class="av-fcol">
          <h4 class="av-fcol-title">Navigate</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#cars">New Cars</a></li>
            <li><a href="index.html#used">Used Cars</a></li>
            <li><a href="index.html#compare">Compare Cars</a></li>
            <li><a href="videos.html">Videos</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="av-fcol">
          <h4 class="av-fcol-title">Services</h4>
          <ul>
            <li><a href="dotm-services.html">DOTM Services</a></li>
            <li><a href="parts-accessories.html">Parts &amp; Accessories</a></li>
            <li><a href="maintenance-repairs.html">Maintenance &amp; Repairs</a></li>
            <li><a href="insurance-services.html">Insurance &amp; Financing</a></li>
            <li><a href="other-services.html">Other Services</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="av-fcol">
          <h4 class="av-fcol-title">Contact</h4>
          <ul>
            <li><a href="tel:+9779701076240">+977-9701076240</a></li>
            <li><a href="mailto:info@autoviindu.com">info@autoviindu.com</a></li>
            <li><a>Nayabazar, Kathmandu</a></li>
            <li><a>Mon–Sat · 9am–6pm</a></li>
          </ul>
          <div class="av-footer-contact-card">
            <div class="av-footer-contact-label">Quick Contact</div>
            <a href="tel:+9779701076240" class="av-footer-call">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              Call Now
            </a>
          </div>
        </div>

      </div><!-- /av-footer-grid -->

      <div class="av-footer-bottom">
        <span>© 2025 AutoViindu Pvt. Ltd. All rights reserved.</span>
        <div class="av-fbot-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>

    </div>
  </footer>`;

  /* ── Inject before closing </body> ── */
  document.body.insertAdjacentHTML('beforeend', footerHTML);

})();