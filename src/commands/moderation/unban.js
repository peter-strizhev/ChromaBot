const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    time,
    TimestampStyles,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Select a member to unban")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to unban")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for unban."),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason =
            interaction.options.getString("reason") ?? "No reason given.";

        const date = new Date();
        const relative = time(date, TimestampStyles.RelativeTime);
        let banEmbed = new EmbedBuilder()
            .setDescription("Ban Management")
            .setColor("#1EFF00")
            .addFields(
                {
                    name: "User",
                    value: `${target} with ID ${target.id} no longer banned`,
                },
                {
                    name: "Action By",
                    value: `<@${interaction.member.id}> with ID ${interaction.member.id}`,
                },
                { name: "Time", value: relative },
                { name: "Reason", value: reason },
            );

        await interaction.reply({ embeds: [banEmbed] });
        await interaction.guild.members.unban(target, reason);
    },
};
