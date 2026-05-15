import re

with open('public/index.html', 'r') as f:
    content = f.read()

# Define the new CSS
new_css = """    /* ══════════════════════════════════════
   ══ MODERN EVENTS SECTION  ══
   ══════════════════════════════════════ */
    .events-section-modern {
      background: var(--bg);
      padding: 80px 0;
      overflow: hidden;
    }
    
    .ev-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 40px;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .ev-hd-left {
      max-width: 600px;
    }
    
    .ev-eyebrow {
      font-size: 13px;
      font-weight: 800;
      color: var(--brand);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      display: inline-block;
      padding: 6px 12px;
      background: rgba(36, 160, 68, 0.1);
      border-radius: var(--pill);
    }
    
    .ev-title {
      font-family: var(--font-h);
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 800;
      color: var(--ink);
      line-height: 1.1;
      margin-bottom: 12px;
      letter-spacing: -1px;
    }
    
    .ev-sub {
      font-size: 16px;
      color: var(--ink3);
      line-height: 1.6;
    }
    
    .ev-btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: var(--pill);
      border: 1.5px solid var(--border);
      background: var(--white);
      color: var(--ink);
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .ev-btn-outline:hover {
      border-color: var(--brand);
      color: var(--brand);
      box-shadow: 0 4px 12px rgba(36, 160, 68, 0.1);
      transform: translateY(-2px);
    }
    
    .ev-modern-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    
    @media (max-width: 992px) {
      .ev-modern-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .ev-modern-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .ev-modern-card {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      aspect-ratio: 4/5;
      cursor: pointer;
      isolation: isolate;
    }
    
    .ev-modern-card.featured {
      grid-column: span 2;
      aspect-ratio: 2/1;
    }
    
    @media (max-width: 992px) {
      .ev-modern-card.featured {
        grid-column: span 2;
        aspect-ratio: 16/9;
      }
    }
    
    @media (max-width: 640px) {
      .ev-modern-card.featured {
        grid-column: span 1;
        aspect-ratio: 4/5;
      }
      .ev-modern-card {
        aspect-ratio: 4/5;
      }
    }
    
    .ev-card-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }
    
    .ev-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%);
      z-index: 2;
      transition: background 0.4s ease;
    }
    
    .ev-modern-card:hover .ev-card-bg {
      transform: scale(1.08);
    }
    
    .ev-modern-card:hover .ev-card-overlay {
      background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%);
    }
    
    .ev-card-top {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      z-index: 3;
    }
    
    .ev-badge {
      padding: 6px 12px;
      border-radius: var(--pill);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    .ev-badge.live {
      background: var(--brand);
      border-color: var(--brand);
    }
    
    .ev-badge.free {
      background: rgba(255, 255, 255, 0.9);
      color: var(--ink);
      border: none;
    }
    
    .ev-badge.invite {
      background: var(--ink);
      border-color: rgba(255,255,255,0.2);
    }
    
    .ev-card-content {
      position: absolute;
      bottom: 24px;
      left: 24px;
      right: 24px;
      z-index: 3;
      display: flex;
      gap: 16px;
      align-items: flex-end;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .ev-modern-card:hover .ev-card-content {
      transform: translateY(-50px);
    }
    
    .ev-date-box {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 64px;
      flex-shrink: 0;
    }
    
    .ev-day {
      font-family: var(--font-d);
      font-size: 26px;
      font-weight: 800;
      color: #fff;
      line-height: 1;
      margin-bottom: 2px;
    }
    
    .ev-month {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255,255,255,0.8);
      letter-spacing: 1px;
    }
    
    .ev-info {
      flex: 1;
    }
    
    .ev-card-title {
      font-family: var(--font-h);
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
      margin-bottom: 10px;
    }
    
    .ev-modern-card.featured .ev-card-title {
      font-size: 28px;
    }
    
    .ev-card-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .ev-card-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: rgba(255,255,255,0.7);
      font-weight: 500;
    }
    
    .ev-modern-card.featured .ev-card-meta {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .ev-card-hover {
      position: absolute;
      bottom: 24px;
      left: 104px;
      right: 24px;
      z-index: 3;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    
    @media (max-width: 480px) {
      .ev-card-hover {
        left: 24px;
      }
      .ev-modern-card:hover .ev-card-content {
        transform: translateY(-80px);
      }
    }
    
    .ev-modern-card:hover .ev-card-hover {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    
    .ev-card-hover p {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .ev-rsvp-btn {
      background: #fff;
      color: var(--ink);
      border: none;
      padding: 10px 20px;
      border-radius: var(--pill);
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
    }
    
    .ev-rsvp-btn:hover {
      transform: scale(1.05);
      background: var(--brand);
      color: #fff;
    }
    
    .ev-rsvp-btn.locked {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5);
      cursor: not-allowed;
    }
    
    .ev-rsvp-btn.locked:hover {
      transform: none;
    }
"""

start_marker = "    /* ══════════════════════════════════════\n   ══ EVENTS SECTION  ══\n   ══════════════════════════════════════ */"
end_marker = "    .events-empty svg {\n      margin: 0 auto 12px;\n      opacity: .3;\n    }"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_marker)
    updated_content = content[:start_idx] + new_css + content[end_idx:]
    with open('public/index.html', 'w') as f:
        f.write(updated_content)
    print("Replaced successfully!")
else:
    print("Markers not found.")
