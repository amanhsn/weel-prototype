/* tour.courier.orders.js — feature-level spotlight tour for courier/orders.html.
   Auto-fires on first visit, throttled to one feature tour per browser tab session (see tour.js).
   Load AFTER flow.js and BEFORE tour.js. No welcome modal — feature tours open directly on the first step. */

window.WEEL_TOUR = {
  role: 'courier',
  feature: 'orders',
  auto: true,
  featureName: { en: 'Orders', fr: 'Commandes' },

  steps: [
    {
      target: '[data-tour="orders-list"]',
      placement: 'top',
      title: { en: 'Every order, one list', fr: 'Chaque commande, une liste' },
      body: {
        en: 'Every delivery request your pharmacies have logged.',
        fr: 'Chaque demande de livraison enregistrée par vos pharmacies.'
      }
    },
    {
      target: '[data-tour="orders-status-filter"]',
      placement: 'bottom',
      title: { en: 'Find a status fast', fr: 'Trouvez un statut rapidement' },
      body: {
        en: 'Filter to Ready, Scheduled, Delivered, Returned or Incomplete — same breakdown as your dashboard.',
        fr: 'Filtrez par Prêt, Planifié, Livré, Retourné ou Incomplet — même répartition que votre tableau de bord.'
      }
    },
    {
      target: '[data-tour="orders-create"]',
      placement: 'right',
      title: { en: 'Start one from here too', fr: 'Créez-en une ici aussi' },
      body: {
        en: 'Create Order works from any screen — Orders just keeps the history.',
        fr: 'Créer une commande fonctionne depuis n’importe quel écran — Commandes garde l’historique.'
      }
    }
  ]
};
