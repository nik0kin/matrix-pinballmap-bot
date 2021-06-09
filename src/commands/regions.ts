import { Region, throttledGetPinballMapRegions } from '../pinballmap';

export async function regionsCommand(
  reply: (message: string, formattedMessage?: string) => void
) {
  // Don't make the list command API driven to avoid a large wall of text in a room
  reply(
    'See https://github.com/nik0kin/matrix-pinballmap-bot/blob/main/docs/region-list.txt for a list of region names, or see https://pinballmap.com/api/v1/regions.json for the most up to date list'
  );
}

export async function regions2Command(
  reply: (message: string, formattedMessage?: string) => void
) {
  let regions: Region[];
  try {
    regions = (await throttledGetPinballMapRegions())!.regions;
  } catch (e) {
    console.error('Failed to get PinballMap regions', e);
    return reply('Something went wrong looking up regions');
  }

  // List without 'real names'
  reply(
    regions
      .map((r) => r.name)
      .sort()
      .join(', ')
  );
}
