const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType,ActionRowBuilder ,ButtonStyle,ButtonBuilder} = require('discord.js'); 

module.exports = {
    Name: 'Avatar',
    Aliases: ["avatar","av","pp"],
    Description: 'avatar',
    Usage: 'avatar @luhux',
    Category: 'Utility',
    Cooldown: 0,
    
    Permissions: {
        User : [],
        Bot  : [],
        Role : []
    },

 
    Command: {
        Prefix: true,
    },

    messageRun: async (client, message, args, settings) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let link = new ActionRowBuilder({components:[new ButtonBuilder({label:"Tarayıcıda aç", style:ButtonStyle.Link, url: member.user.displayAvatarURL({dynamic:true})})]})
        await message.reply({
          content: `${member.user.displayAvatarURL({dynamic:true, format:"png"})}`,
          components:[link]
        })
    },

    interactionRun: async (client, interaction, settings) => {},
};