const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong"),
    async execute(/** @type {import("discord.js").Interaction} */ interaction) {
        let testEmbed = new EmbedBuilder()
            .setDescription("Pong")
            .setColor("#bc0000")
            .setDescription("pong")
            .setImage(
                "https://cdn.discordapp.com/attachments/1257835351825973260/1286178603704516650/cat-driving.gif?ex=66ecf6ab&is=66eba52b&hm=4deb3d5e22313bbc9d220dcff940d3ef3357a3c2ec8fe66a9538cdad9ecfa521&",
            );

        await interaction.reply({ embeds: [testEmbed] });
    },
};
