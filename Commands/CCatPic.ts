import * as Discord from "discord.js"
import * as DBM from "../DataBaseManager"
import * as fs from "fs"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"

export class CCatPic extends Command {


    DefPhotoSet :string[];

    constructor() {
        super("catpic",ArgumentMode.WHOLE);
        this.DefPhotoSet = fs.readFileSync('photoCodes.txt').toString().split('\n');
    }

    Run = async function(Args)  {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        let GuildData :DBM.GuildDataFormat= DBM.GetGuildData(Message.guild.id);
        if (GuildData.db === 'null') {
                Message.channel.send("https://imgur.com/" + this.DefPhotoSet[Math.floor(Math.random() * this.DefPhotoSet.length)]);
        } else {
            let photoSet :string[] = fs.readFileSync(GuildData.db).toString().split('\n');
            photoSet.pop();
            try {
                let photoCode = photoSet[Math.floor(Math.random() * photoSet.length)];
                Message.channel.send(photoCode.includes('imgur') ? photoCode : "https://imgur.com/" + photoCode);
            } catch (err) {
                Embed.setTitle("Catpic databse is empty!");
                Message.channel.send(Embed);
            }
        }
    }
}