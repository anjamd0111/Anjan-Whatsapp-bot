const axios = require('axios');

const jokes = [
  'Why don’t scientists trust atoms? Because they make up everything!',
  'I told my computer I needed a break, and it said "No problem — I’ll go to sleep."',
  'Why did the developer go broke? Because he used up all his cache.',
];
const quotes = [
  '“The best way to predict the future is to invent it.” – Alan Kay',
  '“Stay hungry, stay foolish.” – Steve Jobs',
  '“Code is like humor. When you have to explain it, it’s bad.” – Cory House',
];

module.exports = {
  name: 'fun',
  aliases: ['joke', 'quote', 'dice', 'flip'],
  category: 'fun',
  description: 'Jokes, quotes, dice, coin flip',
  async execute({ sock, m, args, from, text }) {
    const sub = (args[0] || text.split(/\s+/)[0].replace(/^\W/, '')).toLowerCase();
    let out;
    if (sub.includes('quote')) out = quotes[Math.floor(Math.random() * quotes.length)];
    else if (sub.includes('dice')) out = `🎲 You rolled: *${1 + Math.floor(Math.random() * 6)}*`;
    else if (sub.includes('flip')) out = `🪙 ${Math.random() > 0.5 ? 'Heads' : 'Tails'}`;
    else out = `😂 ${jokes[Math.floor(Math.random() * jokes.length)]}`;
    await sock.sendMessage(from, { text: out }, { quoted: m });
  },
};
