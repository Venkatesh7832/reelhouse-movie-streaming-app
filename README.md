# Reelhouse — Movie & TV Discovery Frontend

A frontend-only movie and television discovery application built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, Axios, and Zustand.

## Current scope

- Trending, popular, top-rated, and upcoming/on-air discovery pages.
- Movie and TV detail pages with cast, recommendations, similar titles, and trailers.
- Multi-search with filters and local search history.
- Local watchlist and watch history persistence.
- Demo-only local authentication and protected frontend routes.
- Responsive layouts and motion-enhanced interactions.

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Run locally

```bash
npm install
cp .env.example .env
```

Set `VITE_TMDB_ACCESS_TOKEN` in `.env` to a TMDB API Read Access Token, then run:

```bash
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Environment variables

```env
VITE_API_MODE=tmdb
VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

**Security:** Vite exposes every `VITE_*` variable in the browser bundle. A TMDB token configured this way is visible to visitors. This direct-TMDB mode is for local prototyping only, not production deployment.

## Future backend integration

Set `VITE_API_MODE=backend` and point `VITE_BACKEND_URL` at your own API. The media service module is the adapter boundary; components should consume the service hooks and normalized `Media` types rather than making HTTP requests themselves.

The backend should provide normalized endpoints compatible with `src/services/api/media.service.ts`. Update only the adapter when the backend response contract differs.

Authentication is currently a local mock. It does not provide real identity verification or security. Watchlist and history are stored in browser localStorage through Zustand persistence. Replace these service/store implementations with authenticated backend calls when the backend is available.

## TMDB attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Movie and TV metadata and images are provided by TMDB.
