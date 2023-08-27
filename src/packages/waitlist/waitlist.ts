export type User = {
  displayName: string;
  id: string;
};

let list: User[] = [];

export const waitList = {
  contains(user: User): boolean {
    return list.find((u) => u.id === user.id) != null;
  },

  isEmpty(): boolean {
    return list.length === 0;
  },

  add(user: User): void {
    if (!this.contains(user)) list.push(user);
  },

  stringify(): string {
    return list.reduce<string>((acc, cur, index) => acc + `${index + 1}. ${cur.displayName}\n`, '');
  },

  pop(): User | undefined {
    return list.shift();
  },

  addAtIndex(user: User, index: number): void {
    list.splice(index, 0, user);
  },
};

export type WaitList = typeof waitList;

export const setWaitList = (users: User[]) => (list = users);
