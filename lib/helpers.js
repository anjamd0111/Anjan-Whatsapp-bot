const config = require('../config');

function getText(m) {
  const msg = m.message || {};
  return (
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    ''
  );
}

function isOwner(jid) {
  const num = (jid || '').split('@')[0].split(':')[0];
  return num === config.ownerNumber.replace(/[^0-9]/g, '');
}

async function isAdmin(sock, groupJid, userJid) {
  try {
    const meta = await sock.groupMetadata(groupJid);
    const p = meta.participants.find((x) => x.id === userJid);
    return p && (p.admin === 'admin' || p.admin === 'superadmin');
  } catch { return false; }
}

function uptime(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = { getText, isOwner, isAdmin, uptime, sleep };
