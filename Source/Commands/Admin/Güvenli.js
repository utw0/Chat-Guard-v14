const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType,ActionRowBuilder,UserSelectMenuBuilder,ButtonBuilder,ButtonStyle,RoleSelectMenuBuilder ,ChannelSelectMenuBuilder,ChannelType, EmbedBuilder,StringSelectMenuBuilder} = require('discord.js'); 
const Guild31 = require("../../../Global/Settings/Models/Guild")
module.exports = {
    Name: 'Güvenli',
    Aliases: ["güvenli","gw","wh","whitelist"],
    Description: 'protection whitelist',
    Usage: 'Güvenli',
    Category: 'Admin',
    Cooldown: 10,
    
    Permissions: {
        User : [Flags.Administrator],
    },

    Command: {
        Prefix: true,
    },


    messageRun: async (client, message, args, settings) => {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("üye").setLabel("Güvenli Kullanıcı Ekle").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("rol").setLabel("Güvenli Rol Ekle").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("kanal").setLabel("Güvenli Kanal Ekle").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("kaldır").setLabel("Güvenli Kaldır").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("liste").setLabel("Güvenli Liste").setStyle(ButtonStyle.Success),
        );
       
        let msg = await  message.channel.send({ content:`Güvenli eklemek istediğiniz türü butonlardan seçiniz`, components: [row], collector: true })
        const filter = c => c.user.id == message.member.id 
        const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
        collector.on('collect', async (inter) => {
            await inter.deferUpdate();
            const menu = inter.values ? inter.values[0] : "Yok";
            const button = inter.customId;
            if(button == "kaldır"){
                const güvenliler = await Guild31.findOne({ guildID: message.guild.id });

            const güvenlilerr = await Promise.all(
            güvenliler.guvenli.reverse().slice(0, 25).map(async (identifier, index) => {
                let label, description;

                try {
                if (message.guild.channels.cache.has(identifier)) {
                    const channel = message.guild.channels.cache.get(identifier);
                    label = channel.name;
                    description = `Channel ID: ${identifier}`;
                } else if (message.guild.roles.cache.has(identifier)) {
                    const role = message.guild.roles.cache.get(identifier);
                    label = role.name;
                    description = `Role ID: ${identifier}`;
                } else {
                    const user = await message.client.users.fetch(identifier);
                    label = user.username;
                    description = `User ID: ${identifier}`;
                }

                return {
                    label,
                    description,
                    value: `${index}`
                };
                } catch (error) {
                console.error(`Bilgi alınamadı: ${identifier}`, error);
                return null;
                }
            })
            );

            const güvenli = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("güvenliler")
                .setPlaceholder("Güvenli Listede Bulunanlar")
                .setOptions(güvenlilerr)
            );

            inter.followUp({ content: "Güvenli Listeden Kaldırmak İstediğinizi Seçiniz", components: [güvenli], ephemeral: true }).then(async msg => {
            var filter = (button) => button.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000 * 2 });

            collector.on("collect", async (i) => {
                await i.deferUpdate();
                const selectedIndex = parseInt(i.values[0], 10);

                if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < güvenliler.guvenli.length) {
                güvenliler.guvenli.splice(selectedIndex, 1);
                await güvenliler.save();

                i.followUp({ content: "`Güvenli Listeden Kaldırıldı`", ephemeral: true });
                } else {
                i.followUp({ content: "`Geçersiz seçim. Lütfen tekrar deneyin`", ephemeral: true });
                }
            });
            });           
            }
            if(button == "liste"){
                const güvenliler = await Guild31.findOne({ guildID: message.guild.id });

                let embed = new EmbedBuilder()
                  .setTitle(`Güvenli Listesi`)
                  .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                  .setFooter({ text: `luhux was here!` })
                  .setDescription("Güvenli Öğeler Listesi");
                
                güvenliler.guvenli.reverse().slice(0, 25).forEach((identifier, index) => {
                  try {
                    let label, description;
                
                    if (message.guild.channels.cache.has(identifier)) {
                      const channel = message.guild.channels.cache.get(identifier);
                      label = channel.name;
                      description = `Kanal ID: ${identifier}`;
                    } else if (message.guild.roles.cache.has(identifier)) {
                      const role = message.guild.roles.cache.get(identifier);
                      label = role.name;
                      description = `Rol ID: ${identifier}`;
                    } else {
                      const user = message.client.users.fetch(identifier);
                      const member = message.guild.members.cache.get(identifier);
                      label = member ? member.displayName : "Bilinmeyen Kullanıcı";;
                      description = `Kullanıcı ID: ${identifier}`;
                    }
                
                    embed.addFields(
                      { name: `#${index + 1} - ${label}`, value: description, inline: false }
                    );
                  } catch (error) {
                    console.error(`Bilgi alınamadı: ${identifier}`, error);
                  }
                });
                
                await inter.followUp({ embeds: [embed], ephemeral: true });
            }
            if(button == "üye"){
                const row = new ActionRowBuilder().addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId("user_select")
                        .setMinValues(1)
                        .setMaxValues(5),)
                        await inter.followUp({ content: "Güvenli eklemek istediğiniz kullanıcıları menüden seçiniz", components: [row], ephemeral: true }).then(async registersetup=> {
                            const filter = rs => rs.user.id == message.member.id 
                            const collector = registersetup.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
                            collector.on('collect', async (rs) => {
                                const existingGuvenliler = (await Guild31.findOne({ guildID: rs.guild.id }))?.guvenli || [];
                                const selectedUserIDs = rs.values;
                                const updatedGuvenliler = [...existingGuvenliler, ...selectedUserIDs];
                                await Guild31.updateOne({ guildID: rs.guild.id }, { guvenli: updatedGuvenliler }, { upsert: true });
                                rs.reply({content:`${rs.values.map(role=> `<@${role}>`).join(", ")} **Üye(leri)** Güvenli listeye eklendi`, ephemeral:true})
                            })
                    
                        })
            }
            if(button == "rol"){
                const row = new ActionRowBuilder().addComponents(
                    new RoleSelectMenuBuilder()
                        .setCustomId("role_select")
                        .setMinValues(1)
                        .setMaxValues(5),)
                        await inter.followUp({ content: "Güvenli eklemek istediğiniz rolleri menüden seçiniz", components: [row], ephemeral: true }).then(async registersetup=> {
                            const filter = rs => rs.user.id == message.member.id 
                            const collector = registersetup.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
                            collector.on('collect', async (rs) => {
                                const existingGuvenliler = (await Guild31.findOne({ guildID: rs.guild.id }))?.guvenli || [];
                                const selectedUserIDs = rs.values;
                                const updatedGuvenliler = [...existingGuvenliler, ...selectedUserIDs];
                                await Guild31.updateOne({ guildID: rs.guild.id }, { guvenli: updatedGuvenliler }, { upsert: true });
                                rs.reply({content:`${rs.values.map(role=> `<@&${role}>`).join(", ")} **Rol(leri)** Güvenli listeye eklendi`, ephemeral:true})
                            })
                    
                        })
            }
            if(button == "kanal"){
                const row = new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                    .setCustomId("channel_select")
					.addChannelTypes(
						ChannelType.GuildText,
						ChannelType.AnnouncementThread,
						ChannelType.GuildForum,
						ChannelType.GuildAnnouncement,
					)
                        .setMinValues(1)
                        .setMaxValues(5),)
                        await inter.followUp({ content: "Güvenli eklemek istediğiniz rolleri menüden seçiniz", components: [row], ephemeral: true }).then(async registersetup=> {
                            const filter = rs => rs.user.id == message.member.id 
                            const collector = registersetup.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
                            collector.on('collect', async (rs) => {
                                const existingGuvenliler = (await Guild31.findOne({ guildID: rs.guild.id }))?.guvenli || [];
                                const selectedUserIDs = rs.values;
                                const updatedGuvenliler = [...existingGuvenliler, ...selectedUserIDs];
                                await Guild31.updateOne({ guildID: rs.guild.id }, { guvenli: updatedGuvenliler }, { upsert: true });
                                rs.reply({content:`${rs.values.map(role=> `<#${role}>`).join(", ")} **Kanal(ları)** Güvenli listeye eklendi`, ephemeral:true})
                            })
                    
                        })
            }
        })
    },

    interactionRun: async (client, interaction, settings) => {},
};
/*
 
*/