import { CacheType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { waitList } from '../waitlist/waitlist';
import { WaitListCommands } from './commands';

export const addToWaitList = async (interaction: CommandInteraction): Promise<void> => {
  const user = interaction.user;
  if (waitList.contains(user)) {
    await interaction.reply(`${user.displayName} is already on the waitlist`);
  } else {
    waitList.add(user);
    await interaction.reply(`Adding ${user.displayName} to the waitlist`);
  }
};

export const viewWaitList = async (interaction: CommandInteraction): Promise<void> => {
  if (waitList.isEmpty()) {
    await interaction.reply('The waitlist is currently empty');
  } else {
    await interaction.reply(`Waitlist:\n${waitList.stringify()}`);
  }
};

export const notifyNextUser = async (interaction: CommandInteraction): Promise<void> => {
  const user = waitList.pop();

  if (!user) {
    await interaction.reply('The waitlist is currently empty');
  } else {
    await interaction.reply(
      `<@${user.id}> You're up! You have 5 minutes to claim your spot at the table`,
    );
  }
};

export const waitListManager = {
  handleInteraction: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    switch (interaction.commandName) {
      case WaitListCommands.Add:
        await addToWaitList(interaction);
        break;
      case WaitListCommands.View:
        await viewWaitList(interaction);
        break;
      case WaitListCommands.Next:
        await notifyNextUser(interaction);
        break;
      default:
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
  },
};

export type WaitListManager = typeof waitListManager;
