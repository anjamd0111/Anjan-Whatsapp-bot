const chalk = require('chalk');

const ts = () => chalk.gray(`[${new Date().toLocaleTimeString()}]`);

function banner() {
  const lines = [
    '',
    '   █████╗ ███╗   ██╗ ██╗ █████╗ ███╗   ██╗   ███╗   ███╗██████╗ ',
    '  ██╔══██╗████╗  ██║ ██║██╔══██╗████╗  ██║   ████╗ ████║██╔══██╗',
    '  ███████║██╔██╗ ██║ ██║███████║██╔██╗ ██║   ██╔████╔██║██║  ██║',
    '  ██╔══██║██║╚██╗██║ ██║██╔══██║██║╚██╗██║   ██║╚██╔╝██║██║  ██║',
    '  ██║  ██║██║ ╚████║██╗██║██║  ██║██║ ╚████║██╗██║ ╚═╝ ██║██████╔╝',
    '  ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚═════╝ ',
    '',
  ];
  const colors = [chalk.magentaBright, chalk.cyanBright, chalk.blueBright, chalk.greenBright, chalk.yellowBright, chalk.redBright];
  lines.forEach((l, i) => console.log(colors[i % colors.length](l)));
  console.log(chalk.cyanBright('  ▸ Advanced WhatsApp MD Bot  ▸  v1.0.0  ▸  by Anjan Dhar\n'));
}

module.exports = {
  banner,
  log: (m) => console.log(ts(), chalk.white(m)),
  success: (m) => console.log(ts(), chalk.greenBright('✔'), chalk.green(m)),
  warn: (m) => console.log(ts(), chalk.yellowBright('⚠'), chalk.yellow(m)),
  error: (m) => console.log(ts(), chalk.redBright('✖'), chalk.red(m)),
  info: (m) => console.log(ts(), chalk.cyanBright('ℹ'), chalk.cyan(m)),
};
