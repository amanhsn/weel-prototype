/* tour.courier.reports.js — feature-level spotlight tour for courier/reports.html (Delivery Reports).
   Auto-fires on first visit, throttled to one feature tour per browser tab session (see tour.js).
   Load AFTER flow.js and BEFORE tour.js. No welcome modal — feature tours open directly on the first step. */

window.WEEL_TOUR = {
  role: 'courier',
  feature: 'delivery-reports',
  auto: true,
  featureName: { en: 'Delivery Reports', fr: 'Rapports de livraison' },

  steps: [
    {
      target: '[data-tour="reports-filter-bar"]',
      placement: 'bottom',
      title: { en: 'Slice it your way', fr: 'Filtrez à votre façon' },
      body: {
        en: 'Filter by status, pharmacy, or fields — the date range narrows everything at once.',
        fr: 'Filtrez par statut, pharmacie ou champs — la période resserre tout en même temps.'
      }
    },
    {
      target: '[data-tour="reports-table"]',
      placement: 'top',
      title: { en: 'Proof for every delivery', fr: 'La preuve pour chaque livraison' },
      body: {
        en: 'Status, customer and Amount per delivery — tap Load next to Signature for proof of delivery.',
        fr: 'Statut, client et montant — touchez Charger près de Signature pour la preuve.'
      }
    },
    {
      target: '[data-tour="reports-download"]',
      placement: 'left',
      title: { en: 'Export what you’re looking at', fr: 'Exportez ce que vous voyez' },
      body: {
        en: 'Download pulls exactly the filtered rows in front of you.',
        fr: 'Télécharger extrait exactement les lignes filtrées devant vous.'
      }
    }
  ]
};
