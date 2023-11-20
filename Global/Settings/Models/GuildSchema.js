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
}, guildSchema); //mongo yok değilmi bunda
// true yaptık açtık işte // bu adece dosya yukelemelri yapiyor find update gibi seylerde options da cluster belirtmen lazim
// göstersene bi

// vantedb.findOne({guildID: ertununAnnesi}, { Cluster: "ServerID" }) // butun olaylarda en sonda options kismi oluyor onun icine Cluster belirtirsen oluyor
// tamamen local benim db uzdrinden calisiyor ama cluster modu aktif degil cluster acarsaniz sunucuya ozel dosya acar icine jsonlari acar
// anladım şimdi

// altyapida baska anlamadiign bir sey varsa aciklayim gidicem
//anlamadığım bişey olduğunda dmden spam atarım merak etme canım <3
// ananskm ama ilk ertunn anensini sonr zaten yorulur sikmem anneni merak etme
// çok teşekkürler <3 
// rica ederimsaas


// evet cluster modu acik olanlarda yapman lazim diger turlu bulamiyor dosyayi tamam canım ertunun annesi için kolay gelsin beline kuvvet iyi çalışamlar dilerim link bekliyorum
// eyvallah hocam ama paylasmam ozelimi karim o benm :haha:
// buton gibi interaction tabanli seylerde client.on interactionCreatee acmayin events dosyasinda custom var orda hem menu hem button icin handler var tamam data silince de cluster eklicez değil mi veya update edince