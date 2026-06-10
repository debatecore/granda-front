# granda-front

granda (Polish for fracas) is a web application for Oxford Debate tournament management.

## Deployment with Docker

To deploy via Docker:

1. Set up an `.env` file to configure your deployment. You may use this example and adjust it to your needs:

```env
# Backend setup (for documentation refer to https://github.com/debatecore/tau?tab=readme-ov-file#environment-setup)
DOCKER_DB_PASSWORD=THISISAVERYSECUREDBPASSWORD
DOCKER_DB_ROOT_PASSWORD=ANOTHERSECUREROOTPASSWORD
DATABASE_URL=postgresql://tau:tau@db-prod:5432/tau
SECRET=SUPERSECRETSTRINGHERE
FRONTEND_ORIGIN=http://localhost:3000

# Frontend setup
BACKEND_NAME=server-prod
BACKEND_URL=http://${BACKEND_NAME}:2023 # Used for server-side requests
FRONTEND_PORT=3000                      # Port with the frontend to be exposed
BACKEND_PORT=2023                       # Port with the backend to be exposed
```

2. Then you can simply run:

```bash
docker compose --profile prod up -d
```

3. Once the containers are built and started, you can access the application from http://localhost:3000 (or other address, depending on your `FRONTEND_PORT` variable).

## Local development

In this scenario, you will deploy the backend via Docker, allowing you to start the frontend locally, e.g. using a Node development server.

```mermaid
architecture-beta
    group your_machine(server)[Your machine]
    group docker(cloud)[Docker] in your_machine

    service backend_container(server)[tau backend] in docker
    service db_container(database)[Postgres database] in docker
    service ghcr(cloud)[GitHub Container Registry] in your_machine
    service npm(server)[node server] in your_machine
    service env(disk)[env or shell variables] in your_machine

    backend_container:R -- L:db_container
    ghcr:B -- T:backend_container
    npm:T -- B:backend_container
    env:T -- B:backend_container
    env:T -- B:db_container
    env:L -- R:npm
```

1. Create an `.env` file containing **only** backend-related variables, e.g.:

```env
DOCKER_DB_PASSWORD=THISISAVERYSECUREDBPASSWORD
DOCKER_DB_ROOT_PASSWORD=ANOTHERSECUREROOTPASSWORD
DATABASE_URL=postgresql://tau:tau@db-prod:5432/tau
SECRET=SUPERSECRETSTRINGHERE
FRONTEND_ORIGIN=http://localhost:3000
```

2. Start the backend:

```
docker compose --profile dev up -d
```

3. Once the backend is up, you can run the Node development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
