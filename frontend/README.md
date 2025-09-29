# Full Stack Book To Do Next.js

https://www.fullstackbook.com/docs/projects/todo/frontend/nextjs

## Setup

Copy `.env.example` to `.env`.

```
npm install
npm run dev
```

Environment variables expected by the Next.js API routes:
- DB_URL=postgres://postgres:postgres@localhost:80/postgres
	- Required so the API routes under `/api/todos` can connect to the local Postgres started by Docker.
