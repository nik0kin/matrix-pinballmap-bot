/* eslint-disable no-console */
import marked from 'marked';
import { MatrixClient } from 'matrix-bot-sdk';
import { helpCommand } from './commands/help';
import { listCommand } from './commands/list';
import { watchCommand } from './commands/watch';
import { unwatchCommand } from './commands/unwatch';
// import { createError } from './error';
import { createMatrixClient, sendBotMessage, sendBotReply } from './matrix-bot';
import { getRegionUpdateString } from './message-formatter';
import { doRegionPoll } from './region-poll';
import { Settings, SettingsWithDefaults } from './settings';
import { readWatchedRegions } from './storage';

async function poll(settings: SettingsWithDefaults, botClient: MatrixClient) {
  try {
    const updates = await doRegionPoll(botClient);
    readWatchedRegions(botClient).forEach(([roomId, region]) => {
      const regionUpdates = updates[region];
      if (!regionUpdates.length) {
        // skip message if there's no updates for a region
        // console.log(region + ': No Region Updates');
        return;
      }
      const message = getRegionUpdateString(region, regionUpdates);
      if (!settings.dryRun) {
        sendBotMessage(botClient, roomId, message, marked(message));
      } else {
        console.log(message);
      }
    });
  } catch (e) {
    console.error('An error occured while polling for region data', e);
  }
  setPollTimeout(settings, botClient);
}

function setPollTimeout(
  settings: SettingsWithDefaults,
  botClient: MatrixClient
) {
  setTimeout(() => {
    poll(settings, botClient);
  }, settings.pollFrequency * 1000);
}

/**
 * Starts the Matrix bot
 */
export async function startBot(userSettings: Settings) {
  const settings: SettingsWithDefaults = {
    storageFile: 'bot-storage.json',
    promptWords: ['!pinballmap', '!pm', '!pin'],
    autoJoin: false,
    dryRun: false,
    ...userSettings,
  };
  settings.promptWords = settings.promptWords.map((w) => w.toLowerCase());

  // Connect to Matrix
  const botClient = createMatrixClient(settings);
  await botClient.start();

  console.log('PinballMap bot online');

  botClient.on('room.message', async function (roomId, event) {
    if (event.sender === (await botClient.getUserId())) return;
    if (!event.content || !event.content.body) return;

    const reply = (message: string, formattedMessage?: string) => {
      if (!settings.dryRun) {
        sendBotReply(
          botClient,
          roomId,
          {
            sender: event.sender,
            message: event.content.body,
          },
          message,
          formattedMessage
        );
      } else {
        console.log('reply: ' + message);
      }
    };

    const tokens = (event.content.body as string).split(' ');
    const [prompt, commandToken, ...rest] = tokens;

    // check if prompt word is said
    if (!settings.promptWords.includes(prompt.toLowerCase())) return;

    // check command
    const [command /* , arg1, arg2 */] = (commandToken || '').split(':');

    try {
      switch (command.toLowerCase()) {
        case 'help':
          helpCommand(settings, reply);
          break;
        case 'list':
          listCommand(reply);
          break;
        case 'watch':
          watchCommand(botClient, reply, roomId, rest.join(' ').toLowerCase());
          break;
        case 'unwatch':
          unwatchCommand(
            botClient,
            reply,
            roomId,
            rest.join(' ').toLowerCase()
          );
          break;
        default:
          helpCommand(settings, reply, command);
      }
    } catch (e) {
      console.error(
        'An error occured during the command: ' + event.content.body,
        e
      );
    }
  });

  poll(settings, botClient);
}
