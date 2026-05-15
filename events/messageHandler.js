const config = require('../config');
const { getCommand, commands } = require('../lib/commandLoader');
const { getText, isOwner, isAdmin } = require('../lib/helpers');
const rateLimit = require('../lib/rateLimit');
const db = require('../lib/database');
const { warn, info, error } = require('../utils/logger');

const LINK_REGEX = /(https?:\/\/|www\.|chat\.whatsapp\.com)/i;
const spamMap = new Map();

module.exports = async function messageHandler(sock, { messages, type }) {
  if (type !== 'notify') return;
  for (const m of messages) {
    if (!m.message || m.key.fromMe) continue;

    const from = m.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? (m.key.participant || m.participant) : from;
    const text = getText(m).trim();
    const lower = text.toLowerCase();

    if (config.autoRead) await sock.readMessages([m.key]).catch(() => {});

    // XP
    db.addXP(sender, 1);

    // Anti-spam (5 msgs in 4s)
    if (config.antiSpam && isGroup) {
      const arr = (spamMap.get(sender) || []).filter((t) => Date.now() - t < 4000);
      arr.push(Date.now());
      spamMap.set(sender, arr);
      if (arr.length > 5) {
        await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} stop spamming!`, mentions: [sender] });
      }
    }

    // Anti-link
    if (config.antiLink && isGroup && LINK_REGEX.test(text)) {
      const g = db.getGroup(from);
      if (g.antiLink && !(await isAdmin(sock, from, sender)) && !isOwner(sender)) {
        await sock.sendMessage(from, { delete: m.key }).catch(() => {});
        await sock.sendMessage(from, { text: `🚫 Links not allowed, @${sender.split('@')[0]}!`, mentions: [sender] });
        continue;
      }
    }

    if (!text.startsWith(config.prefix)) continue;

    const args = text.slice(config.prefix.length).trim().split(/\s+/);
    const name = args.shift().toLowerCase();
    const cmd = getCommand(name);
    if (!cmd) continue;

    if (!rateLimit.check(sender)) {
      await sock.sendMessage(from, { text: '⏳ Slow down! Rate limit reached.' }, { quoted: m });
      continue;
    }

    if (cmd.ownerOnly && !isOwner(sender)) {
      await sock.sendMessage(from, { text: '🔒 Owner only command.' }, { quoted: m });
      continue;
    }
    if (cmd.adminOnly) {
      if (!isGroup) { await sock.sendMessage(from, { text: 'Group only.' }, { quoted: m }); continue; }
      if (!(await isAdmin(sock, from, sender)) && !isOwner(sender)) {
        await sock.sendMessage(from, { text: '👮 Admins only.' }, { quoted: m }); continue;
      }
    }
    if (config.mode === 'private' && !isOwner(sender)) continue;

    if (config.autoTyping) await sock.sendPresenceUpdate('composing', from).catch(() => {});
    if (config.autoReact) await sock.sendMessage(from, { react: { text: '⚡', key: m.key } }).catch(() => {});

    info(`Command: ${name} from ${sender.split('@')[0]}`);
    try {
      await cmd.execute({ sock, m, args, from, sender, isGroup, text, commands, config, db });
    } catch (e) {
      error(`cmd ${name}: ${e.message}`);
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: m });
    }
  }
};
