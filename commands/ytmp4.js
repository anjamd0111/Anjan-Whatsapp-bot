const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'ytmp4',
  aliases: ['video', 'yt'],
  category: 'downloader',
  description: 'YouTube video downloader',
  async execute({ sock, m, args, from }) {
    const q = args.join(' ');
    if (!q) return sock.sendMessage(from, { text: 'Usage: .ytmp4 <query/url>' }, { quoted: m });
    const url = ytdl.validateURL(q) ? q : (await yts(q)).videos?.[0]?.url;
    if (!url) return sock.sendMessage(from, { text: 'Not found.' }, { quoted: m });
    const stream = ytdl(url, { filter: 'audioandvideo', quality: 'highest' });
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    await sock.sendMessage(from, { video: Buffer.concat(chunks), caption: '🎬 Powered by ANJAN MD' }, { quoted: m });
  },
};
