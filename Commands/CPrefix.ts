import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CPrefix extends Command {

    constructor() {
        super("prefix",ArgumentMode.WHOLE);
    }

    Run = async function(Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];


        if (Message.member.hasPermission("ADMINISTRATOR")) {
            if (Args.length > 1 ? Args[1] === "" : false) {
                Embed.setTitle("There is no prefix to be read!");
            } else {
                DBM.SetGuildPrefix(Message.guild.id,Args[1]);
                Embed.setTitle("Succesfuly set prefix " + Args[1] + " for this current guild!");
            }
            Message.channel.send(Embed);
        }
    }

}