import { stringifyWaitList, waitListContainsUser } from '../waitlist';
import { User } from '../types';

describe('waitListContainsUser', () => {
  it('should return true when id matches an existing item', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];

    const user = { displayName: 'Vdm', id: 'abc' };

    const contains = waitListContainsUser(waitList, user);

    expect(contains).toBe(true);
  });

  it('should return true when id matches an existing item with different name', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];

    const user = { displayName: 'SomeoneElse', id: 'abc' };

    const contains = waitListContainsUser(waitList, user);

    expect(contains).toBe(true);
  });

  it('should return false when id does not match an existing item', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];

    const user = { displayName: 'SomeoneElse', id: 'ghi' };

    const contains = waitListContainsUser(waitList, user);

    expect(contains).toBe(false);
  });
});

describe('stringifyWaitList', () => {
  it('should return a message when list is empty', async () => {
    const waitList: User[] = [];
    expect(stringifyWaitList(waitList)).toEqual('The wait list is currently empty');
  });

  it('should return a numbered list when list is not empty', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];
    expect(stringifyWaitList(waitList)).toEqual('Wait list:\n1. Vdm\n2. Champ\n');
  });
});
