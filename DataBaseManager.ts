import * as Cron from 'cron';
import {JsonDB} from "node-json-db"
import {Config} from "node-json-db/dist/lib/JsonDBConfig"
import {Command} from "./Commands/Command"
import {Client, Guild, CrosspostedChannel} from "discord.js"

export const UserData = new JsonDB(new Config("UserData",true,false,"/"));
export const UserDataHour = new JsonDB(new Config("UserHourCount"),true,false,"/");
export const GuildData = new JsonDB(new Config("GuildData",true,false,"/"));
export const CommandUsages = new JsonDB(new Config("CommandUsages",true,false,"/"));
let Bot : Client;

export function SetClient(Bot_ : Client) : void {
    Bot = Bot_;
}

export function StartRoutines() : void {

    let ClearMinuteHistory : Cron.CronJob = new Cron.CronJob("* * * * *", function() {
        let Count : number = UserDataHour.getData("/Count");
        let CurrentMinute : number = new Date().getMinutes();
        for (let i = 0;i < Count;i++) {
            let UserHour : UserHourFormat = UserDataHour.getData("/Users["+i+"]");
            if (UserHour.counts[CurrentMinute] === 0) continue;
            UserHour.counts[CurrentMinute] = 0;
            UserDataHour.push("/Users["+i+"]",UserHour,true);
        }
        UserDataHour.save();
    });

    let UsersToDelete : UserHourFormat[] = [];
    let ClearNullArrays : Cron.CronJob = new Cron.CronJob("0 */12 * * *", function () {
        let Count : number = UserDataHour.getData("/Count");
        if (Count !== 0) {
            for (let i = 0;i < Count;i++) {
                let UserHours : UserHourFormat = UserDataHour.getData("/Users["+i+"]");
                let IsNull : boolean = true;
                for (let j = 0;j < UserHours.counts.length;j++) {
                    if (UserHours.counts[j] !== 0) {
                        IsNull = false;
                        break;
                    }
                }
                if (IsNull) UsersToDelete.push(UserHours);
            }
            UsersToDelete.forEach((User : UserHourFormat) => {
                let Index = UserDataHour.getIndex("/Users",User.id); 
                UserDataHour.delete("/Users["+Index+"]");
                let Count : number = UserDataHour.getData("/Count");
                --Count;
                UserDataHour.push("/Count",Count,true);
            });
            UserDataHour.save();
        }
    });

    ClearMinuteHistory.start();
    ClearNullArrays.start();

}

// ============================= Formats

export interface UserDataFormat {
    id :string,
    Msgs: number,
    Imgs :number,
    Rep: number
}

export interface GuildDataFormat {
    id :string,
    prfx: string,
    db :string
}

export interface CoammandUsageFormat {
    id :string,
    usages: number
}

export interface UserHourFormat {
    id :string,
    counts :number[]
}

export interface UserIndexFormat {
    id: string,
    index :number
}

// =============================== User Interfacing

export function GetLastHourMessages(ID : string) : number[] {
    let Index : number = UserDataHour.getIndex("/Users",ID);
    let HourData : UserHourFormat = UserDataHour.getData("/Users["+Index+"]");
    let HourDataCopy : number[] = [];
    for (let i = 0;i < 60;i++) {
        HourDataCopy.push(HourData.counts[i]);
    }
    return HourDataCopy;
}

export function AddToUserStats (ID :string,Msg :number,Img: number,Rep :number) : void {
    let Index :number = UserData.getIndex("/Users",ID);
    let UserDat :UserDataFormat = UserData.getData("/Users[" + Index + "]");
    UserDat.Msgs += Msg;
    UserDat.Imgs += Img;
    UserDat.Rep += Rep;
    UserData.push("/Users["+Index+"]",UserDat);
    UserData.save;
}

export function GetUserData (ID :string) : UserDataFormat {
    let Index :number = UserData.getIndex("/Users",ID);
    return UserData.getData(`/Users[${Index}]`);
}

export function DeleteUserData(ID :string) : void {
    let Index :number = UserData.getIndex("/Users",ID);
    UserData.delete(`/Users[${Index}]`);
    UserData.push("/Count",UserData.getData("/Count")-1,true);
    UserData.save();
}

export function tryadduser(ID: string) : void {
    if (UserData.getIndex("/Users",ID) === -1) {
        UserData.push("/Users[]",{ id:ID,Msgs:0,Imgs:0,Rep:0 });
        UserData.push("/Count",UserData.getData("/Count")+1,true);
    }
}

export function AddToLastHourHistory(ID :string) : void {
    let Index : number = UserDataHour.getIndex("/Users",ID);
    if (Index === -1) {
        let temp : number[] = [];
        for (let i = 0;i < 60;i++) temp.push(0);
        UserDataHour.push("/Users[]",{id:ID,counts:temp});
        let Count : number = UserDataHour.getData("/Count");
        ++Count;
        UserDataHour.push("/Count",Count);
        UserDataHour.save();
        Index = UserDataHour.getIndex("/Users",ID);
    }
    let Data : UserHourFormat = UserDataHour.getData("/Users["+Index+"]");
    Data.counts[(new Date()).getMinutes()] += 1;
    UserDataHour.save();
}

// =============================== Guild Interfacing

export function GetGuild(ID : string) : Guild {
    return Bot.guilds.cache.get(ID);
}

function ContainedInTheCurrentGuilds(Bot : Client,key : string) : boolean {
    for (let [key_] of Bot.guilds.cache) {
        if (key_ === key) return true;
    }
    return false;
}

export function CheckForGuilds(Bot : Client) : void {
    for (var [key] of Bot.guilds.cache) {
        if (GuildData.getIndex("/Guilds",key) === -1) AddGuild(key);
    }
    let Count : number = GuildData.getData("/Count");
    let GuildsToRemove : GuildDataFormat[] = [];
    for (let i = 0;i < Count;i++) {
        let GuildData_ : GuildDataFormat = GuildData.getData("/Guilds["+i+"]");
        if (!ContainedInTheCurrentGuilds(Bot,GuildData_.id)) GuildsToRemove.push(GuildData_);
    }
    for (let i = 0;i < GuildsToRemove.length;i++) {
        RemoveGuild(GuildsToRemove[i].id);
    }
}

export function AddGuild (ID :string) : void {
    let IData : GuildDataFormat = {id:ID,prfx:"~",db:"null"};
    GuildData.push("/Guilds[]",IData);
    let Count : number = GuildData.getData("/Count");
    ++Count;
    GuildData.push("/Count",Count);
    GuildData.save();
}

export function RemoveGuild (ID :string) : void {
    let GuildData_ : GuildDataFormat = GetGuildData(ID);
    let Index : number = GuildData.getIndex("/Guilds",ID);
    if (GuildData_.db !== "null") {
       // fs.unlinkSync(GuildData_.db);
    }
    GuildData.delete("/Guilds["+Index+"]");
    let Count : number = GuildData.getData("/Count");
    --Count;
    GuildData.push("/Count",Count);
    GuildData.save();
}

export function GetGuildData(ID :string) : GuildDataFormat {
    let Index :number = GuildData.getIndex("/Guilds",ID);
    return GuildData.getData("/Guilds["+Index+"]");
}

export function GetGuildDataAt(IDX :number) : GuildDataFormat {
    return GuildData.getData("/Guilds["+IDX+"]");
}

export function SetGuildDatabase(ID :string ,DatabaseName :string) : void {
    let Index :number = GuildData.getIndex("/Guilds",ID);
    let GuildData_ :GuildDataFormat = GuildData.getData(`/Guilds[${Index}]`);
    GuildData_.db = DatabaseName;
    GuildData.push("/Guilds["+Index+"]",GuildData_);
    GuildData.save();
}

export function SetGuildPrefix(ID :string ,Prefix :string) : void {
    let Index :number = GuildData.getIndex("/Guilds",ID);
    let GuildData_ :GuildDataFormat = GuildData.getData(`/Guilds[${Index}]`);
    GuildData_.prfx = Prefix;
    GuildData.push("/Guilds["+Index+"]",GuildData_);
    GuildData.save();
}

// =============================== Command Interfacing

export function CheckForNewCommand(CL : Command[]) : void {
    CL.forEach((C) => {
        if (CommandUsages.getIndex("/Commands",C.Name) === -1) {
            CommandUsages.push("/Commands[]",{id:C.Name,usages:0});
        }
    });
}

export function IncrementCommandUsage(C : Command) : void {
    let Index :number = CommandUsages.getIndex("/Commands",C.Name);
    if (Index !== -1) {
        let UsageData :CoammandUsageFormat = CommandUsages.getData("/Commands["+Index+"]");
        UsageData.usages += 1;
        CommandUsages.push("/Commands[" + Index + "]",UsageData);
    }
}

export function GetCommandUsages(C : Command) : number {
    let Index :number = CommandUsages.getIndex("/Commands",C.Name);
    if (Index !== -1) {
        let UsageData :CoammandUsageFormat = CommandUsages.getData("/Commands["+Index+"]");
        return UsageData.usages;
    } else {
        return 0;
    }
}