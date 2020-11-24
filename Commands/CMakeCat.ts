import * as Discord from "discord.js"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"
import * as AI_API from "../AI/AI_API"

export class CMakeCat extends Command {
    constructor() {
        super("makecat",ArgumentMode.WHOLE);
    }

    Run = async function(Args)  {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        AI_API.RunAIWithID("0",NoPythonExceptions => {
            if (NoPythonExceptions) {
                Embed.setTitle("Here's a cat."); 
                Embed.attachFiles(["./AI/OUT.jpg"]).setImage('attachment://OUT.jpg');
            } else {
                Embed.setTitle("An exception was encountered in the python backend"); 
            }
            Message.channel.send(Embed);
        });

    } 
}