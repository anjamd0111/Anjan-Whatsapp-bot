const config = require('../config');
const db = require('../lib/database');

module.exports = async function groupHandler(sock, { id, participants, action }) {
  if (!config.welcome) return;
  const g = db.getGroup(id);
  if (!g.welcome) return;
  try {
    const meta = await sock.groupMetadata(id);
    for (const p of participants) {
      const tag = `@${p.split('@')[0]}`;
      if (action === 'add') {
        await sock.sendMessage(id, { text: `👋 Welcome ${tag} to *${meta.subject}*!\nType ${config.prefix}menu to begin.`, mentions: [p] });
      } else if (action === 'remove') {
        await sock.sendMessage(id, { text: `😢 Goodbye ${tag}, we'll miss you.`, mentions: [p] });
      }
    }
  } catch (_) {}
};
