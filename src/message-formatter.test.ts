import { getRegionUpdateString } from './message-formatter';

describe('getRegionUpdateString()', () => {
  test('should work', () => {
    const result = getRegionUpdateString('atlantis', [
      {
        type: 'add',
        machine: { id: 'WaterWorld' },
        location: { id: 'The Arcade' },
      },
    ]);
    expect(result).toEqual(`Region Updates for atlantis:
 - The Arcade added WaterWorld`);
  });
});
