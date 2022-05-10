class Cursor {
  constructor(state) {
    this.state = state;
  }

  add = (cursorPoint, isNewLine = false) => {
    const { line, pos } = cursorPoint;
    if (pos < 77 && !isNewLine) this.cursorPoint = { line, pos: (pos + 1) };
    else this.cursorPoint = { line: (line + 1), pos: 0 };
    return this.cursorPoint;
  };

  remove(cursorPoint, text) {
    this.text = text;
    const { line, pos } = cursorPoint;
    if (pos > 0) return { line, pos: (pos - 1) };
    return { line: (line - 1), pos: 77 };
  }
}

export { Cursor };
