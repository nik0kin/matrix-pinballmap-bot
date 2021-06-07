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

export interface LocationMachineXref {
  id: string;
  updated_at: string;
  location: { id: number };
  machine: { id: number };
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
