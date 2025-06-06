# discord-canvas-easy
## From simple image with configurable canvas
### More canvas coming soon

Simple canvas with discord-canvas-easy

[![npm](https://img.shields.io/npm/v/discord-canvas-easy)](https://npmjs.org/discord-canvas-easy)

[![NPM](https://nodei.co/npm/discord-canvas-easy.png)](https://npmjs.org/package/discord-canvas-easy)

> V3.2.1

## Example of code

```js
const Canvas = require("discord-canvas-easy");
const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});

bot.on("ready", () => {
    console.log("I'm login !")
});

bot.on("messageCreate", async message => {

    if(message.content === "!rank") {

        const Rank = await new Canvas.Card()
        .setGuild(message.guild)
        .setUser(message.author)
        .setBackground("https://lh3.googleusercontent.com/proxy/RlfqL01K_816kNExzofpQ_D206IJmGAYR9e6Nll6AaLgBsReYelwxt--_z1q91ejmeIjHBkB-AYb-1O-qwnoswX1pKGH61jETg_OWSELWK5HSmfScVK56fkT2QoJGsCOfTNWHskc")
        .setRank(2) //optional
        .setLevel(5) //optional
        .setXpNeed(6000) //optional
        .setXp(2457) //optional
        .setColorFont("#000000") //optional
        .setColorProgressBar("#ff4837") //optional
        .toCard()

        message.reply({files: [new Discord.AttachmentBuilder(Rank.toBuffer(), "rank.png")]})
    }

    if(message.content === "!leaderboard") {

        const Leaderboard = await new Canvas.Leaderboard()
        .setBot(bot)
        .setGuild(message.guild)
        .setBackground("https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=720&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29kZXx8fHx8fDE2MzAxNzA4NzM&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1280")
        .addUser(message.author, 8 /*the level*/, 4589 /*the xp*/, 9000 /*the xp need*/)
        .setColorFont("#ffffff") //optional
        .toLeaderboard()

        message.reply({files: [new Discord.AttachmentBuilder(Leaderboard.toBuffer(), "leaderboard.png")]})
    }
});

bot.on("guildMemberAdd", async member => {

    const Welcome = await new Canvas.Home()
    .setGuild(member.guild)
    .setBackground("https://lh3.googleusercontent.com/proxy/RlfqL01K_816kNExzofpQ_D206IJmGAYR9e6Nll6AaLgBsReYelwxt--_z1q91ejmeIjHBkB-AYb-1O-qwnoswX1pKGH61jETg_OWSELWK5HSmfScVK56fkT2QoJGsCOfTNWHskc")
    .setUser(member.user)
    .setText("Welcome {user.username} on the server !") /*optionnal*/ /*you can put {user.username} {user.tag} {server.name} {server.memberCount} for the datas*/
    .setColorFont("#ffffff") //optional
    .toHome()

    await bot.channels.cache.get("CHANNEL_ID").send({files: [new Discord.AttachmentBuilder(Welcome.toBuffer(), "welcome.png")]})
})

bot.on("guildMemberRemove", async member => {

    const Goodbye = await new Canvas.Home()
    .setGuild(member.guild)
    .setBackground("https://lh3.googleusercontent.com/proxy/RlfqL01K_816kNExzofpQ_D206IJmGAYR9e6Nll6AaLgBsReYelwxt--_z1q91ejmeIjHBkB-AYb-1O-qwnoswX1pKGH61jETg_OWSELWK5HSmfScVK56fkT2QoJGsCOfTNWHskc")
    .setUser(member.user)
    .setText("See you soon {user.username} !") /*optionnal*/ /*you can put {user.username} {user.tag} {server.name} {server.memberCount} for the datas*/
    .setColorFont("#ffffff") //optional
    .toHome()

    await bot.channels.cache.get("CHANNEL_ID").send({files: [new Discord.AttachmentBuilder(Goodbye.toBuffer(), "goodbye.png")]})
})

bot.login("YOUR_TOKEN");
```

![img](https://cdn.discordapp.com/attachments/901045589259722782/949365100698021918/rank.png)
![img](https://cdn.discordapp.com/attachments/889902446925742101/1025793581480419491/leaderboard.png)
![img](https://cdn.discordapp.com/attachments/901045589259722782/969977069683494943/welcome.png)