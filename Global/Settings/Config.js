module.exports = {
    serverID: '1066294816851374100',
    ownerID: ["341592492224806914","852800814808694814"],
    
    Bot: {
        Token: 'MTAxMDY2NDIzOTU1NzUxMzI2Nw.Gz6ehB.GRaqj-D2XOKJ2pEC1sWlIh2gVYWX4QblFJ2qek',
        Mongo: 'mongodb+srv://luhux:Utku4545@cluster0.3dsecvl.mongodb.net/roelx?retryWrites=true&w=majority',
        Prefix: ["."],
        Language: 'tr',
        
        Presence: {
            Status: 'idle', 
            Type: 'listening', 
            Message: ["approval luhux"]
        },

        Monitor: [
            { ID: 'System',    Webhook: 'https://discord.com/api/webhooks/1127244640295333918/9BmRwq6-bdb1iQ_BnhSoj23lxLDwtT5MmOpUQhlhRKaxkbl1CqzG4Z_z1K_7dZe4SWKW', },
            { ID: 'Servers',   Webhook: 'https://discord.com/api/webhooks/1127244640295333918/9BmRwq6-bdb1iQ_BnhSoj23lxLDwtT5MmOpUQhlhRKaxkbl1CqzG4Z_z1K_7dZe4SWKW', },
            { ID: 'Feedbacks', Webhook: 'https://discord.com/api/webhooks/1127244640295333918/9BmRwq6-bdb1iQ_BnhSoj23lxLDwtT5MmOpUQhlhRKaxkbl1CqzG4Z_z1K_7dZe4SWKW', },
            { ID: 'Bugs',      Webhook: 'https://discord.com/api/webhooks/1127244640295333918/9BmRwq6-bdb1iQ_BnhSoj23lxLDwtT5MmOpUQhlhRKaxkbl1CqzG4Z_z1K_7dZe4SWKW', },
        ],

        Links: {
            SupportServer: 'https://discord.gg/luppux',
            Dashboard: 'https://luhux.dev/',
            Invite: 'https://discord.com/api/oauth2/authorize?client_id=0&permissions=8&scope=bot%20applications.commands',
            Vote: 'https://luhux.dev/vote'
        }
    }
};