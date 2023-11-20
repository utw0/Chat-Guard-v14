const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType,EmbedBuilder,ActionRowBuilder,ButtonStyle,ButtonBuilder } = require('discord.js'); 

module.exports = {
    Name: 'İnfo',
    Aliases: ['bilgi','Bilgi','bot','info'],
    Description: 'Share your thoughts about the bot',
    Usage: 'info',
    Category: 'Utility',
    Cooldown: 10,
      
    Permissions: {
        User: [],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,

    },

    messageRun: async (client, message, args, settings) => {
        const name = "Luhux Cheaters";
    const icon = `${client.user.displayAvatarURL()}`;

    let servercount = await client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`;
    let ping = `${Date.now() - message.createdTimestamp}ms.`;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(`Source Code`)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://github.com/utw0`),

      new ButtonBuilder()
        .setLabel(`Bot Invite`)
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=927341915169521675&scope=bot&permissions=0"
        )
    );

    const embed = new EmbedBuilder()
      .setAuthor({ name: name, iconURL: icon })
      .setThumbnail(`${icon}`)
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp(new Date())
      .addFields({
        name: `Server Numbers`,
        value: `${client.guilds.cache.size}`,
        inline: true,
      })
      .addFields({
        name: `Server Members`,
        value: `${servercount}`,
        inline: true,
      })
      .addFields({
        name: `Latency`,
        value: `${ping}`,
        inline: true,
      })
      .addFields({
        name: `Uptime`,
        value: `\`\`\`${uptime}\`\`\``,
      })
      .addFields({
        name: `Developer`,
        value: `[\`luhux\`](https://github.com/utw0)`,
        inline: true,
      })
      .addFields({
        name: `Project Start Date`,
        value: `\`NO DATA\``,
        inline: true,
      });

    await message.reply({ embeds: [embed], components: [row] });
  },

    interactionRun: async (client, interaction, settings) => {
        const name = "Luhux Cheaters";
        const icon = `${client.user.displayAvatarURL()}`;
        const guild = interaction.guild;
    
        let servercount = await client.guilds.cache.reduce(
          (a, b) => a + b.memberCount,
          0
        );
        let totalSeconds = client.uptime / 1000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
    
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`;
        let ping = `${Date.now() - interaction.createdTimestamp}ms.`;
    
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(`Source Code`)
            .setStyle(ButtonStyle.Link)
            .setURL(`https://github.com/utw0`),
    
          new ButtonBuilder()
            .setLabel(`Bot Invite`)
            .setStyle(ButtonStyle.Link)
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=927341915169521675&scope=bot&permissions=0"
            )
        );
    
        const embed = new EmbedBuilder()
          .setAuthor({ name: name, iconURL: icon })
          .setThumbnail(`${icon}`)
          .setFooter({
            text: guild.name,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setTimestamp(new Date())
          .addFields({
            name: `Server Numbers`,
            value: `${client.guilds.cache.size}`,
            inline: true,
          })
          .addFields({
            name: `Server Members`,
            value: `${servercount}`,
            inline: true,
          })
          .addFields({
            name: `Latency`,
            value: `${ping}`,
            inline: true,
          })
          .addFields({
            name: `Uptime`,
            value: `\`\`\`${uptime}\`\`\``,
          })
          .addFields({
            name: `Developer`,
            value: `[\`luhux\`](https://github.com/utw0)`,
            inline: true,
          })
          .addFields({
            name: `Project Start Date`,
            value: `\`NO DATA\``,
            inline: true,
          });
    
        await interaction.reply({ embeds: [embed], components: [row] });
    },
};