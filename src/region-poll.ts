import _ from 'lodash';
import { MatrixClient } from 'matrix-bot-sdk';
import {
  CachedLocationMachineXref,
  getPinballMapMachinesByRegions,
  Location,
  Machine,
} from './pinballmap';
import {
  readLocationCache,
  readMachineCache,
  readRegionCache,
  readWatchedRegions,
  saveLocationCache,
  saveMachineCache,
  saveRegionCache,
  toCachedRegion,
} from './storage';

export interface RegionUpdate {
  type: 'add' | 'remove';
  machine: Machine;
  location: Location;
}

const missingFromCache = { id: -1, name: 'name-missing-from-cache' };

export async function doRegionPoll(
  botClient: MatrixClient
): Promise<Record<string, RegionUpdate[]>> {
  const uniqueRegions = [
    ...new Set(readWatchedRegions(botClient).map(([, region]) => region)),
  ];
  const regionPromises = uniqueRegions.map((region) =>
    getPinballMapMachinesByRegions(region)
      .then((data) => {
        const currentShallowRegion = toCachedRegion(
          data.location_machine_xrefs
        );
        const previousCachedRegion = readRegionCache(botClient, region);
        saveRegionCache(botClient, region, currentShallowRegion);
        data.location_machine_xrefs.forEach((lm) => {
          // TODO EFF skip writes if it's already been cached recently
          saveLocationCache(botClient, lm.location);
          saveMachineCache(botClient, lm.machine);
        });
        if (!previousCachedRegion) {
          // region is not saved in cache, dont notify since this region just started being watched
          return [region, []] as [string, RegionUpdate[]];
        }
        const updates = getRegionUpdates(
          botClient,
          previousCachedRegion,
          currentShallowRegion
        );
        return [region, updates] as const;
      })
      .catch((e) => {
        console.error('Error while polling region ' + region, e);
      })
  );
  const updates = await Promise.all(regionPromises);
  return updates.reduce((acc, v) => {
    if (v) {
      const [region, updates] = v;
      acc[region] = updates;
    }
    return acc;
  }, {} as Record<string, RegionUpdate[]>);
}

function isEqual(a: CachedLocationMachineXref, b: CachedLocationMachineXref) {
  return _.isEqual([a.location, a.machine], [b.location, b.machine]);
}

function getRegionUpdates(
  botClient: MatrixClient,
  oldRegion: CachedLocationMachineXref[],
  newRegion: CachedLocationMachineXref[]
): RegionUpdate[] {
  const additionUpdates = _.differenceWith(newRegion, oldRegion, isEqual);
  const removalUpdates = _.differenceWith(oldRegion, newRegion, isEqual);

  return [
    ...additionUpdates.map(
      (locationMachine): RegionUpdate => ({
        type: 'add',
        location:
          readLocationCache(botClient, locationMachine.location) ||
          missingFromCache,
        machine:
          readMachineCache(botClient, locationMachine.machine) ||
          missingFromCache,
      })
    ),
    ...removalUpdates.map(
      (locationMachine): RegionUpdate => ({
        type: 'remove',
        location:
          readLocationCache(botClient, locationMachine.location) ||
          missingFromCache,
        machine:
          readMachineCache(botClient, locationMachine.machine) ||
          missingFromCache,
      })
    ),
  ];
}
