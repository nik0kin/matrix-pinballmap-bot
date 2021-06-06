export async function listCommand(
  reply: (message: string, formattedMessage?: string) => void
) {
  reply(
    'See https://github.com/nik0kin/matrix-pinballmap-bot/blob/main/docs/region-list.txt for a list of region names, or see https://pinballmap.com/api/v1/regions.json for the most up to date list'
  );
}
