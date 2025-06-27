// @ts-check

const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    time,
    TimestampStyles,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick-plebs")
        .setDescription("Removes all Plebs (users with no roles)")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(
        /** @type {import("discord.js").RepliableInteraction} */ interaction,
    ) {
        const date = new Date();
        const timeString = time(date);
        const relative = time(date, TimestampStyles.RelativeTime);

        const allUsers = Array.from(
            (await interaction.guild?.members.fetch()) ?? [],
        );

        console.log(`${allUsers.length} total users`);

        const plebs = allUsers.flatMap(([user, member]) => {
            if (Array.from(member.roles.valueOf().values()).length === 1) {
                console.log(member.displayName, user, "is a pleb");
                return [{ user, member }];
            }
            return [];
        });

        console.log(`${plebs.length} plebs, starting purge...`);

        for (const { user, member } of plebs) {
            await member.kick("non-patreon member");
            console.log("kicked", member.displayName, user);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Kick Management")
                    .setColor("#F6FF00")
                    .addFields({
                        name: `Kicked Plebs`,
                        value: `${plebs.length} plebs wiped`,
                    })
                    .setImage("https://i.imgur.com/PgNGFED.gif"),
            ],
        });
    },
};
