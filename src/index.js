const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')


const dotenv = require('dotenv')
dotenv.config()
const { KEY } = process.env

const fs = require("node:fs")
const path = require("node:path")
const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    } else  {
        console.log(`> That command at ${filePath} are with "data" ou "execute" missing`)
    } 
}

client.once(Events.ClientReady, c => {
	console.log(`> Ready! Logged in as ${c.user.tag}`)
});
client.login(KEY)

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return; 
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error("> Command not found");
        return
    }
    try {
        await command.execute(interaction)
    } 
    catch (error) {
        console.error(error)
        await interaction.reply("> Ocurred an error executing this command!")
    }
})
