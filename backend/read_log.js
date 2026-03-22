const fs = require('fs');
const content = fs.readFileSync('server_log.txt', 'utf16le');
console.log(content.split('\n').slice(-100).join('\n'));
