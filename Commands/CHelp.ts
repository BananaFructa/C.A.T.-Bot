import * as Discord from "discord.js"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"

export class CHelp extends Command {
    constructor() {
        super("help",ArgumentMode.WHOLE);
    }
    Run = async function(Args)  {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        let GuildData :DBM.GuildDataFormat = DBM.GetGuildData(Message.guild.id);

        Embed.setTitle('C.A.T. Bot Command List')
        .setDescription('The prefix for all commands is ' + GuildData.prfx)
        .addField('Commands',
            "**" + "ping" + '** - See if the bot is online \n' +
            "**" + "help" + '** - I guess you knew of this one since you opened the help menu \n ' +
            "**" + "catpic" + "** - Gives a random cat image from the bot's database \n" +
            "**" + "braincells" + '** - See how many brain cells you have left \n' +
            "**" + "roll" + '** - Roll the dice \n' +
            "**" + "cuses" + '** - See how many times all commands have been used \n' +
            "**" + "sats" + "** - View your or someone's else stats \n" +
            "**" + "rep" + "** - Give someone a reputation point \n" +
            "**" + "prefix" + "** - Change the bot's  prefix for this guild (Administrator only) \n" +
            "**" + "rstprefix" + "** - Reset to default prefix (Administrator only , independent of custom prefix) \n" +
            "**" + "cdb-help" + "** - Get the command list for the catpic database editor"
        );

        Message.channel.send(Embed);

    }
}