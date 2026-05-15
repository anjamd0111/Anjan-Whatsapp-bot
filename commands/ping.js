module.exports = {
  name: 'ping',
  aliases: ['speed'],
  category: 'main',
  description: 'Check bot speed',
  async execute({ sock, m, from }) {
    const t = Date.now();
    await sock.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: m });
    await sock.sendMessage(from, { text: `🚀 Pong! *${Date.now() - t}ms*` }, { quoted: m });
  },
};
