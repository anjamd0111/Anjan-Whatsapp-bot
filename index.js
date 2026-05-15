/**
 *  ╔══════════════════════════════════════════╗
 *  ║              ANJAN  MD  BOT              ║
 *  ║   Advanced WhatsApp Multi-Device Bot     ║
 *  ╚══════════════════════════════════════════╝
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const express = require('express');
const NodeCache = require('node-cache');

const config = require('./config');
const { loadCommands, commands } = require('./lib/commandLoader');
const messageHandler = require('./events/messageHandler');
const groupHandler = require('./events/groupHandler');
const { banner, log, success, warn, error, info } = require('./utils/logger');
const { cleanTemp } = require('./utils/cleaner');
const { backupDatabase } = require('./utils/backup');

const SESSION_DIR = path.join(__dirname, 'session');
fs.ensureDirSync(SESSION_DIR);
fs.ensureDirSync(path.join(__dirname, 'database'));
fs.ensureDirSync(path.join(__dirname, 'temp'));
fs.ensureDirSync(path.join(__dirname, 'media'));

const logger = pino({ level: 'silent' });
const msgRetryCounterCache = new NodeCache();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (q) => new Promise((res) => rl.question(q, res));

async function startBot() {
  console.clear();
  banner();

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  info(`Baileys v${version.join('.')} ${isLatest ? '(latest)' : '(outdated)'}`);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('Safari'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  // Pairing code login
  if (!sock.authState.creds.registered) {
    let phoneNumber = (process.env.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
    if (!phoneNumber) {
      phoneNumber = await question(chalk.cyan('📱 Enter your WhatsApp number (with country code, no +): '));
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    }
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(phoneNumber);
        const pretty = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(chalk.greenBright('\n┌──────────────────────────────────┐'));
        console.log(chalk.greenBright(`│  PAIRING CODE: ${chalk.yellowBright(pretty.padEnd(17))}│`));
        console.log(chalk.greenBright('└──────────────────────────────────┘\n'));
        info('Open WhatsApp → Linked Devices → Link with phone number → Enter the code above.');
      } catch (e) {
        error('Failed to request pairing code: ' + e.message);
      }
    }, 3000);
  }

  // Load commands
  await loadCommands();
  success(`Loaded ${commands.size} commands`);

  // Save creds
  sock.ev.on('creds.update', saveCreds);

  // Connection updates
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      info('Scan the QR below or use the pairing code');
      require('qrcode-terminal').generate(qr, { small: true });
    }
    if (connection === 'open') {
      success(`Connected as ${sock.user?.id?.split(':')[0]}`);
      console.log(chalk.magentaBright(`\n  ${config.botName} is now ONLINE 🚀\n`));
    } else if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        error('Logged out. Delete session/ and run again.');
        process.exit(0);
      } else {
        warn(`Disconnected (code ${reason}). Reconnecting...`);
        startBot();
      }
    }
  });

  // Messages
  sock.ev.on('messages.upsert', async (m) => {
    try {
      await messageHandler(sock, m);
    } catch (e) {
      error('messageHandler: ' + e.message);
    }
  });

  // Group participants
  sock.ev.on('group-participants.update', async (update) => {
    try {
      await groupHandler(sock, update);
    } catch (e) {
      error('groupHandler: ' + e.message);
    }
  });

  return sock;
}

// Express keep-alive (Render/Replit)
const app = express();
app.get('/', (_, res) =>
  res.send(`<h1>${config.botName} ✅ Running</h1><p>Uptime: ${Math.floor((Date.now() - config.startTime) / 1000)}s</p>`)
);
app.listen(config.port, () => info(`Keep-alive server on :${config.port}`));

// Crash protection
process.on('uncaughtException', (e) => error('uncaughtException: ' + e.message));
process.on('unhandledRejection', (e) => error('unhandledRejection: ' + e));

// Background tasks
setInterval(() => cleanTemp().catch(() => {}), 30 * 60 * 1000);
setInterval(() => backupDatabase().catch(() => {}), 60 * 60 * 1000);

startBot().catch((e) => error('startBot: ' + e.message));
