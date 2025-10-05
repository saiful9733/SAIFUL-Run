const axios = require("axios");

let simsim = "";

(async () => {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/rummmmna21/rx-api/refs/heads/main/baseApiUrl.json");
    if (res.data && res.data.baby) {
      simsim = res.data.baby;
    }
  } catch {}
})();

module.exports.config = {
  name: "baby",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "rX",
  description: "AI Chatbot with Teach & List support (Boxed Replies)",
  commandCategory: "chat",
  usages: "[query]",
  cooldowns: 0,
  prefix: false
};

// Helper function to create boxed message
function makeBox(senderName, replyText) {
  return `╭──────•◈•──────╮
   🌸 Hᴇʏ Xᴀɴ, I’ᴍ Rᴀᴛʀɪ 🌸   

 ❄ Dᴇᴀʀ, ${senderName}
 
 💌 ${replyText}

╰──────•◈•──────╯`;
}

module.exports.run = async function ({ api, event, args, Users }) {
  const uid = event.senderID;
  const senderName = await Users.getNameUser(uid);
  const query = args.join(" ").toLowerCase();

  try {
    if (!simsim) return api.sendMessage("❌ API not loaded yet.", event.threadID, event.messageID);

    // Autoteach toggle
    if (args[0] === "autoteach") {
      const mode = args[1];
      if (!["on", "off"].includes(mode)) {
        return api.sendMessage("✅ Use: baby autoteach on/off", event.threadID, event.messageID);
      }
      const status = mode === "on";
      await axios.post(`${simsim}/setting`, { autoTeach: status });
      return api.sendMessage(`✅ Auto teach is now ${status ? "ON 🟢" : "OFF 🔴"}`, event.threadID, event.messageID);
    }

    // List command
    if (args[0] === "list") {
      const res = await axios.get(`${simsim}/list`);
      return api.sendMessage(
        `╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬\n├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions}\n├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies}\n╰─╼👤 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫: 𝐫𝐗 𝐀𝐛𝐝𝐮𝐥𝐥𝐚𝐡`,
        event.threadID,
        event.messageID
      );
    }

    // Msg command
    if (args[0] === "msg") {
      const trigger = args.slice(1).join(" ").trim();
      if (!trigger) return api.sendMessage("❌ | Use: !baby msg [trigger]", event.threadID, event.messageID);

      const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`);
      if (!res.data.replies || res.data.replies.length === 0) {
        return api.sendMessage("❌ No replies found.", event.threadID, event.messageID);
      }

      const formatted = res.data.replies.map((rep, i) => `➤ ${i + 1}. ${rep}`).join("\n");
      const msg = `📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}\n📋 𝗧𝗼𝘁𝗮𝗹: ${res.data.total}\n━━━━━━━━━━━━━━\n${formatted}`;
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    // Teach command
    if (args[0] === "teach") {
      const parts = query.replace("teach ", "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: teach [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`);
      return api.sendMessage(`✅ ${res.data.message}`, event.threadID, event.messageID);
    }

    // Edit command
    if (args[0] === "edit") {
      const parts = query.replace("edit ", "").split(" - ");
      if (parts.length < 3)
        return api.sendMessage("❌ | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);

      const [ask, oldR, newR] = parts;
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // Remove command
    if (["remove", "rm"].includes(args[0])) {
      const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: remove [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // Normal query / empty query
    if (!query) {
      const texts = ["Hey baby 💖", "Yes, I'm here 😘"];
      const randReply = texts[Math.floor(Math.random() * texts.length)];
      const message = makeBox(senderName, randReply);
      return api.sendMessage(message, event.threadID);
    }

    // AI response
    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
    const responseText = Array.isArray(res.data.response) ? res.data.response[0] : res.data.response;
    const message = makeBox(senderName, responseText);
    return api.sendMessage(message, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    }, event.messageID);

  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users }) {
  const senderName = await Users.getNameUser(event.senderID);
  const text = event.body?.toLowerCase();
  if (!text || !simsim) return;

  try {
    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`);
    const responseText = Array.isArray(res.data.response) ? res.data.response[0] : res.data.response;
    const message = makeBox(senderName, responseText);
    return api.sendMessage(message, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    }, event.messageID);
  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const text = event.body?.toLowerCase().trim();
  if (!text || !simsim) return;

  const senderName = await Users.getNameUser(event.senderID);

  // Trigger words for casual reply
  const triggers = ["বেবি ", "janu", "xan", "বাবু", "জান", "Baby","baby","bby","Babu"," babu];
  if (triggers.includes(text)) {
    const replies = [
      "𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐰𝐚𝐥𝐚𝐢𝐤𝐮𝐦 ♥",
      "বেশি Baby Baby করলে leave নিবো কিন্তু😒",
    "🥛-🍍👈 -লে খাহ্..!😒",
    "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺",
    "আমি আবাল দের সাথে কথা বলি না😒",
    "এতো ডেকো না, প্রেমে পরে যাবো 🙈",
    "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️",
    "বার বার ডাকলে মাথা গরম হয়ে যায়😑",
    "হ্যা বলো😒, তোমার জন্য কি করতে পারি?",
    "এতো ডাকছিস কেন? গালি শুনবি নাকি? 🤬",
    "কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻",
    "Baby বলে অসম্মান করছো😿",
    "Hop beda😾, Boss বল Boss😼",
    "চুপ থাক, না হলে দাত ভেঙে দিবো",
    "Baby না, জানু বল জানু 😘",
    "বার বার Disturb করিস না, আমি ব্যাস্ত আছি",
    "𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭",
    "আমাকে বেশি ডাকিস না, মুডে নাই😒",
    "হ্যাঁ জানু, এইদিকে আসো কিস দেই🤭",
    "দূরে যা, শুধু Baby Baby করিস 🤣",
    "তোর কথা তোর বাড়ি কেউ শুনে না, আমি কেন শুনবো? 😂",
    "আমাকে ডেকো না, আমি ব্যাস্ত আছি",
    "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭",
    "কালকে দেখা করিস তো 😈",
    "হা বলো, শুনছি আমি 😏",
    "আর কত বার ডাকবি, শুনছি তো",
    "হুম বলো কি বলবে😒",
    "বলো কি করতে পারি তোমার জন্য",
    "আমি তো অন্ধ, কিছু দেখি না 😎",
    "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",
    "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
    "হুম জান, তোমার ওইখানে উম্মাহ😘",
    "আসসালামু আলাইকুম, আপনার জন্য কি করতে পারি?🥰",
    "আমাকে এতো ডাকছ কেন, ভালোবাসো নাকি?🙈",
    "🌻🌺💚 আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ 💚🌺🌻",
    "উফফ বুঝলাম না এতো ডাকছেন কেনো 😡",
    "আজকে আমার মন ভালো নেই, ডাকবেন না 😪",
    "ইসস এতো ডাকো কেনো, লজ্জা লাগে 🙈",
    "ভালোবাসা করতে চাইলে ইনবক্সে যাও 🌻",
    "জান তুমি শুধু আমার, আমি তোমাকে ৩৬৫ দিন ভালোবাসি 💝",
    "জান, বাল ফালাইবা না 🙂🥱",
    "কি রে গ্রুপে দেখি একটাও বেডি নাই 🤦",
    "🫵 তোমাকে প্রচুর ভাল্লাগে, সময় মতো প্রপোজ করমু 😼",
    "দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাচ্ছি 😿",
    "আমি একটা দুধের শিশু 😇",
    "একদিন সে ঠিকই ফিরে তাকাবে আর বলবে – ওর মতো কেউ ভালবাসেনি 🙂",
    "অবহেলা করিস না, আমি বদলে গেলে কষ্ট পাবি 😔",
    "প্রিয়, তোমাকে না পেলে আমি আরেকজনকে পটাবো 😼",
    "তুমি জানো? আমি সারাদিন শুধু তোমার কথাই ভাবি💭",
    "তুমি কথা না বললে আমার মন খারাপ হয়ে যায়😔",
    "তোমার হাসিটা আজ দেখার খুব ইচ্ছে করছে💖",
    "𝗧𝗼𝗿 𝗡𝗮𝗻𝗶𝗿 𝗨𝗜𝗗 𝗱𝗲 𝗖𝘂𝘀𝘁𝗼𝗺 𝗞𝗵𝗲𝗹𝗲 𝗱𝗲𝗸𝗵𝗮𝘆 𝗱𝗶 – 𝗔𝗺𝗶 𝗕𝗮𝗯𝘆 𝗻𝗮𝗸𝗶 𝗣𝗿𝗼? 😏",
    "আজকে খুব একা লাগছে, তুমি পাশে থাকলে ভালো হতো🥺",
    "তোমাকে ছাড়া বেঁচে থাকা অসম্ভব মনে হয়🙈",
    "তুমি কি জানো? আমি কিন্তু তোমায় Miss করি...💌",
    "আমার মনে হয়, তুমি আমার জন্যই পৃথিবীতে আসছো... 💘"
    ];

    const randReply = replies[Math.floor(Math.random() * replies.length)];
    const message = makeBox(senderName, randReply);

    return api.sendMessage(message, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    });
  }

  const matchPrefix = /^(bebe|janu|xan|bbz|mari|arshi)\s+/i;
  if (matchPrefix.test(text)) {
    const query = text.replace(matchPrefix, "").trim();
    if (!query) return;

    try {
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      const responseText = Array.isArray(res.data.response) ? res.data.response[0] : res.data.response;
      const message = makeBox(senderName, responseText);

      return api.sendMessage(message, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    } catch (e) {
      return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
    }
  }

  // Auto-teach reply
  if (event.type === "message_reply") {
    try {
      const setting = await axios.get(`${simsim}/setting`);
      if (!setting.data.autoTeach) return;

      const ask = event.messageReply.body?.toLowerCase().trim();
      const ans = event.body?.toLowerCase().trim();
      if (!ask || !ans || ask === ans) return;

      setTimeout(async () => {
        try {
          await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`);
          console.log("✅ Auto-taught:", ask, "→", ans);
        } catch (err) {
          console.error("❌ Auto-teach internal error:", err.message);
        }
      }, 300);
    } catch (e) {
      console.log("❌ Auto-teach setting error:", e.message);
    }
  }
};
