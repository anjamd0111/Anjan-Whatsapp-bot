module.exports = {
  name: 'group',
  aliases: ['gc'],
  category: 'group',
  description: 'Group admin tools: open/close/kick/promote/demote/tagall',
  adminOnly: true,
  async execute({ sock, m, args, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: 'Group only.' }, { quoted: m });
    const sub = (args[0] || '').toLowerCase();
    const target = (m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])[0]
      || (m.message?.extendedTextMessage?.contextInfo?.participant);

    switch (sub) {
      case 'open':  return sock.groupSettingUpdate(from, 'not_announcement');
      case 'close': return sock.groupSettingUpdate(from, 'announcement');
      case 'kick':
        if (!target) return sock.sendMessage(from, { text: 'Mention or reply to a user.' }, { quoted: m });
        return sock.groupParticipantsUpdate(from, [target], 'remove');
      case 'promote':
        if (!target) return sock.sendMessage(from, { text: 'Mention a user.' }, { quoted: m });
        return sock.groupParticipantsUpdate(from, [target], 'promote');
      case 'demote':
        if (!target) return sock.sendMessage(from, { text: 'Mention a user.' }, { quoted: m });
        return sock.groupParticipantsUpdate(from, [target], 'demote');
      case 'tagall': {
        const meta = await sock.groupMetadata(from);
        const mentions = meta.participants.map((p) => p.id);
        const text = `📢 *Tag All*\n` + mentions.map((j) => `• @${j.split('@')[0]}`).join('\n');
        return sock.sendMessage(from, { text, mentions });
      }
      default:
        return sock.sendMessage(from, { text: 'Usage: .group <open|close|kick|promote|demote|tagall>' }, { quoted: m });
    }
  },
};
