const Canvas = require("canvas")
const Discord = require("discord.js")

module.exports = class Card {

    constructor() {

        this.bot = null;
        this.guild = null;
        this.background = null;
        this.user = null;
        this.rank = null;
        this.level = null;
        this.need = null;
        this.xp = null;
        this.colorFont = null;
        this.colorProgressBar = null;
    }

    /**
     * @param {Discord.Client} value 
    */

    setBot(value) {
        this.bot = value;
        return this;
    }

    /**
     * @param {Discord.Guild} value 
    */

    setGuild(value) {
        this.guild = value;
        return this;
    }

    /**
     * @param {Discord.User} value 
    */

    setUser(value) {
        this.user = value;
        return this;
    }

    /**
     * @param {string} value 
    */

    setBackground(value) {
        this.background = value;
        return this;
    }

    /**
     * @param {number} value 
    */

    setRank(value) {
        this.rank = value;
        return this;
    }

    /**
     * @param {number} value 
    */

    setLevel(value) {
        this.level = value;
        return this;
    }

    /**
     * @param {number} value 
    */

    setXpNeed(value) {
        this.need = value;
        return this;
    }

    /**
     * @param {number} value 
    */

    setXp(value) {
        this.xp = value;
        return this;
    }

    /**
     * @param {string} value 
    */

    setColorFont(value) {
        this.colorFont = value;
        return this;
    }

    /**
     * @param {string} value 
    */

    setColorProgressBar(value) {
        this.colorProgressBar = value;
        return this;
    }

    async toCard() {

        if(this.bot === null || this.bot.token === undefined || this.bot.token === null || typeof this.bot !== "object") throw new Error("The .setBot must be a Discord Client!");
        if(this.guild === null || this.guild.id === undefined || this.guild.id === null) throw new Error("The .setGuild must be a Discord Guild!");
        if(this.background === null || typeof this.background !== "string") throw new Error("The .setBackground must be a string!");
        if(this.user === null || this.user.id === undefined || this.user.id === null) throw new Error("The .setUser must be a Discord User!");
        if(this.rank === null || typeof this.rank !== "number") this.rank = 2;
        if(this.xp === null || typeof this.xp !== "number") this.xp = 2457;
        if(this.need === null || typeof this.need !== "number") this.need = 6000;
        if(this.level === null || typeof this.level !== "number") this.level = 5;
        if(this.colorFont === null || typeof this.colorFont !== "string" || !this.colorFont.match(new RegExp(/^#[0-9a-f]{6}/i))) this.colorFont = "#000000";
        if(this.colorProgressBar === null || typeof this.colorProgressBar !== "string" || !this.colorProgressBar.match(new RegExp(/^#[0-9a-f]{6}/i))) this.colorProgressBar = "#ff4837";

        const canvas = Canvas.createCanvas(800, 300);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage(this.background);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const opacity = await Canvas.loadImage(`${__dirname}/../Assets/rank_black.png`);
        ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height);

        const member = this.guild.members.cache.get(this.user.id);
        const status = member ? member.presence ? member.presence.status : "offline" : "offline";
        const badges = await this.user.fetchFlags();
        const badge = badges.toArray().filter(b => b !== "BotHTTPInteractions" && b !== "Quarantined" && b !== "Spammer" && b !== "TeamPseudoUser" && b !== "VerifiedBot");

        if(this.xp > this.need) this.xp = this.need;
        if(this.xp < 0) this.xp = 0;

        const barre = Math.floor(this.xp / this.need * 490);

        // XP bar (empty)
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.fillStyle = "#ffffff";
        ctx.moveTo(220, 92.5);
        ctx.quadraticCurveTo(220, 75, 240, 75);
        ctx.lineTo(710, 75);
        ctx.quadraticCurveTo(730, 75, 730, 92.5);
        ctx.quadraticCurveTo(730, 110, 710, 110);
        ctx.lineTo(240, 110);
        ctx.quadraticCurveTo(220, 110, 220, 92.5);
        ctx.fill();
        ctx.closePath();

        // XP bar (filled)
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.fillStyle = this.colorProgressBar;
        ctx.moveTo(220, 92.5);
        ctx.quadraticCurveTo(220, 75, 240, 75);
        ctx.lineTo(240 + barre - 20, 75);
        ctx.quadraticCurveTo(240 + barre, 75, 240 + barre, 92.5);
        ctx.quadraticCurveTo(240 + barre, 110, 240 + barre - 20, 110);
        ctx.lineTo(240, 110);
        ctx.quadraticCurveTo(220, 110, 220, 92.5);
        ctx.fill();
        ctx.closePath();

        // Percentage + XP
        ctx.font = '20px "Futura Book"';
        ctx.fillStyle = this.colorFont === "#ffffff" ? "#000000" : this.colorFont;
        ctx.fillText(`${Math.floor(this.xp * 100 / this.need)}%`, 665, 100);
        ctx.fillText(`${this.xp} / ${this.need} XP`, 275, 100);

        // Level + Rank
        ctx.font = '36px "Futura Book"';
        ctx.fillStyle = this.colorFont;
        ctx.fillText(`Level: ${this.level}`, 275, 150);
        if (this.rank === 1) {
            ctx.fillText(`Rank: ${this.rank}st`, 520, 150);
        } else if (this.rank === 2) {
            ctx.fillText(`Rank: ${this.rank}nd`, 520, 150);
        } else if (this.rank === 3) {
            ctx.fillText(`Rank: ${this.rank}rd`, 520, 150);
        } else {
            ctx.fillText(`Rank: ${this.rank}th`, 520, 150);
        }

        // User tag
        ctx.font = '36px "Futura Book"';
        ctx.fillStyle = this.colorFont;
        ctx.fillText(`${this.user.tag.length > 15 ? this.user.tag.slice(0, 15) + "..." : this.user.tag}`, 275, 210);

        //Badge de l'utilisateur                    
        if(badges.bitfield !== 0) {
                    
            for(let i = 0; i < badge.length; i++) {

                if(badge[i] === "HypeSquadOnlineHouse1") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885911154868748318.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "HypeSquadOnlineHouse2") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885911240319324240.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "HypeSquadOnlineHouse3") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885911094319804476.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "Staff") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885910656325410827.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "Partner") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885911476580253806.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "Hypesquad") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885911355142569985.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "BugHunterLevel1") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885910368336117902.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "BugHunterLevel2") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885910424506204160.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "PremiumEarlySupporter") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885910855571619872.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "VerifiedDeveloper") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/885911544884498492.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "CertifiedModerator") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/1057351259109200053.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(badge[i] === "ActiveDeveloper") {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/1057351487937851432.png?v=1")
                    ctx.drawImage(b, 275 + i * 50, 220, 50, 50)
                }
                if(i === (badge.length - 1)) {
                    if((await this.guild.fetchOwner()).id === this.user.id) {
                        const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/832979220387856385.png?v=1")
                        ctx.drawImage(b, 275 + (i+1) * 50, 220, 50, 50)
                    }
                    if(member && member.premiumSinceTimestamp !== null) {
                        if((await this.guild.fetchOwner()).id === this.user.id) {
                            const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? "https://cdn.discordapp.com/emojis/885885300721741874.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? "https://cdn.discordapp.com/emojis/885885268538851379.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? "https://cdn.discordapp.com/emojis/885885230945296384.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? "https://cdn.discordapp.com/emojis/885885188457001070.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? "https://cdn.discordapp.com/emojis/885885137802366996.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? "https://cdn.discordapp.com/emojis/885885091652440104.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? "https://cdn.discordapp.com/emojis/885885056814575697.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? "https://cdn.discordapp.com/emojis/885885020269584404.png?size=96" : "https://cdn.discordapp.com/emojis/885884977831620708.png?size=96")
                            ctx.drawImage(b, 275 + (i+2) * 50, 220, 50, 50)
                        } else {
                            const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? "https://cdn.discordapp.com/emojis/885885300721741874.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? "https://cdn.discordapp.com/emojis/885885268538851379.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? "https://cdn.discordapp.com/emojis/885885230945296384.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? "https://cdn.discordapp.com/emojis/885885188457001070.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? "https://cdn.discordapp.com/emojis/885885137802366996.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? "https://cdn.discordapp.com/emojis/885885091652440104.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? "https://cdn.discordapp.com/emojis/885885056814575697.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? "https://cdn.discordapp.com/emojis/885885020269584404.png?size=96" : "https://cdn.discordapp.com/emojis/885884977831620708.png?size=96")
                            ctx.drawImage(b, 275 + (i+1) * 50, 220, 50, 50)
                        }
                    }
                    if(this.user.displayAvatarURL({dynamic: true}).endsWith(".gif") || (member ? member.presence ? member.presence.activities[0] ? member.presence.activities[0].emoji !== null ? member.presence.activities[0].emoji.id !== undefined : "" : "" : "" : "") || (member ? member.premiumSinceTimestamp !== null : "") || (await this.bot.users.fetch(this.user.id, {force: true})).banner) {
                        if((await this.guild.fetchOwner()).id === this.user.id && member && member.premiumSinceTimestamp !== null) {
                            const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                            ctx.drawImage(b, 275 + (i+3) * 50, 220, 72, 50)
                        } else if((await this.guild.fetchOwner()).id === this.user.id && member && member.premiumSinceTimestamp === null) {
                            const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                            ctx.drawImage(b, 275 + (i+2) * 50, 220, 72, 50)
                        } else if((await this.guild.fetchOwner()).id !== this.user.id && member && member.premiumSinceTimestamp !== null) {
                            const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                            ctx.drawImage(b, 275 + (i+2) * 50, 220, 72, 50)
                        } else {
                            const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                            ctx.drawImage(b, 275 + (i+1) * 50, 220, 72, 50)
                        }
                    }
                }
            }

        } else {
            
            if((await this.guild.fetchOwner()).id === this.user.id) {
                const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/832979220387856385.png?v=1")
                ctx.drawImage(b, 275, 220, 50, 50)
            }
            if(member && member.premiumSinceTimestamp !== null) {
                if((await this.guild.fetchOwner()).id === this.user.id) {
                    const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? "https://cdn.discordapp.com/emojis/885885300721741874.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? "https://cdn.discordapp.com/emojis/885885268538851379.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? "https://cdn.discordapp.com/emojis/885885230945296384.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? "https://cdn.discordapp.com/emojis/885885188457001070.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? "https://cdn.discordapp.com/emojis/885885137802366996.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? "https://cdn.discordapp.com/emojis/885885091652440104.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? "https://cdn.discordapp.com/emojis/885885056814575697.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? "https://cdn.discordapp.com/emojis/885885020269584404.png?size=96" : "https://cdn.discordapp.com/emojis/885884977831620708.png?size=96")
                    ctx.drawImage(b, 275 + 50, 220, 50, 50)
                } else {
                    const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? "https://cdn.discordapp.com/emojis/885885300721741874.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? "https://cdn.discordapp.com/emojis/885885268538851379.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? "https://cdn.discordapp.com/emojis/885885230945296384.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? "https://cdn.discordapp.com/emojis/885885188457001070.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? "https://cdn.discordapp.com/emojis/885885137802366996.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? "https://cdn.discordapp.com/emojis/885885091652440104.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? "https://cdn.discordapp.com/emojis/885885056814575697.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? "https://cdn.discordapp.com/emojis/885885020269584404.png?size=96" : "https://cdn.discordapp.com/emojis/885884977831620708.png?size=96")
                    ctx.drawImage(b, 275, 220, 50, 50)
                }
            }
            if(this.user.displayAvatarURL({dynamic: true}).endsWith(".gif") || (member ? member.presence ? member.presence.activities[0] ? member.presence.activities[0].emoji !== null ? member.presence.activities[0].emoji.id !== undefined : "" : "" : "" : "") || (member ? member.premiumSinceTimestamp !== null : "") || (await this.bot.users.fetch(this.user.id, {force: true})).banner) {
                if((await this.guild.fetchOwner()).id === this.user.id && member && member.premiumSinceTimestamp !== null) {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                    ctx.drawImage(b, 275 + 100, 220, 72, 50)
                } else if((await this.guild.fetchOwner()).id === this.user.id && member && member.premiumSinceTimestamp === null) {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                    ctx.drawImage(b, 275 + 50, 220, 72, 50)
                } else if((await this.guild.fetchOwner()).id !== this.user.id && member && member.premiumSinceTimestamp !== null) {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                    ctx.drawImage(b, 275 + 50, 220, 72, 50)
                } else {
                    const b = await Canvas.loadImage("https://cdn.discordapp.com/emojis/838059673700663316.png?v=1")
                    ctx.drawImage(b, 275, 220, 72, 50)
                }
            }
        }

        //Status
        ctx.beginPath()
        ctx.arc(160, 150, 108, 0, 2 * Math.PI, true)
        ctx.closePath()
        ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
        ctx.fill()

        //Avatar
        ctx.beginPath()
        ctx.arc(160, 150, 100, 0, 2 * Math.PI, true)
        ctx.closePath()
        ctx.clip()

        const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: 'png'}) : this.user.displayAvatarURL({extension: 'png'}) : this.user.displayAvatarURL({extension: 'png'}))
        ctx.drawImage(avatar, 60, 50, 200, 200)

        return canvas;
    }
}