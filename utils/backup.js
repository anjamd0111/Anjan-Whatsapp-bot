const fs = require('fs-extra');
const path = require('path');

async function backupDatabase() {
  const src = path.join(__dirname, '..', 'database');
  const dest = path.join(__dirname, '..', 'database', '_backup');
  await fs.ensureDir(dest);
  const files = (await fs.readdir(src)).filter((f) => f.endsWith('.json'));
  for (const f of files) await fs.copy(path.join(src, f), path.join(dest, f)).catch(() => {});
}

module.exports = { backupDatabase };
