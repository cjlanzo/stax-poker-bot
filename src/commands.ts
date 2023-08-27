import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export enum WaitListCommands {
  Add = 'waitlist-add',
  View = 'waitlist-view',
}

// this might be able to go away as well
export interface ICommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<any>; // ?
}

// currently only the data is being used for deploy-commands
export const commands: Map<string, ICommand> = new Map<string, ICommand>([
  [
    'waitlist-add',
    {
      data: new SlashCommandBuilder()
        .setName('waitlist-add')
        .setDescription('Adds player to wait list'),
      execute: async (interaction: CommandInteraction): Promise<string> => {
        const user = interaction.user.displayName;
        await interaction.reply(`Adding ${user} to the wait-list`);
        return user;
      },
    },
  ],
  [
    'waitlist-view',
    {
      data: new SlashCommandBuilder()
        .setName('waitlist-view')
        .setDescription('Views the wait list'),
      execute: async (interaction: CommandInteraction): Promise<void> => {
        await interaction.reply(`The wait list is as follows:`);
      },
    },
  ],
]);
