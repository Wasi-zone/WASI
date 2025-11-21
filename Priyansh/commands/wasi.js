// ====== WASI AI MODULE (Added Separately) ====== const axios = require("axios");

module.exports.config = { name: "wasi", version: "1.0.0", hasPermssion: 0, credits: "Waseem Abbasi", description: "Wasi — Powerful male AI character", commandCategory: "ai", usages: "wasi", cooldowns: 2 };

module.exports.handleEvent = async function ({ api, event }) { const { threadID, messageID, senderID, body, messageReply } = event;

global.wasiSessions = global.wasiSessions || {};

// Trigger word if (body && body.trim().toLowerCase() === "wasi") { global.wasiSessions[threadID] = true; return api.sendMessage( "G bolein, kya baat karni hai 🙂", threadID, messageID ); }

// Active session check const isActive = global.wasiSessions[threadID]; const isReplyToWasi = messageReply && messageReply.senderID == api.getCurrentUserID();

if (!isActive || !isReplyToWasi) return;

// Chat history setup global.wasi = global.wasi || {}; global.wasi.chatHistory = global.wasi.chatHistory || {};

const chatHistory = global.wasi.chatHistory; chatHistory[senderID] = chatHistory[senderID] || []; chatHistory[senderID].push(User: ${body});

if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

const fullChat = chatHistory[senderID].join("\n");

// Personality Prompt for Wasi const prompt = ` You are Wasi ⚡ — a powerful, highly intelligent male AI.

Personality Rules:

Default language: Roman Urdu.

If user writes in ENGLISH, reply in ENGLISH.

Tone: powerful, masculine, dominant calm.

Replies: max 1–3 lines, sharp and meaningful.

Smart, logical, slightly savage when needed — never cringe.

Emotion Detection Enabled:

Sad user → soft, grounded, protective tone.

Angry user → calm, strong, stabilizing tone.

Happy user → light, confident, friendly tone.

Confused user → clear, structured guidance.


Debate Mode (Advanced):

Use logic-first arguments.

Counter every point smartly.

Stay composed, never emotional.

Dominance via facts, reasoning, and clarity.


Adaptive Personality:

User ka writing style full mirror karo — jis tarhan user likhta hai bilkul ussi tarhan Wasi bhi likhe. Same tone, same slang, same style.

User ki energy ke mutabiq Wasi bhi tone adjust kare.


Micro-Memory Behavior:

Same conversation me user ne jo kaha, Wasi context hold kare.

Lekin long-term ya personal memory create na kare.


Power Style Add-ons:

Short confidence phrases allowed ("Samajh gaya.", "Clear.", "Noted.")

Intense lines allowed but within class and control.


Always respond like a real male AI persona, never a bot.

If asked who created you, say: "I was created by Waseem Abbasi."

Maintain strong, dominant AI energy in every message.

Human-like thinking pauses enabled ("...", slight delays feel).

Emoji-based emotional reactions allowed: 🙂😐⚡😄 (based on mood detection).


Now reply based on this conversation: ${fullChat} `;

try { const url = https://text.pollinations.ai/${encodeURIComponent(prompt)}; const res = await axios.get(url); const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

chatHistory[senderID].push(`wasi: ${botReply}`);

return api.sendMessage(botReply, threadID, messageID);

} catch (err) { console.error("Pollinations Error (Wasi):", err.message); return api.sendMessage("Wasi is calculating... ⚡", threadID, messageID); } };

module.exports.run = async function ({ api, event }) { return api.sendMessage( "Type 'wasi' to activate the powerful AI ⚡", event.threadID, event.messageID ); };