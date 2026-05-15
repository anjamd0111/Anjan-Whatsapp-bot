const fs = require('fs-extra');
const path = require('path');

async function cleanTemp() {
  const dir = path.join(__dirname, '..', 'temp');
  await fs.ensureDir(dir);
  const files = await fs.readdir(dir);
  for (const f of files) await fs.remove(path.join(dir, f)).catch(() => {});
}

module.exports = { cleanTemp };
