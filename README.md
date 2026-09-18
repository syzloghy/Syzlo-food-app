# SYZLO — The Bao Makers

React + TypeScript + Vite frontend for the SYZLO food-ordering platform.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The production output is generated in `dist/`.

## Important security note

The current project contains a **demo frontend staff gate**. `VITE_DEMO_ADMIN_PHONE` and `VITE_DEMO_ADMIN_PIN` are browser-visible build variables and must NOT be treated as secure authentication. Before handling real customer/admin data, replace this with backend authentication and authorization.

Payment gateway secret keys must never be stored in frontend code or `VITE_*` variables. Keep them on the server/backend.

## Hostinger

For Hostinger Web Apps / Node.js hosting, use:

- Framework: Vite / React
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 20.x or 22.x

For a traditional static deployment, upload the contents of `dist/` to the site's public web root after building. The included `.htaccess` and `_redirects` files provide SPA fallback support for hosts that use them.
