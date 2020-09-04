import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CCuses extends Command {

    constructor() {
        super("cuses",ArgumentMode.WHOLE);
    }


    Run = async function (Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        var tierList = "";
        let commandLength :number = CommandManager.Commands.length;
        for (var i = 0; i < commandLength; i++) {
            let C :Command = CommandManager.Commands[i];
            let Usages :number = DBM.GetCommandUsages(C);
            if (Usages == 1) {
                tierList = tierList + C.Name + ' - ' + Usages + ' use \n';
            } else {
                tierList = tierList + C.Name + ' - ' + Usages + ' uses \n';
            }
        }
        Message.channel.send(Embed.addField('All commands with all their uses', tierList));
    }

}

import {CommandManager} from "./CommandManager"