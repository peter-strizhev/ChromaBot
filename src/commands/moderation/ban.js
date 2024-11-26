const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    time,
    TimestampStyles,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Select a member to ban.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to ban.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for banning."),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason =
            interaction.options.getString("reason") ?? "No reason provided";
        const date = new Date();
        const timeString = time(date);
        const relative = time(date, TimestampStyles.RelativeTime);

        let banEmbed = new EmbedBuilder()
            .setDescription("Ban Management")
            .setColor("#bc0000")
            .addFields(
                {
                    name: "Banned User",
                    value: `${target} with ID ${target.id}`,
                },
                {
                    name: "Banned By",
                    value: `<@${interaction.member.id}> with ID ${interaction.member.id}`,
                },
                { name: "Banned In", value: interaction.channel.name },
                { name: "Time", value: relative },
                { name: "Reason", value: reason },
            )
            .setImage(
                "https://cdn.discordapp.com/attachments/1257835351825973260/1286179366933500016/emoji-emojidie.gif?ex=66ecf761&is=66eba5e1&hm=a0bd218ae50db09c54d93f6647df93001e4ad4e926e20357ee4df2b1d8ff3188&",
            );

        await interaction.reply({ embeds: [banEmbed] });
        await interaction.guild.members.ban(target);
    },
};
