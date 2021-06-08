import { Region } from './pinballmap';
import { RegionUpdate } from './region-poll';

export function getRegionListString(regions: Region[]) {
  const str = `region: region full name

${regions.map(({ name, full_name }) => `${name}: ${full_name}`).join('\n')}`;
  return str;
}

export function getRegionUpdateString(
  region: string,
  regionUpdates: RegionUpdate[]
) {
  const regionUpdatesStr = regionUpdates
    .map((ru) => {
      return ` - ${ru.location.name} ${
        ru.type === 'add' ? 'added' : 'removed'
      } ${ru.machine.name}`;
    })
    .join('\n');
  return `Region Updates for ${region}:
${regionUpdatesStr}`;
}
