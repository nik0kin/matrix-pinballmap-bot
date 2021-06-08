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
  const regionUpdatesStr = regionUpdates.map((ru) => {
    return ` - ${ru.location.id} ${ru.type ? 'added' : 'removed'} ${
      ru.machine.id
    }`;
  });
  return `Region Updates for ${region}:
${regionUpdatesStr}`;
}
