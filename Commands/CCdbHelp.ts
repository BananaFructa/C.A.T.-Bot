import * as Discord from "discord.js"
import * as fs from "fs"
import * as DBM from "../DataBaseManager"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils" 

export class CCdbHelp extends Command {

    constructor() {
        super("cdb-help",ArgumentMode.WHOLE);
    }

    Run = async function(Args : any[]) {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        let GuildData :DBM.GuildDataFormat = DBM.GetGuildData(Message.guild.id);

        Message.channel.send(Embed
        .setTitle("Custom catpic database")
        .setDescription("The prefix for all commands is " + GuildData.prfx + " \n You can only create one database. \n If you don't create a database the the ~catpic command will pick up the default database.")
        .addField("Database editor commands",
            "**" + "crt-db" + "** - Create the database | " + GuildData.prfx + "crt-db <name>\n" +
            "**" + "del-db" + "** - Remove database \n" +
            "**" + "add-db" + "** - Add an element to the databse (You can put the whole imgur link or just the code from the image link) | " + GuildData.prfx + "add-db <element> \n" +
            "**" + "rmv-db" + "** - Remove an element from the database (You can put the whole imgur link or just the code from the image link ) | " + GuildData.prfx + "rmv-db <element> \n" +
            "**" + "datalist" + "** - List all the databases \n" +
            "**" + "mergefrom" + "** - Import a database in the current database | " + GuildData.prfx + "mergefrom <database> \n" +
            "**" + "deletefrom" + "** - Delete any common elements between a database and the current database | " + GuildData.prfx + "deletefrom <database>"
        ));
    }

}