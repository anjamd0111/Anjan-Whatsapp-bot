const axios = require('axios');

module.exports = {
  name: 'tiktok',
  aliases: ['tt'],
  category: 'downloader',
  description: 'TikTok video downloader (no watermark)',
  async execute({ sock, m, args, from }) {
    const url = args[0];
    if (!url) return sock.sendMessage(from, { text: 'Usage: .tiktok <url>' }, { quoted: m });
    try {
      const { data } = await axios.get('https://www.tikwm.com/api/', { params: { url } });
      if (!data?.data?.play) throw new Error('No video found');
      await sock.sendMessage(from, {
        video: { url: data.data.play },
        caption: `🎵 ${data.data.title || 'TikTok'}\n👤 ${data.data.author?.nickname || ''}`,
      }, { quoted: m });
    } catch (e) {
      await sock.sendMessage(from, { text: `Failed: ${e.message}` }, { quoted: m });
    }
  },
};
