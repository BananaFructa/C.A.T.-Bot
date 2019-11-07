const Discord = require('discord.js');
const cron = require('cron');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const bot = new Discord.Client();
const delimiter = '!';
const id_EXSYM = ':';
const minMsg_EXSYM = '|';
const member_EXSYM = '#';
const prefix = '~';
const MEMBERfile = 'memberLIST.txt';
const LISTfile = 'cLIST.txt';
const MSGfile = 'msgLIST.txt';
const IMGfile = 'imgLIST.txt';
const REPfile = 'repLIST.txt';
const MSGMINfile = 'msgminLIST.txt';
const DATBSfile = 'datbsLIST.txt';
const USNF = "User not found!";
const defHTMLcolor = '#993399';
const defImgURL = "https://imgur.com/";
const customPDB = 'CUSTOM_CPDB_'
const defPhotoSet = fs.readFileSync('photoCodes.txt').toString().split('\n');
const auth = fs.readFileSync('auth.txt').toString();
const messageBufferLimit = 8;

const cramPhrases = ["NO CRAM!",
    "Please stop cram is banned!",
    "For the love of god why CRAM?????",
    "Cram is banned!", "Cram shall die!1!!!!111"];
const bruhPhrases = ["bruh",
    "bruh moment",
    "bruh momentum"];
const commands = [
    "catpic",
    "help",
    "braincells",
    "crt-db",
    "del-db",
    "add-db",
    "rmv-db",
    "roll",
    "cuses",
    "ping",
    "stats",
    "rep",
    "cdb-help"
];
const brainCells = [
    "-11",
    "0",
    "2",
    "69",
    "420",
    "666"
];
const help = new Discord.RichEmbed()
    .setColor(defHTMLcolor)
    .setTitle('C.A.T. Bot Command List')
    .setDescription('The prefix for all commands is ~')
    .addField('Commands',
        commands[9] + ' - See if the bot is online \n' +
        commands[1] + ' - I guess you knew of this one since you opened the help menu \n ' +
        commands[0] + ' - Gives a random cat image from the bot`s database \n ' +
        commands[2] + ' - See how many brain cells you have left \n' +
        commands[7] + ' - Roll the dice \n' +
        commands[8] + ' - See how many times a command has been used \n' +
        commands[9] + " - View your or someone's else stats \n" +
        commands[11] + " - Give someone a reputation point \n" +
        commands[12] + " - Get the command list for the catpic database editor"
    );

var currentMsgBufferLimit = 0;
var LMchannel = "null";
var LMactive = false;
var repblacklist = [];
var currentMinute = (new Date()).getMinutes();

let resetrepblacklistJOB = new cron.CronJob('0 * * * *', resetrepblacklist);
let incrementMinuteCounterJOB = new cron.CronJob('* * * * *', incrementMinute);

bot.login(auth);
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    bot.user.setGame('with your cat')
    updateLISTfile()
    resetrepblacklistJOB.start()
    incrementMinuteCounterJOB.start();
});
bot.on('message', message => {
    if (!message.author.bot) {
        tryadduser(message.author.id);
        //Message events
        if (filterOut(message.content).includes('uwu') || filterOut(message.content).includes('owo')) {
            message.channel.send('Sorry we do not do that here!');
        } else if (filterOut(message.content).includes('cram')) {
            message.channel.send(cramPhrases[Math.floor(Math.random() * cramPhrases.length)]);
        } else if (filterOut(message.content).includes('bruh')) {
            message.channel.send(bruhPhrases[Math.floor(Math.random() * bruhPhrases.length)]);
            currentMsgBufferLimit = messageBufferLimit;
        }
        //Commands
        if (message == prefix + commands[0]) {
            //~catpic
            var guildId = message.guild.id;
            if (!contained(DATBSfile, guildId + id_EXSYM) || accesfile(DATBSfile, guildId + id_EXSYM) == 'null') {
                message.channel.send(defImgURL + defPhotoSet[Math.floor(Math.random() * defPhotoSet.length)]);
            } else {
                var file = accesfile(DATBSfile, guildId + id_EXSYM);
                var photoSet = fs.readFileSync(file).toString().split('\n');
                photoSet.pop();
                message.channel.send(defImgURL + photoSet[Math.floor(Math.random() * photoSet.length)]);
            }
            incrementfile(LISTfile, commands[0], 1);
        } else if (message == prefix + commands[1]) {
            //~help
            message.channel.send(help);
            incrementfile(LISTfile, commands[1], 1);
        } else if (message.content.includes(prefix + commands[2])) {
            //~braincells
            var brainCellsCount;
            var id = Math.floor(Math.random() * (brainCells.length + 1));
            if (id != brainCells.length) {
                brainCellsCount = brainCells[id];
            } else {
                brainCellsCount = Math.floor(Math.random() * 99999999999);
            }
            var reply;
            if (message.content.includes('@')) {
                try {
                    var UStag = message.mentions.users.first().tag;
                    var name = UStag.substring(0, UStag.length - 5)
                    reply = new Discord.RichEmbed()
                        .setColor(defHTMLcolor)
                        .setTitle(name + ' has ' + brainCellsCount + ' brain cells left!');

                } catch (err) {
                    reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle(USNF);
                }

            } else {
                reply = new Discord.RichEmbed()
                    .setColor(defHTMLcolor)
                    .setTitle('You have ' + brainCellsCount + ' brain cells left!');
            }
            message.channel.send(reply);
            incrementfile(LISTfile, commands[2], 1);
        } else if (message.content.includes(prefix + commands[3]) && message.content[0] == prefix && message.member.hasPermission("ADMINISTRATOR")) {
            //~crt db <name>
            var guildId = message.guild.id;
            var dbName = message.content.replace(prefix + commands[3] + ' ', '');
            if (!isForb(dbName) && !contained(DATBSfile, dbName + '.txt')) {
                if (!contained(DATBSfile, guildId + id_EXSYM)) {
                    try {
                        newentry(DATBSfile, guildId + id_EXSYM, customPDB + dbName + '.txt');
                        fs.writeFileSync(customPDB + dbName + '.txt', '');
                        message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Succesfuly created pic database " + "'" + customPDB + dbName + "'"));
                    } catch (err) {
                        message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("An unexpected error has occured"));
                    }
                } else if (accesfile(DATBSfile, guildId + id_EXSYM) == 'null') {
                    try {
                        setfile(DATBSfile, guildId + id_EXSYM, customPDB + dbName + '.txt');
                        fs.writeFileSync(customPDB + dbName + '.txt', '');
                        message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Succesfuly created pic database " + "'" + customPDB + dbName + "'"));

                    } catch (err) {
                        message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("An unexpected error has occured"));
                    }
                } else {
                    message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("You cannot create another pic database. A single database may be created per guild!"));
                }
                incrementfile(LISTfile, commands[3], 1);
            } else if (isForb(dbName)) {
                message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("A pic database name may only contain letters from a to z. Also it cannot contain CON , PRN , AUX , NUL , COM or LPT "));
            } else if (contained(DATBSfile, dbName + '.txt')) {
                message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("This pic database name has already been taken by other guild!"));
            }
        } else if (message == prefix + commands[4] && message.member.hasPermission("ADMINISTRATOR")) {
            //~del db
            var guildId = message.guild.id;
            if (!contained(DATBSfile, guildId + id_EXSYM) || accesfile(DATBSfile, guildId + id_EXSYM) == 'null') {
                message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("There is no pic database to be deleted!"));
            } else {
                try {
                    var dbName = accesfile(DATBSfile, guildId + id_EXSYM).replace(".txt", '');
                    setfile(DATBSfile, guildId + id_EXSYM, 'null');
                    fs.unlinkSync(dbName + '.txt');
                    var reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Database '" + dbName + "' has been succesfuly deleted!");
                    message.channel.send(reply);
                } catch (err) {
                    message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Un unexpected error has occured"));
                }
            }
            incrementfile(LISTfile, commands[4], 1);
        } else if (message.content.includes(prefix + commands[5]) && message.content[0] == prefix && message.member.hasPermission("ADMINISTRATOR")) {
            //~add db <context>
            var elem = message.content.replace(prefix + commands[5] + " ", '');
            elem = elem.replace(defImgURL, '').replace("https://i.imgur.com/",'');
            var guildId = message.guild.id;
            var file = accesfile(DATBSfile, guildId + id_EXSYM);
            if (contained(DATBSfile, guildId) && file != 'null') {
                addtopicdb(file, elem);
                message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Succesfuly added element " + "'" + elem + "'" + ' to database!'));
            } else {
                message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("There is no database linked to this guild. Consider creating one before trying to add an element to it!"));
            }
            incrementfile(LISTfile, commands[5], 1);
        } else if (message.content.includes(prefix + commands[6]) && message.content[0] == prefix && message.member.hasPermission("ADMINISTRATOR")) {
            //~rmv-db <context>
            var elem = message.content.replace(prefix + commands[6] + " ", '');
            elem = elem.replace(defImgURL, '').replace("https://i.imgur.com/",'');
            var guildId = message.guild.id;
            var file = accesfile(DATBSfile, guildId + id_EXSYM);
            if (contained(DATBSfile, guildId) && file != 'null') {
                if (contained(file, elem)) {
                    removefile(file, elem);
                    message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Succesfuly removed element " + "'" + elem + "'" + ' from database!'));
                } else {
                    message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("This element doesn't exist in the current context!"));
                }
            } else {
                message.channel.send(new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("There is no database linked to this guild. Consider creating one before trying to remove an element from it!"));
            }
        } else if (message.content.includes(prefix + commands[7])) {
            //~roll
            var synMsgErrHandl = "Syntax error ! (Correct syntax example: ~roll d10)";
            if (message.content.includes('d')) {
                var reply = new Discord.RichEmbed()
                var number = message.content.substring(message.content.indexOf('d') + 1, message.content.length);
                if (!isNaN(number)) {
                    reply.setColor(defHTMLcolor).setTitle("You rolled a " + (Math.floor(Math.random() * parseInt(number)) + 1) + " !");
                    incrementfile(LISTfile, commands[7], 1);
                } else {
                    reply.setColor(defHTMLcolor).setTitle(synMsgErrHandl);
                }
                message.channel.send(reply);
            } else {
                var reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle(synMsgErrHandl);
                message.channel.send(reply);
            }
        } else if (message == prefix + commands[8]) {
            //~cuses
            var i = 0;
            var tierList = "";
            for (i = 0; i < commands.length; i++) {
                if (accesfile(LISTfile, commands[i]) == 1) {
                    tierList = tierList + commands[i] + ' - ' + accesfile(LISTfile, commands[i]) + ' use \n';
                } else {
                    tierList = tierList + commands[i] + ' - ' + accesfile(LISTfile, commands[i]) + ' uses \n';
                }
            }
            var reply = new Discord.RichEmbed().setColor(defHTMLcolor).addField('All commands with all their uses', tierList);
            message.channel.send(reply);
            incrementfile(LISTfile, commands[8], 1);
        } else if (message == prefix + commands[9]) {
            //~ping
            var reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Yea i'm online");
            message.channel.send(reply);
            incrementfile(LISTfile, commands[9], 1);
        } else if (message.content.includes(prefix + commands[10])) {
            //~stats
            if (!message.content.includes('@')) {
                showstats(message.channel, message.author.id, message.author.tag);
                incrementfile(LISTfile, commands[10], 1);
            } else {
                try {
                    var userping = message.mentions.users.first();
                    tryadduser(userping.id);
                    showstats(message.channel, userping.id, userping.tag);
                    incrementfile(LISTfile, commands[10], 1);
                } catch (err) {
                    var reply = new Discord.RichEmbed()
                        .setColor(defHTMLcolor)
                        .setTitle(USNF);
                    message.channel.send(reply);
                }
            }
        } else if (message.content.includes(prefix + commands[11])) {
            try {
                var userping = message.mentions.users.first();
                if (!repblacklist.includes(message.author.id)) {
                    if (userping.id != message.author.id) {
                        tryadduser(userping.id);
                        incrementfile(REPfile, userping.id + id_EXSYM, 1);
                        var reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("You successfully gave a reputation point to " + userping.tag.substring(0, userping.tag.length - 5));
                        incrementfile(LISTfile, commands[11], 1);
                        message.channel.send(reply);
                        repblacklist.push(message.author.id);
                    } else {
                        var reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("Nice try but you can't rep yourself!");
                        message.channel.send(reply);
                    }
                } else {
                    var reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle("You can only give a reputation point once per hour!");
                    message.channel.send(reply);
                }

            } catch (err) {
                var reply = new Discord.RichEmbed().setColor(defHTMLcolor).setTitle(USNF);
                message.channel.send(reply);
            }
        } else if (message.content == prefix + commands[12]) {
            message.channel.send(new Discord.RichEmbed()
                .setColor(defHTMLcolor)
                .setTitle("Custom catpic database")
                .setDescription("The prefix for all commands is ~ \n You can only create one database. \n If you don't create a database the the ~catpic command will pick up the default database.")
                .addField("Database editor commands",
                    commands[3] + " - Create the database | ~crt-db <name>\n" +
                    commands[4] + " - Remove database \n" +
                    commands[5] + " - Add an element to the databse (You can put the whole imgur link or just the code from the image link) | ~add-db <element> \n" +
                    commands[6] + " - Remove an element from the database (You can put the whole imgur link or just the code from the image link ) | ~rmv-db <element> \n"));
            incrementfile(LISTfile, commands[12], 1);
        }
        incrementfile(MSGfile, message.author.id + id_EXSYM, 1);
        if (contained(MSGMINfile, message.author.id + id_EXSYM)) {
            msgminUpdate(message.author.id + id_EXSYM, 1, currentMinute, true);
        }
        if (message.attachments.size != 0) {
            incrementfile(IMGfile, message.author.id + id_EXSYM, 1);
        }
        if (currentMsgBufferLimit != 0) {
            //forBruh
            currentMsgBufferLimit--;
        }
    }
});

bot.on("guildMemberRemove", member => {
    if (LMchannel != "null") {
        bot.channels.get(LMchannel).send("Bye " + member + " !");
    }
})

function incrementMinute() {
    currentMinute++;
    if (currentMinute == 60) {
        currentMinute = 0;
    }
    resetForCurrentMin(currentMinute);
}

function isForb(text) {
    return !(/^[a-zA-Z]*$/.test(text)) ||
        text.includes('CON') ||
        text.includes('PRN') ||
        text.includes('AUX') ||
        text.includes('NUL') ||
        text.includes('COM') ||
        text.includes('LPT');
}

function resetrepblacklist() {
    console.log("Reseted rep black list  - " + repblacklist.length + " elements erased");
    repblacklist = [];
}

function updateLISTfile() {
    var i;
    for (i = 0; i < commands.length; i++) {
        if (!contained(LISTfile, commands[i])) {
            newentry(LISTfile, commands[i])
        }
    }
}

function showstats(channel, id, tag) {
    loadImage('test.png').then((image) => {
        const canvas = createCanvas(300, 100);
        const ctx = canvas.getContext('2d');
        var messages = [];
        messages = (accesfile(MSGMINfile, id + id_EXSYM).split('|'));
        messages.shift();
        messages.pop();
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
        fs.writeFile('out.png', bs64img, { encoding: 'base64' }, function (err) {

        });
    })
    const attachment = new Discord.Attachment('out.png');
    var reply = new Discord.RichEmbed()
        .setColor(defHTMLcolor)
        .setTitle(tag.substring(0, tag.length - 5) + "'s stats")
        .addField('Overall statistics',
            "Reputation: " + accesfile(REPfile, id + id_EXSYM) + '\n' +
            "Messages sent: " + accesfile(MSGfile, id + id_EXSYM) + '\n' +
            "Images sent: " + accesfile(IMGfile, id + id_EXSYM)
        )
        .addField("Messages send over the last 60 minutes","_____________________________")
        .attachFile(attachment)
        .setImage('attachment://out.png');
    channel.send(reply);
}

function tryadduser(id) {
    if (!contained(MEMBERfile, id + id_EXSYM)) {
        newentry(MEMBERfile, accesfile(MEMBERfile, 'count') + member_EXSYM, id + id_EXSYM);
        incrementfile(MEMBERfile, 'count', 1);
    }
    if (!contained(MSGfile,id + id_EXSYM)) {
        newentry(MSGfile, id + id_EXSYM);
    }
    if (!contained(IMGfile,id + id_EXSYM)) {
        newentry(IMGfile, id + id_EXSYM);
    }
    if (!contained(REPfile,id + id_EXSYM)) {
        newentry(REPfile, id + id_EXSYM);
    }
    if (!contained(MSGMINfile, id + id_EXSYM)) {
        var line = '';
        line = line.concat('0');
        for (var i = 0; i < 59; i++) {
            line = line.concat('|0');
        }
        newentry(MSGMINfile, id + id_EXSYM);
        setfile(MSGMINfile, id + id_EXSYM, line);
    }
}

function resetForCurrentMin(min) {
    const count = 'count';
    var user_cout = accesfile(MEMBERfile, count);
    var i;
    for (i = 0; i < user_cout; i++) {
        msgminUpdate(accesfile(MEMBERfile, i + member_EXSYM), 0, min, false);
    }
}

function msgminUpdate(elem, value, minute ,DEC_increment) {
    var list = accesfile(MSGMINfile, elem);
    var spiltList = list.split(minMsg_EXSYM);
    if (DEC_increment) {
        var number = parseInt(spiltList[minute]) + value;
        spiltList[minute] = number;
    } else {
        spiltList[minute] = value;
    }
    setfile(MSGMINfile, elem, spiltList.join(minMsg_EXSYM));
}

function filterOut(text) {
    text = text.toLowerCase().replace(/\s/g, '');
    while (text.includes('*') || text.includes('~') || text.includes('>') || text.includes('`')) {
        text = text.replace('*', '').replace('~', '').replace('>', '').replace('`', '');
    }
    return text;
}

// database functions

function contained(file, elem) {
    return fs.readFileSync(file).toString().replace(/\s/g, '').includes(elem);
}

function newentry(file, elem, value = 0) {
    var list = fs.readFileSync(file).toString().replace(/\s/g, '');
    if (!list.includes(elem)) {
        fs.writeFileSync(file, (list + elem + value + delimiter).replace('!', '!\n'));
    }
}

function incrementfile(file, elem, value) {
    var list = fs.readFileSync(file).toString().replace(/\s/g, '');
    var startPoint = list.indexOf(elem) + elem.length;
    var i = startPoint;
    while (list[i] != delimiter) {
        i++;
    }
    var number = parseInt(list.substring(startPoint, i));
    number = number + value;
    list = list.substring(0, startPoint) + number + list.substring(i, list.length);
    fs.writeFileSync(file, list.replace(/!/g, '!\n'));
}

function setfile(file, elem, value) {
    var list = fs.readFileSync(file).toString().replace(/\s/g, '');
    var startPoint = list.indexOf(elem) + elem.length;
    var i = startPoint;
    while (list[i] != delimiter) {
        i++;
    }
    list = list.substring(0, startPoint) + value.toString() + list.substring(i, list.length);
    fs.writeFileSync(file, list.replace(/!/g, '!\n'));
}

function accesfile(file, commandACCES) {
    var list = fs.readFileSync(file).toString().replace(/\s/g, '');
    var startPoint = list.indexOf(commandACCES) + commandACCES.length;
    var i = startPoint;
    while (list[i] != delimiter) {
        i++;
    }
    return list.substring(startPoint, i);

}

// special database functions

function addtopicdb(file, elem) {
    var fl = fs.createWriteStream(file, {
        flags: 'a'
    });
    fl.write(elem + '\n');
    fl.end();
}

function removefile(file, elem) {
    var list = fs.readFileSync(file).toString();
    fs.writeFileSync(file, list.replace(elem + '\n', ''));
}

process.on('uncaughtException', UncaughtExceptionHandler);

function UncaughtExceptionHandler(err) {
    console.log("Uncaught Exception Encountered!!");
    console.log("err: ", err);
    console.log("Stack trace: ", err.stack);
    setInterval(function () { }, 1000);
}