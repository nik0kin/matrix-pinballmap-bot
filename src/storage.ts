import { MatrixClient, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import { LocationMachineXref, CachedLocationMachineXref } from './pinballmap';

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
