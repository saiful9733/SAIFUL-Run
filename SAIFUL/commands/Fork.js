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
📌 *𝐂𝐇𝐀𝐓-𝐁𝐎𝐓-𝐀𝐊𝐀𝐒𝐇 𝐕1*

•𝐑𝐞𝐩𝐨𝐬𝐢𝐭𝐨𝐫𝐲 𝐋𝐢𝐧𝐤:*  
https://github.com/saiful0144/SAIFUL-BOT-V1.git

কোনো সমস্যা বা প্রশ্ন থাকলে যোগাযোগ করুন:  
Messenger:https://www.facebook.com/profile.php?id=61577052283173

─────────────────
Thank you for supporting the Bot!
─────────────────
`;
        return api.sendMessage(message, event.threadID, event.messageID);
    }
};
