import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CDeleteFrom extends Command {

    constructor() {
        super("deletefrom",ArgumentMode.WHOLE);
    }

    Run = async function(Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];
        if (Message.member.hasPermission("ADMINISTRATOR")) {
            var databseToDelete = (Args[1] != "Default" ? "CUSTOM_CPDB_" + + Args[1] + '.txt' : "photoCodes.txt");
            let GuildData  :DBM.GuildDataFormat = DBM.GetGuildData(Message.guild.id);
            var currentFile = GuildData.db;
            if (currentFile !== 'null') {
                if ((databseToDelete != "photoCodes.txt" ? (DBM.GuildData.getIndex("/Guilds",databseToDelete,"db") !== -1) : true)) {
                    var dataToDel = [];
                    dataToDel = fs.readFileSync(databseToDelete).toString().split('\n');
                    dataToDel.pop();
                    var data = fs.readFileSync(currentFile).toString();
                    for (var i = 0; i < dataToDel.length; i++) {
                        data = data.replace(dataToDel[i] + '\n', '');
                    }
                    fs.writeFileSync(currentFile, data);
                    Embed.setTitle("Succesfuly removed database '" + databseToDelete.replace('.txt', '') + "' " + "from '" + currentFile.replace('.txt', '') + "' !");
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