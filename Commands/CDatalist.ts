import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CDataList extends Command { 

    defPhotoSetLenght :number = 0;

    constructor() {
        super("datalist",ArgumentMode.WHOLE);
        this.defPhotoSetLenght = fs.readFileSync('photoCodes.txt').toString().split('\n').length;
    }
 
    Run = async function (Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        var guildCount :number = DBM.GuildData.getData("/Count");
        var txt = "Default | BananaFructa | " + this.defPhotoSetLenght+ " elements";
        for (var i = 0; i < guildCount; i++) {
            let GuildData :DBM.GuildDataFormat = DBM.GetGuildDataAt(i);
            if (GuildData.db !== 'null') {
                var aha = fs.readFileSync(GuildData.db).toString();
                var imgcount = aha.split('\n').length - 1;
                txt += '\n' + GuildData.db.replace(/.txt/g, '').replace(/CUSTOM_CPDB_/g, '');
                txt += ' | ' + (DBM.GetGuild(GuildData.id)).name + ' | ' + imgcount + ' elements';
            }
        }
        Embed.setTitle("Databse list").setDescription(txt);
        Message.channel.send(Embed);
    }

}