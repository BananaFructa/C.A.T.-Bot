import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as DBM from "./DataBaseManager"
import { CommandManager } from "./Commands/CommandManager"

const bot = new Discord.Client();
const defPhotoSet = fs.readFileSync('photoCodes.txt').toString().split('\n');
defPhotoSet.pop();
const auth = fs.readFileSync('auth.txt').toString();

bot.login(auth);
bot.on('ready', () => {
    CommandManager.LoadCommands();
    DBM.SetClient(bot);
    DBM.CheckForNewCommand(CommandManager.Commands);
    DBM.StartRoutines();
    DBM.CheckForGuilds(bot);

    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("your cat!", { type: "WATCHING" });
});

bot.on('message', message => {
    try {
        if (message.author.id !== bot.user.id) {
            DBM.tryadduser(message.author.id);
            let CurrentGuildData :DBM.GuildDataFormat = DBM.GetGuildData(message.guild.id);
            CommandManager.SetPrefix(CurrentGuildData.prfx);
            CommandManager.RunCommand(message.content,message);
            if (message.content === "~rstprefix" && message.member.hasPermission("ADMINISTRATOR")) {
                DBM.SetGuildPrefix(message.guild.id,"~");
                message.channel.send(new Discord.MessageEmbed().setColor("#993399").setTitle("Prefix set to default (~)"));

            }
            //inc message
            DBM.AddToUserStats(message.author.id,1,0,0);
            DBM.AddToLastHourHistory(message.author.id);
            if (message.attachments.size != 0) {
                //inc img
                DBM.AddToUserStats(message.author.id,0,0,1);
            }
        }
    } catch (err) {
        console.log(err);
    }
});

bot.on('guildCreate', guild => {
    DBM.AddGuild(guild.id);
});

bot.on('guildDelete', guild => {
    DBM.RemoveGuild(guild.id);
});

process.on('uncaughtException', UncaughtExceptionHandler);

function UncaughtExceptionHandler(err) {
    console.log("Uncaught Exception Encountered!!");
    console.log("err: ", err);
    console.log("Stack trace: ", err.stack);
  //  process.exit(1);
}