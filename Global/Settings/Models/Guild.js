const mongoose = require('mongoose');

const GuildSchema = mongoose.Schema({
  guildID: String,
  guvenli: { type: Array, default: [] },
  logKanali: String,
  chatKanali: String,
  muteRolu: String,
  ihlalCezaSayi: { type: Number, default: 10, min: 5 },
  ihlalCezaSure: { type: Number, default: 10, min: 5 },
  filtreKelimeler: { type: Array, default: [] },
  botTemizleyiciKanallari: { type: Array, default: [] },
  kufurKoruma: { type: Boolean, default: false },
  reklamKoruma: { type: Boolean, default: false },
  chatiltifat: { type: Boolean, default: false },
  reklamBanKoruma: { type: Boolean, default: false },
  linkKoruma: { type: Boolean, default: false },
  capsKoruma: { type: Boolean, default: false },
  etiketKoruma: { type: Boolean, default: false },
  spamKoruma: { type: Boolean, default: false },
  emojiSpamKoruma: { type: Boolean, default: false }
});

module.exports = mongoose.model("luhux-roel", GuildSchema);