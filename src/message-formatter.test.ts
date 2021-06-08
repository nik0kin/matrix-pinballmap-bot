import { getRegionUpdateString } from './message-formatter';

describe('getRegionUpdateString()', () => {
  test('should work one update', () => {
    const result = getRegionUpdateString('atlantis', [
      {
        type: 'add',
        machine: { id: 101, name: 'WaterWorld' },
        location: { id: 201, name: 'The Arcade' },
      },
    ]);
    expect(result).toEqual(`Region Updates for atlantis:
 - The Arcade added WaterWorld`);
  });
  test('should work two updates', () => {
    const result = getRegionUpdateString('atlantis', [
      {
        type: 'add',
        machine: { id: 101, name: 'WaterWorld' },
        location: { id: 201, name: 'The Arcade' },
      },
      {
        type: 'remove',
        machine: { id: 102, name: 'White Water' },
        location: { id: 201, name: 'The Arcade' },
      },
    ]);
    expect(result).toEqual(`Region Updates for atlantis:
 - The Arcade added WaterWorld
 - The Arcade removed White Water`);
  });
});
