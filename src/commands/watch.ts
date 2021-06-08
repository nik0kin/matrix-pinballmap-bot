import { MatrixClient } from 'matrix-bot-sdk';
import { throttledGetPinballMapRegions } from '../pinballmap';
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

  // Validate region name
  const validRegions = (await throttledGetPinballMapRegions())!.regions;
  if (!validRegions.find((r) => r.name === region)) {
    return reply('Invalid region');
  }

  // Check if room is already watching region
  const watchedRegions = readWatchedRegions(botClient);
  if (watchedRegions.find(([roo, reg]) => reg === region && roo === roomId)) {
    return reply('Already watching');
  }

  saveWatchedRegions(botClient, [...watchedRegions, [roomId, region]]);
  reply('Successfully started watching region: ' + region);
}
