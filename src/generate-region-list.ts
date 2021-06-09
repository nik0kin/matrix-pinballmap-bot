import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { getPinballMapRegions } from './pinballmap';
import { getRegionListDocString } from './message-formatter';

getPinballMapRegions().then((response) => {
  const list = getRegionListDocString(response.regions);
  writeFileSync(resolve(__dirname, '..', 'docs/region-list.txt'), list, {
    encoding: 'utf8',
  });
});
