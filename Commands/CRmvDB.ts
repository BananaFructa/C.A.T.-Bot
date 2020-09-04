import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CRmvDB extends Command {

    constructor() {
        super("rmv-db",ArgumentMode.WHOLE);
    }

    Run = async function (Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];
        if (Message.member.hasPermission("ADMINISTRATOR")) {
            var elem :string = Args[1];
            var guildId :string = Message.guild.id;
            let GuildData :DBM.GuildDataFormat = DBM.GetGuildData(guildId);
            if (GuildData.db !== 'null') {
                if (this.removefrompicdb(GuildData.db, elem)) {
                    Embed.setTitle("Succesfuly removed element " + "'" + elem + "'" + ' from database!');
                } else {
                    Embed.setTitle("This element doesn't exist in the current context!");
                }
            } else {
                Embed.setTitle("There is no database linked to this guild. Consider creating one before trying to remove an element from it!");
            }
            Message.channel.send(Embed);
        }
    }

    removefrompicdb(file, elem) : boolean {
        let content :string = fs.readFileSync(file).toString();
        if (!content.includes(elem)) return false;
        let list :string[] = content.split('\n');
        list.splice(list.indexOf(elem), 1);
        fs.writeFileSync(file, list.join('\n'));
        return true;
    }

}
