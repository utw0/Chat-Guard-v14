const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType, EmbedBuilder ,ActionRowBuilder,ButtonStyle,ButtonBuilder,codeBlock,StringSelectMenuBuilder,ChannelSelectMenuBuilder,ChannelType,RoleSelectMenuBuilder,ModalBuilder,TextInputStyle,TextInputBuilder} = require('discord.js'); 
const Guild31 = require("../../../Global/Settings/Models/Guild")
module.exports = {
    Name: 'Panel',
    Aliases: ["koruma","guard","Guard","panel"],
    Description: 'protection settings',
    Usage: 'panel',
    Category: 'Admin',
    Cooldown: 10,
    
    Permissions: {
        User : [Flags.Administrator],
    },

    Command: {
        Prefix: true,
    },

    messageRun: async (client, message, args, settings) => {
      var guardData = await Guild31.findOne({guildID:message.guild.id})
      var chat = guardData ? guardData.chatiltifat :false
      const channelID = guardData.logKanali; 
      const channel = client.channels.cache.get(channelID);
        let embed = new EmbedBuilder()
        .setTitle(`Roel`)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setFooter({ text: `luhux was here!` })
        .setDescription(`
        Merhaba ${message.member} Guard Yönetim ve Kontrol Paneline Hoşgeldin,
        ${codeBlock("md",
        `# Sunucu Koruma Paneli
• Aşağıda bulunan butonlardan ayarları açıp/kapatabilirsin,
• Menüden bulunan korumaları açıp/kapatabilirsin

Log Kanalı: #${channel.name}
Chat İltifat Sistemi: ${chat == true ? "Aktif 🟢":"Aktif Değil 🔴"}
`)}`);

       
const yoneticilermenusu = new ActionRowBuilder()
.addComponents(
new StringSelectMenuBuilder()
.setCustomId("yoneticiMenu")
.setPlaceholder("Korumalar Aktif Et/Devredışı Bırak")
.setOptions(
    [
        {label:"Capslock Filtresi",description:"Aktif Et/Devredışı Bırak",value:"capsloc",emoji:{id:"1173266908313817193"}},
        {label:"Emoji Spam Filtresi",description:"Aktif Et/Devredışı Bırak",value:"emoji",emoji:{id:"1173266908313817193"}},
        {label:"Reklam Filtresi",description:"Aktif Et/Devredışı Bırak",value:"reklam",emoji:{id:"1173266908313817193"}},
        {label:"Link/Bağlantı Filtresi",description:"Aktif Et/Devredışı Bırak",value:"link",emoji:{id:"1173266908313817193"}},
        {label:"Etiket Filtresi",description:"Aktif Et/Devredışı Bırak",value:"etiket",emoji:{id:"1173266908313817193"}},
        {label:"Spam Filtresi",description:"Aktif Et/Devredışı Bırak",value:"spam",emoji:{id:"1173266908313817193"}},
        {label:"Küfür Filtresi",description:"Aktif Et/Devredışı Bırak",value:"küfür",emoji:{id:"1173266908313817193"}},
        {label:"Chat İltifat",description:"Aktif Et/Devredışı Bırak",value:"chat",emoji:{id:"1173266908313817193"}}
    ]
  ))


  const güvenliler = await Guild31.findOne({ guildID: message.guild.id });

let güvenlilerr;

if (güvenliler && güvenliler.guvenli && güvenliler.guvenli.length > 0) {
  güvenlilerr = await Promise.all(
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
} else {
  güvenlilerr = [
    {
      label: "No Data",
      description: "There is no data available.",
      value: "0"
    }
  ];
}

  
  const güvenli = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("güvenliler")
        .setPlaceholder("Güvenli Listede Bulunanlar")
        .setOptions(güvenlilerr)
    );
       
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("logkanal").setLabel("Log Kanalı").setEmoji("1173266908313817193").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("chatkanalı").setLabel("Chat Kanalı").setEmoji("1173266908313817193").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("ayarlar").setLabel("Sunucu Ayarları").setEmoji("1173266908313817193").setStyle(ButtonStyle.Secondary),
        );
        let msg = await  message.channel.send({ embeds: [embed], components: [row,yoneticilermenusu,güvenli], collector: true })
        const filter = c => c.user.id == message.member.id 
        const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
        collector.on('collect', async (inter) => {
            await inter.deferUpdate();
            const menu = inter.values ? inter.values[0] : "Yok";
            const button = inter.customId;
            if(menu == "capsloc"){
                const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                const kontrol = guildLevel ? guildLevel.capsKoruma : false;
                capslockFiltresiDurumu = !kontrol;
                await Guild31.updateOne({ guildID: inter.guild.id }, { capsKoruma: capslockFiltresiDurumu }, { upsert: true });
    
                const mesaj = capslockFiltresiDurumu ? "**Capslock Filtresi** Aktif Edildi!" : "**Capslock Filtresi** Kapatıldı";
                await inter.followUp({ content: mesaj, ephemeral: true });
                }
                if(menu == "emoji"){
                    const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                    const kontrol = guildLevel ? guildLevel.emojiSpamKoruma : false;
                    emojispam = !kontrol;
                    await Guild31.updateOne({ guildID: inter.guild.id }, { emojiSpamKoruma: emojispam }, { upsert: true });
        
                    const mesaj = emojispam ? "**Emoji Spam Filtresi** Aktif Edildi!" : "**Emoji Spam Filtresi** Kapatıldı";
                    await inter.followUp({ content: mesaj, ephemeral: true });
                    }
                    if(menu == "reklamban"){
                        const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                        const kontrol = guildLevel ? guildLevel.reklamBanKoruma : false;
                        reklamBanKoruma31 = !kontrol;
                        await Guild31.updateOne({ guildID: inter.guild.id }, { reklamBanKoruma: reklamBanKoruma31 }, { upsert: true });
            
                        const mesaj = reklamBanKoruma31 ? "**Reklam Engel Ban Filtresi** Aktif Edildi!" : "**Reklam Engel Ban Filtresi** Kapatıldı";
                        await inter.followUp({ content: mesaj, ephemeral: true });
                        }
                        if(menu == "reklam"){
                            const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                            const kontrol = guildLevel ? guildLevel.reklamKoruma : false;
                            reklam = !kontrol;
                            await Guild31.updateOne({ guildID: inter.guild.id }, { reklamKoruma: reklam }, { upsert: true });
                
                            const mesaj = reklam ? "**Reklam Engel Filtresi** Aktif Edildi!" : "**Reklam Engel Filtresi** Kapatıldı";
                            await inter.followUp({ content: mesaj, ephemeral: true });
                            }
                            if(menu == "link"){
                                const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                                const kontrol = guildLevel ? guildLevel.linkKoruma : false;
                                link331 = !kontrol;
                                await Guild31.updateOne({ guildID: inter.guild.id }, { linkKoruma: link331 }, { upsert: true });
                    
                                const mesaj = link331 ? "**Link Filtresi** Aktif Edildi!" : "**Link Filtresi** Kapatıldı";
                                await inter.followUp({ content: mesaj, ephemeral: true });
                                }
                                if(menu == "etiket"){
                                    const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                                    const kontrol = guildLevel ? guildLevel.etiketKoruma : false;
                                    etike312 = !kontrol;
                                    await Guild31.updateOne({ guildID: inter.guild.id }, { etiketKoruma: etike312 }, { upsert: true });
                        
                                    const mesaj = etike312 ? "**Etiket Filtresi** Aktif Edildi!" : "**Etiket Filtresi** Kapatıldı";
                                    await inter.followUp({ content: mesaj, ephemeral: true });
                                    }
                                    if(menu == "spam"){
                                        const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                                        const kontrol = guildLevel ? guildLevel.spamKoruma : false;
                                        spamKoruma2 = !kontrol;
                                        await Guild31.updateOne({ guildID: inter.guild.id }, { spamKoruma: spamKoruma2 }, { upsert: true });
                            
                                        const mesaj = spamKoruma2 ? "**Spam Filtresi** Aktif Edildi!" : "**Spam Filtresi** Kapatıldı";
                                        await inter.followUp({ content: mesaj, ephemeral: true });
                                        }
                                        if(menu == "küfür"){
                                            const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                                            const kontrol = guildLevel ? guildLevel.kufurKoruma : false;
                                            kufurKoruma2 = !kontrol;
                                            await Guild31.updateOne({ guildID: inter.guild.id }, { kufurKoruma: kufurKoruma2 }, { upsert: true });
                                
                                            const mesaj = kufurKoruma2 ? "**Küfür Filtresi** Aktif Edildi!" : "**Küfür Filtresi** Kapatıldı";
                                            await inter.followUp({ content: mesaj, ephemeral: true });
                                            }
                                            if(menu == "chat"){
                                                const guildLevel = await Guild31.findOne({ guildID: inter.guild.id });
                                                const kontrol = guildLevel ? guildLevel.kufurKoruma : false;
                                                chart31 = !kontrol;
                                                await Guild31.updateOne({ guildID: inter.guild.id }, { chatiltifat: chart31 }, { upsert: true });
                                    
                                                const mesaj = chart31 ? "**Chat İltifat** Aktif Edildi!" : "**Chat İltifat** Kapatıldı";
                                                await inter.followUp({ content: mesaj, ephemeral: true });
                                                }
                                               
            if(button === "ayarlar"){
      
                var guardData = await Guild31.findOne({guildID:message.guild.id})
                var rek = guardData ? guardData.reklamKoruma : false
                var rekban = guardData ? guardData.reklamBanKoruma : false
                var link = guardData ? guardData.linkKoruma : false
                var caps = guardData ? guardData.capsKoruma : false
                var etiket = guardData ? guardData.etiketKoruma : false
                var spam = guardData ? guardData.spamKoruma : false
                var emoji = guardData ? guardData.emojiSpamKoruma : false
                var küfür = guardData ? guardData.kufurKoruma :false
                var chat = guardData ? guardData.chatiltifat :false
                let embed = new EmbedBuilder()
                .setTitle(`Roel`)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setFooter({ text: `luhux was here!` })
                .setDescription(`
${codeBlock("md",
`# Sunucu Koruma Paneli
${rek == true ? "< Reklam Koruma : Açık 🟢":"> Reklam Koruma : Kapalı 🔴"}
${rekban == true ? "< Reklam Koruma Ban : Açık 🟢":"> Reklam Koruma Ban : Kapalı 🔴"}
${link == true ? "< Link Koruma : Açık 🟢":"> Link Koruma : Kapalı 🔴"}
${caps == true ? "< Capslock Koruma : Açık 🟢":"> Capslock Koruma : Kapalı 🔴"}
${etiket == true ? "< Etiket Koruma : Açık 🟢":"> Etiket Koruma : Kapalı 🔴"}
${spam == true ? "< Spam Koruma : Açık 🟢":"> Spam Koruma : Kapalı 🔴"}
${emoji == true ? "< Emoji Spam Koruma : Açık 🟢":"> Emoji Spam Koruma : Kapalı 🔴"}
${küfür == true ? "< Küfür Koruma : Açık 🟢":"> Küfür Koruma : Kapalı 🔴"}
--------------------Others------------------------
${chat == true ? "< Chat İltifat : Açık 🟢":"> Chat İltifat : Kapalı 🔴"}
`)}`);
               
                inter.followUp({embeds:[embed], ephemeral:true})
            }
            if(button === "logkanal"){
            inter.followUp({components:[
                new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                    .setChannelTypes(ChannelType.GuildText)
                    .setCustomId("channelSelectMenu_Setup")
                )
             ],content:"Aşağıda bulunan menüden **Log Kanalı** seçimi yapınız", ephemeral:true}).then(async logkanalısetup=> {
                const filter = rs => rs.user.id == message.member.id 
                const collector = logkanalısetup.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
                collector.on('collect', async (rs) => {
                    var role = rs.values[0]
                    await Guild31.findOneAndUpdate({ guildID: message.guild.id }, { logKanali: role }, { upsert: true });
                 rs.reply({content:`<#${role}> Kanalı **Log Kanalı** olarak ayarlandı.`, ephemeral:true})
                    if(logkanalısetup) logkanalısetup.delete();
                })
            })
            }
            if(button === "chatkanalı"){

                inter.followUp({components:[
                    new ActionRowBuilder().addComponents(
                        new ChannelSelectMenuBuilder()
                        .setChannelTypes(ChannelType.GuildText)
                        .setCustomId("channelSelectMenu_Setup")
                    )
                 ],content:"Aşağıda bulunan menüden **Chat Kanalı** seçimi yapınız", ephemeral:true}).then(async logkanalısetup=> {
                    const filter = rs => rs.user.id == message.member.id 
                    const collector = logkanalısetup.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
                    collector.on('collect', async (rs) => {
                        var role = rs.values[0]
                        await Guild31.findOneAndUpdate({ guildID: message.guild.id }, { chatKanali: role }, { upsert: true });
                     rs.reply({content:`<#${role}> Kanalı **Chat Kanalı** olarak ayarlandı.`, ephemeral:true})
                        if(logkanalısetup) logkanalısetup.delete();
                    })
                })
                }
                if(button === "muterol"){
                    inter.followUp({components:[
                        new ActionRowBuilder().addComponents(
                            new RoleSelectMenuBuilder()
                            .setCustomId("channelSelectMenu_Setup")
                        )
                     ],content:"Aşağıda bulunan menüden **Mute Rolü** seçimi yapınız", ephemeral:true}).then(async registersetup=> {
                        const filter = rs => rs.user.id == message.member.id 
                        const collector = registersetup.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 30000*10 })
                        collector.on('collect', async (rs) => {
                            var role = rs.values[0]
                            await Guild31.findOneAndUpdate({ guildID: message.guild.id }, { muteRolu: role }, { upsert: true });
                         rs.reply({content:`<@&${role}> Rolü **Mute Rolü** olarak ayarlandı.`, ephemeral:true})
                            if(registersetup) registersetup.delete();
                        })
                    })
                    }
                    if(button === "filtre321"){
                      await inter.deferUpdate();
                      const modal = new ModalBuilder()
                      .setCustomId("filtre31")
                      .setTitle("Filtre Ekle")
                      .setComponents(
                          new ActionRowBuilder()
                              .addComponents(
                                  new TextInputBuilder()
                                      .setCustomId("fil")
                                      .setLabel("Filtre Eklencek Kelime(ler)")
                                      .setPlaceholder('utku,luhux,kösem')
                                      .setStyle(TextInputStyle.Short)
                              )
        
                      )
                      inter.followUp({content:"sa", ephemeral:true})
                      await inter.showModal(modal, { client: client, interaction: inter });
                    }
        }) 

    },

    interactionRun: async (client, interaction, settings) => {},
};