import * as Discord from "discord.js"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"

export class CPing extends Command {
    constructor() {
        super("ping",ArgumentMode.WHOLE);
    }

    Run = async function(Args)  {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        Embed.setTitle("Yea i'm online"); 

        Message.channel.send(Embed);

    } 
}