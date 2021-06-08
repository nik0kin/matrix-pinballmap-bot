import _ from 'lodash';
import fetch from 'node-fetch';

const API_BASE_URL = 'https://pinballmap.com/api';

export interface Region {
  id: number;
  name: string;
  full_name: string;
}

export async function getPinballMapRegions() {
  return (await fetch(API_BASE_URL + '/v1/regions.json')).json() as Promise<{
    regions: Region[];
  }>;
}

export const throttledGetPinballMapRegions = _.throttle(
  getPinballMapRegions,
  24 * 60 * 60 * 1000, // 24 hours
  {
    leading: true,
  }
);

export interface Location {
  id: number;
  name: string;
}

export interface Machine {
  id: number;
  name: string;
}

export interface LocationMachineXref {
  id: string;
  updated_at: string;
  location: Location;
  machine: Machine;
}

export interface CachedLocationMachineXref {
  id: string;
  updated_at: string;
  location: number;
  machine: number;
}

export async function getPinballMapMachinesByRegions(region: string) {
  return (
    await fetch(
      `${API_BASE_URL}/v1/region/${region}/location_machine_xrefs.json`
    )
  ).json() as Promise<{
    location_machine_xrefs: LocationMachineXref[];
  }>;
}
