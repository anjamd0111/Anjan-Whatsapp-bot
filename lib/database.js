const fs = require('fs-extra');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'database');
fs.ensureDirSync(DB_DIR);

function file(name) {
  return path.join(DB_DIR, `${name}.json`);
}

function read(name, fallback = {}) {
  const f = file(name);
  if (!fs.existsSync(f)) fs.writeJsonSync(f, fallback, { spaces: 2 });
  try { return fs.readJsonSync(f); } catch { return fallback; }
}

function write(name, data) {
  fs.writeJsonSync(file(name), data, { spaces: 2 });
}

const db = {
  users: () => read('users', {}),
  groups: () => read('groups', {}),
  settings: () => read('settings', {}),
  saveUsers: (d) => write('users', d),
  saveGroups: (d) => write('groups', d),
  saveSettings: (d) => write('settings', d),

  getUser(jid) {
    const users = db.users();
    if (!users[jid]) {
      users[jid] = { xp: 0, level: 1, money: 100, lastDaily: 0, warns: 0 };
      db.saveUsers(users);
    }
    return users[jid];
  },
  updateUser(jid, patch) {
    const users = db.users();
    users[jid] = { ...db.getUser(jid), ...patch };
    db.saveUsers(users);
  },
  addXP(jid, amount = 10) {
    const u = db.getUser(jid);
    u.xp += amount;
    const need = u.level * 100;
    if (u.xp >= need) { u.level += 1; u.xp = 0; }
    db.updateUser(jid, u);
    return u;
  },
  getGroup(jid) {
    const groups = db.groups();
    if (!groups[jid]) {
      groups[jid] = { antiLink: true, antiSpam: true, welcome: true };
      db.saveGroups(groups);
    }
    return groups[jid];
  },
  updateGroup(jid, patch) {
    const groups = db.groups();
    groups[jid] = { ...db.getGroup(jid), ...patch };
    db.saveGroups(groups);
  },
};

module.exports = db;
