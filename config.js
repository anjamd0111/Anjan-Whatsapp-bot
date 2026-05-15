require('dotenv').config();

module.exports = {
  botName: process.env.BOT_NAME || 'ANJAN MD',
  ownerNumber: process.env.OWNER_NUMBER || '919242172548',
  ownerName: process.env.OWNER_NAME || 'Anjan Dhar',
  prefix: process.env.PREFIX || '.',
  mode: process.env.MODE || 'public', // public | private
  autoRead: process.env.AUTO_READ === 'true',
  autoTyping: process.env.AUTO_TYPING === 'true',
  autoReact: process.env.AUTO_REACT === 'true',
  antiLink: process.env.ANTI_LINK === 'true',
  antiSpam: process.env.ANTI_SPAM === 'true',
  welcome: process.env.WELCOME === 'true',
  language: process.env.LANGUAGE || 'en',
  port: parseInt(process.env.PORT || '3000', 10),
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  aiApiUrl: process.env.AI_API_URL || 'https://api.dreaded.site/api/chatgpt',
  version: '1.0.0',
  startTime: Date.now(),
};
