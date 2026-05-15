const fs = require('fs-extra');
const path = require('path');
const { success, error } = require('../utils/logger');

const commands = new Map();
const aliases = new Map();

async function loadCommands() {
  commands.clear();
  aliases.clear();
  const dir = path.join(__dirname, '..', 'commands');
  await fs.ensureDir(dir);
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(dir, file))];
      const cmd = require(path.join(dir, file));
      if (!cmd.name || typeof cmd.execute !== 'function') continue;
      commands.set(cmd.name, cmd);
      (cmd.aliases || []).forEach((a) => aliases.set(a, cmd.name));
    } catch (e) {
      error(`Failed to load ${file}: ${e.message}`);
    }
  }
}

function getCommand(name) {
  if (!name) return null;
  return commands.get(name) || commands.get(aliases.get(name));
}

module.exports = { loadCommands, getCommand, commands, aliases };
