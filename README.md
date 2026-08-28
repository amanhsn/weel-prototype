# Weel Front Door — prototype

A clickable, production-styled prototype of Weel's self-serve signup, onboarding, and login
for three personas (pharmacy, courier company, courier dispatcher). Plain HTML + CSS + vanilla JS,
no build step. UI follows **weel-design-system.vercel.app** — tokens, fonts (Satoshi + Geist,
self-hosted from the DS build), components.



## Run it

```sh
./serve.sh            # serves on http://localhost:5050
# or manually:
python3 -m http.server 5050
```

Root-absolute asset paths mean it must be served (not opened as file://).

## Walkthrough (happy paths)

1. **Login** `http://localhost:5050` — adaptive email-first auth, Google/Microsoft SSO, FR/EN toggle.
   Type any email → Continue → create account → email-code screen → persona fork.
2. **Pharmacy**: fork → "I run a pharmacy" → 3-step wizard (basics → delivery model → live quote +
   simulated dispatch on the map) → dashboard with "Get delivery-ready" checklist →
   "Verify your pharmacy licence" runs the async verification tracker
   (submitted → in review → one doc needs a fix → re-upload → all clear → dispatch unlocked).
3. **Courier company**: fork → "I run a courier company" → create workspace → fleet builder
   (SMS driver invites, CSV import, dispatcher invite with team scope) → compliance
   (COI + PHIPA e-sign flips "cleared to operate"; capability tiers unlock) → Go live → job board.
4. **Dispatcher**: invited path `dispatcher/join.html` (magic-link landing, one screen → board),
   or cold start via fork (company search → request access → pending state).

"Reset prototype ↺" (bottom of dashboards) clears state. State lives in localStorage.

## Files

- `css/weel.css` — the design-system port: tokens copied 1:1 from the DS compiled CSS, components
  matched to Storybook stories (Button, Input, Form Controls, Sidebar, Topbar, OrderStatusBadge,
  DataTable, Demo/Login, Demo/Dashboard).
- `js/flow.js` — wizard state, fake async verification, invites, EN/FR dictionary.
- `assets/fonts/` — Satoshi Variable + Geist woff2, taken from the design system's own build.
