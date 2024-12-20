const { createCanvas } = require("canvas");
// Função para gerar uma carta aleatória
function generateCard() {
    const suits = ['♥', '♦', '♣', '♠'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return { rank, suit };
}

// Função para desenhar uma carta
function drawCard(card) {
    const canvas = createCanvas(150, 200);
    const ctx = canvas.getContext("2d");

    // Fundo da carta
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 150, 200);

    // Bordas
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(0, 0, 150, 200);

    // Conteúdo
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${card.rank}${card.suit}`, 75, 100);

    return canvas.toBuffer();
}

module.exports = { generateCard, drawCard };
