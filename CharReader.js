/**
 *  一文字を表す型
 *  @typedef {string}
 */
var char;

/**
 *  @constructor
 *  @param {string} text 解析する文章
 */
function CharReader(text) {
    this.lines_ = text.split('\n');
    this.lineLenegth_ = 0;
    this.index_ = 1;
    this.lineIndex_ = 0;
}

/**
 *  ファイルの終端文字
 *  @type {char}
 *  @const
 */
CharReader.EOF = '';

/**
 *  行の集合
 *  @type {string[]}
 *  @private
 */
CharReader.prototype.lines_;

/**
 *  現在読み込んでいる行
 *  @type {string}
 *  @private
 */
CharReader.prototype.line_;

/**
 *  現在読み込んでいる行の長さ
 *  @type {number}
 *  @private
 */
CharReader.prototype.lineLenegth_;

/**
 *  現在読み込んでいる位置
 *  @type {number}
 *  @private
 */
CharReader.prototype.index_;

/**
 *  現在読み込んでいる行の位置
 *  @type {int}
 *  @private
 */
CharReader.prototype.lineIndex_;

/**
 *  一文字読み込む
 *  @return {char} 読み込んだ文字
 */
CharReader.prototype.nextChar = function() {
    if (this.index_ < this.lineLenegth_) {
        return this.line_.charAt(this.index_++)
    }

    if (this.index_++ === this.lineLenegth_) {
        return '\n'
    }

    this.line_ = this.nextLine_();

    if (this.line_ === null) {
        return CharReader.EOF
    }

    this.lineLenegth_ = this.line_.length;
    this.index_ = 0;
    return this.nextChar()
};

/**
 *  読み込み位置カーソルを一文字戻す
 */
CharReader.prototype.backChar = function() {
    this.index_--;
};

/**
 *  次の行を読み込む
 *  @return {string|null} 一行。次の行が存在しない場合はnullを返す。
 *  @private
 */
CharReader.prototype.nextLine_ = function() {
    var nextLine = null;
    if (this.lineIndex_ < this.lines_.length) {
        nextLine = this.lines_[this.lineIndex_++];
    }

    console.error('[DEBUG] CharReader#nextLine >> %s', nextLine);
    return nextLine;
};


module.exports = CharReader;