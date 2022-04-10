const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
    message.delete();
    const embed = new MessageEmbed()
        .setTitle("VERIFICATION CAPTCHA")
        .setColor("BLUE")
        .setDescription(`**Click below to verify!**`)
    message.channel.send({
        embeds: [embed], components: [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('verify')
                        .setLabel('Verify')
                        .setStyle('SUCCESS'))
        ]
    })

}

module.exports.help = {
    name: "embed",
    category: "others",
    aliases: [],
    description: "generates embeds",
    example: "``embed``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: true,
    dm_only: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}