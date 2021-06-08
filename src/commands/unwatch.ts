import { MatrixClient } from 'matrix-bot-sdk';
import { readWatchedRegions, saveWatchedRegions } from '../storage';

export async function unwatchCommand(
  botClient: MatrixClient,
  reply: (message: string, formattedMessage?: string) => void,
  roomId: string,
  region: string
) {
  if (region.includes(' ')) {
    return reply(`Region cannot contain spaces: \`${region}\``);
  }

  // Check if room is already watching region
  const watchedRegions = readWatchedRegions(botClient);
  if (!watchedRegions.find(([roo, reg]) => reg === region && roo === roomId)) {
    return reply('You are not currently watching: ' + region);
  }

  saveWatchedRegions(
    botClient,
    watchedRegions.filter(([roo, reg]) => !(reg === region && roo === roomId))
  );
  reply('Successfully stopped watching region: ' + region);
}
