// namaz.js
// Auto Namaz notification in ALL groups (Manual time version)
// File: modules/commands/namaz.js

const schedule = require("node-schedule");

module.exports.config = {
  name: "namaz",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Akash + Saiful Edit",
  description: "প্রতিদিন নামাজের সময় সব গ্রুপে অটো নোটিফিকেশন পাঠাবে",
  commandCategory: "Islamic",
  usages: "অটো রান",
  cooldowns: 5
};

let jobs = [];

module.exports.onLoad = async function({ api }) {
  // নামাজ টাইম (বাংলাদেশ স্ট্যান্ডার্ড টাইম)
  const prayerTimes = {
    "ফজর": { time: "04:42", msg: 
`╔═❖🌅❖═╗
🕌 ফজর নামাজ
╚═❖🌅❖═╝
⏰ সময় শেষ হতে চলেছে! ফজরের নামাজের জন্য প্রস্তুত হোন।
👑𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➠ 𝐒𝐀𝐈𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "যোহর": { time: "13:28", msg: 
`╔═❖☀️❖═╗
🕌 যোহর নামাজ
╚═❖☀️❖═╝
⏰ সময় শেষ হতে চলেছে! জোহরের  নামাজের জন্য প্রস্তুত হোন।
👑𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➠ 𝐒𝐀𝐈𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "আসর": { time: "16:21", msg: 
`╔═❖🌇❖═╗
🕌 আসর নামাজ
╚═❖🌇❖═╝
⏰ সময় শেষ হতে চলেছে! আসরের  নামাজের জন্য প্রস্তুত হোন।
👑𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➠ 𝐒𝐀𝐈𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "মাগরিব": { time: "17:51", msg: 
`╔═❖🌙❖═╗
🕌 মাগরিব নামাজ
╚═❖🌙❖═╝
⏰ সময় শেষ হতে চলেছে! মাগরিবের  নামাজের জন্য প্রস্তুত হোন।
👑𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➠ 𝐒𝐀𝐈𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "ইশা": { time: "19:24", msg: 
`╔═❖🌌❖═╗
🕌 ইশা নামাজ
╚═❖🌌❖═╝
⏰ সময় শেষ হতে চলেছে! ইশার নামাজের জন্য প্রস্তুত হোন।
👑𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➠ 𝐒𝐀𝐈𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` }
  };

  // প্রতিদিনের ওয়াক্ত
  for (let [prayer, { time, msg }] of Object.entries(prayerTimes)) {
    const [hour, minute] = time.split(":").map(Number);

    const job = schedule.scheduleJob({ hour, minute, tz: "Asia/Dhaka" }, function () {
      const today = new Date();
      const day = today.getDay(); // Sunday = 0 ... Friday = 5

      // শুক্রবার হলে যোহর স্কিপ হবে
      if (day === 5 && prayer === "যোহর") return;

      for (const threadID of global.data.allThreadID) {
        api.sendMessage(msg, threadID);
      }
    });

    jobs.push(job);
  }

  // জুমার নামাজ (শুধু শুক্রবার 13:28 এ)
  const jumuahJob = schedule.scheduleJob({ dayOfWeek: 5, hour: 12, minute: 45, tz: "Asia/Dhaka" }, function () {
    const jumuahMsg = 
`╔═❖🕌❖═╗
✨ জুমার নামাজ ✨
╚═❖🕌❖═╝
✨ মাত্র কয়েক মুহূর্ত বাকি… এখনি নত হই জুমার নামাজে।
👑𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➠ 𝐒𝐀𝐈𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟`;

    for (const threadID of global.data.allThreadID) {
      api.sendMessage(jumuahMsg, threadID);
    }
  });

  jobs.push(jumuahJob);

  console.log("✅ নামাজ নোটিফিকেশন সিস্টেম চালু হয়েছে (৫ ওয়াক্ত + জুমা)।");
};

module.exports.run = async function() {
  // কোনো কমান্ড দরকার নেই, অটো চলবে
};
