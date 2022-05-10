class Editor {
  constructor() {
    this.text = '';
    this.selectText = '';
    this.textRow = [];
    this.cursor = { line: 0, pos: 0, number: 0 };
  }

  addSymbol(symbol) {
    const { line, pos, number } = this.cursor;
    if (number.length === this.text.length) {
      if (symbol === '\n') {
        this.textRow[line] += symbol;
        this.textRow.push('');
        this.cursor = { line: (line + 1), pos: 0, number: (number + 1) };
      } else if (this.textRow[line].length === 77) {
        this.textRow.push(symbol);
        this.cursor = { line: (line + 1), pos: 1, number: (number + 1) };
      } else {
        this.textRow[line] += symbol;
        this.cursor = { line, pos: (pos + 1), number: (number + 1) };
      }
      this.text += symbol;
    } else {
      this.text = this.text.slice(0, number) + symbol + this.text.slice(number);
      this.textRow = this.changeTextRow(this.text);
      if (symbol === '\n') {
        this.cursor = {
          line: (line + 1),
          pos: 0,
          number: (number + 1),
        };
      } else {
        this.cursor = {
          line,
          pos: (pos + 1),
          number: (number + 1),
        };
      }
    }
  }

  deleteSymbol(direction) {
    const { line, pos, number } = this.cursor;
    if (number === this.text.length) {
      if (direction === 'prev') {
        if (pos !== 0) {
          this.text = this.text.slice(0, this.text.length - 1);
          this.textRow[line] = this.textRow[line].slice(0, this.textRow[line].length - 1);
          this.cursor = { line, pos: (pos - 1), number: (number - 1) };
        } else if (line !== 0) {
          this.text = this.text.slice(0, this.text.length - 1);
          this.textRow[line - 1] = this.textRow[line - 1]
            .slice(0, this.textRow[line - 1].length - 1);
          this.textRow.pop();
          this.cursor = {
            line: (line - 1),
            pos: this.textRow[line - 1].length - 1,
            number: (number - 1),
          };
        }
      }
    } else if (direction === 'prev') {
      if (pos !== 0) {
        this.text = this.text.slice(0, number - 1) + this.text.slice(number);
        this.textRow = this.changeTextRow(this.text);
        this.cursor = {
          line,
          pos: (pos - 1),
          number: (number - 1),
        };
      } else {
        this.text = this.text.slice(0, number - 1) + this.text.slice(number);
        this.cursor = {
          line: (line - 1),
          pos: (this.textRow[line].length - 1),
          number: (number - 1),
        };
        this.textRow = this.changeTextRow(this.text);
      }
    } else {
      this.text = this.text.slice(0, number) + this.text.slice(number + 1);
      this.cursor = {
        line,
        pos,
        number,
      };
      this.textRow = this.changeTextRow(this.text);
    }
  }

  getSelect() {
    return this.selectText;
  }

  deleteSelect() {
    this.selectText = '';
  }

  replaceSelect(selectText) {
    this.selectText = selectText;
  }

  changeTextRow() {
    const splitText = this.text.split('\n').map((row) => `${row}\n`);
    if (splitText.length === 1) splitText[0] = splitText[0].slice(0, splitText[0].length - 1);
    const textArr = splitText.map((row) => {
      if (row.length <= 77) return row;
      return row.match(/.{1,77}/g);
    });
    return textArr.flat();
  }
}

export { Editor };
