import { MatrixClient, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import {
  LocationMachineXref,
  CachedLocationMachineXref,
  Machine,
  Location,
} from './pinballmap';

// watchedRegion: [roomId, region]

export function readWatchedRegions(
  botClient: MatrixClient
): Array<[string, string]> {
  const savedValue = (
    botClient.storageProvider as SimpleFsStorageProvider
  ).readValue('watchedRegions');
  return savedValue ? JSON.parse(savedValue) : [];
}

export function saveWatchedRegions(
  botClient: MatrixClient,
  value: Array<[string, string]>
) {
  (botClient.storageProvider as SimpleFsStorageProvider).storeValue(
    'watchedRegions',
    JSON.stringify(value)
  );
}

export function readRegionCache(
  botClient: MatrixClient,
  region: string
): CachedLocationMachineXref[] | undefined {
  const savedValue = (
    botClient.storageProvider as SimpleFsStorageProvider
  ).readValue('regionCache');
  return (savedValue ? JSON.parse(savedValue) : {})[region];
}

export function saveRegionCache(
  botClient: MatrixClient,
  region: string,
  value: CachedLocationMachineXref[]
) {
  const savedValue = (
    botClient.storageProvider as SimpleFsStorageProvider
  ).readValue('regionCache');
  const cache = savedValue ? JSON.parse(savedValue) : {};
  cache[region] = value;
  (botClient.storageProvider as SimpleFsStorageProvider).storeValue(
    'regionCache',
    JSON.stringify(cache)
  );
}

export function toCachedRegion(
  regions: LocationMachineXref[]
): CachedLocationMachineXref[] {
  return regions.map(({ id, updated_at, machine, location }) => {
    const clone = {
      id,
      updated_at,
      machine: machine.id,
      location: location.id,
    };
    return clone;
  });
}

// A Machine/Location needs to be in the cache so that when a Machine is removed, it's name can be referenced
// TODO remove RegionUpdate's could use a PinballMap API to lookup info

// TODO EFF Machine/Location cache entries can be cleared if `watchedRegions` does not contain any locationMachines with an id pointing to the cached location or machine
//  or after a recent polling, any location or machine that wasnt just cached, could be thrown out

const machineCachePrefix = 'm_';

export function readMachineCache(
  botClient: MatrixClient,
  machineId: number
): Machine | undefined {
  const savedValue = (
    botClient.storageProvider as SimpleFsStorageProvider
  ).readValue(machineCachePrefix + machineId);
  return savedValue ? JSON.parse(savedValue) : undefined;
}

export function saveMachineCache(
  botClient: MatrixClient,
  { id, name }: Machine
) {
  (botClient.storageProvider as SimpleFsStorageProvider).storeValue(
    machineCachePrefix + id,
    JSON.stringify({ id, name })
  );
}

const locationCachePrefix = 'l_';

export function readLocationCache(
  botClient: MatrixClient,
  locationId: number
): Machine | undefined {
  const savedValue = (
    botClient.storageProvider as SimpleFsStorageProvider
  ).readValue(locationCachePrefix + locationId);
  return savedValue ? JSON.parse(savedValue) : undefined;
}

export function saveLocationCache(
  botClient: MatrixClient,
  { id, name }: Location
) {
  (botClient.storageProvider as SimpleFsStorageProvider).storeValue(
    locationCachePrefix + id,
    JSON.stringify({ id, name })
  );
}
