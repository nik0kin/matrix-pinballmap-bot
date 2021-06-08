export async function regionsCommand(
  reply: (message: string, formattedMessage?: string) => void
) {
  // Don't make the list command API driven to avoid a large wall of text in a room
  reply(
    'See https://github.com/nik0kin/matrix-pinballmap-bot/blob/main/docs/region-list.txt for a list of region names, or see https://pinballmap.com/api/v1/regions.json for the most up to date list'
  );
}
