import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CRep extends Command {

    repblacklist :string[] = [];

    constructor() {
        super("rep",ArgumentMode.WHOLE);

        setInterval(() => {
            this.repblacklist = [];
        },3600000);
    }

    Run = async function (Args : any[]) {
        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        try {
            var userping = Message.mentions.users.first();
            if (!this.repblacklist.includes(Message.author.id)) {
                if (userping.id != Message.author.id) {
                    DBM.tryadduser(userping.id);
                    DBM.AddToUserStats(userping.id,0,0,1);
                    Embed.setTitle("You successfully gave a reputation point to " + userping.tag.substring(0, userping.tag.length - 5));
                    this.repblacklist.push(Message.author.id);
                } else {
                    Embed.setTitle("Nice try but you can't rep yourself!");
                }
            } else {
                Embed.setTitle("You can only give a reputation point once per hour!");
            }
        } catch (err) {
            Embed.setTitle("User not found !");
        }
        Message.channel.send(Embed);
    }
}