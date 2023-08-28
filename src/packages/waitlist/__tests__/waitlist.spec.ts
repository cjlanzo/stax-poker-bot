import { WaitListCommands } from '../../discord/commands';
import {
  addUniqueUser,
  handleCommand,
  notifyOnAddUser,
  notifyOnNextUser,
  notifyOnViewWaitList,
  stringifyWaitList,
  waitListContainsUser,
} from '../waitlist';
import { User } from '../waitlist';

describe('addUniqueUser', () => {
  it('should not add a user that is already on the list', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];

    const user = { displayName: 'Vdm', id: 'abc' };

    const updatedWaitList = addUniqueUser(waitList, user);

    expect(updatedWaitList).toEqual(waitList);
  });

  it('should add a user not already on the list', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];

    const user = { displayName: 'Rensy', id: 'ghi' };

    const updatedWaitList = addUniqueUser(waitList, user);

    expect(updatedWaitList).toEqual([
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
      { displayName: 'Rensy', id: 'ghi' },
    ]);
  });
});

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
  it('should return an empty string when list is empty', async () => {
    const waitList: User[] = [];
    expect(stringifyWaitList(waitList)).toEqual('');
  });

  it('should return a numbered list when list is not empty', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];
    expect(stringifyWaitList(waitList)).toEqual('1. Vdm\n2. Champ\n');
  });
});

describe('notifyOnAddUser', () => {
  describe('given the user is already on the waitlist', () => {
    it('should reply that user is already on the waitlist', async () => {
      const waitList = [
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ];

      const user = { displayName: 'Vdm', id: 'abc' };

      const reply = notifyOnAddUser(waitList, user);

      expect(reply).toEqual('Vdm is already on the waitlist');
    });
  });

  describe('given the user is not already on the waitlist', () => {
    it('should reply that user has been added to the waitlist', async () => {
      const waitList = [
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ];

      const user = { displayName: 'Rensy', id: 'ghi' };

      const reply = notifyOnAddUser(waitList, user);

      expect(reply).toEqual('Adding Rensy to the waitlist');
    });
  });
});

describe('notifyOnViewWaitList', () => {
  describe('given an empty waitlist', () => {
    it('should reply that the waitlist is empty', async () => {
      const waitList: User[] = [];

      const reply = notifyOnViewWaitList(waitList);

      expect(reply).toEqual('The waitlist is currently empty');
    });
  });

  describe('given a waitlist with names on it', () => {
    it('should reply with the current state of the waitlist', async () => {
      const waitList = [
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ];

      const reply = notifyOnViewWaitList(waitList);

      expect(reply).toEqual('Waitlist:\n1. Vdm\n2. Champ\n');
    });
  });
});

describe('notifyOnNextUser', () => {
  describe('given the next user exists', () => {
    it('should reply that the next user has been selected', async () => {
      const user = { displayName: 'Vdm', id: 'abc' };

      const reply = notifyOnNextUser(user);

      expect(reply).toEqual(
        `<@${user.id}> You're up! You have 5 minutes to claim your spot at the table`,
      );
    });
  });

  describe('given the next user does not exist', () => {
    it('should reply that the list is empty', async () => {
      const reply = notifyOnNextUser(undefined);

      expect(reply).toEqual('The waitlist is currently empty');
    });
  });
});

// figure these out
describe('handleCommand', () => {
  it('should call correct functions when called with Add command', async () => {
    const waitList: User[] = [];
    const user = { displayName: 'Vdm', id: 'abc' };

    handleCommand(waitList, user, WaitListCommands.Add);

    expect(addUniqueUser).toBeCalledWith(waitList, user);
    expect(notifyOnAddUser).toBeCalledWith(waitList, user);
  });

  it('should call correct functions when called with View command', async () => {
    const waitList: User[] = [];
    const user = { displayName: 'Vdm', id: 'abc' };

    handleCommand(waitList, user, WaitListCommands.View);

    expect(notifyOnViewWaitList).toBeCalledWith(waitList);
  });

  it('should call correct functions when called with Next command', async () => {
    const waitList = [
      { displayName: 'Vdm', id: 'abc' },
      { displayName: 'Champ', id: 'def' },
    ];

    const user = { displayName: 'Rensy', id: 'ghi' };

    const { updatedWaitList } = handleCommand(waitList, user, WaitListCommands.Next);

    expect(notifyOnNextUser).toBeCalledWith(waitList, waitList[0]);
    expect(updatedWaitList).toEqual([{ displayName: 'Champ', id: 'def' }]);
  });

  // it('should not crash when called with unrecognized command', async () => {});
});
