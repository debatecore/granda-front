# granda-front

granda (Polish for fracas) is a web application for Oxford Debate tournament management.

## Deployment with Docker

To deploy via Docker:

1. Prepare the following directory structure:

```
.
├── granda-front    # cloned from this repository
└── tau             # cloned from https://github.com/debatecore/tau
```

2. Set up an `.env` file and place it in `granda-front`.

You may use this example and adjust it to your needs:

```
# Backend setup (for documentation refer to https://github.com/debatecore/tau?tab=readme-ov-file#environment-setup)
DOCKER_DB_PASSWORD=THISISAVERYSECUREDBPASSWORD
DOCKER_DB_ROOT_PASSWORD=ANOTHERSECUREROOTPASSWORD
DATABASE_URL=postgresql://tau:tau@localhost:5432/tau
SECRET=SUPERSECRETSTRINGHERE
FRONTEND_ORIGIN=http://localhost:3000

# Frontend setup
BACKEND_URL=http://localhost:2023    # Used for server-side requests
FRONTEND_PORT=3000                      # Port with the frontend to be exposed
BACKEND_PORT=2023                       # Port with the backend to be exposed
```

**Note:** due to [Docker networking model](https://docs.docker.com/compose/how-tos/networking/), deployment and development configs are incompatible. Therefore `FRONTEND_ORIGIN` must be set accordingly before building the image. Whenever switching between deployment and development, rebuild your image with `docker compose --profile prod up --build -d --force-recreate server-prod`.

3. From the level of `granda-front`, run:

```bash
docker compose --profile prod up -d
```

Once the containers are built and started, you can access the application from http://localhost:3000 (or other address, depending on your `FRONTEND_PORT` variable).

## Local development

First, set up the backend either using [above deployment instructions](#deployment-with-docker) or those found in [the backend repository](https://github.com/debatecore/tau?tab=readme-ov-file#deployment-and-local-development).

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
