import { WaitListCommands } from '../../discord/commands';
import {
  handleAddPlayer,
  handleAddSelf,
  handleClear,
  handleNewTable,
  handleNextUser,
  handleRemovePlayer,
  handleRemoveSelf,
} from '../handler';
import { CommandPayload } from '../types';
import { stringifyWaitList, waitListContainsUser } from '../waitlist';

jest.mock('../waitlist');

describe('handleAddSelf', () => {
  describe('given the user is already on the list', () => {
    it('should notify user that they are already on the list ', async () => {
      (waitListContainsUser as jest.Mock).mockImplementationOnce(() => true);

      const command: CommandPayload = {
        currentWaitList: [],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.AddSelf,
      };

      const r = handleAddSelf(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('You are already on the wait list');
    });
  });

  describe('given the user is not already on the list', () => {
    it('should update the list and notify the user they have been added', async () => {
      (waitListContainsUser as jest.Mock).mockImplementationOnce(() => false);
      (stringifyWaitList as jest.Mock).mockImplementationOnce(() => '');

      const command: CommandPayload = {
        currentWaitList: [],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.AddSelf,
      };

      const r = handleAddSelf(command);

      expect(stringifyWaitList as jest.Mock).toBeCalled();
      expect(r.updatedWaitList).toEqual([{ displayName: 'Vdm', id: 'abc' }]);
      expect(r.reply).toEqual('Added Vdm to the wait list\n');
    });
  });
});

describe('handleRemoveSelf', () => {
  describe('given user is not on the list', () => {
    it('should notify the user that they are not on the list', async () => {
      const command: CommandPayload = {
        currentWaitList: [],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.RemoveSelf,
      };

      const r = handleRemoveSelf(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('You are not on the wait list');
    });
  });

  describe('given user is on the list', () => {
    it('should update the list and notify the user that they have been removed', async () => {
      (stringifyWaitList as jest.Mock).mockImplementationOnce(() => '');

      const command: CommandPayload = {
        currentWaitList: [{ displayName: 'Vdm', id: 'abc' }],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.RemoveSelf,
      };

      const r = handleRemoveSelf(command);

      expect(r.updatedWaitList).toEqual([]);
      expect(r.reply).toEqual('Removed Vdm from the wait list\n');
    });
  });
});

describe('handleClear', () => {
  it('should clear the list and notify the user', async () => {
    const r = handleClear();

    expect(r.updatedWaitList).toEqual([]);
    expect(r.reply).toEqual('Cleared the wait list');
  });
});

describe('handleNextUser', () => {
  describe('given an empty wait list', () => {
    it('should notify that the list is empty', async () => {
      const command: CommandPayload = {
        currentWaitList: [],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.Next,
      };

      const r = handleNextUser(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('The waitlist is currently empty');
    });
  });

  describe('given a non-empty wait list', () => {
    it('should remove the next user from the list and notify them', async () => {
      const command: CommandPayload = {
        currentWaitList: [{ displayName: 'Vdm', id: 'abc' }],
        initiator: { displayName: 'Champ', id: 'def' },
        commandName: WaitListCommands.Next,
      };

      const r = handleNextUser(command);

      expect(r.updatedWaitList).toEqual([]);
      expect(r.reply).toEqual(
        "<@abc> You're up! You have 5 minutes to claim your spot at the table",
      );
    });
  });
});

describe('handleAddPlayer', () => {
  describe('given a list that already contains the user', () => {
    it('should notify the user that they are already on the list', async () => {
      (waitListContainsUser as jest.Mock).mockImplementationOnce(() => true);

      const command: CommandPayload = {
        currentWaitList: [{ displayName: 'Vdm', id: 'abc' }],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.AddSelf,
        options: {
          userToAdd: { displayName: 'Champ', id: 'def' },
          waitListPosition: 1,
          tableSize: 10,
        },
      };

      const r = handleAddPlayer(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('Champ is already on the wait list');
    });
  });

  describe('given an index that is less than 0', () => {
    it('should notify the user that the index is invalid', async () => {
      (waitListContainsUser as jest.Mock).mockImplementationOnce(() => false);

      const command: CommandPayload = {
        currentWaitList: [{ displayName: 'Vdm', id: 'abc' }],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.AddSelf,
        options: {
          userToAdd: { displayName: 'Champ', id: 'def' },
          waitListPosition: 0,
          tableSize: 10,
        },
      };

      const r = handleAddPlayer(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('You must specify a valid position in the list');
    });
  });

  describe('given an index that is more than the length of the list', () => {
    it('should notify the user that the index is invalid', async () => {
      (waitListContainsUser as jest.Mock).mockImplementationOnce(() => false);

      const command: CommandPayload = {
        currentWaitList: [{ displayName: 'Vdm', id: 'abc' }],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.AddSelf,
        options: {
          userToAdd: { displayName: 'Champ', id: 'def' },
          waitListPosition: 3,
          tableSize: 10,
        },
      };

      const r = handleAddPlayer(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('You must specify a valid position in the list');
    });
  });

  describe('given a valid index', () => {
    it('should update the list and notify that the user was added', async () => {
      (waitListContainsUser as jest.Mock).mockImplementationOnce(() => false);
      (stringifyWaitList as jest.Mock).mockImplementationOnce(() => '');

      const command: CommandPayload = {
        currentWaitList: [{ displayName: 'Vdm', id: 'abc' }],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.AddSelf,
        options: {
          userToAdd: { displayName: 'Champ', id: 'def' },
          waitListPosition: 2,
          tableSize: 10,
        },
      };

      const r = handleAddPlayer(command);

      expect(r.updatedWaitList).toEqual([
        { displayName: 'Vdm', id: 'abc' },
        { displayName: 'Champ', id: 'def' },
      ]);
      expect(r.reply).toEqual('Added Champ to position 2 of the wait list\n');
    });
  });
});

describe('handleRemovePlayer', () => {
  describe('given user is not on the list', () => {
    it('should notify that the user is not on the list', async () => {
      const command: CommandPayload = {
        currentWaitList: [],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.RemoveSelf,
        options: {
          userToRemove: { displayName: 'Champ', id: 'def' },
          tableSize: 10,
        },
      };

      const r = handleRemovePlayer(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('Champ is not on the wait list');
    });
  });

  describe('given user is on the list', () => {
    it('should update the list and notify that the user was removed', async () => {
      (stringifyWaitList as jest.Mock).mockImplementationOnce(() => '');
      (stringifyWaitList as jest.Mock).mockImplementationOnce(() => '');

      const command: CommandPayload = {
        currentWaitList: [
          { displayName: 'Vdm', id: 'abc' },
          { displayName: 'Champ', id: 'def' },
        ],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.RemoveSelf,
        options: {
          userToRemove: { displayName: 'Champ', id: 'def' },
          tableSize: 10,
        },
      };

      const r = handleRemovePlayer(command);

      expect(r.updatedWaitList).toEqual([{ displayName: 'Vdm', id: 'abc' }]);
      expect(r.reply).toEqual('Removed Champ from the wait list\n');
    });
  });
});

describe('handleNewTable', () => {
  describe('given an empty table', () => {
    it('should notify that the table is empty', async () => {
      const command: CommandPayload = {
        currentWaitList: [],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.NewTable,
      };

      const r = handleNewTable(command);

      expect(r.updatedWaitList).toBeUndefined();
      expect(r.reply).toEqual('The waitlist is currently empty');
    });
  });

  describe('given a wait list smaller than the table size', () => {
    it('should notify up to the length of the wait list', async () => {
      const command: CommandPayload = {
        currentWaitList: [
          { displayName: 'Vdm', id: 'abc' },
          { displayName: 'Champ', id: 'def' },
          { displayName: 'Rensy', id: 'ghi' },
        ],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.NewTable,
        options: {
          tableSize: 10,
        },
      };

      const r = handleNewTable(command);

      expect(r.updatedWaitList).toEqual([]);
      expect(r.reply).toEqual(
        "<@abc> <@def> <@ghi> You're up! You have 5 minutes to claim your spot at the table",
      );
    });
  });

  describe('given a wait list larger than the table size', () => {
    it('should notify up to the length of the wait list', async () => {
      const command: CommandPayload = {
        currentWaitList: [
          { displayName: 'Vdm', id: 'abc' },
          { displayName: 'Champ', id: 'def' },
          { displayName: 'Rensy', id: 'ghi' },
          { displayName: 'Rithz', id: 'jkl' },
          { displayName: 'Demias', id: 'mno' },
          { displayName: 'Butterz', id: 'pqr' },
        ],
        initiator: { displayName: 'Vdm', id: 'abc' },
        commandName: WaitListCommands.NewTable,
        options: {
          tableSize: 5,
        },
      };

      const r = handleNewTable(command);

      expect(r.updatedWaitList).toEqual([{ displayName: 'Butterz', id: 'pqr' }]);
      expect(r.reply).toEqual(
        "<@abc> <@def> <@ghi> <@jkl> <@mno> You're up! You have 5 minutes to claim your spot at the table",
      );
    });
  });
});
