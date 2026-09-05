# Dead Women Society

An independent feminist publication by Nicole. Four essays explore women's work, autonomy, solidarity, and struggles under patriarchy.

## Run locally

Requires Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by the development server.

```sh
npm run build
npm start
```

This repository contains source code only. No automatic deployment or GitHub Pages workflow is configured.

## Content and design

- Article text, metadata, image credits, and book pages: `app/articles.json`
- Homepage and interactive book reader: `app/page.tsx`
- Responsive layout, page-turn effects, and colors: `app/globals.css`
- Historical article images: `public/archive/`
- Supplied brand logo: `public/dead-women-society-logo.png`

The reader supports two-page desktop spreads, single-page mobile reading, a contents menu, navigation buttons, keyboard arrows, touch swipes, and reduced motion preferences.

The essays are imported from the author's supplied publication. Original email/PDF exports and local hosting identifiers are excluded. Source portraits retain their credits in the article data. This repository does not grant additional rights to the essays or third-party images.

The stack is React, TypeScript, Vinext/Vite, Tailwind CSS, Base UI, and Lucide.
