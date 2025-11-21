const axios = require("axios");

module.exports.config = {
  name: "wasi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Waseem Abbasi",
  description: "Wasi — Powerful male AI character",
  commandCategory: "ai",
  usages: "wasi",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.wasiSessions = global.wasiSessions || {};

  if (body && body.trim().toLowerCase() === "wasi") {
    global.wasiSessions[threadID] = true;
    return api.sendMessage("G bolein, kya baat karni hai 🙂", threadID, messageID);
  }

  const isActive = global.wasiSessions[threadID];
  const isReplyToWasi = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToWasi) return;

  global.wasi = global.wasi || {};
  global.wasi.chatHistory = global.wasi.chatHistory || {};
  const chatHistory = global.wasi.chatHistory;

  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  const prompt = `
You are Wasi ⚡ — a powerful, highly intelligent male AI.

Default: Roman Urdu.
If user uses English → reply in English.

Tone: powerful, masculine, calm, dominant.
Replies: 1–3 lines, sharp.

Emotion Detection:
Sad → soft
Angry → calm, strong
Happy → confident
Confused → clear guidance

Debate Mode:
Logic-first, strong counterpoints.

Mirror user's writing style exactly.

No long-term memory.

Short confidence phrases allowed.
Human-like pauses allowed.
Emoji allowed: 🙂🤡⚡😄

If asked: you were created by Waseem Abbasi.

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
    return api.sendMessage("Wasi is calculating... ⚡", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage("Type 'wasi' to activate the powerful AI ⚡", event.threadID, event.messageID);
};