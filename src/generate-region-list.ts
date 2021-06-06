import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { getPinballMapRegions } from './pinballmap';
import { getRegionListString } from './message-formatter';

getPinballMapRegions().then((response) => {
  const list = getRegionListString(response.regions);
  writeFileSync(resolve(__dirname, '..', 'docs/region-list.txt'), list, {
    encoding: 'utf8',
  });
});
