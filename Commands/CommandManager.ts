import * as DBM from "../DataBaseManager"
import {ArgumentMode} from "./ArgsUtils"

import {CPing} from "./CPing"
import {CHelp} from "./CHelp"
import {CCatPic} from "./CCatPic"
import {CBrainCelss} from "./CBrainCells"
import {CCrTDB} from "./CCrtDB"
import {CDelDB} from "./CDelDB"
import {CAddDB} from "./CAddDB"
import {CRmvDB} from "./CRmvDB"
import {CRoll} from "./CRoll"
import {CCdbHelp} from "./CCdbHelp"
import {CRep} from "./CRep"
import {CMergeFrom} from "./CMergeFrog"
import {CDeleteFrom} from "./CDeleteFrom"
import {CPrefix} from "./CPrefix"
import {CCuses} from "./CCuses"
import {CStats} from "./CStats"
import {CDataList} from "./CDatalist"


export class CommandManager {
    static Commands = [];
    static Prefix;

    /** Loads the commands */
    static LoadCommands() {
        this.Commands.push(new CPing);
        this.Commands.push(new CHelp);
        this.Commands.push(new CCatPic);
        this.Commands.push(new CBrainCelss);
        this.Commands.push(new CCrTDB);
        this.Commands.push(new CDelDB);
        this.Commands.push(new CAddDB);
        this.Commands.push(new CRmvDB);
        this.Commands.push(new CRoll);
        this.Commands.push(new CCdbHelp);
        this.Commands.push(new CRep);
        this.Commands.push(new CMergeFrom);
        this.Commands.push(new CDeleteFrom);
        this.Commands.push(new CPrefix);
        this.Commands.push(new CCuses);
        this.Commands.push(new CStats);
        this.Commands.push(new CDataList);
    }

    /** Sets the prefix
     * @param Prefix The prefix
     */
    static SetPrefix(Prefix :String) {
        this.Prefix = Prefix;
    }

    /** Inputs a string and an undefined number of arguments
     * @param Args[0] The message that was sent
     * @param Args[1] The cannel in which the message was sent
     */
    static RunCommand(...Args : any[]) {
        let CommandQuerry = Args.shift();
        CommandQuerry = CommandQuerry.toLowerCase();
        if (CommandQuerry.startsWith(this.Prefix)) {

            CommandQuerry = CommandQuerry.replace(this.Prefix,"");
            
            for (let i = 0;i < this.Commands.length;i++) {
                if (CommandQuerry.startsWith(this.Commands[i].Name)) {

                    if (this.Commands[i].ArgumentMode === ArgumentMode.SPLIT) { 
                        let CommandArguments = CommandQuerry.split(" ");
                        for (let j = 1;j < CommandArguments.length;j++) {
                            Args.push(CommandArguments[j]);
                            
                        }
                    } else if (this.Commands[i].ArgumentMode === ArgumentMode.WHOLE && CommandQuerry.startsWith(this.Commands[i].Name + " ")) {
                        let CommandArgument = CommandQuerry.replace(this.Commands[i].Name + " ","");
                        Args.push(CommandArgument);
                    }

                    try {
                        this.Commands[i].Run(Args);
                        DBM.IncrementCommandUsage(this.Commands[i]);
                    } catch (err) {
                        console.log(err);
                    }

                    break;

                }
            }
        }
    }
}