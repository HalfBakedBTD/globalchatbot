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
  if (message.content === '?help') {
    return message.channel.send("**My Commands:**\nTo use GlobalChat, make a channel named `#global-chat` and start chatting!\n\t?help - shows this message.\n\t?invite - invite me to your server!\n\t?info - Gives you some of my stats.")
  }
  if (message.content === '?invite') {
    message.channel.send("I have direct messaged you my invite link!");
    return message.author.send("Invite me to your discord:\n:link: https://discord.com/oauth2/authorize?client_id=769389557304918016&permissions=67496128&scope=bot :link:");
  }
  if (message.content === '?info') {
    return message.channel.send(`**GlobalChat:**\n\tRunning on ${bot.guilds.size} servers.\n\tWatching ${bot.users.size} online users.`);
  }
  if(message.channel.name !== "global-chat") return;
  for (i = 0; i < badWords.length; i++) {
      var rgx = new RegExp(badWords[i], 'gi');
      if (rgx.test(message.content)) {
          message.delete().catch(O_o=>{});
          message.channel.send("Message deleted to keep things family friendly for all servers! (Links are potentially harmful and are also removed.)").then(msg => msg.delete(2000));
          return;
      }
  }
  
  bot.channels.filter(c => c.name === 'global-chat').forEach(channel => {
    if (channel.type == 'text') {
      channel.send(`<@${message.author.id}> - ${message.createdAt}\n${message.content}`);
      return message.delete().catch(O_o=>{});
    }
  });

  let prefix = "?";
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
});

bot.login(process.env.BOT_TOKEN);
