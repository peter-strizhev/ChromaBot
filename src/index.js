// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const {
    Client,
    Collection,
    GatewayIntentBits,
    SlashCommandBuilder,
} = require("discord.js");

const { token } = require("./config");

// New client instance
/**
 * @type {Client & { commands?: Collection<string, { data: SlashCommandBuilder, execute: (interaction: import("discord.js").Interaction) => Promise<void> }>}}
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(commandPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, {
                ...command,
                async execute(...args) {
                    console.log(
                        `[info] Executing command "${command.data.name}"`,
                    );
                    return await command.execute(...args);
                },
            });
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is is missing a required data or execute property.`,
            );
        }
    }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log into Discord with token
client.login(token);
