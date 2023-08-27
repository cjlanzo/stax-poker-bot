import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export enum WaitListCommands {
  Add = 'waitlist-add',
  View = 'waitlist-view',
  Next = 'waitlist-next',
}

export const commands: SlashCommandBuilder[] = [
  new SlashCommandBuilder()
    .setName(WaitListCommands.Add)
    .setDescription('Add yourself to the wait list'),
  new SlashCommandBuilder().setName(WaitListCommands.View).setDescription('View the wait list'),
  new SlashCommandBuilder()
    .setName(WaitListCommands.Next)
    .setDescription('(admin) Notify the next player on the wait list that they are ready to play')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
];
