const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType,ActionRowBuilder ,ButtonStyle,ButtonBuilder} = require('discord.js'); 
const { DiscordBanners } = require('discord-banners');
const discordBanners = new DiscordBanners(client);
module.exports = {
    Name: 'Banner',
    Aliases: ["bnr","banner","baner"],
    Description: 'banner',
    Usage: 'banner @luhux',
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
         const banner = await discordBanners.getBanner(member.id, { size: 2048, format: "png", dynamic: true })
         if(banner){   
        let link = new ActionRowBuilder({components:[new ButtonBuilder({label:"Tarayıcıda aç", style:ButtonStyle.Link, url: banner})]})
         await message.reply({
             content: `${banner}`
             , components:[link] })}
    },

    interactionRun: async (client, interaction, settings) => {},
};