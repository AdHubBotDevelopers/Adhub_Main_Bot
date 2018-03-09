const Discord = require('discord.js');
var openDB = require('json-file-db');
var jsonfile = require('jsonfile')
// Create an instance of a Discord client
const client = new Discord.Client();

const config = require('./config.json');
// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

const prefix = config.prefix;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"


  if(message.content.startsWith(prefix + 'testcommand'))
  {
    message.channel.send("This is how messages *should* look!");
  }
  if (message.content.startsWith(prefix + 'ping')) {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }
  if(message.content.startsWith(prefix + 'shutdown'))
  {
    if(message.author.id == "118455061222260736")
    {
      client.destroy();
    }else
    {
      message.reply(`Well looky here. Someone thinks they're a prankster. I've got news. ***YOU'RE NOT FUNNY***`);
    }
  }
  if(message.content.startsWith(prefix + 'ban'))
  {
    if(!message.member.roles.some(r=>["DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
    {
      message.channel.send("You do not have permissions to ban");
    }else
    {
      message.guild.ban(message.mentions.members.first());
    }
  }
  if(message.content.startsWith(prefix + 'mute'))
  {
    if(!message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
    {
      message.channel.send("You do not have permissions to mute");
    }else
    {
      var role = message.guild.roles.find(val => val.name == "Adhub-Mute");
      message.guild.members.find(val => val.id == message.author.id).addRole(role);
    }
  }
  if(message.content.startsWith(prefix + 'unban'))
  {
    if(!message.member.roles.some(r=>["DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
    {
      message.channel.send("You do not have permissions to unban");
    }else
    {
      message.guild.unban(message.mentions.members.first());
    }
  }
  if(message.content.startsWith(prefix + 'unmute'))
  {
    if(!message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
    {
      message.channel.send("You do not have permissions to unmute");
    }else
    {
      var role = message.guild.roles.find(val => val.name == "Adhub-Mute");
      message.guild.members.find(val => val.id == message.author.id).removeRole(role);
    }
  }
  if(message.content.startsWith(prefix + 'apply'))
  {
    if(message.content.split(' ').length == 3)
    {
      try {
      client.fetchInvite(message.content.split(' ')[1]).then(g => {

          message.channel.send(`Thank you for sending your application for ${g.guild.name}! Our reviewers will get to work on that right away.`);
          var channy = message.guild.channels.find(val=>val.id == "400003339187781642");
          channy.send(g.guild.name + "\n" + message.author + "\n" + g + "\n" + message.content.split(' ')[2]);
        }catch(err)
        {
          message.reply("Sorry, the invite code you have provided is not valid.");
        }
      });

    }
  }
  if(message.content.startsWith(prefix + 'register'))
  {
    message.guild.channels.toArray()[0].createInvite().then(invite =>
    {
      message.reply(" the invite is " + invite.code);
      // Add databasing.
      var file = '/tmp/invites.json'
      jsonfile.readFile(file, function(err, obj) {
        obj.push({server: message.content.split('register').substring(1), code: invite.code});
      });
    })
  }
  if(message.content.startsWith(prefix + 'review'))
  {
    //var add = openDB("review.json");
    if(!message.member.roles.some(r=>["DC | Advertiser", "AdHub | Board of Directors"].includes(r.name)) )
    {
      return message.reply("You do not have the correct permissions to perform this command!");
    }
    var arr = message.content.split(' ');
    if(arr.length <= 3)
    {
      return message.reply("Sorry, you have provided incorrect arguments.");
    }
    var revie = "";
    for(var i = 3; i<arr.length; i++)
    {
        revie += arr[i];
        if(arr.length - 1 != i)
            revie += " ";
    }

    if(coolDownArr.indexOf(message.author.id) >= 0)
    {
      return message.reply("Please wait before executing this command again.");
    }

    var chan = message.guild.channels.find(val => val.name == message.mentions.channels.first().name);
    client.fetchInvite(message.content.split(' ')[1]).then(g => {
      chan.send(revie + "\n" + g);
      coolDownArr.push(message.author.id);
      setTimeout(function()
      {
        var index = coolDownArr.indexOf(message.author.id);
        if (index >= 0) {
          arr.splice( index, 1 );
        }
      }, 30000)

    });
  }
});

// Log our bot in
client.login(token);
