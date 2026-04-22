# Frontend

React + Vite web app for the Malware Checker platform. Lets users upload a file and see a full scan report including threat score, verdict, and per-engine findings.

## Features

- Drag-and-drop or click-to-browse file upload
- Live threat score meter (0–100) with colour-coded severity
- Per-finding breakdown showing engine, signature, and description
- Three verdict states: Clean, Suspicious, Malicious

## Running locally

```bash
npm install
npm run dev
```

App starts on `http://localhost:5173`. Requires the Backend API running on port 3000.

## API proxy

Vite proxies `/check`, `/report`, and `/healthcheck` to `http://localhost:3000` during development — no CORS configuration needed.

## Building for production

```bash
npm run build   # output in /dist
```
