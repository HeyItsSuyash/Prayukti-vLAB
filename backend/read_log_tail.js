const fs = require('fs');
const content = fs.readFileSync('server_log.txt', 'utf16le');
const lines = content.split('\n');
console.log(lines.slice(-200).join('\n'));
