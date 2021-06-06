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
