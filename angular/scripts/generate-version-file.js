const fs = require('fs');
const version = require('../package.json').version;

fs.writeFileSync('./src/assets/version.json', JSON.stringify({version}));
