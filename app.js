/**
 * KREUZFAHRTPARKPLATZ.DE - PROTOTYPE STATE & INTERACTION CONTROLLER
 * Architecture: Vanilla JS Component State Manager
 * Target: High fidelity developer-handoff & user testing
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. GLOBAL STATE STORE ---
  const state = {
    currentScreen: 'screen-home',
    deviceMode: 'desktop', // 'desktop', 'laptop', 'tablet', 'mobile'
    devSpecsOpen: false,
    selectedService: 'shuttle', // 'shuttle' | 'valet'
    bookingData: {
      port: 'Kiel',
      ship: 'Mein Schiff 1 (TUI Cruises)',
      terminal: 'Ostseekai Kiel',
      startDate: '2027-06-12',
      endDate: '2027-06-19',
      days: 8,
      provider: 'Port Parking Kiel',
      basePrice: 139.00,
      protectionAddon: false,
      protectionPrice: 9.90,
      totalPrice: 139.00,
      bookingRef: 'KP-2027-018453',
      paymentMethod: 'paypal',
      customer: {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@kreuzfahrt-kiel.de',
        phone: '+49 171 1234567',
        plate: 'HH-KP 2027',
        carModel: 'VW Passat Variant',
        passengers: 2,
        arrivalTime: '11:30'
      }
    },
    // Listings data for Kiel (exact match to client assets & pricing sheet)
    listings: [
      {
        id: 'port-parking-kiel',
        title: 'Port Parking Kiel',
        badge: 'Testsieger & Empfehlung',
        serviceType: 'shuttle',
        isCovered: false,
        price: 139.00,
        dailyPrice: 17.38,
        rating: 4.9,
        reviewsCount: 1240,
        distanceKm: 3.8,
        shuttleTimeMin: 7,
        terminals: 'Ostseekai, Schwedenkai, Norwegenkai',
        features: ['Kostenloser Shuttle-Transfer', '24/7 Videoüberwacht', 'Schlüssel behalten', 'Eingezäuntes Areal', 'Kostenlose Stornierung bis 24h'],
        image: 'downloaded_assets/08_Startseite_Bestellablauf/03_Kiel_Auswahl_02_von_02_Parken.png'
      },
      {
        id: 'kiel-valet-service',
        title: 'Kiel Valet Service Direkt',
        badge: 'Premium Komfort am Schiff',
        serviceType: 'valet',
        isCovered: true,
        price: 179.00,
        dailyPrice: 22.38,
        rating: 4.8,
        reviewsCount: 890,
        distanceKm: 0.1,
        shuttleTimeMin: 0,
        terminals: 'Direktübergabe am Ostseekai & allen Terminals',
        features: ['Übergabe direkt am Schiff', 'Tiefgaragen-Stellplatz', 'Fahrzeug-Übergabeprotokoll', 'Kein Shuttle nötig', 'Allianz Versicherungsschutz'],
        image: 'downloaded_assets/08_Startseite_Bestellablauf/04_Kiel_Auswahl_02_von_02_Alternative_Valet.png'
      },
      {
        id: 'ostsee-parkhaus-kiel',
        title: 'Ostsee Parkhaus Kiel City',
        badge: '100% Wettergeschützt',
        serviceType: 'shuttle',
        isCovered: true,
        price: 149.00,
        dailyPrice: 18.63,
        rating: 4.7,
        reviewsCount: 610,
        distanceKm: 4.2,
        shuttleTimeMin: 9,
        terminals: 'Ostseekai & Schwedenkai',
        features: ['Überdachtes Parkhaus', 'Shuttle alle 15 Minuten', 'E-Ladestation vorhanden', 'Frauen- & Familienparkplätze'],
        image: 'downloaded_assets/08_Startseite_Bestellablauf/03_Kiel_Auswahl_02_von_02_Parken.png'
      },
      {
        id: 'kiel-shuttle-sued',
        title: 'Kiel Shuttle Parking Süd',
        badge: 'Preishit',
        serviceType: 'shuttle',
        isCovered: false,
        price: 119.00,
        dailyPrice: 14.88,
        rating: 4.6,
        reviewsCount: 450,
        distanceKm: 6.5,
        shuttleTimeMin: 12,
        terminals: 'Alle Terminals inkl. Ostuferhafen',
        features: ['Besonders günstig', 'Große SUV & Van Stellplätze', 'Eingezäunt & beleuchtet', 'Barrierefreier Shuttlebus'],
        image: 'downloaded_assets/08_Startseite_Bestellablauf/03_Kiel_Auswahl_02_von_02_Parken.png'
      },
      {
        id: 'city-port-parking',
        title: 'City Port Parking Kiel',
        badge: 'Hafennah',
        serviceType: 'shuttle',
        isCovered: false,
        price: 129.00,
        dailyPrice: 16.13,
        rating: 4.5,
        reviewsCount: 320,
        distanceKm: 2.9,
        shuttleTimeMin: 5,
        terminals: 'Schwedenkai & Ostseekai',
        features: ['Sehr kurze Transferzeit', 'Online Check-in', 'Gepäck-Service inklusive'],
        image: 'downloaded_assets/08_Startseite_Bestellablauf/03_Kiel_Auswahl_02_von_02_Parken.png'
      }
    ]
  };

  // --- 2. SCREEN ROUTER ---
  const screens = document.querySelectorAll('.app-screen');
  const screenSelect = document.getElementById('protoScreenSelect');

  function showScreen(screenId) {
    if (!document.getElementById(screenId)) {
      console.warn(`Screen ${screenId} not found`);
      return;
    }

    screens.forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    targetScreen.classList.add('active');
    state.currentScreen = screenId;

    if (screenSelect) {
      screenSelect.value = screenId;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateScreenDynamicContent(screenId);
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
    });
    // Auto-close on link click
    mobileNavDrawer.querySelectorAll('[data-goto]').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
      });
    });
  }

  // Bind screen select dropdown
  if (screenSelect) {
    screenSelect.addEventListener('change', (e) => {
      showScreen(e.target.value);
    });
  }

  // Global click delegator for screen navigation triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-goto]');
    if (trigger) {
      e.preventDefault();
      const targetScreen = trigger.getAttribute('data-goto');
      const serviceMode = trigger.getAttribute('data-service');
      if (serviceMode) {
        state.selectedService = serviceMode;
        if (serviceMode === 'valet') {
          state.bookingData.provider = 'Kiel Valet Service Direkt';
          state.bookingData.basePrice = 179.00;
        } else {
          state.bookingData.provider = 'Port Parking Kiel';
          state.bookingData.basePrice = 139.00;
        }
        recalcPrices();
      }
      showScreen(targetScreen);
    }
  });

  // --- 3. VIEWPORT SIMULATOR HANDLER ---
  const viewport = document.getElementById('protoViewport');
  const deviceButtons = document.querySelectorAll('.proto-device-btn');
  let userExplicitDevice = false;

  function syncDeviceMode(device, notify = false) {
    deviceButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-device') === device);
    });
    state.deviceMode = device;
    if (viewport) {
      viewport.setAttribute('data-device', device);
    }
    if (notify) {
      showToast(`Ansicht gewechselt: ${device.toUpperCase()}`);
    }
  }

  deviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      userExplicitDevice = true;
      const device = btn.getAttribute('data-device');
      syncDeviceMode(device, true);
    });
  });

  // Auto detect viewport on load or resize if user has not manually locked a preset
  function autoDetectViewport() {
    if (userExplicitDevice) return;
    const w = window.innerWidth;
    if (w <= 600) {
      syncDeviceMode('mobile');
    } else if (w <= 1024) {
      syncDeviceMode('tablet');
    } else if (w <= 1300) {
      syncDeviceMode('laptop');
    } else {
      syncDeviceMode('desktop');
    }
  }

  window.addEventListener('resize', autoDetectViewport);
  autoDetectViewport();

  // --- 4. FIGMA / DEV SPECS DRAWER HANDLER ---
  const devSpecsToggleBtn = document.getElementById('protoDevSpecsToggle');
  const devSpecsDrawer = document.getElementById('devSpecsDrawer');
  const devSpecsCloseBtn = document.getElementById('devSpecsCloseBtn');

  if (devSpecsToggleBtn && devSpecsDrawer) {
    devSpecsToggleBtn.addEventListener('click', () => {
      state.devSpecsOpen = !state.devSpecsOpen;
      devSpecsDrawer.classList.toggle('open', state.devSpecsOpen);
      devSpecsToggleBtn.classList.toggle('active', state.devSpecsOpen);
    });
  }

  if (devSpecsCloseBtn && devSpecsDrawer) {
    devSpecsCloseBtn.addEventListener('click', () => {
      state.devSpecsOpen = false;
      devSpecsDrawer.classList.remove('open');
      if (devSpecsToggleBtn) devSpecsToggleBtn.classList.remove('active');
    });
  }

  // --- 5. SEARCH ENGINE (STARTSEITE) ---
  const searchForm = document.getElementById('heroSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const portInput = document.getElementById('searchPortSelect');
      const dateStart = document.getElementById('searchStartDate');
      const dateEnd = document.getElementById('searchEndDate');
      const shipSelect = document.getElementById('searchShipSelect');

      if (portInput) state.bookingData.port = portInput.value;
      if (dateStart) state.bookingData.startDate = dateStart.value;
      if (dateEnd) state.bookingData.endDate = dateEnd.value;
      if (shipSelect) state.bookingData.ship = shipSelect.value;

      showToast('Suche wird ausgeführt...');
      setTimeout(() => {
        showScreen('screen-kiel-search');
      }, 300);
    });
  }

  // --- 6. KIEL SEARCH RESULTS - FILTER & LISTING ENGINE ---
  const filterForm = document.getElementById('kielFilterForm');
  const priceSlider = document.getElementById('filterPriceSlider');
  const priceSliderVal = document.getElementById('priceSliderVal');
  const resultsContainer = document.getElementById('searchResultsCardsList');
  const sortSelect = document.getElementById('resultsSortSelect');

  function renderListings() {
    if (!resultsContainer) return;

    let filtered = [...state.listings];

    // Filter by price slider
    if (priceSlider) {
      const maxPrice = parseFloat(priceSlider.value);
      if (priceSliderVal) priceSliderVal.textContent = `${maxPrice} €`;
      filtered = filtered.filter(item => item.price <= maxPrice);
    }

    // Filter by Service Type checkboxes
    const shuttleCheck = document.getElementById('filterTypeShuttle');
    const valetCheck = document.getElementById('filterTypeValet');
    if (shuttleCheck && valetCheck) {
      if (shuttleCheck.checked && !valetCheck.checked) {
        filtered = filtered.filter(i => i.serviceType === 'shuttle');
      } else if (!shuttleCheck.checked && valetCheck.checked) {
        filtered = filtered.filter(i => i.serviceType === 'valet');
      }
    }

    // Filter by covered checkbox
    const coveredCheck = document.getElementById('filterFeatureCovered');
    if (coveredCheck && coveredCheck.checked) {
      filtered = filtered.filter(i => i.isCovered);
    }

    // Sort listings
    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortVal === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortVal === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortVal === 'dist') {
        filtered.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }

    // Render HTML cards
    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="card card-padded" style="text-align: center; padding: 40px 20px;">
          <p style="font-size: 18px; font-weight: 700; color: var(--color-navy-900);">Keine Parkplätze für diese Filterkriterien gefunden</p>
          <p style="color: var(--color-text-muted); margin-top: 6px;">Bitte passen Sie den Preis-Schieberegler oder die Ausstattungsmerkmale an.</p>
          <button class="btn btn-outline btn-sm" id="resetFiltersBtn" style="margin-top: 14px;">Filter zurücksetzen</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (priceSlider) priceSlider.value = 220;
          if (shuttleCheck) shuttleCheck.checked = true;
          if (valetCheck) valetCheck.checked = true;
          if (coveredCheck) coveredCheck.checked = false;
          renderListings();
        });
      }
      return;
    }

    resultsContainer.innerHTML = filtered.map(item => {
      const isFeatured = item.id === 'port-parking-kiel';
      return `
        <article class="listing-card ${isFeatured ? 'featured-card' : ''}">
          ${item.badge ? `
            <div class="listing-featured-ribbon">
              <span class="badge ${isFeatured ? 'badge-featured' : 'badge-blue'}">${item.badge}</span>
            </div>
          ` : ''}

          <div class="listing-thumb-wrap">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #0f2c52 0%, #1e4d8c 100%); display: flex; align-items: center; justify-content: center; color: #ffffff; padding: 16px; text-align: center;">
              <div>
                <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" style="margin: 0 auto 6px; opacity: 0.9;">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                  <circle cx="7" cy="17" r="2"></circle>
                  <circle cx="17" cy="17" r="2"></circle>
                </svg>
                <div style="font-weight: 700; font-size: 13px;">${item.serviceType === 'valet' ? 'Valet Direktübergabe' : 'Kostenloser Shuttle'}</div>
                <div style="font-size: 11px; opacity: 0.8;">${item.isCovered ? 'Überdacht & Gesichert' : 'Eingezäuntes Freigelände'}</div>
              </div>
            </div>
          </div>

          <div class="listing-body">
            <div>
              <div class="listing-title-row">
                <h3 class="listing-title">${item.title}</h3>
                <div class="listing-terminal-dist">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.4 11.8a1 1 0 0 0 1.2 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>${item.distanceKm > 0.5 ? `${item.distanceKm} km zum Ostseekai (ca. ${item.shuttleTimeMin} Min. Shuttle)` : 'Direkt am Terminal (0 Min. Gehzeit)'}</span>
                </div>
              </div>

              <div class="listing-rating-row">
                <div class="star-rating">
                  <span>★</span> <span>${item.rating.toFixed(1)}</span>
                </div>
                <span style="color: var(--color-text-muted);">(${item.reviewsCount} Bewertungen)</span>
                <span style="color: var(--color-border);">|</span>
                <span style="color: var(--color-navy-700); font-weight: 600;">Terminals: ${item.terminals}</span>
              </div>

              <div class="listing-highlights-chips">
                ${item.features.map(f => `
                  <span class="chip">
                    <svg width="12" height="12" fill="none" stroke="#10b981" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ${f}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="listing-price-col">
            <span class="listing-duration">Gesamtpreis für 8 Tage</span>
            <div class="listing-price-total">${item.price.toFixed(2).replace('.', ',')} €</div>
            <span class="listing-price-daily">(${item.dailyPrice.toFixed(2).replace('.', ',')} € / Tag)</span>
            <span class="listing-cancellation-badge">Kostenlos stornierbar</span>
            <button class="btn btn-primary btn-sm btn-full" data-goto="${item.serviceType === 'valet' ? 'screen-detail-valet' : 'screen-detail-shuttle'}" data-service="${item.serviceType}">
              ${item.serviceType === 'valet' ? 'Valet Details' : 'Verfügbarkeit prüfen'}
            </button>
          </div>
        </article>
      `;
    }).join('');

    const countElem = document.getElementById('resultsMatchCount');
    if (countElem) countElem.textContent = filtered.length;
  }

  if (priceSlider) {
    priceSlider.addEventListener('input', renderListings);
  }
  if (filterForm) {
    filterForm.addEventListener('change', renderListings);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', renderListings);
  }

  // --- 7. CHECKOUT CALCULATIONS & STEPPER ---
  function recalcPrices() {
    const addonCheck = document.getElementById('addonProtectionCheck');
    state.bookingData.protectionAddon = addonCheck ? addonCheck.checked : false;

    let total = state.bookingData.basePrice;
    if (state.bookingData.protectionAddon) {
      total += state.bookingData.protectionPrice;
    }
    state.bookingData.totalPrice = total;

    // Update all dynamic price elements
    document.querySelectorAll('.js-base-price').forEach(el => {
      el.textContent = `${state.bookingData.basePrice.toFixed(2).replace('.', ',')} €`;
    });
    document.querySelectorAll('.js-total-price').forEach(el => {
      el.textContent = `${state.bookingData.totalPrice.toFixed(2).replace('.', ',')} €`;
    });
    document.querySelectorAll('.js-provider-title').forEach(el => {
      el.textContent = state.bookingData.provider;
    });
  }

  const addonProtectionCheck = document.getElementById('addonProtectionCheck');
  if (addonProtectionCheck) {
    addonProtectionCheck.addEventListener('change', recalcPrices);
  }

  // Payment Method Selection Tabs
  const paymentCards = document.querySelectorAll('.payment-method-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      state.bookingData.paymentMethod = card.getAttribute('data-method') || 'paypal';
    });
  });

  // Step 1 Form Submission
  const checkoutStep1Form = document.getElementById('checkoutStep1Form');
  if (checkoutStep1Form) {
    checkoutStep1Form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Read values
      const fName = document.getElementById('custFirstName');
      const lName = document.getElementById('custLastName');
      const email = document.getElementById('custEmail');
      const phone = document.getElementById('custPhone');
      const plate = document.getElementById('custPlate');
      const model = document.getElementById('custModel');

      if (fName && fName.value) state.bookingData.customer.firstName = fName.value;
      if (lName && lName.value) state.bookingData.customer.lastName = lName.value;
      if (email && email.value) state.bookingData.customer.email = email.value;
      if (phone && phone.value) state.bookingData.customer.phone = phone.value;
      if (plate && plate.value) state.bookingData.customer.plate = plate.value;
      if (model && model.value) state.bookingData.customer.carModel = model.value;

      showToast('Daten gespeichert. Weiter zur Bezahlung...');
      setTimeout(() => {
        showScreen('screen-checkout-step2');
      }, 250);
    });
  }

  // Step 2 Form Submission (Pay Now)
  const checkoutStep2Form = document.getElementById('checkoutStep2Form');
  if (checkoutStep2Form) {
    checkoutStep2Form.addEventListener('submit', (e) => {
      e.preventDefault();
      const agbCheck = document.getElementById('checkTermsAgb');
      if (agbCheck && !agbCheck.checked) {
        alert('Bitte akzeptieren Sie die AGB und Datenschutzerklärung, um fortzufahren.');
        return;
      }
      showToast('Buchung wird autorisiert...');
      setTimeout(() => {
        showScreen('screen-checkout-step3');
      }, 400);
    });
  }

  // --- 8. ACCORDION LOGIC ---
  document.addEventListener('click', (e) => {
    const questionBtn = e.target.closest('.faq-question');
    if (questionBtn) {
      const item = questionBtn.closest('.faq-item');
      if (item) {
        item.classList.toggle('open');
      }
    }
  });

  // --- 9. DETAIL PAGE TABS ---
  const detailTabButtons = document.querySelectorAll('.detail-tab-btn');
  detailTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPaneId = btn.getAttribute('data-tab');
      detailTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.detail-tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // --- 10. MODAL EMAIL PREVIEW ---
  const emailModal = document.getElementById('emailPreviewModal');
  const openEmailModalBtns = document.querySelectorAll('.js-open-email-modal');
  const closeEmailModalBtns = document.querySelectorAll('.js-close-email-modal');

  openEmailModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (emailModal) emailModal.classList.add('active');
    });
  });

  closeEmailModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (emailModal) emailModal.classList.remove('active');
    });
  });

  if (emailModal) {
    emailModal.addEventListener('click', (e) => {
      if (e.target === emailModal) {
        emailModal.classList.remove('active');
      }
    });
  }

  // --- 11. HELPER / DYNAMIC UPDATES ---
  function updateScreenDynamicContent(screenId) {
    recalcPrices();
    if (screenId === 'screen-kiel-search') {
      renderListings();
    }
  }

  // Toast Function
  let toastTimeout;
  function showToast(msg) {
    let toast = document.getElementById('protoToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'protoToast';
      toast.className = 'proto-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="#ffb703" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
      <span>${msg}</span>
    `;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Copy to clipboard helper
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      const textToCopy = copyBtn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Kopiert: ${textToCopy}`);
      }).catch(() => {
        showToast(`Code: ${textToCopy}`);
      });
    }
  });

  // Initialize first view
  showScreen('screen-home');
  recalcPrices();
  renderListings();
});
