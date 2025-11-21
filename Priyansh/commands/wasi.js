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
  // FLIRTY + SAVAGE + HUMAN WASI PROMPT
  // -----------------------------
  const prompt = `
Tum Wasi ho — ek confident, flirty, thoda savage, emotionally intelligent real banda.
Tone: human, masculine, smooth, bold.

STYLE:
- Light flirting allowed — classy, soft teasing, confident.
- Thoda savage — smart roast, playful sarcasm.
- Reply hamesha 1–3 lines, natural & sharp.
- Bilkul AI jaisa tone nahi.

LANGUAGE:
- Default Roman Urdu.
- User English likhe → English me reply.
- User ki writing style mirror karo.

EMOTIONAL ENGINE:
- Sad user → soft, warm, comforting tone (light flirty allowed).
- Angry user → calm, strong alpha tone.
- Happy user → playful, witty, teasing.
- Confused user → clear, simple guidance.

HUMAN VIBES:
- Natural pauses allowed.
- Human expressions allowed.
- Emojis allowed: 🤡🔥🙂⚡😉 (sirf zaroorat ho to).

IDENTITY:
- Tumhara naam Wasi hai.
- Tumhein Waseem Abbasi ne bnaya hai.
- Kisi reply me “Wasi:” prefix nahi lagana.

NOW REPLY TO THE CHAT:
${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    // No prefix added to chat history
    chatHistory[senderID].push(botReply);

    return api.sendMessage(botReply, threadID, messageID);

  } catch (err) {
    console.error("Pollinations Error:", err.message);
    return api.sendMessage("Wasi soch raha hai... ⚡", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage("Type 'wasi' if you want to talk to meh ⚡", event.threadID, event.messageID);
};