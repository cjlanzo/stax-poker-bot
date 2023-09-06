import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export enum WaitListCommands {
  AddSelf = 'waitlist-add',
  RemoveSelf = 'waitlist-remove',
  View = 'waitlist-view',
  Clear = 'waitlist-clear',
  Next = 'waitlist-next',
  Add = 'waitlist-add-player',
  Remove = 'waitlist-remove-player',
  NewTable = 'new-table',
}

export const commands: SlashCommandBuilder[] = [
  new SlashCommandBuilder()
    .setName(WaitListCommands.AddSelf)
    .setDescription('Add yourself to the wait list'),
  new SlashCommandBuilder()
    .setName(WaitListCommands.RemoveSelf)
    .setDescription('Remove yourself to the wait list'),
  new SlashCommandBuilder().setName(WaitListCommands.View).setDescription('View the wait list'),
  new SlashCommandBuilder()
    .setName(WaitListCommands.Clear)
    .setDescription('(admin) Clear the wait list')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder()
    .setName(WaitListCommands.Next)
    .setDescription('(admin) Notify the next player on the wait list that they are ready to play')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder()
    .setName(WaitListCommands.Add)
    .setDescription('(admin) Add the player to the specified position on the wait list')
    .addUserOption((option) => {
      return option.setName('usertoadd').setDescription('user to add');
    })
    .addNumberOption((option) => {
      return option.setName('listposition').setDescription('list position to add the user at');
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder()
    .setName(WaitListCommands.Remove)
    .setDescription('(admin) Remove the player from the wait list')
    .addUserOption((option) => {
      return option.setName('usertoremove').setDescription('user to remove');
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder()
    .setName(WaitListCommands.NewTable)
    .setDescription('(admin) Create a new table from the wait list (defaults to 10 players)')
    .addNumberOption((option) => {
      return option
        .setName('tablesize')
        .setDescription('number of players to add to the new table');
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
];
