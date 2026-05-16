import sys

with open('public/assets/js/app.js', 'r') as f:
    content = f.read()

start_marker = "  <!-- ══ EVENTS SECTION ══ -->\n<section class=\"events-section\">"
end_marker = "  </div>\n</section>"

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Start marker not found")
    sys.exit(1)

# Find the end of the section by looking for the end_marker after start_idx
end_idx = content.find(end_marker, start_idx) + len(end_marker)

new_html = """  <!-- ══ MODERN EVENTS SECTION ══ -->
<section class="events-section-modern">
  <div class="wrap">

    <div class="ev-header">
      <div class="ev-hd-left">
        <div class="ev-eyebrow">Discover Auto Culture</div>
        <h2 class="ev-title">Upcoming Auto Events</h2>
        <p class="ev-sub">Car shows, test drive days, and exclusive launches across Nepal</p>
      </div>
      <button class="ev-btn-outline" onclick="window.location.href='#'">View All Events →</button>
    </div>

    <div class="ev-modern-grid">
      
      <!-- Featured card -->
      <div class="ev-modern-card featured" onclick="window.location.href='#'">
        <div class="ev-card-bg" style="background-image: url('/assets/images/events/auto-expo.jpg'); background-color: #1A1A1A;"></div>
        <div class="ev-card-overlay"></div>
        <div class="ev-card-top">
          <span class="ev-badge live">Featured</span>
          <span class="ev-badge free">Free Entry</span>
        </div>
        <div class="ev-card-content">
          <div class="ev-date-box">
            <div class="ev-day">18</div>
            <div class="ev-month">APR</div>
          </div>
          <div class="ev-info">
            <div class="ev-card-title">Nepal Auto Expo 2026</div>
            <div class="ev-card-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Bhrikutimandap, Kathmandu
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                10:00 AM – 6:00 PM
              </span>
            </div>
          </div>
        </div>
        <div class="ev-card-hover">
          <p>Nepal's biggest annual automobile showcase featuring 50+ brands, live test drives, and exclusive launch reveals. Don't miss it.</p>
          <button class="ev-btn-outline" style="background:var(--brand);color:#fff;border:none;">RSVP Now →</button>
        </div>
      </div>

      <!-- Regular card -->
      <div class="ev-modern-card" onclick="window.location.href='#'">
        <div class="ev-card-bg" style="background-image: url('/assets/images/events/test-drive.jpg'); background-color: #2E4F8A;"></div>
        <div class="ev-card-overlay"></div>
        <div class="ev-card-top">
          <span class="ev-badge">Test Drive</span>
          <span class="ev-badge free">Free</span>
        </div>
        <div class="ev-card-content">
          <div class="ev-date-box">
            <div class="ev-day">22</div>
            <div class="ev-month">APR</div>
          </div>
          <div class="ev-info">
            <div class="ev-card-title">EV Test Drive Day</div>
            <div class="ev-card-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Naxal, KTM
              </span>
            </div>
          </div>
        </div>
        <div class="ev-card-hover">
          <p>Book a slot and experience the newest electric vehicles firsthand.</p>
          <button class="ev-btn-outline" style="background:var(--brand);color:#fff;border:none;">Book Slot</button>
        </div>
      </div>

      <!-- Regular card -->
      <div class="ev-modern-card" onclick="window.location.href='#'">
        <div class="ev-card-bg" style="background-image: url('/assets/images/events/launch.jpg'); background-color: #1C1C1C;"></div>
        <div class="ev-card-overlay"></div>
        <div class="ev-card-top">
          <span class="ev-badge">Launch</span>
          <span class="ev-badge invite">Invite Only</span>
        </div>
        <div class="ev-card-content">
          <div class="ev-date-box">
            <div class="ev-day">05</div>
            <div class="ev-month">MAY</div>
          </div>
          <div class="ev-info">
            <div class="ev-card-title">Exclusive SUV Reveal</div>
            <div class="ev-card-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Hotel Yak & Yeti
              </span>
            </div>
          </div>
        </div>
        <div class="ev-card-hover">
          <p>Be the first to see the most anticipated SUV launch.</p>
          <button class="ev-btn-outline" style="background:var(--ink3);color:#fff;border:none;">Waitlist</button>
        </div>
      </div>

    </div>
  </div>
</section>"""

new_content = content[:start_idx] + new_html + content[end_idx:]

with open('public/assets/js/app.js', 'w') as f:
    f.write(new_content)

print("Events section replaced successfully.")
