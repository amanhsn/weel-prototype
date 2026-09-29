/* tour.courier.drivers.js — feature-level spotlight tour for courier/drivers.html (the persistent
   Drivers management screen — not the fleet.html onboarding-wizard step, which never gets a tour).
   Auto-fires on first visit, throttled to one feature tour per browser tab session (see tour.js).
   Load AFTER flow.js and BEFORE tour.js. No welcome modal — feature tours open directly on the first step. */

window.WEEL_TOUR = {
  role: 'courier',
  feature: 'drivers',
  auto: true,
  featureName: { en: 'Drivers', fr: 'Chauffeurs' },

  steps: [
    {
      target: '[data-tour="drivers-add"]',
      placement: 'bottom',
      title: { en: 'Add a driver', fr: 'Ajoutez un chauffeur' },
      body: {
        en: 'Name and mobile number — they get an SMS invite with a temporary password, no app-store hunt.',
        fr: 'Nom et numéro mobile — il reçoit une invitation SMS avec un mot de passe temporaire, sans chercher d’application.'
      }
    },
    {
      target: '[data-tour="drivers-table"]',
      placement: 'top',
      title: { en: 'Your fleet, one table', fr: 'Votre flotte, un tableau' },
      body: {
        en: 'ID, contact details and status for every driver you’ve invited — edit or remove from Actions.',
        fr: 'ID, coordonnées et statut de chaque chauffeur invité — modifiez ou retirez depuis Actions.'
      }
    },
    {
      target: '[data-tour="drivers-search"]',
      placement: 'bottom',
      title: { en: 'Find one fast', fr: 'Trouvez-en un rapidement' },
      body: {
        en: 'Search by name as your roster grows.',
        fr: 'Recherchez par nom à mesure que votre équipe grandit.'
      }
    }
  ]
};
