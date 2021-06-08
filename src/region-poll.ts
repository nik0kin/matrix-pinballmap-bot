import _ from 'lodash';
import { MatrixClient } from 'matrix-bot-sdk';
import {
  CachedLocationMachineXref,
  getPinballMapMachinesByRegions,
  LocationMachineXref,
} from './pinballmap';
import {
  readRegionCache,
  readWatchedRegions,
  saveRegionCache,
  toCachedRegion,
} from './storage';

export interface RegionUpdate {
  type: 'add' | 'remove';
  machine: any;
  location: any;
}

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
        if (!previousCachedRegion) {
          // region is not saved in cache, dont notify since this region just started being watched
          return [region, []] as [string, RegionUpdate[]];
        }
        const updates = getRegionUpdates(
          previousCachedRegion || [],
          currentShallowRegion,
          data.location_machine_xrefs
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
  oldRegion: CachedLocationMachineXref[],
  newRegion: CachedLocationMachineXref[],
  newRegionFull: LocationMachineXref[]
): RegionUpdate[] {
  const additionUpdates = _.differenceWith(newRegion, oldRegion, isEqual);
  const removalUpdates = _.differenceWith(oldRegion, newRegion, isEqual);
  function findLocation(locationId: number) {
    return newRegionFull.find((lm) => {
      return lm.location.id === locationId;
    })!;
  }
  function findMachine(machineId: number) {
    return newRegionFull.find((lm) => {
      return lm.machine.id === machineId;
    })!;
  }
  return [
    ...additionUpdates.map(
      (locationMachine): RegionUpdate => ({
        type: 'add',
        location: findLocation(locationMachine.location),
        machine: findMachine(locationMachine.machine),
      })
    ),
    ...removalUpdates.map(
      (locationMachine): RegionUpdate => ({
        type: 'remove',
        location: findLocation(locationMachine.location),
        machine: findMachine(locationMachine.machine),
      })
    ),
  ];
}
