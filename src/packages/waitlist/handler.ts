import { stringifyWaitList, waitListContainsUser } from './waitlist';
import { WaitListCommands } from '../discord/commands';
import { CommandPayload, CommandResponse, User } from './types';

export const handleAddSelf = (command: CommandPayload): CommandResponse => {
  const { currentWaitList, initiator } = command;

  if (waitListContainsUser(currentWaitList, initiator)) {
    return {
      reply: 'You are already on the wait list',
    };
  }

  const updatedWaitList = [...currentWaitList, initiator];

  return {
    updatedWaitList,
    reply: `Added ${initiator.displayName} to the wait list\n${stringifyWaitList(updatedWaitList)}`,
  };
};

export const handleRemoveSelf = (command: CommandPayload): CommandResponse => {
  const { currentWaitList, initiator } = command;
  const index = currentWaitList.findIndex((u) => u.id === initiator.id);

  if (index == -1) {
    return {
      reply: 'You are not on the wait list',
    };
  }

  const updatedWaitList = [...currentWaitList];
  updatedWaitList.splice(index, 1);

  return {
    updatedWaitList,
    reply: `Removed ${initiator.displayName} from the wait list\n${stringifyWaitList(
      updatedWaitList,
    )}`,
  };
};

export const handleView = (command: CommandPayload): CommandResponse => {
  const { currentWaitList } = command;

  return {
    reply: stringifyWaitList(currentWaitList),
  };
};

export const handleClear = (): CommandResponse => {
  return {
    updatedWaitList: [],
    reply: 'Cleared the wait list',
  };
};

export const handleNextUser = (command: CommandPayload): CommandResponse => {
  const { currentWaitList } = command;
  const updatedWaitList = [...currentWaitList];
  const nextUser = updatedWaitList.shift();

  if (!nextUser) {
    return {
      reply: 'The waitlist is currently empty',
    };
  }

  return {
    updatedWaitList,
    reply: `<@${nextUser.id}> You're up! You have 5 minutes to claim your spot at the table`,
  };
};

export const handleAddPlayer = (command: CommandPayload): CommandResponse => {
  const { currentWaitList, options } = command;
  const userToAdd = options!.userToAdd!;
  const addPosition = options!.waitListPosition!;
  const index = addPosition - 1;

  if (waitListContainsUser(currentWaitList, userToAdd)) {
    return {
      reply: `${userToAdd.displayName} is already on the wait list`,
    };
  }

  if (index < 0 || index > currentWaitList.length) {
    return {
      reply: 'You must specify a valid position in the list',
    };
  }

  const updatedWaitList = [...currentWaitList];
  updatedWaitList.splice(index, 0, userToAdd);

  return {
    updatedWaitList,
    reply: `Added ${userToAdd.displayName} to position ${
      index + 1
    } of the wait list\n${stringifyWaitList(updatedWaitList)}`,
  };
};

export const handleRemovePlayer = (command: CommandPayload): CommandResponse => {
  const { currentWaitList, options } = command;
  const userToRemove = options!.userToRemove!;
  const index = currentWaitList.findIndex((u) => u.id === userToRemove.id);

  if (index == -1) {
    return {
      reply: `${userToRemove.displayName} is not on the wait list`,
    };
  }

  const updatedWaitList = [...currentWaitList];
  updatedWaitList.splice(index, 1);

  return {
    updatedWaitList,
    reply: `Removed ${userToRemove.displayName} from the wait list\n${stringifyWaitList(
      updatedWaitList,
    )}`,
  };
};

export const handleNewTable = (command: CommandPayload): CommandResponse => {
  const { currentWaitList, options } = command;

  if (currentWaitList.length == 0) {
    return {
      reply: 'The waitlist is currently empty',
    };
  }

  const tableSize = options!.tableSize;
  const updatedWaitList = [...currentWaitList];
  const numPlayers = Math.min(tableSize, currentWaitList.length);
  const playersToAdd: User[] = [];

  for (let i = 0; i < numPlayers; i++) {
    const [player] = updatedWaitList.splice(0, 1);
    playersToAdd.push(player);
  }

  const playerIds = playersToAdd.reduce<string>((acc, p) => `${acc} <@${p.id}>`, '').trimStart();

  return {
    updatedWaitList,
    reply: `${playerIds} You're up! You have 5 minutes to claim your spot at the table`,
  };
};

export const handleCommand = (command: CommandPayload): CommandResponse => {
  switch (command.commandName) {
    case WaitListCommands.AddSelf:
      return handleAddSelf(command);
    case WaitListCommands.RemoveSelf:
      return handleRemoveSelf(command);
    case WaitListCommands.View:
      return handleView(command);
    case WaitListCommands.Clear:
      return handleClear();
    case WaitListCommands.Next:
      return handleNextUser(command);
    case WaitListCommands.Add:
      return handleAddPlayer(command);
    case WaitListCommands.Remove:
      return handleRemovePlayer(command);
    case WaitListCommands.NewTable:
      return handleNewTable(command);
    default:
      console.error(`No command matching ${command.commandName} was found.`);
      return {};
  }
};
