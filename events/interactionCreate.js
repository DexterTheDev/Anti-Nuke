const { MessageEmbed, MessageAttachment } = require("discord.js");
const { CaptchaGenerator } = require("captcha-canvas");
const { writeFileSync } = require('fs');
const limits = new Map();

module.exports = async(client, interaction) => {
    if (!interaction.isButton()) return;

    let guild = await client.guilds.cache.get(client.config.guildID);
    if (!interaction.user.bot) {
        switch (interaction.customId) {
            case 'verify':
                if (interaction.member.roles.cache.get(client.config.memberRole)) interaction.reply({ content: `**You are already verified & got access to the server**`, ephemeral: true });
                else if (limits.get(interaction.member.id)) interaction.reply({ content: "You've already active verification captcha", ephemeral: true })
                else {
                    limits.set(interaction.member.id, interaction.message.guildId);
                    interaction.reply({ content: "**Verification captcha has been generated at your dm's**", ephemeral: true })
                    let captcha = [];
                    let distraction = [];
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(char => {
                        if (distraction.length < 8) distraction.push((Math.random() * 9) + 1 > 5 ? (Math.random() * 9) + 1 > 5 ? char.toUpperCase() : char : "0123456789".charAt(Math.floor(Math.random() * 9)));
                        if (captcha.length < 6) captcha.push((Math.random() * 9) + 1 > 5 ? (Math.random() * 9) + 1 > 5 ? char.toUpperCase() : char : "0123456789".charAt(Math.floor(Math.random() * 9)));
                    });

                    const captchaG = new CaptchaGenerator()
                        .setDimension(150, 450)
                        .setCaptcha({ text: captcha.toString().split(",").join(""), size: 60, color: "lime" })
                        .setDecoy({ opacity: 0.5 })
                        .setTrace({ color: "lime" });
                    const buffer = captchaG.generateSync()

                    let m = await guild.channels.cache.get(client.config.logs).send({ files: [new MessageAttachment(await buffer, "Captcha.png")] })
                    m.delete();
                    var url = m.attachments.first() ?.url?? '';

                    interaction.member.send({
                        embeds: [new MessageEmbed()
                            .setAuthor({ name: "Verification Captcha", iconURL: guild.iconURL({ dynamic: true }) })
                            .setDescription("**Complete the following captcha below to access the server**")
                            .setFooter({ text: "Verification Period: 2 minutes" })
                            .setImage(url)
                            .setColor("GREEN")
                        ]
                    }).then(async msg => {
                        msg.channel.awaitMessages({
                            time: 2 * 60000,
                            max: 1
                        }).then(messages => {
                            if (!messages.first()) interaction.member.send("**Captcha timeout retry again to generate new one reclick the \`verify\` button**");
                            else {
                                if (messages.first().content == captcha.join("")) {
                                    interaction.member.send("**Thanks for verifying, You've got the access to the server**");
                                    interaction.member.roles.add(client.config.memberRole);
                                    interaction.member.roles.remove(client.config.unverified);
                                } else interaction.member.send("**Invalid Captcha, retry again to generate new one reclick the \`verify\` button**");
                                limits.delete(interaction.member.id);
                            }
                        })
                    })
                }
                break;
        }
    }
};