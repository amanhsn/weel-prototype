/* tour.courier.pharmacies.js — feature-level spotlight tour for courier/pharmacies.html.
   Auto-fires on first visit, throttled to one feature tour per browser tab session (see tour.js).
   Load AFTER flow.js and BEFORE tour.js. No welcome modal — feature tours open directly on the first step. */

window.WEEL_TOUR = {
  role: 'courier',
  feature: 'pharmacies',
  auto: true,
  featureName: { en: 'Pharmacies', fr: 'Pharmacies' },

  steps: [
    {
      target: '[data-tour="pharmacies-add"]',
      placement: 'bottom',
      title: { en: 'Add a pharmacy', fr: 'Ajoutez une pharmacie' },
      body: {
        en: 'Register a pharmacy’s address and contacts once — every delivery you dispatch for them pulls from here.',
        fr: 'Enregistrez l’adresse et les contacts d’une pharmacie une seule fois — chaque livraison que vous répartissez pour elle en découle.'
      }
    },
    {
      target: '[data-tour="pharmacies-table"]',
      placement: 'top',
      title: { en: 'Every pharmacy you serve', fr: 'Toutes vos pharmacies' },
      body: {
        en: 'ID, address, phone and email in one row — edit or remove from Actions.',
        fr: 'ID, adresse, téléphone et courriel sur une ligne — modifiez ou retirez depuis Actions.'
      }
    },
    {
      target: '[data-tour="pharmacies-search"]',
      placement: 'bottom',
      title: { en: 'Find one fast', fr: 'Trouvez-en une rapidement' },
      body: {
        en: 'Search by name or address as your list grows.',
        fr: 'Recherchez par nom ou adresse à mesure que votre liste grandit.'
      }
    }
  ]
};
