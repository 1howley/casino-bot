const { generateCard, drawCard } = require("../utils/cardUtils");
const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("A Black Jack game aka 21"),

    async execute(interaction) {
        const card1 = generateCard();
        const card2 = generateCard();

        const card1Image = drawCard(card1);
        const card2Image = drawCard(card2);

        const card1Attachment = new AttachmentBuilder(card1Image, { name: "card1.png" });
        const card2Attachment = new AttachmentBuilder(card2Image, { name: "card2.png" });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("stay")
                    .setLabel("Ficar")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("hit")
                    .setLabel("Pedir Mais")
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({
            content: "Suas cartas iniciais:",
            files: [card1Attachment, card2Attachment],
            components: [row],
        });

        // Aguardar interações com botões
        const filter = (btnInteraction) =>
            btnInteraction.customId === "stay" || btnInteraction.customId === "hit";
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 30000,
        });

        collector.on("collect", async (btnInteraction) => {
            if (btnInteraction.customId === "stay") {
                await btnInteraction.update({
                    content: "Você escolheu ficar! O jogo terminou.",
                    components: [],
                });
                collector.stop();
            } else if (btnInteraction.customId === "hit") {
                const newCard = generateCard();
                const newCardImage = drawCard(newCard);
                const newCardAttachment = new AttachmentBuilder(newCardImage, { name: "newCard.png" });

                await btnInteraction.update({
                    content: "Você pediu mais uma carta! Aqui está:",
                    files: [newCardAttachment],
                    components: [row],
                });
            }
        });

        collector.on("end", () => {
            console.log("> Coleta de botões encerrada.");
        });
    },
};
