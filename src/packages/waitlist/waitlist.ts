import { User } from './types';

export const waitListContainsUser = (waitList: User[], user: User): boolean => {
  return waitList.find((u) => u.id === user.id) != null;
};

export const stringifyWaitList = (waitList: User[]): string => {
  if (waitList.length == 0) return 'The wait list is currently empty';
  return waitList.reduce<string>(
    (acc, cur, index) => acc + `${index + 1}. ${cur.displayName}\n`,
    'Wait list:\n',
  );
};
