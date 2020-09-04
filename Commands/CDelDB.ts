import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"

export class CDelDB extends Command {

    constructor() {
        super("del-db",ArgumentMode.WHOLE);
    }

    Run = async function (Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        if (Message.member.hasPermission("ADMINISTRATOR")) {
            let guildId :string = Message.guild.id;
            let GuildData :DBM.GuildDataFormat = DBM.GetGuildData(guildId);
            if (GuildData.db === 'null') {
                Embed.setTitle("There is no pic database to be deleted!");
            }else {
                try {
                    fs.unlinkSync(GuildData.db);
                    Embed.setTitle("Database '" + GuildData.db.replace(".txt","") + "' has been succesfuly deleted!");
                    DBM.SetGuildDatabase(guildId,"null");
                } catch (err) {
                    Embed.setTitle("Un unexpected error has occured");
                }
            }
            Message.channel.send(Embed);
        }
        
    }
}