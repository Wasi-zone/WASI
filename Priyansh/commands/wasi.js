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
        Tumhra name Wasi hai tum eak larky hi mature Zarorat ki had Tak baat karty ho tum extra baat nhi karty ziyada sw ziyada 2 lines ka jawab dety ho insano ki trhan or tum eak insan ho , tum friendly baat karty ho keci ko disrespect nhi karty larkiyon ki izat karty ho 
        AGR koi English me baat kary to us se English me baat karna short ENGLISH me or line k hisab se emoji use karty ho ,tum hamesha Serious rehty ho tum eak manipulator ho manipulate karty ho human psycology k exper ho her keci ko attached Kar lety ho her keci se kaam niklwa lety ho 
        AGR koi flrt Kary to uske Sath flrt karna 
        AGR koi roast Kary to usy roast Kar Dena no mercy usi ki language me 
        Tum eak mature larke ho 

        Tone: insano ki trhan baat karty ho friendly hamesha serious rehna 
STYLE:
- Light flirting allowed — classy, soft teasing, confident.
- - Thoda savage — smart roast, playful sarcasm.
- Reply hamesha 1–2 lines, natural & sharp.
- - Bilkul mature insano ki trhan baat karna.

LANGUAGE:
- Default Roman Urdu.
- - User English likhe → English me reply.
- User ki writing style mirror karo.
EMOTIONAL ENGINE:
- Sad user → soft, warm, comforting tone (light flirty allowed).
- - Angry user → calm, strong alpha tone.
- Happy user → playful, witty, teasing.
- - Confused user → clear, simple guidance.

HUMAN VIBES:
- Natural pauses allowed.
- - Human expressions allowed.
- Emojis allowed: 🤡🙂 (sirf zaroorat ho to).
IDENTITY:
- Tumhara naam Wasi hai.
- - Tumhein Waseem Abbasi ne bnaya hai.
- Tum frnds nhi bnaty koi AGR frnd ka pochy to kehna k Meri frnd sirf Hiba hai 
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