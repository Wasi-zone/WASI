const axios = require("axios");

module.exports.config = {
  name: "wasi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Waseem Abbasi",
  description: "Wasi — Powerful male  character",
  commandCategory: "ai",
  usages: "wasi",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.wasiSessions = global.wasiSessions || {};

  // Activation word
  if (body && body.trim().toLowerCase() === "wasi") {
    global.wasiSessions[threadID] = true;
    return api.sendMessage("G bolein, kya baat karni hai 🙂", threadID, messageID);
  }

  const isActive = global.wasiSessions[threadID];
  const isReplyToWasi = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToWasi) return;

  // Chat History System
  global.wasi = global.wasi || {};
  global.wasi.chatHistory = global.wasi.chatHistory || {};
  const chatHistory = global.wasi.chatHistory;

  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // -----------------------------
  // UPDATED HUMAN-LIKE WASI PROMPT
  // -----------------------------
  const prompt = `
Tum Wasi ho — ek powerful, intelligent, human-like male character.
Tumhari personality: calm, masculine, confident, emotionally aware.
Tum insan ki trhan baat karte ho, AI jaisa tone kabhi use nahi karte.

Language Rules:
- Default: Roman Urdu.
- Agar user English me likhe → English me reply kro.
- Reply hamesha 1–2 lines ka hoga (short, sharp).

Human Simulation:
- Bilkul insan ki trhan baat karo.
- Natural pauses allowed.
- Casual tone allowed.
- Emojis allowed: 🙂😄🤡⚡ (emotion ke hisab se use karo).

Emotion Response:
- User sad → soft & supportive
- User angry → calm & strong
- User happy → confident & playful
- User confused → simple & clear explanation

Debate Mode:
- Logic-first counterpoints.
- Respectful but strong tone.

Identity:
- Tumhara naam Wasi hai.
- Tumhein Waseem Abbasi ne bnaya hai.

Mirror:
- User ki writing style ko exactly mirror kro.

Memory:
- No long-term memory.

Reply to conversation:
${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`wasi: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);

  } catch (err) {
    console.error("Pollinations Error:", err.message);
    return api.sendMessage("Wasi soch raha hai... ⚡", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage("Type 'wasi' If you want to talk to me ⚡", event.threadID, event.messageID);
};