import * as Discord from "discord.js"
import * as DBM from "../DataBaseManager"
import * as fs from "fs"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"

export class CBrainCelss extends Command {

    brainCells : string[] = [
        "-11",
        "0",
        "2",
        "69",
        "420",
        "666"
    ];

    constructor() {
        super("braincells",ArgumentMode.WHOLE);
    }

    Run = async function(Args) {
        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        let brainCellsCount :number = 0;
        let index :number = Math.floor(Math.random() * (this.brainCells.length + 1));
        if (index != this.brainCells.length) {
            brainCellsCount = this.brainCells[index];
        } else {
            brainCellsCount = Math.floor(Math.random() * 99999999999);
        }
        if (Message.content.includes('@')) {
            try {
                let UStag :string = Message.mentions.users.first().tag;
                let name :string = UStag.substring(0, UStag.length - 5);
                Embed.setTitle(name + ' has ' + brainCellsCount + ' brain cells left!');

            } catch (err) {
                Embed.setTitle("User not found!");
            }
        } else {
            Embed.setTitle('You have ' + brainCellsCount + ' brain cells left!');
        }
        Message.channel.send(Embed);
    }
}