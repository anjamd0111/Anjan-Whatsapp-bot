module.exports = {
  name: 'rank',
  aliases: ['level', 'xp'],
  category: 'economy',
  description: 'Check your XP & level',
  async execute({ sock, m, from, sender, db }) {
    const u = db.getUser(sender);
    await sock.sendMessage(from, {
      text: `🏆 *Your Rank*\n👤 @${sender.split('@')[0]}\n⭐ Level: ${u.level}\n✨ XP: ${u.xp}/${u.level * 100}\n💰 Balance: $${u.money}`,
      mentions: [sender],
    }, { quoted: m });
  },
};
