var CharReader = require('./CharReader.js');

function TokenReader(text) {
    this.charReader_ = new CharReader(text);
    this.token_ = '';
    this.tokenKind_ = TokenReader.TokenKind.Unknown;
    this.c = '\n';
}

/**
 *	@type {number}
 *	@const
 */
TokenReader.MaxTokenLength = 32;

/**
 *	@enum {number}
 */
TokenReader.CharKind = {
    Unknown: 0,
    Letter: 1,
    Digit: 2,
    Delimiter: 3,
    Space: 4,
    EOF: 5
};

/**
 *	@enum {number}
 */
TokenReader.TokenKind = {
    Unknown: 0,
    Name: 1,
    ConstNumber: 2,
    Delimiter: 3,
    EOF: 4,
};

/**
 *	@type {CharReader}
 *	@private
 */
TokenReader.prototype.charReader_;

/**
 *	@type {char}
 *	@private
 */
TokenReader.prototype.c_;

/**
 *	@type {string}
 *	@private
 */
TokenReader.prototype.token_;

/**
 *	@type {TokenRedaer.TokenKind}
 *	@private
 */
TokenReader.prototype.tokenKind_;

/**
 *	@param {char} c
 *	@return {TokenReader.CharKind}
 *	@private
 */
TokenReader.prototype.charKindT_ = function(c) {
    var regDigit = /^[0-9]$/,
        regLetter = /^[a-zA-Z_\$]$/,
        regDelimiter = /^[];]$/,
        regSpace = /^\s$/;

    if (c === CharReader.EOF) {
        return TokenReader.CharKind.EOF
    }

    if (regDigit.test(c)) {
        return TokenReader.CharKind.Digit
    }

    if (regLetter.test(c)) {
        return TokenReader.CharKind.Letter
    }

    if (regDelimiter.test(c)) {
        return TokenReader.CharKind.Delimiter
    }

    if (regSpace.test(c)) {
        return TokenReader.CharKind.Space
    }

    return TokenReader.CharKind.Unknown
};

/**
 *	@param {char} c
 *	@return {string}
 */
TokenReader.prototype.nextToken = function() {
    this.token_ = '';
    this.tokenKind_ = TokenReader.TokenKind.Unknown;

    var nextState = 1;

    while (this.charKindT_(this.c_) === TokenReader.CharKind.Space) {
        this.c_ = this.charReader_.nextChar();
    }

    loop: while (true) {
        state: switch (nextState) {
            case 1:
                switch (this.charKindT_(this.c_)) {
                    case TokenReader.CharKind.Letter:
                        this.token_ += this.c_;
                        this.tokenKind_ = TokenReader.TokenKind.Name;
                        nextState = 2;
                        break state

                    case TokenReader.CharKind.Digit:
                        this.token_ += this.c_;
                        this.tokenKind_ = TokenReader.TokenKind.ConstNumber;
                        nextState = 3;
                        break state

                    case TokenReader.CharKind.Delimiter:
                        this.token_ += this.c_;
                        this.tokenKind_ = TokenReader.TokenKind.Delimiter;
                        nextState = 4;
                        break state

                    case TokenReader.CharKind.EOF:
                        this.token_ += this.c_;
                        this.tokenKind_ = TokenReader.TokenKind.EOF;
                        break loop

                    case TokenReader.CharKind.Unknown:
                        this.token_ += this.c_;
                        this.tokenKind_ = TokenReader.TokenKind.Unknown;
                        nextState = 5;
                        break state
                }

            case 2:
                this.c_ = this.charReader_.nextChar();
                if (this.charKindT_(this.c_) === TokenReader.CharKind.Letter ||
                    this.charKindT_(this.c_) === TokenReader.CharKind.Digit) {
                    this.token_ += this.c_;
                    nextState = 2;
                    break state

                } else {
                    break loop

                }

            case 3:
                this.c_ = this.charReader_.nextChar();
                if (this.charKindT_(this.c_) === TokenReader.CharKind.Digit) {
                    this.token_ += this.c_;
                    nextState = 3;
                    break state

                } else {
                    break loop

                }

            case 4:
                this.c_ = this.charReader_.nextChar();
                if (this.charKindT_(this.c_) === TokenReader.CharKind.Delimiter) {
                    this.token_ += this.c_;
                    nextState = 4;
                    break state

                } else {
                    break loop

                }

            case 5:
                this.c_ = this.charReader_.nextChar();
                if (this.charKindT_(this.c_) === TokenReader.CharKind.Unknown) {
                    this.token_ += this.c_;
                    nextState = 5;
                    break state

                } else {
                    break loop

                }
        }
    }

    console.error('[DEBUG] TokenReader#nextToken >> {kind: %d, token: "%s"}', this.tokenKind_, this.token_);
    return {
        token: this.token_,
        kind: this.tokenKind_
    }
};

module.exports = TokenReader;