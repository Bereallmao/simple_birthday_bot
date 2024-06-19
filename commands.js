require('dotenv').config()
const { REST, Routes, SlashCommandBuilder } = require("discord.js")
const botid = process.env.BOT_ID
const serverid = process.env.SERVER_ID
const bot_token = process.env.DISCORD_TOKEN

const rest = new REST().setToken(bot_token)

const slash = async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(botid, serverid), {
		 body: [
			/*{
			name: "setbd",
			description: "set the birthday of a member."
			}*/
			 new SlashCommandBuilder()
			 .setName("setbd")
			 .setDescription("set the birthday of a member.")
			 .addStringOption(option => {
				return option
				.setName("date")
				.setDescription("the birthday date of the member. DD-MM")
				.setRequired(true)
			 })
			 .addStringOption(option1 => {
				return option1
				.setName("id")
				.setDescription("user id of the member.")
				.setRequired(true)
			 })
		]
	})
	} catch (error) {
	console.error(error)
	}
}

slash();
