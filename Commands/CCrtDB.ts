import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"

export class CCrTDB extends Command {

    constructor() {
        super("crt-db",ArgumentMode.WHOLE);
    }

    Run = async function (Args) {
        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];
        if (Message.member.hasPermission("ADMINISTRATOR")) {
            let guildId :string = Message.guild.id;
            let dbName :string = Args[1];
            let GuildData :DBM.GuildDataFormat = DBM.GetGuildData(guildId);
            if (!this.isForb(dbName) && DBM.GuildData.getIndex("/Guilds","CUSTOM_CPDB_"+dbName +'.txt',"db") === -1) {
                if (GuildData.db === 'null') {
                    try {
                        DBM.SetGuildDatabase(guildId, "CUSTOM_CPDB_" + dbName + '.txt');
                        fs.writeFileSync("CUSTOM_CPDB_" + dbName + '.txt', '');
                        Embed.setTitle("Succesfuly created pic database " + "'" + "CUSTOM_CPDB_" + dbName + "'");

                    } catch (err) {
                        Embed.setTitle("An unexpected error has occured");
                    }
                } else {
                    Embed.setTitle("You cannot create another pic database. A single database may be created per guild!");
                }
            } else if (this.isForb(dbName)) {
                Embed.setTitle("A pic database name may only contain letters from a to z. Also it cannot contain CON , PRN , AUX , NUL , COM or LPT ");
            } else if (DBM.GuildData.getIndex("/Guilds","CUSTOM_CPDB_"+dbName +'.txt',"db") !== -1) {
                Embed.setTitle("This pic database name has already been taken by other guild!");
            }
            Message.channel.send(Embed);
        }
    }

    isForb(text) {
        return !(/^[a-zA-Z]*$/.test(text)) ||
            text.includes('CON') ||
            text.includes('PRN') ||
            text.includes('AUX') ||
            text.includes('NUL') ||
            text.includes('COM') ||
            text.includes('LPT');
    }

}