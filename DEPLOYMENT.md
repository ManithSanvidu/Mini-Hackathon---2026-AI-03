# Frontend and backend on Vercel

Create two Vercel projects from this repository, both using the Dev branch and Node 24. MongoDB remains on Atlas. Railway is not required; the optional railway.json is unused by Vercel.

## Backend project

1. Import the repository with Root Directory set to backend. The Express preset is specified in backend/vercel.json. Keep the default Express build/output settings; install uses npm ci.
2. Set MONGO_URI to the Atlas URI, JWT_SECRET to a long random secret, and OFFICER_REGISTRATION_CODE to a private signup code.
3. Set CORS_ORIGINS to the exact frontend origin, such as https://your-frontend.vercel.app. Multiple approved origins can be comma-separated with no trailing slash.
4. Deploy and note the backend HTTPS origin. Vercel invokes the exported app.js; its middleware initializes MongoDB before serving requests. No custom start command or PORT setting is needed on Vercel.
5. Ensure Atlas allows connections from your deployment. Check /api/health on the backend domain; it returns 200 only with an active database connection.
6. The frontend browser must be able to reach the backend API without a Vercel deployment-protection login. Configure protection for the environments you use; application authentication still protects officer routes.

## Frontend project

1. Import the same repository again with Root Directory set to frontend and the Vite preset.
2. frontend/vercel.json sets npm ci, npm run build, output dist, and the SPA route fallback.
3. Set VITE_API_URL to your backend project's HTTPS origin, with no /api suffix, for example https://your-backend.vercel.app.
4. Set the backend CORS_ORIGINS to the final frontend origin, then redeploy the backend if it changed. Rebuild the frontend whenever VITE_API_URL changes.
5. Configure variables separately for Production and any Preview environments you use. Add approved preview frontend origins explicitly to backend CORS_ORIGINS.

VITE_* variables are embedded in public JavaScript. Never put MongoDB credentials, JWT_SECRET, or the officer registration code in frontend variables.

## Local development

Copy backend/.env.example to backend/.env and replace placeholders. Copy frontend/.env.example to frontend/.env if absent. The existing local frontend .env uses http://localhost:5001. Run npm ci and npm run dev in each directory. Local startup still uses server.js on port 5001.

## Before publishing

- Commit and push the completed deployment changes to Dev; Git-connected deployments use committed files, not local edits.
- Rotate the database password previously committed in backend/.env.example and put the replacement in the backend Vercel variables. Removing it from the current file does not remove Git history.
- Test registration, invalid login rejection, report submission, officer status updates, public map loading, and refreshing nested frontend URLs.
- API regression tests mock persistence; live Atlas connectivity and deployed end-to-end flows require verification after environment configuration.
- Photo uploads remain unavailable until persistent media storage is implemented.

References: [Vercel Express](https://vercel.com/docs/frameworks/backend/express), [Vercel Vite](https://vercel.com/docs/frameworks/frontend/vite).
