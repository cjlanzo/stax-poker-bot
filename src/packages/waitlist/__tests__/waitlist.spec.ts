import { setWaitList, waitList } from '../waitlist';

describe('waitList', () => {
  describe('contains', () => {
    it('should return true when id matches an existing item', async () => {
      setWaitList([
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ]);

      const contains = waitList.contains({ displayName: 'Vdm', id: 'abc' });

      expect(contains).toBe(true);
    });

    it('should return true when id matches an existing item with different name', async () => {
      setWaitList([
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ]);

      const contains = waitList.contains({ displayName: 'SomeoneElse', id: 'abc' });

      expect(contains).toBe(true);
    });

    it('should return false when id does not match an existing item', async () => {
      setWaitList([
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ]);

      const contains = waitList.contains({ displayName: 'SomeoneElse', id: 'ghi' });

      expect(contains).toBe(false);
    });
  });
  describe('add', () => {
    it('should not add a user when already in the list', async () => {
      setWaitList([
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ]);

      waitList.add({ displayName: 'Vdm', id: 'abc' });

      expect(waitList.stringify()).toEqual('1. Vdm\n2. Champ\n');
    });

    it('should add a user when not already in the list', async () => {
      setWaitList([
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ]);

      waitList.add({ displayName: 'Rensy', id: 'ghi' });

      expect(waitList.stringify()).toEqual('1. Vdm\n2. Champ\n3. Rensy\n');
    });
  });

  describe('stringify', () => {
    it('should return an empty string when list is empty', async () => {
      setWaitList([]);
      expect(waitList.stringify()).toEqual('');
    });

    it('should return a numbered list when list is not empty', async () => {
      setWaitList([
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ]);

      expect(waitList.stringify()).toEqual('1. Vdm\n2. Champ\n');
    });
  });
});
