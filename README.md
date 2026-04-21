# Frontend

React + Vite web app for the Malware Checker platform. Lets users upload a file and see whether it contains malware.

## Running locally

```bash
npm install
npm run dev
```

App starts on `http://localhost:5173`. Requires the Backend API running on port 3000.

## API proxy

Vite proxies `/check`, `/report`, and `/healthcheck` to `http://localhost:3000` during development so there are no CORS issues.

## Building for production

```bash
npm run build   # output in /dist
```
