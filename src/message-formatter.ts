import { Region } from './pinballmap';

export function getRegionListString(regions: Region[]) {
  const str = `region: region full name

${regions.map(({ name, full_name }) => `${name}: ${full_name}`).join('\n')}`;
  return str;
}
