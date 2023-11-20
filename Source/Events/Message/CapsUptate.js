const { Events, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Guild31 = require("../../../Global/Settings/Models/Guild");
const ms = require("ms");
const limitTracker = new Map();
module.exports = {
  Name: Events.MessageUpdate,
  System: true,

  execute: async (client, msg) => {
    const data = await Guild31.findOne({ guildID: msg.guild.id });
    if (!data || !data.logKanali || !data.capsKoruma|| msg.author?.bot) return;

    const user = msg.author;
    const member = msg.guild.members.cache.get(user.id);

    if (data.guvenli.includes(user.id)) return;
    
    else {
        const e = new EmbedBuilder().setDescription(
          `Bu sunucuda büyük harf kullanımına izin verilmiyor, ${user}.`
        );
        const capsLockRegex = /[^A-ZĞÜŞİÖÇ]/g;
        const content = msg.content.toLowerCase();
        const words = content.split(" ");

        if (
          msg.content.replace(capsLockRegex, "").length >=
          msg.content.length / 2
        ) {
          if (msg.content.length <= 5) return;
          msg.delete();
          const logChannel = client.channels.cache.get(data.logKanali);
          msg.channel.send({ embeds: [e] })
          .then(async (msg) => {
            setTimeout(async () => {
              if (msg && msg.deletable) await msg.delete();
            }, 5000);
          });
          if (!logChannel) return;
          else {
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
                    `<@${user.id}> büyük harf  gönderdiği için uyarıldı.\n\`\`\`${msg.content}\`\`\``
                  )
                  .setFooter({ text: `User ID: ${user.id}` })
                  .setTimestamp(),
              ],
              components: [buttons],
            });
            const userLimitKey = `${msg.guild.id}:${user.id}`;
            const userLimit = limitTracker.get(userLimitKey) || { count: 0, lastMessageTime: null };
      
            const now = Date.now();
            const timeDifference = userLimit.lastMessageTime ? now - userLimit.lastMessageTime : null;
            if (links && links.length > 0) {
              userLimit.count += 1;
              userLimit.lastMessageTime = now;
              limitTracker.set(userLimitKey, userLimit);
              if (userLimit.count >= 8) {
                member.timeout(ms("5m"));
                msg.channel.send({content:`${member} Büyük harf kullanmaya devam ettiğin için seni \` 5 Dakika \` susturdum`}).then(async (msg) => {
                  setTimeout(async () => {
                    if (msg && msg.deletable) await msg.delete();
                  }, 9000);
                });
                member.send({content:`\`${msg.guild.name}\` Uyarılara uymadığın için seni \` 5 Dakika \` susturdum`})
                logChannel.send({embeds:[ new EmbedBuilder()
                  .setDescription(
                    `<@${member.id}> Büyük harf kullandığı için **5 Dakika** susturuldu`
                  )
                  .setFooter({ text: `Kullanıcı ID: ${member.id}` })
                  .setTimestamp(),]})
                limitTracker.delete(userLimitKey);
              }
              return;
            }
      
            limitTracker.set(userLimitKey, { count: 1, lastMessageTime: now });
            const col = await logMsg.createMessageComponentCollector({
              componentType: ComponentType.Button,
            });

            col.on("collect", async (m) => {
              switch (m.customId) {
                case "linktimeout":
                  {
                    if (
                      !m.member.permissions.has(
                        PermissionFlagsBits.ModerateMembers
                      )
                    )
                      return m.reply({
                        embeds: [
                          new EmbedBuilder().setDescription(
                            `${m.user} **Yönetici** izni eksik, lütfen bu izni aldıktan sonra tekrar deneyin.`
                          ),
                        ],
                        ephemeral: true,
                      });

                    if (!msg.member) {
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
                        `Şu tarihten itibaren bir zaman aşımı aldınız: \`${msg.guild.name}\``
                      )
                      .setTimestamp();

                    msg.member
                      .send({
                        embeds: [timeoutEmbed],
                      })
                      .then(() => {
                        const time = ms("10m");
                        msg.member.timeout(time);
                      });
                  }
                  break;

                case "linkkick":
                  {
                    if (
                      !m.member.permissions.has(PermissionFlagsBits.KickMembers)
                    )
                      return m.reply({
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
                        `Büyük harf kullandığınız için \`${msg.guild.name}\` sunucusundan atıldınız.`
                      )
                      .setTimestamp();

                    if (!msg.member) {
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

                    msg.member
                      .send({
                        embeds: [kickEmbed],
                      })
                      .then(() => {
                        msg.member.kick({ reason: "Büyük Harf Kullanımı (luhux was here)" });
                      });
                  }
                  break;
              }
            });
          }
        }
      }
    }
  }
