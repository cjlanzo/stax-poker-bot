import { CacheType, CommandInteractionOptionResolver } from 'discord.js';
import { CommandOptions } from './types';

export const mapDiscordOptions = (
  options?: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
): CommandOptions => {
  return {
    userToAdd: options?.getUser('usertoadd', false)!,
    userToRemove: options?.getUser('usertoremove', false)!,
    waitListPosition: options?.getNumber('listposition', false)!,
    tableSize: options?.getNumber('tablesize', false) ?? 10,
  };
};
