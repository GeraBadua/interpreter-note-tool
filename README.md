# Interpreter Note Tool

Smart notebook for interpreters with live translation, glossary lookup, and role-based workflows. Built as a portfolio-ready web app with a demo mode so it can run without a database.

## Features

- Interpreter and Admin flows
- Real-time translation and dictionary lookup
- Smart notes UI with saved note list
- Demo mode for deployment without MongoDB

## Demo Credentials (No Database)

When `MONGODB_URI` is missing or `DEMO_MODE=true`, the app runs in demo mode.
Demo mode uses in-memory notes only (refreshing the page resets them).

- Admin: `admin@demo.com` / `Admin123!`
- Interpreter: `interpreter@demo.com` / `Interpreter123!`

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional: MongoDB Setup

Create a `.env.local` file and add:

```bash
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<dbName>?retryWrites=true&w=majority"
JWT_SECRET="your-secret"
DEEPL_API_KEY="your-deepl-key"
```

If you want to force demo mode even with a database, add:

```bash
DEMO_MODE="true"
```

## Deploy

You can deploy on Vercel without MongoDB by leaving `MONGODB_URI` unset. The demo mode will handle login and notes with in-memory data.

## API Notes (Why Some Endpoints Fail)

Some endpoints require credentials:

- `/api/translate` needs `DEEPL_API_KEY` (DeepL)
- `/api/dictionary` also uses `DEEPL_API_KEY` to translate definitions
- `/api/datamuse` works without credentials

Database-backed endpoints:

- `/api/login` and `/api/notes` work in demo mode if `MONGODB_URI` is missing or `DEMO_MODE=true`
- `/api/intreg`, `/api/adminreg`, `/api/adminteam` are disabled in demo mode (they need MongoDB)

To make everything work for a full test:

1) Add a MongoDB connection string and `JWT_SECRET` in `.env.local`
2) Add a `DEEPL_API_KEY`
3) Restart the dev server
