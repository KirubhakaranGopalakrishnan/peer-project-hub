# Peer Project Hub

A full-stack MERN platform where students post coding projects, discover
others' work, comment, rate, like, and bookmark. Dark, Linear/Vercel-inspired
UI. Auth via Firebase.

## Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Firebase Auth (client SDK)
- **Backend:** Express, Mongoose, Firebase Admin SDK (verifies tokens)
- **Database:** MongoDB

---

## 1. Create your Firebase project (required — do this first)

Firebase can't be pre-configured for you since it's tied to your own Google
account. This takes about 10 minutes.

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it (e.g. "peer-project-hub") → finish the wizard (you can skip Google Analytics).
2. In the left sidebar: **Build → Authentication → Get started**.
3. Under **Sign-in method**, enable **Email/Password**, and optionally **Google** (needed for the "Continue with Google" button).
4. Get your **frontend config**: ⚙️ Project Settings → General → scroll to "Your apps" → click the **</>** (Web) icon → register an app (no need for Firebase Hosting) → copy the `firebaseConfig` object. These values go into `client/.env`.
5. Get your **backend service account key**: ⚙️ Project Settings → **Service Accounts** tab → **Generate new private key** → downloads a JSON file. You'll paste its full contents (as one line) into `server/.env` as `FIREBASE_SERVICE_ACCOUNT_KEY`.

Keep both of these private — never commit them to a public repo.

---

## 2. MongoDB

Use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (recommended) or a local MongoDB install. Either way you just need a connection string for `MONGO_URI`.

---

## 3. Local setup

### Backend
```bash
cd server
npm install
cp .env.example .env
```
Fill in `server/.env`:
```
PORT=5000
MONGO_URI=<your MongoDB connection string>
FIREBASE_SERVICE_ACCOUNT_KEY=<the full service account JSON, as one line>
FRONTEND_URL=https://your-app.vercel.app
```

To turn the downloaded service account JSON file into a single line, run:
```bash
node -e "console.log(JSON.stringify(require('./path/to/downloaded-key.json')))"
```
Paste the output as the value of `FIREBASE_SERVICE_ACCOUNT_KEY`.

Start it:
```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
```
Fill in `client/.env` with your Firebase **web app** config (from step 1.4) and the backend URL:
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Start it:
```bash
npm run dev
```

Visit `http://localhost:5173`, sign up, and start posting projects.

---

## 4. How auth actually works here

- The **frontend** uses the Firebase client SDK directly for signup/login — Firebase handles passwords, sessions, and tokens; your backend never sees a password.
- Every API request from the frontend automatically attaches the user's current Firebase **ID token** (`Authorization: Bearer <token>`), handled in `client/src/api/axios.js`.
- The **backend** verifies that token on every protected route using `firebase-admin`, and auto-creates a matching `User` document in MongoDB on first request (for bio/profile data that Firebase itself doesn't store).

---

## 5. Deployment

Same split as before: **backend → Render**, **frontend → Vercel**.

### Backend on Render
1. New Web Service → connect your repo → Root Directory: `server`.
2. Build Command: `npm install`. Start Command: `npm start`.
3. Environment variables: `MONGO_URI`, `FIREBASE_SERVICE_ACCOUNT_KEY`, `FRONTEND_URL` (your Vercel URL once you have it).
4. Deploy, note the live URL (e.g. `https://peer-project-hub.onrender.com`).

### Frontend on Vercel
1. Import the repo → Root Directory: `client`.
2. Environment variables: `VITE_API_URL=https://<your-render-url>/api`, plus all six `VITE_FIREBASE_*` values.
3. Deploy.
4. **Important Firebase step:** in Firebase Console → Authentication → Settings → **Authorized domains**, add your Vercel domain (e.g. `your-app.vercel.app`). Firebase blocks auth requests from unrecognized domains by default — this is the #1 thing people forget when deploying.

---

## 6. API Reference

| Method | Route                              | Auth      | Notes                              |
|--------|-------------------------------------|-----------|-------------------------------------|
| GET    | /api/projects                       | no        | `?q=&tag=&page=&limit=`             |
| GET    | /api/projects/mine                  | yes       | current user's projects             |
| GET    | /api/projects/:id                   | optional  | includes isLiked/isBookmarked/myRating if logged in |
| POST   | /api/projects                       | yes       | create                              |
| PUT    | /api/projects/:id                   | yes (owner) | update                            |
| DELETE | /api/projects/:id                   | yes (owner) | delete + cascades comments/likes/bookmarks/ratings |
| POST   | /api/projects/:id/comments          | yes       | add comment                         |
| DELETE | /api/projects/:id/comments/:commentId | yes (author) | delete own comment            |
| POST   | /api/projects/:id/bookmark          | yes       | toggle                              |
| POST   | /api/projects/:id/like              | yes       | toggle                              |
| POST   | /api/projects/:id/rating            | yes       | body: `{ value: 1-5 }`, upserts     |
| GET    | /api/users/:uid                     | no        | profile + their projects            |
| PUT    | /api/users/me                       | yes       | update own bio/displayName/photoURL |
| GET    | /api/users/me/bookmarks             | yes       | current user's bookmarked projects  |
| GET    | /api/analytics                      | no        | totals + most-liked project         |

---

## 7. Known limitations / next steps

- No image upload for project screenshots — add Firebase Storage or Cloudinary if wanted.
- Search uses MongoDB text search on title/description/tags — fine for a class project, not built for scale.
- No pagination on comments (fine unless a project gets hundreds).
- No rate limiting on the API — add `express-rate-limit` before making this public-facing for real.
