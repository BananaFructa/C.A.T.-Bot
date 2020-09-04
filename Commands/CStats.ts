import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 
import { createCanvas, loadImage } from 'canvas';

export class CStats extends Command {

    constructor() {
        super("stats",ArgumentMode.WHOLE);
    }

    Run = async function (Args : any[]) {
        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        if (!Message.content.includes('@')) {
            this.showstats(Message.channel, Message.author.id, Message.author.tag);
        } else {
            try {
                var userping = Message.mentions.users.first();
                DBM.tryadduser(userping.id);
                this.showstats(Message.channel, userping.id, userping.tag);
            } catch (err) {
                Message.channel.send(Embed.setTitle("User not found!"));
            }
        }
    }

    async showstats(channel, id, tag) {
        let ud :DBM.UserDataFormat = DBM.GetUserData(id);
        let currentMinute :number = new Date().getMinutes();
        loadImage('test.png').then((image) => {
            const canvas = createCanvas(300, 100);
            const ctx = canvas.getContext('2d');
            var messages = [];
            messages = DBM.GetLastHourMessages(id);
            ctx.drawImage(image, 0, 0, 300, 100);
            ctx.strokeStyle = 'rgba(153,51,153,1)';
            ctx.fillStyle = 'rgba(153,51,153,0.4)';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 100);
            ctx.moveTo(0, 100);
            ctx.lineTo(300, 100);
            var xPos = 300;
            ctx.moveTo(xPos, 100);
            for (var i = currentMinute; i > -1; i--) {
                ctx.lineTo(xPos - 5, 100 - messages[i]*2);
                xPos -= 5;
            }
            for (var i = 59; i > currentMinute; i--) {
                ctx.lineTo(xPos - 5, 100 - messages[i]*2);
                xPos -= 5;
            }
            ctx.lineTo(0, 100);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            let bs64img = canvas.toDataURL().split(';base64,').pop();
            fs.writeFileSync('out.png', bs64img, { encoding: 'base64' });
        })
        channel.send(new Discord.MessageEmbed()
            .setColor("#993399")
            .setTitle(tag.substring(0, tag.length - 5) + "'s stats")
            .addField('Overall statistics',
                "Reputation: " + ud.Rep + '\n' +
                "Messages sent: " + ud.Msgs + '\n' +
                "Images sent: " + ud.Imgs
            )
            .attachFiles(["out.png"])
            .setImage('attachment://out.png'));
    }
}