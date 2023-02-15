[![The Rick and Morty API](https://repository-images.githubusercontent.com/120371205/b6740400-92d4-11ea-8a13-d5f6e0558e9b)](https://therickandmortyapi.vercel.app)

# The Rick and Morty API

A backend clone project of the [The Rick and Morty API](https://rickandmortyapi.com), star the project [here](https://github.com/afuh/rick-and-morty-api).

[The Rick and Morty API](https://therickandmortyapi.vercel.app) is a RESTful API based on the television show [Rick and Morty](https://www.adultswim.com/videos/rick-and-morty). The Rick and Morty API is filled with canonical information as seen on the TV show.

## Getting Started

Install dependencies with yarn

```bash
yarn
```

Start local postgres database

```bash
docker-compose --env-file .env.local up -d
```

Seed the database

```bash
yarn dev
curl --request POST --url http://localhost:4000/api/seed
```

Test the REST api

```bash
yarn test
```

**Check out the [documentation](https://therickandmortyapi.vercel.app/docs/introduction) to get started**
