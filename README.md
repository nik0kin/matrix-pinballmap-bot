# matrix-pinballmap-bot

Watch regions for pinball machine location updates

```
Human: !pm watch seattle
Bot: Successfully started watching region: seattle

Bot: Region Updates for seattle:
 - Shorty's added Centaur
```

`!pm help` for more commands.

Unfortunately due to public Strava API restrictions, we cannot query more information on a given club activity, and thus the bot can't link to it.

## Develop

```
yarn install
yarn dev
```

## Run

### Bootstrap mode

Running as a background process via pm2:

```
# clone this repo and cd inside of it

yarn install

cp bot-config.sample.json bot-config.json
# configure bot-config.json

yarn global add pm2
pm2 start pm2.config.js
```

### As a Node.js package

Programatically with javascript/typescript:

```
yarn add matrix-pinballmap-bot
```

```
import { startBot } from 'matrix-pinballmap-bot';

const config = {
  // see bot-config.sample.json
};

startBot(config);
```

## Config

See [settings.ts](./src/settings.ts) for config descriptions

## Reference

Uses PinballMap API: https://pinballmap.com/api/v1/docs
