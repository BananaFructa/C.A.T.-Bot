import * as Discord from "discord.js"
import {Command} from "./Command"
import {ArgumentIndexes,ArgumentMode} from "./ArgsUtils"
import {NN_Data} from "../AI/NNInterfaces"
import * as AIUtils from "../AI/NNUtils"
import * as Runners from "../AI/NNRunners"

export class CCatOrDog extends Command {

    NNData : NN_Data = AIUtils.GetNNData("SavedAIs/catDogClassifier.nncd");

    constructor() {
        super("catordog",ArgumentMode.WHOLE);
    }

    Run = async function(Args)  {

        let Embed :Discord.MessageEmbed = new Discord.MessageEmbed().setColor("#993399");
        let Message :Discord.Message =  Args[ArgumentIndexes.MESSAGE];

        if (Message.attachments) {
            let URL : string = Message.attachments.array()[0].url;
            if (URL.endsWith(".jpg") || URL.endsWith(".png")) {
                AIUtils.LoadPixelArrayFromUrl(URL,64,64,PixelArray => {
                    let Result : number[] = Runners.NNRunConvolutional(PixelArray,this.NNData);
                    if (Result[0] > 0.5) {
                        Embed.setTitle("That's a cat !"); 
                        Message.channel.send(Embed);
                    } else if (Result[0] < 0.5) {
                        Embed.setTitle("That's a dog !"); 
                        Message.channel.send(Embed);
                    }
                });
            }
        }
    } 
}