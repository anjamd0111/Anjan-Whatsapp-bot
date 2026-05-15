const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  aliases: ['song', 'music'],
  category: 'downloader',
  description: 'Search & send YouTube audio',
  async execute({ sock, m, args, from }) {
    const query = args.join(' ');
    if (!query) return sock.sendMessage(from, { text: 'Usage: .play <song name>' }, { quoted: m });
    const r = await yts(query);
    const v = r.videos?.[0];
    if (!v) return sock.sendMessage(from, { text: 'No results.' }, { quoted: m });

    await sock.sendMessage(from, {
      image: { url: v.thumbnail },
      caption: `🎵 *${v.title}*\n👤 ${v.author.name}\n⏱ ${v.timestamp}\n👁 ${v.views}\n🔗 ${v.url}\n\n_Downloading audio..._`,
    }, { quoted: m });

    const stream = ytdl(v.url, { filter: 'audioonly', quality: 'highestaudio' });
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    const buffer = Buffer.concat(chunks);
    await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mpeg', fileName: `${v.title}.mp3` }, { quoted: m });
  },
};
