import { CacheType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { WaitList } from './waitlist';
import { WaitListCommands } from './commands';

export class WaitListManager {
  readonly waitList: WaitList;

  constructor() {
    this.waitList = new WaitList();
  }

  async addToWaitList(interaction: CommandInteraction): Promise<void> {
    const user = interaction.user.displayName;
    this.waitList.add(user);
    await interaction.reply(`Adding ${user} to the wait-list`);
  }

  async viewWaitList(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(this.waitList.view());
  }

  async handleInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    switch (interaction.commandName) {
      case WaitListCommands.Add:
        await this.addToWaitList(interaction);
        break;
      case WaitListCommands.View:
        await this.viewWaitList(interaction);
        break;
      default:
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
  }
}
