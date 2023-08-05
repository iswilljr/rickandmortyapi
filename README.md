[![The Rick and Morty API](https://repository-images.githubusercontent.com/120371205/b6740400-92d4-11ea-8a13-d5f6e0558e9b)](https://therickandmortyapi.vercel.app)

# The Rick and Morty API

[![Rick and Morty API Unit and E2E Testing](https://github.com/iswilljr/rick-and-morty-api/actions/workflows/rest.yml/badge.svg)](https://github.com/iswilljr/rick-and-morty-api/actions/workflows/rest.yml)
[![Rick and Morty Site E2E Testing](https://github.com/iswilljr/rick-and-morty-site-qwik/actions/workflows/test.yml/badge.svg)](https://github.com/iswilljr/rick-and-morty-site-qwik/actions/workflows/test.yml)

A backend clone project of the [The Rick and Morty API](https://rickandmortyapi.com), star the project [here](https://github.com/afuh/rick-and-morty-api).

[The Rick and Morty API](https://therickandmortyapi.vercel.app) is a RESTful API based on the television show [Rick and Morty](https://www.adultswim.com/videos/rick-and-morty). The Rick and Morty API is filled with canonical information as seen on the TV show.

## Getting Started

**Check out the [documentation](https://therickandmortyapi.vercel.app/docs/introduction) to get started**

#### Install dependencies with pnpm

```bash
pnpm install
```

#### Start local postgres database

```bash
docker-compose up -d
```

#### Seed the database

```bash
# Start dev server
pnpm dev

# On another terminal
curl --request POST --url http://localhost:4000/seed
```

#### Testing

```bash
# Controllers And Services
pnpm test

# REST API
pnpm test:e2e
```

## Website

Check the [code of the website](https://github.com/iswilljr/rick-and-morty-site)
