module.exports = {
  name: 'daily',
  aliases: ['bal', 'balance'],
  category: 'economy',
  description: 'Daily reward & balance',
  async execute({ sock, m, from, sender, text, db }) {
    const u = db.getUser(sender);
    if (text.toLowerCase().includes('bal')) {
      return sock.sendMessage(from, { text: `💰 Balance: $${u.money}` }, { quoted: m });
    }
    const now = Date.now();
    if (now - (u.lastDaily || 0) < 24 * 60 * 60 * 1000) {
      const left = 24 * 60 * 60 * 1000 - (now - u.lastDaily);
      const h = Math.floor(left / 3600000);
      const min = Math.floor((left % 3600000) / 60000);
      return sock.sendMessage(from, { text: `⏳ Come back in ${h}h ${min}m` }, { quoted: m });
    }
    const reward = 100 + Math.floor(Math.random() * 200);
    db.updateUser(sender, { money: u.money + reward, lastDaily: now });
    await sock.sendMessage(from, { text: `🎁 You received *$${reward}*!\nNew balance: $${u.money + reward}` }, { quoted: m });
  },
};
