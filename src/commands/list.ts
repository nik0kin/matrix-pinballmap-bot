import { MatrixClient } from 'matrix-bot-sdk';
import { readWatchedRegions } from '../storage';

export async function listCommand(
  botClient: MatrixClient,
  reply: (message: string, formattedMessage?: string) => void,
  roomId: string
) {
  const watchedRegions = readWatchedRegions(botClient).filter(
    ([_roomId]) => _roomId === roomId
  );

  reply(
    'This room is currently watching: ' +
      watchedRegions.map(([, region]) => region).join(', ')
  );
}
