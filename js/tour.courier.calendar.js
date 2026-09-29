/* tour.courier.calendar.js — feature-level spotlight tour for courier/calendar.html.
   Auto-fires on first visit, throttled to one feature tour per browser tab session (see tour.js).
   Load AFTER flow.js and BEFORE tour.js. No welcome modal — feature tours open directly on the first step. */

window.WEEL_TOUR = {
  role: 'courier',
  feature: 'calendar',
  auto: true,
  featureName: { en: 'Calendar', fr: 'Calendrier' },

  steps: [
    {
      target: '[data-tour="calendar-view-toggle"]',
      placement: 'bottom',
      title: { en: 'Day, week or month', fr: 'Jour, semaine ou mois' },
      body: {
        en: 'Switch views to see today’s deliveries or plan a whole week.',
        fr: 'Changez de vue pour voir les livraisons du jour ou planifier une semaine.'
      }
    },
    {
      target: '[data-tour="calendar-day-cell"]',
      placement: 'right',
      title: { en: 'Click any day', fr: 'Cliquez un jour' },
      body: {
        en: 'Open a day to see every delivery scheduled for it, driver by driver.',
        fr: 'Ouvrez un jour pour voir chaque livraison planifiée, chauffeur par chauffeur.'
      }
    },
    {
      target: '[data-tour="calendar-today"]',
      placement: 'bottom',
      title: { en: 'Jump to today', fr: 'Revenez à aujourd’hui' },
      body: {
        en: 'One click back to today’s dispatch, wherever you’ve scrolled.',
        fr: 'Un clic pour revenir à la répartition du jour.'
      }
    }
  ]
};
