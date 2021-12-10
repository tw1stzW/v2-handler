const settings = require('./src/config.js');

const Discord = require('discord.js');
const fs = require('fs');

if(settings.tokens.length <= 0) return console.error('Bir token bağlanmamış.');

for(var key in settings.tokens) {

  const client = new Discord.Client();
  client.login(settings.tokens[key]).catch(() => {
    return;
  });

  client.commands = new Discord.Collection();
  client.on('ready', async () => {
    console.log(`${client.user.tag} ismine bağlandım.`);

    await fs.readdir('./src/commands', (err, files) => {
      if(err) return;
      
      for(const key in files) {
        if(files[key].split('.').pop() == 'js') { 
          var file = require(`./src/commands/${files[key]}`);
          if(file.help && file.help.name) client.commands.set(file.help.name, file);
        };
      };

    });
  });

  client.on('message', async message => {
    if(message.partial) message = await message.fetch();
    if(message.author.bot || !settings.prefixes.some(data => message.content.startsWith(data.prefix))) return;

    const data = settings.prefixes.find(data => message.content.startsWith(data.prefix));
    const spaceReg = / +/g;

    var arguments;
    var commandName;

    if(data.space === true) {
      arguments = message.content.split(spaceReg).slice(2);
      commandName = message.content.split(spaceReg)[1];
    } else {
      arguments = message.content.split(spaceReg)[1];
      commandName = message.content.split(spaceReg)[0].slice(data.prefix.length);
    };

    if(!client.commands.some(data => data.help.name.toLowerCase() === commandName || data.config.aliases.find(alias => alias.toLowerCase() === commandName))) return;
    const command = client.commands.find(data => data.help.name.toLowerCase() === commandName || data.config.aliases.find(alias => alias.toLowerCase() === commandName));
  
    if(!command.runInDM && message.channel.type === 'text') return;
    if((command.requiredPermissionsMe || []).length > 0 && !command.requiredPermissionsMe.some(perm => message.guild.me.hasPermission(perm)) && message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.channel.send(`Bu komutu çalıştırabilmek için şu yetkilere ihtiyacım var:\n${command.requiredPermissionsMe.filter(perm => !message.guild.me.hasPermission(perm)).join('\n')}`); 
    if((command.requiredPermissions || []).length > 0 && !command.filterServerOwner && !command.requiredPermissions.some(perm => message.member.hasPermission(perm)) && message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.channel.send(`Bu komutu kullanabilmek için şu yetkilere ihtiyacın var:\n${command.requiredPermissions.filter(perm => !message.member.hasPermission(perm)).join('\n')}`); 
    if(command.filterServerOwner && message.guild.owner.user.id !== message.author.id) return message.channel.send('Bu komutu sadece bu sunucunun sahibi kullanabilir.');

    command.run(client, message, arguments);
  });

  /* eventleri buraya yapisitrin disina cikmayin optumss */

};