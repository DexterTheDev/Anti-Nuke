module.exports.run = async (client , message, args) => {
    message.channel.send(`🏓 Pong, It took \`${client.ws.ping}\`ms`)
}

module.exports.help = {
    name: "ping",
    category: "others",
    aliases: ['latency'],
    description: "Send bot respond latency in ms.",
    example: "``ping``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    dm_only: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}