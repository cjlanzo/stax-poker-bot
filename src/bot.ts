import { Client, Events } from 'discord.js';
import * as dotenv from 'dotenv';
import { User } from './packages/waitlist/waitlist';
import { handleCommand } from './packages/waitlist/waitlist';

dotenv.config();

const client = new Client({ intents: [] });
let waitList: User[] = [];

client.once(Events.ClientReady, (c) => console.log(`Ready! Logged in as ${c.user.tag}`));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { updatedWaitList, reply } = handleCommand(
    waitList,
    interaction.user,
    interaction.commandName,
  );

  waitList = updatedWaitList;
  if (reply) interaction.reply(reply);
});

client.login(process.env.DISCORD_TOKEN!);

console.log('Bot is starting...');
