import { REST, Routes } from 'discord.js';
import { token, clientId, guildId } from '../config.json';
import { commands } from './commands';

const commandJson = Array.from(commands.values()).map((c) => c.data.toJSON());

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commandJson.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandJson,
    });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
