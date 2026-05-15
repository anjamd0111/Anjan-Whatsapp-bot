# 🌟 ANJAN MD — Advanced WhatsApp Multi-Device Bot

Premium, modular WhatsApp bot built with **Baileys** (Node.js). Supports pairing-code login, QR login, multi-device, auto-reconnect, downloaders, AI, economy, anti-link, and more.

---

## ✨ Features

- 🔐 Pairing code + QR login
- 📱 Multi-device & auto reconnect
- 🧩 Modular command handler (one file per command)
- 👑 Owner / 👮 Admin / 👥 Public commands
- 👋 Welcome & goodbye, 🚫 Anti-link, 🛡 Anti-spam
- 👀 Auto-read, ⌨ Auto-typing, ⚡ Auto-react
- 🎬 YouTube / TikTok / Instagram downloaders
- 🎵 `.play` music search & send
- 🤖 AI chat, 🌤 Weather, 😂 Fun
- 🏆 Level & XP, 💰 Economy with daily reward
- 📡 Broadcast, ⚙ Live settings toggles
- 💾 JSON database + auto backup
- 🧹 Temp cleaner + crash protection
- 🌐 Express keep-alive (Render / Replit)

---

## 📁 Folder Structure

```
ANJAN-MD/
 ├── index.js
 ├── config.js
 ├── package.json
 ├── .env.example
 ├── session/        (auto-generated)
 ├── database/       (JSON db + backups)
 ├── commands/       (one file per command)
 ├── events/         (message + group handlers)
 ├── lib/            (db, helpers, command loader)
 ├── utils/          (logger, cleaner, backup)
 ├── media/
 └── temp/
```

---

## 🚀 Installation

```bash
git clone <your-repo> ANJAN-MD
cd ANJAN-MD
cp .env.example .env
# edit .env → set OWNER_NUMBER (with country code, no +)
npm install
npm start
```

On first run you’ll be asked for your number and shown a **pairing code**.
Open **WhatsApp → Linked Devices → Link with phone number → enter the code.**

---

## 📲 Termux Setup

```bash
pkg update && pkg upgrade -y
pkg install nodejs git ffmpeg -y
git clone <your-repo>
cd ANJAN-MD
cp .env.example .env
nano .env        # set OWNER_NUMBER
npm install
npm start
```

---

## ☁ Railway Deploy

1. Fork this repo to GitHub.
2. railway.app → **New Project → Deploy from GitHub**.
3. Add environment variables from `.env.example`.
4. Set start command: `npm start`.
5. First-run logs show your pairing code.

## 🌐 Render Deploy

1. Create **New → Web Service** from GitHub.
2. Build: `npm install` · Start: `npm start` · Env: Node 18.
3. Add env vars from `.env.example`.
4. Watch logs → enter pairing code in WhatsApp.

## 💻 VPS Deploy (PM2)

```bash
npm i -g pm2
pm2 start index.js --name anjan-md
pm2 save && pm2 startup
```

## 🧪 Replit

Import repo → set Secrets from `.env.example` → press Run.

---

## 🧩 Commands

| Command | Category | Description |
|---|---|---|
| `.menu` | main | Show all commands |
| `.ping` | main | Speed test |
| `.sticker` | converter | Image/video → sticker |
| `.play <song>` | downloader | YouTube audio |
| `.ytmp4 <q>` | downloader | YouTube video |
| `.tiktok <url>` | downloader | TikTok no-watermark |
| `.ig <url>` | downloader | Instagram media |
| `.ai <q>` | ai | AI chat |
| `.weather <city>` | tools | Current weather |
| `.fun joke/quote/dice/flip` | fun | Random fun |
| `.group open/close/kick/promote/demote/tagall` | group | Admin tools |
| `.rank` | economy | Your level & XP |
| `.daily` / `.bal` | economy | Reward / balance |
| `.bc <msg>` | owner | Broadcast |
| `.set <key> <val>` | owner | Live toggle settings |

---

## 🔑 Environment Variables

| Key | Description |
|---|---|
| `BOT_NAME` | Display name |
| `OWNER_NUMBER` | Your WhatsApp number, country code, no `+` |
| `OWNER_NAME` | Owner name |
| `PREFIX` | Default `.` |
| `MODE` | `public` or `private` |
| `AUTO_READ`, `AUTO_TYPING`, `AUTO_REACT` | Booleans |
| `ANTI_LINK`, `ANTI_SPAM`, `WELCOME` | Booleans |
| `WEATHER_API_KEY` | Optional OpenWeather key |
| `AI_API_URL` | Free AI endpoint |
| `PORT` | Keep-alive web port |

---

## 🛠 Troubleshooting

- **Pairing code invalid** → number must include country code, no `+` or spaces.
- **`Logged out`** → delete `session/` folder and restart.
- **Sticker fails** → install `ffmpeg` (`pkg install ffmpeg` on Termux).
- **YouTube download fails** → `npm i ytdl-core@latest`.
- **Connection drops** → bot auto-reconnects; ensure stable internet.

---

## 📜 License

MIT © Anjan Dhar
