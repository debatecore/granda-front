# granda-front

granda (Polish for fracas) is a web application for Oxford Debate tournament management.

## Deployment with Docker

To deploy via Docker:

Set up an `.env` file to configure your deployment. You may use this example and adjust it to your needs:

```env
# Backend setup (for documentation refer to https://github.com/debatecore/tau?tab=readme-ov-file#environment-setup)
DOCKER_DB_PASSWORD=THISISAVERYSECUREDBPASSWORD
DOCKER_DB_ROOT_PASSWORD=ANOTHERSECUREROOTPASSWORD
DATABASE_URL=postgresql://tau:tau@db-prod:5432/tau
SECRET=SUPERSECRETSTRINGHERE
FRONTEND_ORIGIN=http://localhost:3000

# Frontend setup
BACKEND_URL=http://tau-prod:2023        # Used for server-side requests
FRONTEND_PORT=3000                      # Port with the frontend to be exposed
BACKEND_PORT=2023                       # Port with the backend to be exposed
```

Then you can simply run:

```bash
docker compose --profile prod up -d
```

Once the containers are built and started, you can access the application from http://localhost:3000 (or other address, depending on your `FRONTEND_PORT` variable).

## Local development

To develop the application locally, set create an `.env` file containing **only** backend-related variables, e.g.:

```env
DOCKER_DB_PASSWORD=THISISAVERYSECUREDBPASSWORD
DOCKER_DB_ROOT_PASSWORD=ANOTHERSECUREROOTPASSWORD
DATABASE_URL=postgresql://tau:tau@db-prod:5432/tau
SECRET=SUPERSECRETSTRINGHERE
FRONTEND_ORIGIN=http://localhost:3000
```

Then, start the backend:

```
docker compose --profile dev up -d
```

Once the backend is up, you can run the Node development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
