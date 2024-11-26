const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    time,
    TimestampStyles,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Select a member to un-timeout.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to un-timeout")
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const member = interaction.options.getMember("target");

        const date = new Date();
        const relative = time(date, TimestampStyles.RelativeTime);
        let timeoutEmbed = new EmbedBuilder()
            .setDescription("Timeout Management")
            .setColor("#1EFF00")
            .addFields(
                {
                    name: "User",
                    value: `${target} with ID ${target.id} no longer timed out`,
                },
                {
                    name: "Action By",
                    value: `<@${interaction.member.id}> with ID ${interaction.member.id}`,
                },
                { name: "Time", value: relative },
            );

        await interaction.reply({ embeds: [timeoutEmbed] });
        await member.timeout(null);
    },
};
