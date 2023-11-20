const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType } = require('discord.js'); 

module.exports = {
    Name: 'Clear',
    Aliases: ["clear","bluk","sil","temizle"],
    Description: 'clear',
    Usage: 'temizle 100',
    Category: 'Admin',
    Cooldown: 0,
    
    Permissions: {
        User : [Flags.Administrator],
    },
    Command: {
        Prefix    : true,
      
    },

    messageRun: async (client, message, args, settings) => {
        if (!args[0] || isNaN(args[0]) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.channel.send({content:"Silincek sayı giriniz"});
        message.channel.bulkDelete(Number(args[0])).then(async c => {
          message.reply({ content:`**${c.size}** mesaj silindi!`}).then(x => x.delete({ timeout: 5000 }) );
      
         

        });
    },

    interactionRun: async (client, interaction, settings) => {},
};