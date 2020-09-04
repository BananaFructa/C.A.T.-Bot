import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CRoll extends Command {

    constructor() {
        super("roll",ArgumentMode.WHOLE);
    }

    Run = async function (Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        let synMsgErrHandl :string = "Syntax error ! (Correct syntax example: ~roll d10)";
        if (Message.content.includes('d')) {
            let number :string = String(Args[1]).replace("d","");
            if (!isNaN(Number(number))) {
               Embed.setTitle("You rolled a " + (Math.floor(Math.random() * parseInt(number)) + 1) + " !");
            } else {
            Embed.setTitle(synMsgErrHandl);
            }
        } else {
            Embed.setTitle(synMsgErrHandl);
        }
        Message.channel.send(Embed);
        
    }

}

