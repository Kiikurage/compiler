var fs = require('fs'),
    CharReader = require('./CharReader.js');

var text = fs.readFileSync('./CharReader.js', 'utf8'),
    cr = new CharReader(text),
    c;

while ((c = cr.nextChar()) !== CharReader.EOF) console.log(c);