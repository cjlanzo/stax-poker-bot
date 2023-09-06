export type User = {
  displayName: string;
  id: string;
};

export type CommandOptions = {
  userToAdd?: User;
  userToRemove?: User;
  waitListPosition?: number;
  tableSize: number;
};

export type CommandPayload = {
  currentWaitList: User[];
  initiator: User;
  commandName: string;
  options?: CommandOptions;
};

export type CommandResponse = {
  updatedWaitList?: User[];
  reply?: string;
};
