const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const config = require('../config');

module.exports = {
  name: 'sticker',
  aliases: ['s', 'stiker'],
  category: 'converter',
  description: 'Convert image/video to sticker',
  async execute({ sock, m, from }) {
    const quoted = m.message?.imageMessage || m.message?.videoMessage
      || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
      || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;
    if (!quoted) return sock.sendMessage(from, { text: '📸 Reply to or send an image/video.' }, { quoted: m });

    const targetMsg = m.message?.imageMessage || m.message?.videoMessage
      ? m
      : { message: m.message.extendedTextMessage.contextInfo.quotedMessage };

    const buffer = await downloadMediaMessage(targetMsg, 'buffer', {});
    const sticker = new Sticker(buffer, {
      pack: config.botName,
      author: config.ownerName,
      type: StickerTypes.FULL,
      quality: 70,
    });
    const out = await sticker.toBuffer();
    await sock.sendMessage(from, { sticker: out }, { quoted: m });
  },
};
