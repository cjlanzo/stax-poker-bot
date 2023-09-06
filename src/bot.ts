import { Client, Events } from 'discord.js';
import * as dotenv from 'dotenv';
import { handleCommand } from './packages/waitlist/handler';
import { User } from './packages/waitlist/types';
import { mapDiscordOptions } from './packages/waitlist/mapper';

dotenv.config();

const client = new Client({ intents: [] });

let waitLists: { [guildId: string]: User[] } = {
  [process.env.STAX_GUILD_ID!]: [],
  [process.env.TEST_GUILD_ID!]: [],
};

client.once(Events.ClientReady, (c) => console.log(`Ready! Logged in as ${c.user.tag}`));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const guildId = interaction.guildId;

  if (!guildId) {
    console.log('Unrecognized guildId');
    return;
  }

  // comment this out later
  // if (guildId === process.env.STAX_GUILD_ID!) {
  //   interaction.reply('Bot is down for maintenance');
  //   return;
  // }

  try {
    const { updatedWaitList, reply } = handleCommand({
      currentWaitList: waitLists[guildId],
      initiator: interaction.user,
      commandName: interaction.commandName,
      options: mapDiscordOptions(interaction.options),
    });

    waitLists[guildId] = updatedWaitList ?? waitLists[guildId];
    if (reply) interaction.reply(reply);
  } catch (e) {
    interaction.reply('Error');
    console.error(`Error occurred.\n${e}`);
  }
});

client.login(process.env.DISCORD_TOKEN!);

console.log('Bot is starting...');
