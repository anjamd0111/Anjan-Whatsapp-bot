const axios = require('axios');

module.exports = {
  name: 'ai',
  aliases: ['gpt', 'chat'],
  category: 'ai',
  description: 'Chat with AI',
  async execute({ sock, m, args, from, config }) {
    const q = args.join(' ');
    if (!q) return sock.sendMessage(from, { text: 'Usage: .ai <question>' }, { quoted: m });
    try {
      const { data } = await axios.get(config.aiApiUrl, { params: { text: q, prompt: q } });
      const ans = data?.result || data?.response || data?.message || JSON.stringify(data).slice(0, 1000);
      await sock.sendMessage(from, { text: `🤖 *AI:*\n${ans}` }, { quoted: m });
    } catch (e) {
      await sock.sendMessage(from, { text: `AI Error: ${e.message}` }, { quoted: m });
    }
  },
};
