module.exports = {
  name: 'setting',
  aliases: ['settings', 'set'],
  category: 'owner',
  description: 'Toggle bot settings: autoread, autotype, autoreact, antilink, antispam, mode',
  ownerOnly: true,
  async execute({ sock, m, args, from, config }) {
    const [key, value] = args;
    if (!key) return sock.sendMessage(from, {
      text: `⚙️ *Settings*\n• mode: ${config.mode}\n• autoRead: ${config.autoRead}\n• autoTyping: ${config.autoTyping}\n• autoReact: ${config.autoReact}\n• antiLink: ${config.antiLink}\n• antiSpam: ${config.antiSpam}\n\nUsage: .set <key> <on|off|public|private>`,
    }, { quoted: m });
    const v = (value || '').toLowerCase();
    const bool = v === 'on' || v === 'true';
    switch (key.toLowerCase()) {
      case 'mode': config.mode = v === 'private' ? 'private' : 'public'; break;
      case 'autoread': config.autoRead = bool; break;
      case 'autotype': case 'autotyping': config.autoTyping = bool; break;
      case 'autoreact': config.autoReact = bool; break;
      case 'antilink': config.antiLink = bool; break;
      case 'antispam': config.antiSpam = bool; break;
      default: return sock.sendMessage(from, { text: 'Unknown setting.' }, { quoted: m });
    }
    await sock.sendMessage(from, { text: `✅ Updated *${key}* → ${value}` }, { quoted: m });
  },
};
