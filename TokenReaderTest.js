var fs = require('fs'),
    TokenReader = require('./TokenReader.js');

var text = fs.readFileSync('./CharReader.js', 'utf8'),
    tr = new TokenReader(text),
    token;

while (true) {
    token = tr.nextToken();

    if (token.kind === TokenReader.TokenKind.EOF) {
        break
    }
}