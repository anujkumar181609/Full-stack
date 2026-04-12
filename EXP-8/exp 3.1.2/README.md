# JWT Protected Routes (React + Express)

Industry-standard full-stack structure with:
- Express API with JWT authentication and protected endpoints
- React Router protected pages on the client
- Clean folder separation by concern (config, middleware, controllers, routes)

## Project Structure

```text
exp-3.1.2/
  client/
  server/
```

## Quick Start

1. Setup backend env:

```bash
cd server
cp .env.example .env
```

2. Install dependencies:

```bash
cd ../server && npm install
cd ../client && npm install
```

3. Run backend:

```bash
cd ../server
npm run dev
```

4. Run frontend:

```bash
cd ../client
npm run dev
```

Frontend runs at `http://localhost:5173` and backend at `http://localhost:5000` by default.
