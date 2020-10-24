const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
const badWords = [
    'nigga',
    'nggr',
    'nigger',
    'fuck',
    'shit',
    'asshole',
    'cunt',
    'fag',
    'fagg',
    'fuk',
    'fck',
    'fcuk',
    'assfuck',
    'assfucker',
    'fucker',
    'dick',
    'cum',
    'penis',
    'dildo',
    'vegina',
    'condom',
    'condum',
    'lmao',
    'lma0',
    'lmfoa',
    'lmfa0',
    'pussy',
    'af',
    'https',
    '.com',
    '.gg'
];

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("?help", {type: "WATCHING"});
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  for (i = 0; i < badWords.length; i++) {
      var rgx = new RegExp(badWords[i], 'gi');
      if (rgx.test(message.content)) {
          message.delete().catch(O_o=>{});
          message.channel.send("Message deleted to keep things family friendly for all servers! (Links are potentially harmful and are also removed.)").then(msg => msg.delete(2000));
          return;
      }
  }

  let prefix = "?";
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
});

bot.login(process.env.BOT_TOKEN);
