/* eslint-disable no-console */
import { helpCommand } from './commands/help';
import { listCommand } from './commands/list';
import { createMatrixClient, sendBotReply } from './matrix-bot';

import { Settings } from './settings';
// import { createError } from './error';

/**
 * Starts the Matrix bot
 */
export async function startBot(userSettings: Settings) {
  const settings: Required<Settings> = {
    storageFile: 'bot-storage.json',
    promptWords: ['!pinballmap', '!pm', '!pin'],
    autoJoin: false,
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

    const reply = (message: string, formattedMessage?: string) =>
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

    const tokens = (event.content.body as string).split(' ');
    const [prompt, commandToken, ...rest] = tokens;

    // check if prompt word is said
    if (!settings.promptWords.includes(prompt.toLowerCase())) return;

    // check command
    const [command, arg1, arg2] = (commandToken || '').split(':');

    try {
      switch (command.toLowerCase()) {
        case 'help':
          helpCommand(settings, reply);
          break;
        case 'list':
          listCommand(reply);
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
}
