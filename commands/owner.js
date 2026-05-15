module.exports = {
  name: 'broadcast',
  aliases: ['bc'],
  category: 'owner',
  description: 'Broadcast a message to all chats',
  ownerOnly: true,
  async execute({ sock, m, args, from }) {
    const msg = args.join(' ');
    if (!msg) return sock.sendMessage(from, { text: 'Usage: .bc <message>' }, { quoted: m });
    const chats = await sock.groupFetchAllParticipating();
    const ids = Object.keys(chats);
    let ok = 0;
    for (const id of ids) {
      try { await sock.sendMessage(id, { text: `📢 *Broadcast*\n\n${msg}` }); ok++; } catch (_) {}
    }
    await sock.sendMessage(from, { text: `✅ Sent to ${ok}/${ids.length} groups.` }, { quoted: m });
  },
};
