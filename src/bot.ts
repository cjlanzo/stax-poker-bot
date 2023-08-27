import { Client, Events } from 'discord.js';
import { waitListManager } from './packages/discord/waitlist-manager';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [] });

client.once(Events.ClientReady, (c) => console.log(`Ready! Logged in as ${c.user.tag}`));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await waitListManager.handleInteraction(interaction);
});

client.login(process.env.DISCORD_TOKEN!);

console.log('Bot is starting...');
