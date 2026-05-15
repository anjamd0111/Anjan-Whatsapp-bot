const axios = require('axios');

module.exports = {
  name: 'weather',
  aliases: ['w'],
  category: 'tools',
  description: 'Get current weather',
  async execute({ sock, m, args, from, config }) {
    const city = args.join(' ');
    if (!city) return sock.sendMessage(from, { text: 'Usage: .weather <city>' }, { quoted: m });
    try {
      let text;
      if (config.weatherApiKey) {
        const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: { q: city, appid: config.weatherApiKey, units: 'metric' },
        });
        text = `🌤 *${data.name}, ${data.sys.country}*\n🌡 Temp: ${data.main.temp}°C (feels ${data.main.feels_like}°C)\n💧 Humidity: ${data.main.humidity}%\n💨 Wind: ${data.wind.speed} m/s\n☁ ${data.weather[0].description}`;
      } else {
        const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const c = data.current_condition[0];
        text = `🌤 *${city}*\n🌡 Temp: ${c.temp_C}°C (feels ${c.FeelsLikeC}°C)\n💧 Humidity: ${c.humidity}%\n💨 Wind: ${c.windspeedKmph} km/h\n☁ ${c.weatherDesc[0].value}`;
      }
      await sock.sendMessage(from, { text }, { quoted: m });
    } catch (e) {
      await sock.sendMessage(from, { text: `Weather error: ${e.message}` }, { quoted: m });
    }
  },
};
