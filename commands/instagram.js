const axios = require('axios');

module.exports = {
  name: 'instagram',
  aliases: ['ig', 'insta'],
  category: 'downloader',
  description: 'Instagram media downloader',
  async execute({ sock, m, args, from }) {
    const url = args[0];
    if (!url) return sock.sendMessage(from, { text: 'Usage: .ig <post-url>' }, { quoted: m });
    try {
      const { data } = await axios.get(`https://api.dreaded.site/api/igdl?url=${encodeURIComponent(url)}`);
      const items = data?.result || data?.data || [];
      if (!items.length) throw new Error('Nothing to download');
      for (const it of items.slice(0, 5)) {
        const link = it.url || it.download || it;
        if (typeof link !== 'string') continue;
        await sock.sendMessage(from, { video: { url: link }, caption: '📸 Instagram' }, { quoted: m });
      }
    } catch (e) {
      await sock.sendMessage(from, { text: `Failed: ${e.message}` }, { quoted: m });
    }
  },
};
