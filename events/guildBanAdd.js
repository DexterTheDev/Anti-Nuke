const { MessageEmbed } = require("discord.js");
const limiter = new Map();

module.exports = async (client, user) => {
    const fetchedLogs = await user.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_BAN_ADD",
    });
    const Log = fetchedLogs.entries.first();
    if (!Log) return;
    let operators = "";

    const { executor, target } = Log;
    if (client.config.whitelisted.includes(executor.id)) return;

    if (!limiter.get(executor.id)) limiter.set(executor.id, 1)
    else limiter.set(executor.id, limiter.get(executor.id) + 1)

    setTimeout(() => {
        limiter.delete(executor.id)
    }, 60000);

    if (limiter.get(executor.id) >= 4) {
        let member = await user.guild.members.cache.get(executor.id);
        let roles = [];
        await member.roles.cache.map(r => {
            if (r.id != user.guild.id) roles.push(r.name);
        });

        if (member.user.bot) {
            member.roles.cache.map(async role => {
                if (role.managed) {
                    try {
                        await role.setPermissions(0);
                        operators += `+ ${executor.tag} BOT, has been quarantined\n`
                    } catch (Err) {
                        operators += `- Couldn't manage ${executor.tag} roles!\n`
                    }
                }
            })
        } else {
            operators += `+ ${executor.tag}, has been quarantined\n`
            member.roles.set([client.config.quarantine])
        }
        limiter.delete(executor.id)
        client.logger(content = "**⚠️ Something has been detected**", embed = new MessageEmbed()
            .setAuthor({ name: executor.tag, iconURL: executor.displayAvatarURL({ dynamic: true })})
            .setColor("RED")
            .setDescription(`<@${executor.id || "Invalid"}> (**${executor.tag || "Invalid#0000"}**) has triggered \`BANNING\` anti nuke.`)
            .addField(`Roles`, `${roles.length >= 1 ? roles.join(", ") : "**No Roles.**"}`)
            .setFooter({ text: `Trigger ID: ${executor.id}`})
            .addField(`Operations`, `\`\`\`diff\n${operators || "- None"}\`\`\``))
    }
};