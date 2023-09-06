import { REST, Routes } from 'discord.js';
import { commands } from './packages/discord/commands';
import * as dotenv from 'dotenv';

dotenv.config();

const commandJson = commands.map((c) => c.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
const serversToUpdate = [process.env.STAX_GUILD_ID!, process.env.TEST_GUILD_ID!];

(async () => {
  try {
    console.log(`Started refreshing ${commandJson.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    for (const guildId of serversToUpdate) {
      const data: any = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId),
        {
          body: commandJson,
        },
      );

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
