const {
    SlashCommandBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    InteractionCollector,
    Client,
    time,
    TimestampStyles,
    PermissionFlagsBits,
    ComponentType,
    Component,
} = require("discord.js");
const humanizeDuration = require("humanize-duration");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banvote")
        .setDescription("Start a vote to ban a user")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to publicly ban")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the public ban vote.")
                .setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName("time")
                .setDescription("Allowed time for vote (default is 5 minutes"),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason");
        const timeLimit = interaction.options.getNumber("time") ?? 5;
        const timeInMS = timeLimit * 60 * 1000;

        const date = new Date();
        const relative = time(date, TimestampStyles.RelativeTime);

        const yes = new ButtonBuilder()
            .setCustomId("yes")
            .setLabel("Yes")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🔨");

        const no = new ButtonBuilder()
            .setCustomId("no")
            .setLabel("No")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("👼");

        const row = new ActionRowBuilder().addComponents(yes, no);
        let banVoteEmbed = new EmbedBuilder()
            .setDescription("Public Execution")
            .setColor("#bc0000")
            .addFields(
                {
                    name: "User To Be Banned:",
                    value: `${target}`,
                    inline: true,
                },
                {
                    name: "Vote Started By:",
                    value: `<@${interaction.member.id}>`,
                    inline: true,
                },
                { name: "Reason", value: reason },
                { name: "Time Remaining", value: relative },
                // {name: 'Votes', value: `${} Yes | ${} No`}
            );

        const response = await interaction.reply({
            embeds: [banVoteEmbed],
            components: [row],
        });

        const collector = response.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
            time: timeInMS,
        });

        collector.on("collect", (interaction) => {
            if (interaction.customId === "yes") {
                interaction.reply("You clicked on Yes.");
                return;
            }
            if (interaction.customId === "no") {
                interaction.reply("You clicked on No.");
                return;
            }
        });

        collector.on("end", () => {
            yes.setDisabled(true);
            no.setDisabled(true);

            interaction.editReply({
                components: [row],
            });
        });
    },
};
