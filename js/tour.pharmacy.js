/* tour.pharmacy.js — welcome modal copy + spotlight steps for the pharmacy dashboard.
   Load AFTER flow.js and BEFORE tour.js. */

window.WEEL_TOUR = {
  role: 'pharmacy',
  org: (s) => (s.pharmacy && s.pharmacy.name) || 'Lakeshore Pharmacy',

  welcome: {
    title: { en: 'Welcome to Weel', fr: 'Bienvenue chez Weel' },
    bullets: [
      {
        icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
        text: {
          en: 'Create a delivery in under a minute — techs and assistants included.',
          fr: 'Créez une livraison en moins d’une minute — techniciens et assistants inclus.'
        }
      },
      {
        icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        text: {
          en: 'Patients get a live SMS tracking link — no app, no calls to the counter.',
          fr: 'Les patients reçoivent un lien de suivi par SMS — sans application, sans appels au comptoir.'
        }
      },
      {
        icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
        text: {
          en: 'Proof of delivery and chain of custody, recorded automatically.',
          fr: 'Preuve de livraison et chaîne de possession, enregistrées automatiquement.'
        }
      }
    ],
    note: {
      en: 'You’re in test mode — explore everything; nothing goes out the door yet.',
      fr: 'Vous êtes en mode test — explorez tout ; rien ne part encore en livraison.'
    },
    primary: { en: 'Show me around · 1 min', fr: 'Faites-moi visiter · 1 min' }
  },

  steps: [
    {
      target: '[data-tour="nav"]',
      placement: 'right',
      title: { en: 'Everything lives here', fr: 'Tout se passe ici' },
      body: {
        en: 'Deliveries, patients, calendar and compliance — one click each. The weel logo always brings you back home.',
        fr: 'Livraisons, patients, calendrier et conformité — un clic chacun. Le logo weel vous ramène toujours à l’accueil.'
      }
    },
    {
      target: '[data-tour="create-delivery"]',
      placement: 'right',
      title: { en: 'Your most-used button', fr: 'Votre bouton le plus utilisé' },
      body: {
        en: 'One form: who, where, when. Most techs finish in under a minute.',
        fr: 'Un seul formulaire : qui, où, quand. La plupart des techniciens terminent en moins d’une minute.'
      }
    },
    {
      target: '[data-tour="stats"]',
      placement: 'bottom',
      title: { en: 'Your numbers, at a glance', fr: 'Vos chiffres, en un coup d’œil' },
      body: {
        en: 'This week’s deliveries and where every order stands — it fills in as you deliver.',
        fr: 'Les livraisons de la semaine et l’état de chaque commande — ça se remplit au fil de vos livraisons.'
      }
    },
    {
      target: '[data-tour="today-table"]',
      placement: 'top',
      title: { en: 'Today’s board', fr: 'Le tableau du jour' },
      body: {
        en: 'These rows are samples so you can see the shape. Your first real delivery replaces them.',
        fr: 'Ces lignes sont des exemples pour vous montrer la forme. Votre première vraie livraison les remplacera.'
      }
    },
    {
      target: '[data-tour="ask-phil"]',
      placement: 'bottom',
      title: { en: 'Stuck? Ask Phil', fr: 'Coincé ? Demandez à Phil' },
      body: {
        en: 'Phil answers in plain language — “which orders are overdue?” beats digging through menus.',
        fr: 'Phil répond en langage clair — « quelles commandes sont en retard ? » vaut mieux que fouiller les menus.'
      }
    },
    {
      target: '[data-tour="checklist"]',
      placement: 'left',
      title: { en: 'Finish these 5 and you’re live', fr: 'Terminez ces 5 étapes et vous êtes en ligne' },
      body: {
        en: 'This list is the whole setup. Do the licence first — it’s the only step with a wait.',
        fr: 'Cette liste, c’est toute la configuration. Commencez par la licence — c’est la seule étape avec un délai.'
      }
    }
  ]
};
