import { MatrixClient } from 'matrix-bot-sdk';
import { readWatchedRegions, saveWatchedRegions } from '../storage';

export async function watchCommand(
  botClient: MatrixClient,
  reply: (message: string, formattedMessage?: string) => void,
  roomId: string,
  region: string
) {
  if (region.includes(' ')) {
    return reply(`Region cannot contain spaces: \`${region}\``);
  }
  // TODO validate region name
  const watchedRegions = readWatchedRegions(botClient);
  // TODO check if room is already watching region
  saveWatchedRegions(botClient, [...watchedRegions, [roomId, region]]);
  reply('Successfully started watching region: ' + region);
}
