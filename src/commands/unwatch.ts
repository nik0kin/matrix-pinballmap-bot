import { MatrixClient } from 'matrix-bot-sdk';
import { readWatchedRegions, saveWatchedRegions } from '../storage';

export async function unwatchCommand(
  botClient: MatrixClient,
  reply: (message: string, formattedMessage?: string) => void,
  region: string
) {
  if (region.includes(' ')) {
    return reply(`Region cannot contain spaces: \`${region}\``);
  }
  const watchedRegions = readWatchedRegions(botClient);
  saveWatchedRegions(
    botClient,
    watchedRegions.filter(([, wRegion]) => wRegion !== region)
  );
  reply('Successfully stopped watching region: ' + region);
}
