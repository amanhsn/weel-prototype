/* tour.courier.map.js — feature-level spotlight tour for courier/map.html (Map View).
   Auto-fires on first visit, throttled to one feature tour per browser tab session (see tour.js).
   Load AFTER flow.js and BEFORE tour.js. No welcome modal — feature tours open directly on the first step. */

window.WEEL_TOUR = {
  role: 'courier',
  feature: 'map-view',
  auto: true,
  featureName: { en: 'Map View', fr: 'Vue carte' },

  steps: [
    {
      target: '[data-tour="map-tabs"]',
      placement: 'right',
      title: { en: 'Two ways in', fr: 'Deux points d’entrée' },
      body: {
        en: 'Switch between your drivers and your pharmacies — search either list to jump to a pin.',
        fr: 'Passez de vos chauffeurs à vos pharmacies — cherchez dans l’une ou l’autre liste pour sauter à un point.'
      }
    },
    {
      target: '[data-tour="map-canvas"]',
      placement: 'left',
      title: { en: 'Every driver, live', fr: 'Chaque chauffeur, en direct' },
      body: {
        en: 'Pins cluster as you zoom out; tap one to see who’s carrying what, right now.',
        fr: 'Les points se regroupent en dézoomant; touchez-en un pour voir qui transporte quoi, en ce moment.'
      }
    },
    {
      target: '[data-tour="map-view-profile"]',
      placement: 'right',
      title: { en: 'One click to the detail', fr: 'Un clic pour le détail' },
      body: {
        en: 'View Profile opens that driver’s current deliveries without leaving the map.',
        fr: 'Voir le profil ouvre les livraisons en cours de ce chauffeur sans quitter la carte.'
      }
    }
  ]
};
