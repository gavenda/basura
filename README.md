# Basura

![GitHub package.json version](https://img.shields.io/github/package-json/v/gavenda/basura?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/gavenda/basura?style=for-the-badge)

It connects to the Discord gateway with [discord.js](https://discord.js.org), runs on [Bun](https://bun.sh), keeps
its data in a local SQLite database, and caches AniList responses in [Valkey](https://valkey.io). To view the original gateway version of this bot, from before this rewrite, please click [here](https://github.com/gavenda/studio-helper/tree/main/bot/basura).

To add this bot to your server, click [here](https://discord.com/api/oauth2/authorize?client_id=870014073197170799&permissions=536870912&scope=applications.commands%20bot).

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

Being based on what **Annie** can do, these are planned:

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

You need [Bun](https://bun.sh).

```sh
bun install
cp .env.example .env

# Valkey for the cache. The bot won't start without it.
podman run -d --rm --name basura-valkey -p 127.0.0.1:6379:6379 docker.io/valkey/valkey:9-alpine
```

Fill `.env` with your bot token, and set `DISCORD_DEV_GUILD_ID` to your test server so commands show up there
instantly. Bun loads `.env` automatically. On startup the bot registers its commands (in that server, or globally when
it's blank), and serves a health check on `127.0.0.1:8080/health` that answers 200 while it's connected.

The application must not have an **Interactions Endpoint URL** set in the developer portal: when it does, Discord
sends interactions there instead of over the gateway.

| Command                   | What it does                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `bun run dev`             | Runs the bot, restarting on changes.                                                                                             |
| `bun start`               | Runs the bot once, in production mode.                                                                                           |
| `bun run commands:deploy` | Registers the commands without starting the bot.                                                                                 |
| `bun run build`           | Bundles the bot into `dist/index.js`.                                                                                            |
| `bun run image`           | Builds the `localhost/basura` container image with Podman.                                                                       |
| `bun run codegen`         | Regenerates the AniList types in [types.ts](src/anilist/types.ts) from the live schema and [queries.ts](src/anilist/queries.ts). |
| `bun run type-check`      | Type-checks the project with TypeScript 7.                                                                                       |
| `bun run format`          | Formats the source with `bun fmt`.                                                                                               |

### Layout

- [index.ts](src/index.ts) starts everything: logging, events, the health check, and the gateway login.
- A slash command is one file, `src/commands/chat-input/<name>.command.ts`, exporting an `AppChatInputCommand`.
  Add it to the list in [commands/chat-input/index.ts](src/commands/chat-input/index.ts), which is both what's
  registered with Discord and what interactions are routed by.
- Buttons are handled in `src/handlers/buttons/<name>.handler.ts`, routed by the `custom_id` prefix before the first
  `:`. Build and parse ids with the helpers in [discord/ids.ts](src/discord/ids.ts).
- Gateway events are `src/events/<name>.event.ts`, listed in [events.ts](src/events.ts).
- AniList lookups (anime, manga, staff, character) are defined once in [discord/lookups.ts](src/discord/lookups.ts)
  and shared by their command and the card's page buttons.

Data is kept in a SQLite database (`data/basura.sqlite` by default, set `DATABASE_PATH` to move it). The schema is
created and migrated on startup from [db/index.ts](src/db/index.ts). It holds linked AniList users and server settings.

AniList responses are cached in Valkey at `REDIS_URL` through Bun's built-in Redis client, under `basura:` keys that
expire on their own (see [cache.ts](src/cache.ts) and the TTLs in [anilist/client.ts](src/anilist/client.ts)).
The cache is required, because AniList's rate limits are strict: the bot waits up to 30 seconds for Valkey at
startup and exits if it never answers. If Valkey goes away later, lookups fail with a "try again shortly" message
rather than reach AniList uncached, and the health check fails until it's back. Identical lookups made at the same
moment share one AniList request, and unknown ids are cached too.

AniList's rate limit is tracked in Valkey as well, so it holds across restarts (see
[anilist/rate-limit.ts](src/anilist/rate-limit.ts)). Each request is counted against a per-minute budget,
`ANILIST_REQUESTS_PER_MINUTE` (30 by default, AniList's current limit), before it's sent. When AniList answers 429 or
says no requests are left, every request is held until the limit lifts. Commands wait up to a minute for it and then
tell the user to try again; autocomplete never waits and shows no choices instead.

AniList queries live in [queries.ts](src/anilist/queries.ts). After changing one, run `bun run codegen` to update
its result types. The [AniList API docs](https://docs.anilist.co/guide/introduction) and
[GraphiQL](https://anilist.co/graphiql) are handy for exploring the schema.

Formatting is `bun fmt`, configured in the `[fmt]` section of [bunfig.toml](bunfig.toml). The pre-commit hook formats
staged files with `bun fmt --staged` and runs a type-check, so a commit with type errors will be rejected.

## I want to contribute!

Sure. Feel free. If you want to check the changes for your pull requests, you can invite the development
version of the bot by clicking [here](https://discord.com/oauth2/authorize?client_id=911875737999527956&scope=applications.commands).

To test commands in your own server, set `DISCORD_DEV_GUILD_ID` in `.env` to your server's id.

## I want to deploy my own!

Go ahead. Feel free to clone or fork this repo. It runs as a rootless [Podman Quadlet](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
pod, with the bot and its Valkey cache side by side:

```sh
# Secrets for the container
mkdir -p ~/.config/basura
cp .env.example ~/.config/basura/basura.env   # then fill it in
chmod 600 ~/.config/basura/basura.env

# Install the units and start the bot
mkdir -p ~/.config/containers/systemd
cp deploy/* ~/.config/containers/systemd/
systemctl --user daemon-reload
systemctl --user start basura-pod

# Keep it running when you're logged out
loginctl enable-linger "$USER"
```

The two containers share the pod's network and talk over `127.0.0.1`, so no Podman network is created, and nothing
is published since the bot only makes outgoing connections. The bot keeps its database on the `basura-data` volume.
Valkey keeps nothing on disk and holds at most 128 MB, dropping the least recently used entries first. The bot requires Valkey: it starts once Valkey is healthy and stops with it. Podman restarts either container when its
health check fails; the bot's fails while it's disconnected from the gateway or from Valkey. Logs are in
`journalctl --user -u basura` and `journalctl --user -u basura-valkey`.

The image is [published to GHCR](https://github.com/gavenda/basura/pkgs/container/basura) for every version tag, as
`ghcr.io/gavenda/basura:latest` (and `:3`, `:3.0`, `:3.0.0`). To update automatically, enable Podman's auto-update
timer, which pulls newer images and restarts the units, rolling back if the new one fails:

```sh
systemctl --user enable --now podman-auto-update.timer
```

To run your own build instead, `bun run image` and set `Image=localhost/basura:latest` in `basura.container`, removing
its `AutoUpdate=` line.

### Releasing

Bump `version` in [package.json](package.json), commit it as `Release vX.Y.Z`, and push an annotated tag:

```sh
git tag -a v3.1.0 -m "Basura v3.1.0"
git push origin main v3.1.0
```

The [Publish container](.github/workflows/publish.yml) workflow checks the tag, then builds and pushes the image.
Pre-release tags like `v3.1.0-rc.1` are published without moving `latest`.

## What are the future plans for this?

- Implement more ideas that **Annie** may come up (yes this is shamelessly a high priority, I highly respect the author
  for the incredible ideas)
- Whatever my Discord server requests me to do that is weab related

## Will it support MyAnimeList?

Dear lord, of all things, the most toxic community I have ever went into. I can probably do this, once they have their
APIv2 sorted out.
