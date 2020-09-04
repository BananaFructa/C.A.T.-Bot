import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"

export class CAddDB extends Command {
    
    constructor() {
        super("add-db",ArgumentMode.WHOLE);
    }

    Run = async function(Args : any[]) {
        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        if (Message.member.hasPermission("ADMINISTRATOR")) {
            let elem :string = Args[1];
            let guildId :string = Message.guild.id;
            let GuildData :DBM.GuildDataFormat = DBM.GetGuildData(guildId);
            if (GuildData.db !== 'null') {
                this.addtopicdb(GuildData.db, elem);
                Embed.setTitle("Succesfuly added element " + "'" + elem + "'" + ' to database!');
            } else {
                Embed.setTitle("There is no database linked to this guild. Consider creating one before trying to add an element to it!");
            }
            Message.channel.send(Embed);
        }
    }

    addtopicdb(file, elem) {
        let fl :fs.WriteStream = fs.createWriteStream(file, {
            flags: 'a'
        });
        fl.write(elem + '\n');
        fl.end();
    }

}