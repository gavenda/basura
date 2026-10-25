# Basura

![GitHub package.json version](https://img.shields.io/github/package-json/v/gavenda/basura?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/gavenda/basura?style=for-the-badge)

This is the Cloudflare Workers version of the original. To view the gateway version of this bot,
please click [here](https://github.com/gavenda/studio-helper/tree/main/bot/basura).

To add this bot to your server, click [here](https://discord.com/api/oauth2/authorize?client_id=870014073197170799&permissions=536870912&scope=applications.commands%20bot).
This is now guaranteed an uptime of 24/7 until I run out of Cloudflare resources.

Highly consider this project a love child or bastard of [Annie](https://github.com/AlexanderColen/Annie-May-Discord-Bot).

## What is Basura?

Basura literally means trash.

Trash includes isekai bullshit, power leveling xianxia, wuxia, otome politics,
and any that heightens your level of idiotness.

## What can it do?

It looks things up on [AniList](https://anilist.co) straight from Discord:

- `/anime` and `/manga` look up any anime or manga.
- `/staff` looks up anime/manga staff.
- `/character` looks up a character.
- `/about` tells you about the trash, me.

Being based on what **Annie** can do, these are planned. Their slash command definitions are kept (commented out)
in [command.list.ts](src/command.list.ts), but they have no handlers yet:

- Linking your Discord account to AniList (`/link`, `/unlink`) and showing the scores of linked users within each
  Discord server for the searched media.
- Searching for users on AniList and displaying their stats and weab tendencies (`/user`).
- Media rankings based on season, season year, and format (`/ranking`).
- Airing notifications bound to a channel (`/notification`).
- Right-click message commands for searching anime, manga, staff, characters, and users.

## What are the commands?

We are using interaction commands. Hit your slash (/) key on the Discord server this bot is on and it will tell you
everything you need to know.
Interaction commands in my opinion, should mitigate the necessary need for a help command.

## Development

You need [Bun](https://bun.sh) and a Cloudflare account.

```sh
bun install
```

Create a `.dev.vars` file (and a `.prod.vars` for production) with your Discord application's credentials:

```sh
DISCORD_TOKEN=...
DISCORD_PUBLIC_KEY=...
DISCORD_APPLICATION_ID=...
```

| Command                | What it does                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `bun start`            | Runs the worker locally on port 8787 using the `dev` environment.                                                                |
| `bun run ngrok`        | Exposes the local worker so Discord can reach it.                                                                                |
| `bun run register:dev` | Registers commands in the test guilds listed in [register.ts](src/register.ts).                                                  |
| `bun run register`     | Registers commands globally using `.prod.vars`.                                                                                  |
| `bun run deploy:dev`   | Deploys the `dev` environment.                                                                                                   |
| `bun run deploy`       | Deploys the `prod` environment.                                                                                                  |
| `bun run types`        | Regenerates [worker-configuration.d.ts](src/worker-configuration.d.ts) after editing `wrangler.jsonc`.                           |
| `bun run codegen`      | Regenerates the AniList types in [types.ts](src/anilist/types.ts) from the live schema and [queries.ts](src/anilist/queries.ts). |
| `bun run type-check`   | Type-checks the project with TypeScript.                                                                                         |
| `bun run prettier`     | Formats the source.                                                                                                              |

AniList queries live in [queries.ts](src/anilist/queries.ts). After changing one, run `bun run codegen` to update
its result types. The [AniList API docs](https://docs.anilist.co/guide/introduction) and
[GraphiQL](https://anilist.co/graphiql) are handy for exploring the schema.

The pre-commit hook formats staged files with Prettier and runs a type-check, so a commit with type errors
will be rejected.

## I want to contribute!

Sure. Feel free. If you want to check the changes for your pull requests, you can invite the development
version of the bot by clicking [here](https://discord.com/oauth2/authorize?client_id=911875737999527956&scope=applications.commands).

To test commands in your own server, add your Discord server id to [register.ts](src/register.ts)
and run `bun run register:dev`.

## I want to deploy my own!

Go ahead. Feel free to clone or fork this repo. You will need:

- A [Cloudflare D1](https://developers.cloudflare.com/d1/) database for linked AniList users and server settings.
  Create the tables with [d1-schema.sql](d1-schema.sql):
  ```sh
  bunx wrangler d1 execute <database-name> --remote --file=d1-schema.sql
  ```
- A [Cloudflare KV](https://developers.cloudflare.com/kv/) namespace, used to back off when AniList rate limits us.
- The Discord secrets above, set on the worker with `bunx wrangler secret put <NAME> --env <env>`.

Then edit [wrangler.jsonc](wrangler.jsonc) with your own routes, D1 database id, and KV namespace id, and deploy.
Point your Discord application's interactions endpoint URL at the deployed worker.

## What are the future plans for this?

- Implement more ideas that **Annie** may come up (yes this is shamelessly a high priority, I highly respect the author
  for the incredible ideas)
- Whatever my Discord server requests me to do that is weab related

## Will it support MyAnimeList?

Dear lord, of all things, the most toxic community I have ever went into. I can probably do this, once they have their
APIv2 sorted out.
