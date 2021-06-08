import { getRegionUpdateString } from './message-formatter';

describe('getRegionUpdateString()', () => {
  test('should work', () => {
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
});
