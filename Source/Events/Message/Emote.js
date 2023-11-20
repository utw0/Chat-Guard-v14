const { Events, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Guild31 = require("../../../Global/Settings/Models/Guild");
const ms = require("ms");
const limitTracker = new Map();
module.exports = {
  Name: Events.MessageCreate,
  System: true,

  execute: async (client, msg) => {
    const data = await Guild31.findOne({ guildID: msg.guild.id });
    if (!data || !data.logKanali || !data.emojiSpamKoruma|| msg.author?.bot) return;

    const user = msg.author;
    const member = msg.guild.members.cache.get(user.id);

    if (data.guvenli.includes(user.id)) return;
   
    else {
        const e = new EmbedBuilder().setDescription(
          `Lütfen emoji spam atma! ${user}.`
        );
        const emojiRegex = /<a?:.+?:\d+>|[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
        const content = msg.content.toLowerCase();
        const words = content.split(" ");

        if (emojiRegex.test(msg.content) && msg.content.match(emojiRegex).length > 9) {
          msg.delete();
          const logChannel = client.channels.cache.get(data.logChannel);
          msg.channel.send({ embeds: [e] });
          if (!logChannel) return;
          else {
            const buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Timeout")
                .setEmoji(`${Emojis.MUTE}`)
                .setCustomId("linktimeout")
                .setStyle(ButtonStyle.Secondary),

            );
            const logMsg = await logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `<@${user.id}> Emoji spam uyarı\n\`\`\`${msg.content}\`\`\``
                  )
                  .setFooter({ text: `User ID: ${user.id}` })
                  .setTimestamp(),
              ],
              components: [buttons],
            });

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
                        `Şu tarihten itibaren bir zaman aşımı aldınız: \`${msg.guild.name}\``
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
                        `Fazla etiket gönderdiğiniz için \`${msg.guild.name}\` sunucusundan atıldınız.`
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
                      member.kick({ reason: "Fazla kişiye etiket attığı için" });
                    });
                    break;
                  }
                }
              });
            }
          }
        }
      }
    }