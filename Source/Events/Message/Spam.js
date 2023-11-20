const { Events, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Guild31 = require("../../../Global/Settings/Models/Guild");
const ms = require("ms");
const messageCounts = new Map();
const limitTracker = new Map();
module.exports = {
  Name: Events.MessageCreate,
  System: true,

  execute: async (client, message) => {
    const data = await Guild31.findOne({ guildID: message.guild.id });
    if (!data || !data.logKanali || !data.spamKoruma || message.author?.bot) return;

    const user = message.author;
    const member = message.guild.members.cache.get(user.id);

    const logChannel = client.channels.cache.get(data.logKanali);

    const e = new EmbedBuilder().setDescription(
      `<@${message.author.id}> Lütfen spam yapma, yavaş ol.`
    );

    const maxMessageCount = 5;
    const intervalSeconds = 10;

    let messageCount = messageCounts.get(message.author.id) || 0;
    messageCount++;
    messageCounts.set(message.author.id, messageCount);

    if (messageCount > maxMessageCount) {
      try {
        await message.delete();
      } catch (err) {
        console.error('Mesaj silinirken hata oluştu:', err);
        return;
      }

      setTimeout(() => {
        messageCounts.delete(message.author.id);
      }, 5000);

      message.channel.send({ embeds: [e] }).then(async (msg) => {
        setTimeout(async () => {
          if (msg && msg.deletable) await msg.delete();
        }, 2000);
      });
  
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Timeout")
            .setCustomId("linktimeout")
            .setStyle(ButtonStyle.Secondary),
         
        );
        const logMsg = await logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `<@${user.id}> Spam yaptığı için uyarıldı.\n\`\`\`${message.content}\`\`\``
              )
              .setFooter({ text: `User ID: ${user.id}` })
              .setTimestamp(),
          ],
          components: [buttons],
        });
        const userLimitKey = `${message.guild.id}:${user.id}`; 
        const userLimit = limitTracker.get(userLimitKey) || { count: 0, lastMessageTime: null };
        const now = Date.now();
        const timeDifference = userLimit.lastMessageTime ? now - userLimit.lastMessageTime : null;
      
        userLimit.count += 1;
        userLimit.lastMessageTime = now;
        limitTracker.set(userLimitKey, userLimit);
      
        if (userLimit.count >= 5) {
          member.timeout(ms("5m"));
      
          message.channel.send({ content: `${member} Spam yapmaya devam ettiğin için seni \` 5 Dakika \` susturdum` }).then(async (message) => {
            setTimeout(async () => {
              if (message && message.deletable) await message.delete();
            }, 9000);
          });
      
          member.send({ content: `\`${message.guild.name}\` Uyarılara uymadığın için seni \` 5 Dakika \` susturdum` });
      
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `<@${member.id}> Spam gönderildiği için **5 Dakika** susturuldu`
                )
                .setFooter({ text: `Kullanıcı ID: ${member.id}` })
                .setTimestamp(),
            ],
          });
    
          limitTracker.delete(userLimitKey);
          messageCounts.delete(message.author.id);
          limitTracker.set(userLimitKey, { count: 1, lastMessageTime: now });
        
        return;
      }
        const col = await logMsg.createMessageComponentCollector({
          componentType: ComponentType.Button,
        });

        col.on("collect", async (m) => {
            switch (m.customId) {
              case "linktimeout": {
                if (!m.member.permissions.has(PermissionsBitField.Flags.Administrator)) return m.reply({
                  embeds: [
                    new EmbedBuilder().setDescription(
                      `${m.user} **Yönetici** izni eksik, lütfen bu izni aldıktan sonra tekrar deneyin.`
                    ),
                  ],
                  ephemeral: true,
                });
  
                if (!member) {
                  return m.reply({
                    embeds: [
                      new EmbedBuilder().setDescription(
                        `Belirtilen üye büyük olasılıkla sunucudan ayrıldı.`
                      ),
                    ],
                    ephemeral: true,
                  });
                }
  
                m.reply({
                  embeds: [
                    new EmbedBuilder().setDescription(
                      `${member} 10 dakika süreyle başarıyla zaman aşımına uğradı.`
                    ),
                  ],
                  ephemeral: true,
                });
  
                const timeoutEmbed = new EmbedBuilder()
                  .setTitle("Timeout")
                  .setDescription(
                    `Şu tarihten itibaren bir zaman aşımı aldınız: \`${message.guild.name}\``
                  )
                  .setTimestamp();
  
                member.send({
                  embeds: [timeoutEmbed],
                }).then(() => {
                  const time = ms("10m");
                  member.timeout(time);
                });
                break;
              }
  
              case "linkkick": {
                if (!m.member.permissions.has(PermissionsBitField.Flags.Administrator)) return m.reply({
                  embeds: [
                    new EmbedBuilder().setDescription(
                      `${m.user} *Yönetici* izni eksik, lütfen bu izni aldıktan sonra tekrar deneyin.`
                    ),
                  ],
                  ephemeral: true,
                });
  
                const kickEmbed = new EmbedBuilder()
                  .setTitle("Kicked")
                  .setDescription(
                    `Spam yaptığınız için \`${message.guild.name}\` sunucusundan atıldınız.`
                  )
                  .setTimestamp();
  
                if (!member) {
                  return m.reply({
                    embeds: [
                      new EmbedBuilder().setDescription(
                        `Belirtilen üye büyük olasılıkla sunucuyu terk etti.`
                      ),
                    ],
                    ephemeral: true,
                  });
                }
  
                m.reply({
                  embeds: [
                    new EmbedBuilder().setDescription(
                      `${member} başarıyla sunucudan atıldı.`
                    ),
                  ],
                  ephemeral: true,
                });
  
                member.send({
                  embeds: [kickEmbed],
                }).then(() => {
                  member.kick({ reason: "Spam Uyarısı (Luhux was here kanzi)." });
                });
                break;
              }
            }
          });
        }
      } }
    
  
