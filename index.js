const { Client, Collection } = require("discord.js");
const client = new Client({
    disableEveryone: true,
    disabledEvents: ["GUILD_MEMBER_REMOVE", "GUILD_UPDATE", "GUILD_MEMBERS_CHUNK", "GUILD_ROLE_CREATE", "GUILD_EMOJIS_UPDATE", "GUILD_INTEGRATIONS_UPDATE", "CHANNEL_CREATE", "CHANNEL_UPDATE", "CHANNEL_PINS_UPDATE", "MESSAGE_DELETE_BULK", "USER_UPDATE", "PRESENCE_UPDATE", "TYPING_START", "VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE", "WEBHOOKS_UPDATE"],
    disabledEvents: ["TYPING_START"],
    intents: 32767
});

const events = require("./structures/event");
const command = require("./structures/command");

client.config = require("./config")
client.logger = async(content, embed) => {
    let msg = {}
    if (content) msg.content = content
    if (embed) msg.embeds = [embed]

    await client.guilds.cache.get(client.config.guildID).channels.cache.get(client.config.logs).send(msg)
};
client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();
command.run(client);
events.run(client)

client.on("ready", () => {
    console.log(`${client.user.username} is connected...`)
});

client.login(client.config.token);