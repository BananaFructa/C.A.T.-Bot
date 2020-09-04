import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CMergeFrom extends Command {

    constructor() {
        super("mergefrom",ArgumentMode.WHOLE);
    }

    Run = async function (Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        if (Message.member.hasPermission("ADMINISTRATOR")) {
            var databseToMerge = (Args[1] !== "default" ? "CUSTOM_CPDB_" + Args[1] + '.txt' : "photoCodes.txt");
            let GuildData  :DBM.GuildDataFormat = DBM.GetGuildData(Message.guild.id);
            var currData = GuildData.db;
            if (currData !== 'null') {
                if ((databseToMerge !== "photoCodes.txt" ? (DBM.GuildData.getIndex("/Guilds",databseToMerge,"db") !== -1) : true)) {
                    var data = fs.readFileSync(databseToMerge).toString();
                    var fl = fs.createWriteStream(currData, {
                        flags: 'a'
                    });
                    fl.write(data);
                    fl.end();
                    Embed.setTitle("Succesfuly merged database '" + databseToMerge.replace('.txt', '') + "' " + "to '" + currData.replace('.txt', '') + "' !");
                } else {
                    Embed.setTitle("The specified database doesn't exist!");
                }
            } else {
                Embed.setTitle("Consider creating a databse before modifying it!");
            }
            Message.channel.send(Embed);
        }
    }

}