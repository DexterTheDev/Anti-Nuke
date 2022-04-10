module.exports = async(client, member) => {
    if (member.user.displayAvatarURL().split("avatars/")[1].split(".png")[0] <= 5) {
        member.kick('Detected default avatar')
        member.send("**:x: Rejoin the server with proper avatar url**").catch(() => {});
    } else {
        if (Date.now() - member.user.createdAt > 864000000) {
            await member.roles.add(client.config.unverified);
        } else {
            member.send("**:x: Your account creation less than 10 days!**")
                .then(() => {
                    member.kick('Account less than 10 days!')
                })
                .catch(() => {});
        };
    };
};