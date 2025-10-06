module.exports.config = {
    name: "fork",
    version: "1.0.8",
    hasPermssion: 0,
    credits: "Mohammad Akash",
    description: "Send repository link when 'fork' is mentioned in text, without prefix",
    commandCategory: "info",
    usages: "fork",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const text = (event.body || "").toLowerCase();

    // 'fork' শব্দ টেক্সটে আছে কি চেক করছে
    if (text.includes("fork")) { 
        const message = `
╔══════════════════════════════╗
║ 🤖 CHAT-BOT-SAIFUL V1 🚀     ║
╠══════════════════════════════╣
║ 📦 Repository Link:           ║
║ 🔗 https://github.com/saiful0144/SAIFUL-BOT-V1.git ║
╠══════════════════════════════╣
║ 👑 Owner: Saiful Islam 🕊️     ║
╠══════════════════════════════╣
║ 💬 যেকোনো তথ্য, পরামর্শ বা        ║
║     সাহায্যের জন্য যোগাযোগ করুন: ║
║ 📘 Messenger:                 ║
║ 🔹 https://www.facebook.com/profile.php?id=61577052283173 ║
╠══════════════════════════════╣
║ 🛠 Last Update: 06 Oct 2025    ║
╠══════════════════════════════╣
║ 💖 Thanks for supporting the Bot! ✨ ║
╚══════════════════════════════╝
`;
        return api.sendMessage(message, event.threadID, event.messageID);
    }
};
