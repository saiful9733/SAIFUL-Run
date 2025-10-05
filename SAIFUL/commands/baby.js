const axios = require("axios");

const simsim = "https://simsimi.cyberbot.top";

module.exports.config = {
name: "baby",
version: "1.0.6",
hasPermssion: 0,
credits: "ULLASH + Edited by Saiful",
description: "Cute AI Baby Chatbot | Box-styled replies",
commandCategory: "simsim",
usages: "[message/query]",
cooldowns: 0,
prefix: false
};

function makeBox(headerName, innerLine1, innerLine2) {
return `╭──────•◈•──────╮
${headerName}

${innerLine1}
${innerLine2}

╰──────•◈•──────╯`;
}

module.exports.run = async function ({ api, event, args, Users }) {
try {
const uid = event.senderID;
const senderName = await Users.getNameUser(uid);
const query = args.join(" ").trim();

// যদি কোনো query না দিয়ে শুধু command দেয়  
if (!query) {  
  // fixed boxed reply when no query provided  
  const boxed = makeBox(  
    "Hᴇʏ Xᴀɴ I’ᴍ Bᴀʙʏ✨   ",  
    "❄ Dᴇᴀʀ, ${senderName}",  
    "💌 শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺"  
  );  
  return api.sendMessage(boxed, event.threadID, event.messageID);  
}  

// যদি teach/remove/edit/list commands দিলে তখন আগের মত handle করবো  
const key = args[0].toLowerCase();  
if (["remove", "rm"].includes(key)) {  
  const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");  
  if (parts.length < 2)  
    return api.sendMessage(" | Use: remove [Question] - [Reply]", event.threadID, event.messageID);  
  const [ask, ans] = parts;  
  const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);  
  return api.sendMessage(res.data.message, event.threadID, event.messageID);  
}  

if (key === "list") {  
  const res = await axios.get(`${simsim}/list`);  
  if (res.data && res.data.code === 200) {  
    return api.sendMessage(  
      `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\n☠︎︎ Developer: ${res.data.author}`,  
      event.threadID,  
      event.messageID  
    );  
  } else {  
    return api.sendMessage(`Error: ${res.data?.message || "Failed to fetch list"}`, event.threadID, event.messageID);  
  }  
}  

if (key === "edit") {  
  const parts = query.replace("edit ", "").split(" - ");  
  if (parts.length < 3)  
    return api.sendMessage(" | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);  
  const [ask, oldReply, newReply] = parts;  
  const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);  
  return api.sendMessage(res.data.message, event.threadID, event.messageID);  
}  

if (key === "teach") {  
  const parts = query.replace("teach ", "").split(" - ");  
  if (parts.length < 2)  
    return api.sendMessage(" | Use: teach [Question] - [Reply]", event.threadID, event.messageID);  
  const [ask, ans] = parts;  
  const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`);  
  return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);  
}  

// normal simsim query -> wrap response(s) in box  
const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);  
const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];  
  
for (const reply of responses) {  
  const boxed = makeBox(  
    "Hᴇʏ Xᴀɴ I’ᴍ Bᴀʙʏ✨   ",  
    `❄ Dᴇᴀʀ ${senderName}`,  
    `💌 ${reply}`  
  );  
  await new Promise((resolve) => {  
    api.sendMessage(boxed, event.threadID, (err, info) => {  
      if (!err) {  
        global.client.handleReply.push({  
          name: module.exports.config.name,  
          messageID: info.messageID,  
          author: event.senderID,  
          type: "simsimi"  
        });  
      }  
      resolve();  
    }, event.messageID);  
  });  
}

} catch (err) {
console.error(err);
return api.sendMessage(| Error in baby command: ${err.message}, event.threadID, event.messageID);
}
};

module.exports.handleReply = async function ({ api, event, Users }) {
try {
const senderName = await Users.getNameUser(event.senderID);
const replyText = event.body ? event.body.trim() : "";
if (!replyText) return;

const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);  
const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];  
  
for (const reply of responses) {  
  const boxed = makeBox(  
    "Hᴇʏ Xᴀɴ I’ᴍ Bᴀʙʏ✨   ",  
    `❄ Dᴇᴀʀ ${senderName}`,  
    `💌 ${reply}`  
  );  
  await new Promise((resolve) => {  
    api.sendMessage(boxed, event.threadID, (err, info) => {  
      if (!err) {  
        global.client.handleReply.push({  
          name: module.exports.config.name,  
          messageID: info.messageID,  
          author: event.senderID,  
          type: "simsimi"  
        });  
      }  
      resolve();  
    }, event.messageID);  
  });  
}

} catch (err) {
console.error(err);
return api.sendMessage( | Error in handleReply: ${err.message}, event.threadID, event.messageID);
}
};

module.exports.handleEvent = async function ({ api, event, Users }) {
try {
const raw = event.body ? event.body.toLowerCase().trim() : "";
if (!raw) return;

const senderName = await Users.getNameUser(event.senderID);  
const senderID = event.senderID;  

// random/fun list (used when user only calls baby/bot)  
const greetings = [  
  "𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐰𝐚𝐥𝐚𝐢𝐤𝐮𝐦 ♥",  
  "বলেন sir__😌",  
  "𝐁𝐨𝐥𝐨 𝐣𝐚𝐧 𝐤𝐢 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐧𝐧𝐦 𝐭𝐦𝐫 𝐣𝐨𝐧𝐧𝐨 🐸",  
  "𝐋𝐞𝐛𝐮 𝐤𝐡𝐚𝐰 𝐝𝐚𝐤𝐭𝐞 𝐝𝐚𝐤𝐭𝐞 𝐭𝐨 𝐡𝐚𝐩𝐚𝐲 𝐠𝐞𝐬𝐨",  
  "𝐆𝐚𝐧𝐣𝐚 𝐤𝐡𝐚 𝐦𝐚𝐧𝐮𝐬𝐡 𝐡𝐨 🍁",  
  "𝐋𝐞𝐦𝐨𝐧 𝐭𝐮𝐬 🍋",  
  "মুড়ি খাও 🫥",  
  ".__𝐚𝐦𝐤𝐞 𝐬𝐞𝐫𝐞 𝐝𝐞𝐰 𝐚𝐦𝐢 𝐚𝐦𝐦𝐮𝐫 𝐤𝐚𝐬𝐞 𝐣𝐚𝐛𝐨!!🥺.....😗",  
  "লুঙ্গি টা ধর মুতে আসি🙊🙉",  
  "──‎ 𝐇𝐮𝐌..? 👉👈",  
  "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🐸",  
  "কি হলো, মিস টিস করচ্ছো নাকি 🤣",  
  "𝐓𝐫𝐮𝐬𝐭 𝐦𝐞 𝐢𝐚𝐦 𝐦𝐚𝐫𝐢𝐚 🧃",  
  "𝐇ᴇʏ 𝐗ᴀɴ 𝐈’ᴍ 𝐌ᴀʀɪ𝐚 𝐁ᴀʙʏ✨"  
];  

// যদি শুধু baby/bot ডাকে  
if (  
  raw === "baby" || raw === "bot" || raw === "bby" ||  
  raw === "jannu" || raw === "xan" || raw === "বেপি" || raw === "বট" || raw === "বেবি"  
) {  
  const randomReply = greetings[Math.floor(Math.random() * greetings.length)];  
  const boxed = `
╭──────•◈•──────╮ 
  Hᴇʏ Xᴀɴ I’ᴍ Bᴀʙʏ✨
❄ Dᴇᴀʀ, ${senderName}
💌 ${randomReply}
╰──────•◈•──────╯;   const mention = {   body: @${senderName} ${boxed},   mentions: [{ tag: @${senderName}`, id: senderID }]
};
return api.sendMessage(mention, event.threadID, (err, info) => {
if (!err) {
global.client.handleReply.push({
name: module.exports.config.name,
messageID: info.messageID,
author: event.senderID,
type: "simsimi"
});
}
}, event.messageID);
}

// যদি baby <query> টাইপ করে থাকে  
if (  
  raw.startsWith("baby ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||  
  raw.startsWith("jannu ") || raw.startsWith("xan ") ||  
  raw.startsWith("বেপি ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")  
) {  
  const query = raw  
    .replace(/^baby\s+|^bot\s+|^bby\s+|^jannu\s+|^xan\s+|^বেপি\s+|^বট\s+|^বেবি\s+/i, "")  
    .trim();  
  if (!query) return;  

  const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);  
  const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];  
    
  for (const reply of responses) {  
    const boxed = `╭──────•◈•──────╮

Hᴇʏ Xᴀɴ I’ᴍ Bᴀʙʏ✨

❄ Dᴇᴀʀ ${senderName}
💌 ${reply}

╰──────•◈•──────╯;   await new Promise((resolve) => {   api.sendMessage(boxed, event.threadID, (err, info) => {   if (!err) {   global.client.handleReply.push({   name: module.exports.config.name,   messageID: info.messageID,   author: event.senderID,   type: "simsimi"   });   }   resolve();   }, event.messageID);   });   }   }   } catch (err) {   console.error(err);   return api.sendMessage(| Error in handleEvent: ${err.message}`, event.threadID, event.messageID);
}
}; এটা কি ভাবে রিপ্লাই দিবে
