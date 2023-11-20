const vanteDB = require('vantedb');
const { Bot } = require('../Config');

const guildSchema = {
    guildID: String,
    guildName: String,
    Prefix: { type: Array, default: Bot.Prefix },
    Language: { type: String, default: Bot.Language },

};

module.exports = vanteDB.model({
    Collection: 'Servers',
    Folder: './Global/Database/',
    Cluster: true,
    Type: [],
}, guildSchema); 
