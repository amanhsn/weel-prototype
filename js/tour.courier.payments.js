/* tour.courier.payments.js — feature-level spotlight tour for courier/payments.html.
   Auto-fires on first visit, throttled to one feature tour per browser tab session (see tour.js).
   Load AFTER flow.js and BEFORE tour.js. No welcome modal — feature tours open directly on the first step. */

window.WEEL_TOUR = {
  role: 'courier',
  feature: 'payments',
  auto: true,
  featureName: { en: 'Payments', fr: 'Paiements' },

  steps: [
    {
      target: '[data-tour="payments-collected"]',
      placement: 'bottom',
      title: { en: 'What you’ve collected', fr: 'Ce que vous avez encaissé' },
      body: {
        en: 'The Amount collected across your deliveries for the range you’ve selected.',
        fr: 'Le montant encaissé pour vos livraisons sur la période choisie.'
      }
    },
    {
      target: '[data-tour="payments-filters"]',
      placement: 'bottom',
      title: { en: 'Any window you need', fr: 'La période qu’il vous faut' },
      body: {
        en: 'Narrow to a day or widen to a quarter — every figure updates to match.',
        fr: 'Réduisez à une journée ou élargissez à un trimestre — tous les chiffres suivent.'
      }
    },
    {
      target: '[data-tour="payments-export"]',
      placement: 'left',
      title: { en: 'Take it with you', fr: 'Emportez-le' },
      body: {
        en: 'Export CSV pulls the same rows you’re looking at, for your books or your accountant.',
        fr: 'Exporter CSV extrait les mêmes lignes affichées, pour votre comptabilité.'
      }
    }
  ]
};
