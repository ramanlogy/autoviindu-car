import re

with open('/home/raman/Desktop/autoviindu/public/index.html', 'r') as f:
    content = f.read()

# Replace USED CARS block
used_cars_target = """        <!-- USED CARS -->
        <div class="av-item">
          <button class="av-link">Used Cars
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd">
            <div class="av-col" style="min-width:225px">
              <span class="av-lbl">Pre-owned</span>
              <a class="av-row" href="#" onclick="AV.goTo('used');return false">
                <div class="av-ri"><span class="av-rt">Browse used cars</span><span class="av-rs">Verified · certified
                    pre-owned</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'certified'});return false">
                <div class="av-ri"><span class="av-rt">Certified used cars</span><span class="av-rs">140-point
                    inspected</span></div>
                <span class="av-b av-b--b">Verified</span>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('used',{view:'history'});return false">
                <div class="av-ri"><span class="av-rt">Vehicle history report</span><span class="av-rs">Accident &amp;
                    ownership check</span></div>
              </a>
              <a class="av-row" href="#" onclick="alert('Sell enquiry: +977-9701076240')">
                <div class="av-ri"><span class="av-rt">Sell your car</span><span class="av-rs">Get instant
                    valuation</span></div>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Filter by</span>
              <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'year'});return false">
                <div class="av-ri"><span class="av-rt">Year</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'price'});return false">
                <div class="av-ri"><span class="av-rt">Price range</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'mileage'});return false">
                <div class="av-ri"><span class="av-rt">Mileage</span><span class="av-rs">Low km preferred</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'brand'});return false">
                <div class="av-ri"><span class="av-rt">Brand</span></div>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Finance</span>
              <a class="av-row" href="#" onclick="AV.goTo('tools',{tool:'emi'});return false">
                <div class="av-ri"><span class="av-rt">EMI calculator</span><span class="av-rs">Check monthly
                    payments</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('tools',{tool:'loan'});return false">
                <div class="av-ri"><span class="av-rt">Loan eligibility check</span></div>
              </a>
              <a class="av-row" href="/insurance-finance.html">
                <div class="av-ri"><span class="av-rt">Banks &amp; finance options</span></div>
              </a>
            </div>
          </div>
        </div>"""

used_cars_replacement = """        <!-- USED CARS -->
        <div class="av-item">
          <button class="av-link">Used Cars
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd av-dd-split">
            <div class="av-split-side">
              
              <div class="av-split-item">
                <div class="av-split-lbl">Pre-owned <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Pre-owned</span>
                    <a class="av-row" href="#" onclick="AV.goTo('used');return false">
                      <div class="av-ri"><span class="av-rt">Browse used cars</span><span class="av-rs">Verified · certified pre-owned</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'certified'});return false">
                      <div class="av-ri"><span class="av-rt">Certified used cars</span><span class="av-rs">140-point inspected</span></div>
                      <span class="av-b av-b--b">Verified</span>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('used',{view:'history'});return false">
                      <div class="av-ri"><span class="av-rt">Vehicle history report</span><span class="av-rs">Accident &amp; ownership check</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="alert('Sell enquiry: +977-9701076240')">
                      <div class="av-ri"><span class="av-rt">Sell your car</span><span class="av-rs">Get instant valuation</span></div>
                    </a>
                  </div>
                </div>
              </div>

              <div class="av-split-item">
                <div class="av-split-lbl">Filter by <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Filter by</span>
                    <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'year'});return false">
                      <div class="av-ri"><span class="av-rt">Year</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'price'});return false">
                      <div class="av-ri"><span class="av-rt">Price range</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'mileage'});return false">
                      <div class="av-ri"><span class="av-rt">Mileage</span><span class="av-rs">Low km preferred</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('used',{filter:'brand'});return false">
                      <div class="av-ri"><span class="av-rt">Brand</span></div>
                    </a>
                  </div>
                </div>
              </div>

              <div class="av-split-item">
                <div class="av-split-lbl">Finance <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Finance</span>
                    <a class="av-row" href="#" onclick="AV.goTo('tools',{tool:'emi'});return false">
                      <div class="av-ri"><span class="av-rt">EMI calculator</span><span class="av-rs">Check monthly payments</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('tools',{tool:'loan'});return false">
                      <div class="av-ri"><span class="av-rt">Loan eligibility check</span></div>
                    </a>
                    <a class="av-row" href="/insurance-finance.html">
                      <div class="av-ri"><span class="av-rt">Banks &amp; finance options</span></div>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>"""

content = content.replace(used_cars_target, used_cars_replacement)

# Replace COMPARE block
compare_target = """        <!-- COMPARE -->
        <div class="av-item">
          <button class="av-link">Compare
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd">

            <div class="av-col" style="min-width:205px">
              <span class="av-lbl">Tools</span>
              <a class="av-row" href="#" onclick="AV.goTo('compare');return false">
                <div class="av-ri"><span class="av-rt">New car comparison</span><span class="av-rs">Side-by-side specs
                    &amp; price</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{type:'used'});return false">
                <div class="av-ri"><span class="av-rt">Used car comparison</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'ev_vs_petrol'});return false">
                <div class="av-ri"><span class="av-rt">EV vs Petrol</span><span class="av-rs">Real cost over 5
                    years</span></div>
                <span class="av-b av-b--g">Popular</span>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'hybrid_vs_ev'});return false">
                <div class="av-ri"><span class="av-rt">Hybrid vs EV</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{mode:'multi'});return false">
                <div class="av-ri"><span class="av-rt">Compare up to 5 cars</span></div>
                <span class="av-b av-b--o">New</span>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Smart compare</span>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'custom'});return false">
                <div class="av-ri"><span class="av-rt">Build your own</span><span class="av-rs">Pick any 2–5 cars</span>
                </div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'truecost'});return false">
                <div class="av-ri"><span class="av-rt">True cost calculator</span><span class="av-rs">Price + tax + fuel
                    + maintenance</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'roadscore'});return false">
                <div class="av-ri"><span class="av-rt">Nepal road suitability</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'ownerscore'});return false">
                <div class="av-ri"><span class="av-rt">Owner satisfaction score</span></div>
              </a>
            </div>

            <div class="av-col" style="min-width:215px">
              <span class="av-lbl">Popular comparisons</span>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'nexon_ev_vs_byd_atto3'});return false">
                <div class="av-ri"><span class="av-rt">Nexon EV vs BYD Atto 3</span><span class="av-rs">Top EV
                    battle</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'mg_zs_vs_byd_atto3'});return false">
                <div class="av-ri"><span class="av-rt">MG ZS EV vs BYD Atto 3</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'creta_vs_seltos'});return false">
                <div class="av-ri"><span class="av-rt">Hyundai Creta vs Kia Seltos</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'tata_nexon_vs_punch'});return false">
                <div class="av-ri"><span class="av-rt">Tata Nexon vs Punch</span><span class="av-rs">Budget SUV
                    battle</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'hyundai_venue_vs_sonet'});return false">
                <div class="av-ri"><span class="av-rt">Venue vs Sonet</span><span class="av-rs">Compact SUV
                    rivals</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'swift_vs_i20'});return false">
                <div class="av-ri"><span class="av-rt">Maruti Swift vs Hyundai i20</span><span class="av-rs">Hatchback
                    showdown</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'fortuner_vs_endeavour'});return false">
                <div class="av-ri"><span class="av-rt">Fortuner vs Endeavour</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'best_suvs'});return false">
                <div class="av-ri"><span class="av-rt">Best-selling SUVs</span></div>
              </a>
            </div>

          </div>
        </div>"""

compare_replacement = """        <!-- COMPARE -->
        <div class="av-item">
          <button class="av-link">Compare
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd av-dd-split">
            <div class="av-split-side">

              <div class="av-split-item">
                <div class="av-split-lbl">Tools <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Tools</span>
                    <a class="av-row" href="#" onclick="AV.goTo('compare');return false">
                      <div class="av-ri"><span class="av-rt">New car comparison</span><span class="av-rs">Side-by-side specs &amp; price</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{type:'used'});return false">
                      <div class="av-ri"><span class="av-rt">Used car comparison</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'ev_vs_petrol'});return false">
                      <div class="av-ri"><span class="av-rt">EV vs Petrol</span><span class="av-rs">Real cost over 5 years</span></div>
                      <span class="av-b av-b--g">Popular</span>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'hybrid_vs_ev'});return false">
                      <div class="av-ri"><span class="av-rt">Hybrid vs EV</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{mode:'multi'});return false">
                      <div class="av-ri"><span class="av-rt">Compare up to 5 cars</span></div>
                      <span class="av-b av-b--o">New</span>
                    </a>
                  </div>
                </div>
              </div>

              <div class="av-split-item">
                <div class="av-split-lbl">Smart compare <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Smart compare</span>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'custom'});return false">
                      <div class="av-ri"><span class="av-rt">Build your own</span><span class="av-rs">Pick any 2–5 cars</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'truecost'});return false">
                      <div class="av-ri"><span class="av-rt">True cost calculator</span><span class="av-rs">Price + tax + fuel + maintenance</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'roadscore'});return false">
                      <div class="av-ri"><span class="av-rt">Nepal road suitability</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'ownerscore'});return false">
                      <div class="av-ri"><span class="av-rt">Owner satisfaction score</span></div>
                    </a>
                  </div>
                </div>
              </div>

              <div class="av-split-item">
                <div class="av-split-lbl">Popular comparisons <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Popular comparisons</span>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'nexon_ev_vs_byd_atto3'});return false">
                      <div class="av-ri"><span class="av-rt">Nexon EV vs BYD Atto 3</span><span class="av-rs">Top EV battle</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'mg_zs_vs_byd_atto3'});return false">
                      <div class="av-ri"><span class="av-rt">MG ZS EV vs BYD Atto 3</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'creta_vs_seltos'});return false">
                      <div class="av-ri"><span class="av-rt">Hyundai Creta vs Kia Seltos</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'tata_nexon_vs_punch'});return false">
                      <div class="av-ri"><span class="av-rt">Tata Nexon vs Punch</span><span class="av-rs">Budget SUV battle</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'hyundai_venue_vs_sonet'});return false">
                      <div class="av-ri"><span class="av-rt">Venue vs Sonet</span><span class="av-rs">Compact SUV rivals</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'swift_vs_i20'});return false">
                      <div class="av-ri"><span class="av-rt">Maruti Swift vs Hyundai i20</span><span class="av-rs">Hatchback showdown</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'fortuner_vs_endeavour'});return false">
                      <div class="av-ri"><span class="av-rt">Fortuner vs Endeavour</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{preset:'best_suvs'});return false">
                      <div class="av-ri"><span class="av-rt">Best-selling SUVs</span></div>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>"""

content = content.replace(compare_target, compare_replacement)

# Replace SERVICES block
services_target = """        <!-- SERVICES -->
        <div class="av-item">
          <button class="av-link" onclick="window.location.href='/services.html'">Services
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd">
            <div class="av-col" style="min-width:230px">
              <span class="av-lbl">All services</span>
              <a class="av-row" href="/dotm-services.html">
                <div class="av-ri"><span class="av-rt">DOTM services</span><span class="av-rs">Bluebook, fitness,
                    transfers</span></div>
              </a>
              <a class="av-row" href="/parts-accessories.html">
                <div class="av-ri"><span class="av-rt">Parts &amp; accessories</span><span class="av-rs">Genuine OEM
                    &amp; accessories</span></div>
              </a>
              <a class="av-row" href="/maintenance-repairs.html">
                <div class="av-ri"><span class="av-rt">Maintenance &amp; repairs</span><span class="av-rs">Servicing,
                    AC, EV diagnostics</span></div>
              </a>
              <a class="av-row" href="/insurance-finance.html">
                <div class="av-ri"><span class="av-rt">Insurance &amp; financing</span><span class="av-rs">EMI plans,
                    insurance, trade-in</span></div>
              </a>
              <a class="av-row" href="/other-services.html">
                <div class="av-ri"><span class="av-rt">Other services</span><span class="av-rs">GPS, ceramic coat,
                    roadside</span></div>
              </a>
            </div>
          </div>
        </div>"""

services_replacement = """        <!-- SERVICES -->
        <div class="av-item">
          <button class="av-link" onclick="window.location.href='/services.html'">Services
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd av-dd-split">
            <div class="av-split-side">

              <div class="av-split-item">
                <div class="av-split-lbl">Vehicle care <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Vehicle care</span>
                    <a class="av-row" href="/maintenance-repairs.html">
                      <div class="av-ri"><span class="av-rt">Maintenance &amp; repairs</span><span class="av-rs">Servicing, AC, EV diagnostics</span></div>
                    </a>
                    <a class="av-row" href="/parts-accessories.html">
                      <div class="av-ri"><span class="av-rt">Parts &amp; accessories</span><span class="av-rs">Genuine OEM &amp; accessories</span></div>
                    </a>
                    <a class="av-row" href="/other-services.html">
                      <div class="av-ri"><span class="av-rt">Other services</span><span class="av-rs">GPS, ceramic coat, roadside</span></div>
                    </a>
                  </div>
                </div>
              </div>

              <div class="av-split-item">
                <div class="av-split-lbl">Paperwork &amp; Finance <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Paperwork &amp; Finance</span>
                    <a class="av-row" href="/dotm-services.html">
                      <div class="av-ri"><span class="av-rt">DOTM services</span><span class="av-rs">Bluebook, fitness, transfers</span></div>
                    </a>
                    <a class="av-row" href="/insurance-finance.html">
                      <div class="av-ri"><span class="av-rt">Insurance &amp; financing</span><span class="av-rs">EMI plans, insurance, trade-in</span></div>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>"""

content = content.replace(services_target, services_replacement)

# Replace NEWS & REVIEWS block
news_target = """        <!-- NEWS & REVIEWS -->
        <div class="av-item">
          <button class="av-link" onclick="window.location.href='/videos.html'">News &amp; Reviews
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd">

            <div class="av-col">
              <span class="av-lbl">Watch</span>
              <a class="av-row" href="videos.html">
                <div class="av-ri"><span class="av-rt">Videos</span><span class="av-rs">New uploads &amp; trending
                    reels</span></div>
              </a>
              <a class="av-row" href="videos.html?type=reviews">
                <div class="av-ri"><span class="av-rt">News &amp; reviews</span><span class="av-rs">Latest news and
                    reviews</span></div>
              </a>
              <a class="av-row" href="videos.html?type=shorts">
                <div class="av-ri"><span class="av-rt">Short reels</span><span class="av-rs">Quick highlights &amp;
                    clips</span></div>
              </a>
              <a class="av-row" href="videos.html?type=ev">
                <div class="av-ri"><span class="av-rt">EV videos</span><span class="av-rs">Nepal EV revolution</span>
                </div>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Latest news</span>
              <a class="av-row" href="videos.html?type=ev">
                <div class="av-ri"><span class="av-rt">EV news</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('news',{tag:'upcoming'});return false">
                <div class="av-ri"><span class="av-rt">Upcoming launches</span><span class="av-rs">Price &amp; tax
                    updates</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('news',{tag:'budget'});return false">
                <div class="av-ri"><span class="av-rt">Budget, excise &amp; customs</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('news',{tag:'market'});return false">
                <div class="av-ri"><span class="av-rt">Market trends</span></div>
              </a>
            </div>

            <div class="av-col">
              <span class="av-lbl">Guides &amp; info</span>
              <a class="av-row" href="#" onclick="AV.goTo('guide',{topic:'buying'});return false">
                <div class="av-ri"><span class="av-rt">Buying guide</span><span class="av-rs">Tips for Nepal
                    buyers</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('guide',{topic:'maintenance'});return false">
                <div class="av-ri"><span class="av-rt">Maintenance tips</span><span class="av-rs">Nepal roads &amp;
                    monsoon care</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('guide',{topic:'women'});return false">
                <div class="av-ri"><span class="av-rt">Women &amp; cars</span><span class="av-rs">Growing segment in
                    Nepal</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('awards');return false">
                <div class="av-ri"><span class="av-rt">Nepal car awards</span><span class="av-rs">Best cars of the
                    year</span></div>
              </a>
              <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'tmv'});return false">
                <div class="av-ri"><span class="av-rt">True market value</span><span class="av-rs">What others paid in
                    Nepal</span></div>
              </a>
            </div>

          </div>
        </div>"""

news_replacement = """        <!-- NEWS & REVIEWS -->
        <div class="av-item">
          <button class="av-link" onclick="window.location.href='/videos.html'">News &amp; Reviews
            <svg class="av-chev" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class="av-dd av-dd-split">
            <div class="av-split-side">

              <div class="av-split-item">
                <div class="av-split-lbl">Watch <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Watch</span>
                    <a class="av-row" href="videos.html">
                      <div class="av-ri"><span class="av-rt">Videos</span><span class="av-rs">New uploads &amp; trending reels</span></div>
                    </a>
                    <a class="av-row" href="videos.html?type=reviews">
                      <div class="av-ri"><span class="av-rt">News &amp; reviews</span><span class="av-rs">Latest news and reviews</span></div>
                    </a>
                    <a class="av-row" href="videos.html?type=shorts">
                      <div class="av-ri"><span class="av-rt">Short reels</span><span class="av-rs">Quick highlights &amp; clips</span></div>
                    </a>
                    <a class="av-row" href="videos.html?type=ev">
                      <div class="av-ri"><span class="av-rt">EV videos</span><span class="av-rs">Nepal EV revolution</span></div>
                    </a>
                  </div>
                </div>
              </div>

              <div class="av-split-item">
                <div class="av-split-lbl">Latest news <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Latest news</span>
                    <a class="av-row" href="videos.html?type=ev">
                      <div class="av-ri"><span class="av-rt">EV news</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('news',{tag:'upcoming'});return false">
                      <div class="av-ri"><span class="av-rt">Upcoming launches</span><span class="av-rs">Price &amp; tax updates</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('news',{tag:'budget'});return false">
                      <div class="av-ri"><span class="av-rt">Budget, excise &amp; customs</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('news',{tag:'market'});return false">
                      <div class="av-ri"><span class="av-rt">Market trends</span></div>
                    </a>
                  </div>
                </div>
              </div>

              <div class="av-split-item">
                <div class="av-split-lbl">Guides &amp; info <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                <div class="av-split-content">
                  <div class="av-col">
                    <span class="av-lbl">Guides &amp; info</span>
                    <a class="av-row" href="#" onclick="AV.goTo('guide',{topic:'buying'});return false">
                      <div class="av-ri"><span class="av-rt">Buying guide</span><span class="av-rs">Tips for Nepal buyers</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('guide',{topic:'maintenance'});return false">
                      <div class="av-ri"><span class="av-rt">Maintenance tips</span><span class="av-rs">Nepal roads &amp; monsoon care</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('guide',{topic:'women'});return false">
                      <div class="av-ri"><span class="av-rt">Women &amp; cars</span><span class="av-rs">Growing segment in Nepal</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('awards');return false">
                      <div class="av-ri"><span class="av-rt">Nepal car awards</span><span class="av-rs">Best cars of the year</span></div>
                    </a>
                    <a class="av-row" href="#" onclick="AV.goTo('compare',{tool:'tmv'});return false">
                      <div class="av-ri"><span class="av-rt">True market value</span><span class="av-rs">What others paid in Nepal</span></div>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>"""

content = content.replace(news_target, news_replacement)

with open('/home/raman/Desktop/autoviindu/public/index.html', 'w') as f:
    f.write(content)
