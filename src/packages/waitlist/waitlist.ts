import { WaitListCommands } from '../discord/commands';

export type User = {
  displayName: string;
  id: string;
};

export const addUniqueUser = (waitList: User[], user: User): User[] => {
  if (waitListContainsUser(waitList, user)) return waitList;
  return [...waitList, user];
};

export const waitListContainsUser = (waitList: User[], user: User): boolean => {
  return waitList.find((u) => u.id === user.id) != null;
};

export const stringifyWaitList = (waitList: User[]): string => {
  return waitList.reduce<string>(
    (acc, cur, index) => acc + `${index + 1}. ${cur.displayName}\n`,
    '',
  );
};

export const notifyOnAddUser = (waitList: User[], user: User): string => {
  if (waitListContainsUser(waitList, user)) return `${user.displayName} is already on the waitlist`;
  return `Adding ${user.displayName} to the waitlist`;
};

export const notifyOnViewWaitList = (waitList: User[]): string => {
  if (waitList.length === 0) return 'The waitlist is currently empty';
  return `Waitlist:\n${stringifyWaitList(waitList)}`;
};

export const notifyOnNextUser = (user: User | undefined): string => {
  if (!user) return 'The waitlist is currently empty';
  return `<@${user.id}> You're up! You have 5 minutes to claim your spot at the table`;
};

export const handleCommand = (
  waitList: User[],
  user: User,
  commandName: string,
): {
  updatedWaitList: User[];
  reply?: string;
} => {
  switch (commandName) {
    case WaitListCommands.Add:
      return {
        updatedWaitList: addUniqueUser(waitList, user),
        reply: notifyOnAddUser(waitList, user),
      };
    case WaitListCommands.View:
      return {
        updatedWaitList: waitList,
        reply: notifyOnViewWaitList(waitList),
      };
    case WaitListCommands.Next:
      const nextUser = waitList.shift();
      return {
        updatedWaitList: waitList,
        reply: notifyOnNextUser(nextUser),
      };
    default:
      console.error(`No command matching ${commandName} was found.`);
      return {
        updatedWaitList: waitList,
        reply: undefined,
      };
  }
};
