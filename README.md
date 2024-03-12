# Basura

![GitHub package.json version](https://img.shields.io/github/package-json/v/gavenda/basura?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/gavenda/basura?style=for-the-badge)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/gavenda/basura/deploy.yml?style=for-the-badge)

This is the cloudflare service worker version of the original. To view the gateway version of this bot,
please click [here](https://github.com/gavenda/studio-helper/tree/main/bot/basura).

To add this bot to your server, click [here](https://discord.com/api/oauth2/authorize?client_id=870014073197170799&permissions=536870912&scope=applications.commands%20bot).
This is now guaranteed an uptime of 24/7 until I ran out of cloudflare resources.

Highly consider this project a love child or bastard of [Annie](https://github.com/AlexanderColen/Annie-May-Discord-Bot).

## I want to contribute!

Sure. Feel free. If you want to check the changes for your pull requests, you can invite the development
version of the bot by clicking [here](https://discord.com/oauth2/authorize?client_id=911875737999527956&scope=applications.commands).

For commands, they are automatically registered whenever a PR push is made, make sure to add
your discord server id in [register-dev.ts](src/register-dev.ts) file.

## I want to deploy my own!

Go ahead. Feel free to clone or fork this repo and setup the necessary environmental variables. It should work as long as you signup
for a [PlanetScale](https://planetscale.com/) database and an [UpStash](https://upstash.com/) redis server.

Edit the wrangler.toml file to suit your needs. You can skip providing an UpStash redis server credentials, and use Cloudflare KV instead.

## What is Basura?

Basura literally means trash.

Trash includes isekai bullshit, power leveling xianxia, wuxia, otome politics,
and any that heightens your level of idiotness.

## What can it do?

It is purely based off what **Annie** can do (description also from **Annie**):

- Look up any anime/manga media from AniList via a search query.
- Display scores of users within each Discord server for the searched media.
- Search for users on AniList and display their stats and weab tendencies (did I forget to mention this is again, based
  on **Annie**?)
- Display media rankings based on season, season year, and format.

## What are the commands?

We are using interaction commands. Hit your slash (/) key on the discord server this bot is on and it will tell you
everything you need to know.
Interaction commands in my opinion, should mitigate the necessary need for a help command.

## What are the future plans for this?

- Implement more ideas that **Annie** may come up (yes this is shamelessly a high priority, I highly respect the author
  for the incredible ideas)
- Whatever my Discord server requests me to do that is weab related

## Will it support MyAnimeList?

Dear lord, of all things, the most toxic community I have ever went into. I can probably do this, once they have their
APIv2 sorted out.
