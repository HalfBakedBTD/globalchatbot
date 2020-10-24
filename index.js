const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const claim_cooldown_time = 10;
const claim_talked_users = new Set();
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
    '.gg',
    'kys',
    'die',
    'kill'
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
    return message.channel.send("**My Commands:**\nTo use GlobalChat, make a channel named `#global-chat` and start chatting!\n\t?help - shows this message.\n\t?invite - invite me to your server!\n\t?info - Gives you some of my stats.\n\t?rules - Gives you a list of chatting rules you must follow.")
  }
  if (message.content === '?invite') {
    message.channel.send("I have direct messaged you my invite link!");
    return message.author.send("Invite me to your discord:\n:link: https://discord.com/oauth2/authorize?client_id=769389557304918016&permissions=67496128&scope=bot :link:");
  }
  if (message.content === '?info') {
    return message.channel.send(`**GlobalChat:**\n\tRunning on ${bot.guilds.size} servers.\n\tWatching ${bot.users.size} online users.`);
  }
  if (message.content === '?rules') {
    return message.channel.send(`**GlobalChat:**\n1. Use the bot as it was intended. Use it to chat with other users across multiple servers.\n2. No advertising, spam, ddos, or death threats.\n3. Keep chat PG13 and so all users can enjoy the chat.\n\nAny violations of these rules will not be tolerated and every user breaking these rules will be permanently banned from using the bot in all servers.`);
  }
  if(message.channel.name !== "global-chat") return;
  for (i = 0; i < badWords.length; i++) {
      var rgx = new RegExp(badWords[i], 'gi');
      if (rgx.test(message.content)) {
          message.delete().catch(O_o=>{});
          message.channel.send("Message deleted to keep things family friendly for all servers! (Links are potentially harmful and are also removed.)").then(msg => msg.delete(5000));
          return;
      }
  }
  if (claim_talked_users.has(message.author.id)) return message.reply("you have to wait 10 seconds between chats to stop spam.").then(msg => msg.delete(6000));
    bot.channels.filter(c => c.name === 'global-chat').forEach(channel => {
      if (channel.type == 'text') {
        if (message.author.id === '487707042224799757') {
          let ownEmbed = new Discord.RichEmbed()
   	      .setColor('#f80707')
   	      .setDescription(`**[Owner]** <@${message.author.id}>: ${message.content}`);
          channel.send(ownEmbed);
          message.delete().catch(O_o=>{});
        } else {
          let adEmbed = new Discord.RichEmbed()
   	      .setColor('#27ae60')
   	      .setDescription(`<@${message.author.id}>: ${message.content}`);
          channel.send(adEmbed);
          message.delete().catch(O_o=>{});
        }
      }
    });
  claim_talked_users.add(message.author.id);
    setTimeout(() => {
      claim_talked_users.delete(message.author.id);
    }, claim_cooldown_time * 600);

  let prefix = "?";
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
});

bot.login(process.env.BOT_TOKEN);
