import marked from 'marked';

import { Settings } from '../settings';

export async function helpCommand(
  settings: Required<Settings>,
  reply: (message: string, formattedMessage?: string) => void,
  invalidCommand?: string
) {
  const message = `${
    invalidCommand
      ? `Unrecognized command: ${invalidCommand}`
      : 'Add/remove pinball machine location notifications.'
  }

Usage:
${settings.promptWords.map((word) => `  - \`${word} [COMMAND]\``).join('\n')}

Commands:
  - \`watch <region>\`    Turn on notifications for pinball machine location updates in a given region
  - \`unwatch <region>\`  Turn off notifications for a given region
  - \`list\`              List PinballMap Regions
  - \`help\`              Display this help message
`;

  reply(message, marked(message));
}

// unused parameter syntax
//   - \`${settings.promptWords[0]} [COMMAND]:[ARG1]:[ARG2]\`
