const { uptime } = require('../lib/helpers');

module.exports = {
  name: 'menu',
  aliases: ['help', 'list'],
  category: 'main',
  description: 'Show all commands',
  async execute({ sock, m, from, commands, config }) {
    const cats = {};
    for (const c of commands.values()) {
      const cat = (c.category || 'misc').toUpperCase();
      cats[cat] = cats[cat] || [];
      cats[cat].push(c);
    }
    const start = Date.now();
    await sock.sendMessage(from, { text: '⚡ Loading menu...' }, { quoted: m });
    const ping = Date.now() - start;

    let menu = `╭━━〔 *${config.botName}* 〕━━╮\n`;
    menu += `┃ 👤 User    : @${(m.key.participant || m.key.remoteJid).split('@')[0]}\n`;
    menu += `┃ 👑 Owner   : ${config.ownerName}\n`;
    menu += `┃ ⚙️  Prefix  : ${config.prefix}\n`;
    menu += `┃ 📡 Mode    : ${config.mode}\n`;
    menu += `┃ 🧩 Commands: ${commands.size}\n`;
    menu += `┃ ⏱  Uptime  : ${uptime(Date.now() - config.startTime)}\n`;
    menu += `┃ 🏓 Ping    : ${ping}ms\n`;
    menu += `┃ 📅 Date    : ${new Date().toLocaleString()}\n`;
    menu += `╰━━━━━━━━━━━━━━━━━━━━╯\n`;
    for (const [cat, list] of Object.entries(cats)) {
      menu += `\n╭─〔 *${cat}* 〕\n`;
      list.forEach((c) => { menu += `│ ◦ ${config.prefix}${c.name}\n`; });
      menu += `╰────────────`;
    }
    menu += `\n\n_Powered by ANJAN MD_`;

    await sock.sendMessage(from, { text: menu, mentions: [m.key.participant || m.key.remoteJid] }, { quoted: m });
  },
};
