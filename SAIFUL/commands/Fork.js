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
╭───────────────────────────────╮
│ 🤖 𝐂𝐇𝐀𝐓-𝐁𝐎𝐓-𝐒𝐀𝐈𝐅𝐔𝐋 𝐕1 🚀       │
├───────────────────────────────┤
│ 📦 𝗥𝗲𝗽𝗼𝘀𝗶𝘁𝗼𝗿𝘆 𝗟𝗶𝗻𝗸:              │
│ 🔗 https://github.com/saiful0144/SAIFUL-BOT-V1.git │
│                                               │
│ 👑 𝗢𝘄𝗻𝗲𝗿: 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🕊️              │
│ 💬 যেকোনো তথ্য, পরামর্শ বা সাহায্যের জন্য যোগাযোগ করুন।: │
│ 📘 Messenger:                                │
│ 🔹 https://www.facebook.com/profile.php?id=61577052283173 │
│                                               │
│ 🛠️ 𝗟𝗮𝘀𝘁 𝗨𝗽𝗱𝗮𝘁𝗲: 𝟬𝟲 𝗢𝗰𝘁 𝟮𝟬𝟮𝟱 ✅           │
│ 💖 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘀𝘂𝗽𝗽𝗼𝗿𝘁𝗶𝗻𝗴 𝘁𝗵𝗲 𝗕𝗼𝘁! 💫     │
╰───────────────────────────────╯
`;
        return api.sendMessage(message, event.threadID, event.messageID);
    }
};
