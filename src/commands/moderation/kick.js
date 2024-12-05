const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    time,
    TimestampStyles,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Select a member to kick.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to kick.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for kicking."),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason =
            interaction.options.getString("reason") ?? "No reason provided";
        const date = new Date();
        const timeString = time(date);
        const relative = time(date, TimestampStyles.RelativeTime);

        let kickEmbed = new EmbedBuilder()
            .setDescription("Kick Management")
            .setColor("#F6FF00")
            .addFields(
                {
                    name: "Kicked User",
                    value: `${target} with ID ${target.id}`,
                },
                {
                    name: "Kicked By",
                    value: `<@${interaction.member.id}> with ID ${interaction.member.id}`,
                },
                { name: "Kicked In", value: interaction.channel.name },
                { name: "Time", value: relative },
                { name: "Reason", value: reason },
            )
            .setImage(
                "https://cdn.discordapp.com/attachments/1257835351825973260/1286180061900439593/asdf-movie.gif?ex=66ecf806&is=66eba686&hm=28ba7bac9a5badf4942c957271951d99c788f38909494455a650be63cca369b4&",
            );

        await interaction.reply({ embeds: [kickEmbed] });
        await interaction.guild.members.kick(target);
    },
};
