const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    time,
    TimestampStyles,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Select a member to timeout with a duration.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to timeout")
                .setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName("duration")
                .setDescription("The duration to timeout for")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for timeout."),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const duration = interaction.options.getNumber("duration"); // always hours
        const reason =
            interaction.options.getString("reason") ?? "No reason provided";
        const dirInMS = duration * 60 * 60 * 1000;
        // const dirInMS = 1000; // debug diration
        const member = interaction.options.getMember("target");

        const date = new Date();
        const relative = time(date, TimestampStyles.RelativeTime);
        let timeoutEmbed = new EmbedBuilder()
            .setDescription("Timeout Management")
            .setColor("#F6FF00")
            .addFields(
                {
                    name: "Timed out User",
                    value: `${target} with ID ${target.id}`,
                },
                {
                    name: "Timed out By",
                    value: `<@${interaction.member.id}> with ID ${interaction.member.id}`,
                },
                { name: "Timed out In", value: interaction.channel.name },
                { name: "Time", value: relative },
                { name: "Reason", value: reason },
            )
            .setImage(
                "https://cdn.discordapp.com/attachments/1285082545662197821/1286545287137071128/muted-silent.gif?ex=66ee4c2b&is=66ecfaab&hm=93c1b5a649520681c37f85bfbe22cbc345a82010e00cda5c8c0891b14a2b9a09&",
            );

        await interaction.reply({ embeds: [timeoutEmbed] });
        await member.timeout(dirInMS, reason);
    },
};
