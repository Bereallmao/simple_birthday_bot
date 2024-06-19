const fs = require('fs');
const path = './birthday.database.json'; 
require('dotenv').config();
const DateToday = new Date();
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 3 })
const date = ("0" + DateToday.getDate()).slice(-2);
const month = ("0" + (DateToday.getMonth() + 1)).slice(-2);
const today = (date + "-" + month);
client.on("ready", () => {
	console.log("[*/INFO] bot started");
	runBirthdayChecker()
})

client.on("interactionCreate", async (interaction) => {
	if(interaction.isCommand()) {
		if(interaction.commandName === "setbd") {
			const StringOption1 = interaction.options.getString("date")
			const StringOption2 = interaction.options.getString("id")
			interaction.reply({ content: `OUTPUT\n${StringOption1}` })
			addBirthday(StringOption2, StringOption1, () => {console.log("[*/INFO] SUCCESS: birthday added.")});
			console.log("[*/INFO] today's date is " + today);
			console.log(`[*/INFO] command 'setbd' issued with paramenter ${StringOption1} and ${StringOption2}`)
		}
	}
})

function ReadDB(callback) {
	fs.readFile(path, 'utf8', (err, data) => {
		if (err) {
			if (err.code === 'ENOENT') {
				callback([]);
			} else {
				throw err;
			}
		} else {
			try {
				callback(JSON.parse(data));
			} catch (parseError) {
				console.error('[*/ERROR] ', parseError);
				console.log('[*/INFO] Returning callback([]) in order to fix.');
				callback([]);
			}
		}

	});
}

async function getDiscordUsername(userId) {
    try {
        let user = await client.users.fetch(userId);
        return user.username;
    } catch (error) {
        console.error('[*/ERROR] Error fetching user:', error);
        return null;
    }
}

function checkBirthdays() {
    console.log("[*/INFO] running checkBirthdays on " + today)
    ReadDB((data) => {
        data.forEach((member) => {
		console.log("[*/DEBUG] date loaded from database: " + member.date)
            if (member.date === today) {
		console.log("[*/INFO] today is somebody's birthday!")
		console.log("[*/INFO] user ID: " + member.userid)
		/*getDiscordUsername(member.userid)
		    .then(username => {
                client.channels.cache.get('1220035245949063283').send(`Happy Birthday, @${username} !🎉🎂`)
		    })*/ // maybe some time in the future?
		client.channels.cache.get(process.env.CHANNEL_ID).send(`Happy Birthday, <@${member.userid}> !🎉🎂:`)
            }
        });
    });
}

function WriteDB(data, callback) {
	fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) throw err;
        callback();
    });
}

function addBirthday(userid, date, callback) {
	ReadDB((data) => {
		data.push({ userid, date });
		WriteDB(data, callback);
	});
}

function runBirthdayChecker() {
    	console.log("[*/INFO] runBirthdayChecker looped");
	checkBirthdays();
	setInterval(() => {checkBirthdays()}, 25 * 60 * 60 * 1000);
}

client.login(process.env.DISCORD_TOKEN)
