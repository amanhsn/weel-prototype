/* tour.courier.js — welcome modal copy + spotlight steps for the courier admin dashboard.
   Load AFTER flow.js and BEFORE tour.js. */

window.WEEL_TOUR = {
  role: 'courier',
  org: (s) => (s.courier && s.courier.name) || 'Rapide Livraison Inc.',

  welcome: {
    title: { en: 'Welcome to Weel', fr: 'Bienvenue chez Weel' },
    bullets: [
      {
        icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
        text: {
          en: 'Every delivery your pharmacies request, on one board.',
          fr: 'Chaque livraison demandée par vos pharmacies, sur un seul tableau.'
        }
      },
      {
        icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        text: {
          en: 'Assign a driver in two clicks — they get SMS directions, no app hunt.',
          fr: 'Assignez un chauffeur en deux clics — il reçoit l’itinéraire par SMS, sans chercher d’application.'
        }
      },
      {
        icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        text: {
          en: 'Billing runs itself — every delivery is invoiced to the pharmacy at your rate.',
          fr: 'La facturation se gère toute seule — chaque livraison est facturée à la pharmacie à votre tarif.'
        }
      }
    ],
    note: {
      en: 'Ambient deliveries unlock at clearance — cold chain and controlled follow as you clear those tiers.',
      fr: 'Les livraisons ambiantes se débloquent à l’autorisation — chaîne du froid et substances contrôlées suivent à mesure que vous validez ces paliers.'
    },
    primary: { en: 'Show me around · 1 min', fr: 'Faites-moi visiter · 1 min' }
  },

  steps: [
    {
      target: '[data-tour="nav"]',
      placement: 'right',
      title: { en: 'Your operation, one sidebar', fr: 'Votre opération, une barre latérale' },
      body: {
        en: 'Orders, pharmacies, drivers, calendar and the live map — dispatch runs from here.',
        fr: 'Commandes, pharmacies, chauffeurs, calendrier et carte en direct — la répartition part d’ici.'
      }
    },
    {
      target: '[data-tour="deliveries-board"]',
      placement: 'top',
      title: { en: 'The deliveries board', fr: 'Le tableau des livraisons' },
      body: {
        en: 'Every delivery a pharmacy has requested, and which driver is taking it — click a row for the full detail. Samples until your first real delivery.',
        fr: 'Chaque livraison demandée par une pharmacie, et quel chauffeur s’en occupe — cliquez une ligne pour tout le détail. Des exemples jusqu’à votre première vraie livraison.'
      }
    },
    {
      target: '[data-tour="nav-drivers"]',
      placement: 'right',
      title: { en: 'Your fleet', fr: 'Votre flotte' },
      body: {
        en: 'Add drivers by name and phone — they get an SMS invite with a temporary password.',
        fr: 'Ajoutez des chauffeurs par nom et téléphone — ils reçoivent une invitation SMS avec un mot de passe temporaire.'
      }
    },
    {
      target: '[data-tour="view-map"]',
      placement: 'bottom',
      title: { en: 'Watch it move', fr: 'Regardez ça bouger' },
      body: {
        en: 'Every driver and delivery on one map — the fastest way to spot a route going sideways.',
        fr: 'Chaque chauffeur et chaque livraison sur une carte — le moyen le plus rapide de repérer un itinéraire qui dérape.'
      }
    },
    {
      target: '[data-tour="checklist"]',
      placement: 'left',
      title: { en: 'Finish these 5 and you’re dispatching', fr: 'Terminez ces 5 étapes et vous répartissez' },
      body: {
        en: 'Company verification first — most clear the same day.',
        fr: 'La vérification de l’entreprise d’abord — la plupart passent le jour même.'
      }
    }
  ]
};
