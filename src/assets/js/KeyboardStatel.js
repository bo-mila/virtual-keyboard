class KeyboardState {
  constructor(initial) {
    this.lang = 'en';
    this.state = initial;
    this.textRow = [''];
    this.cursor = { line: 0, pos: 0, number: 0 };
    this.capsLock = false;
    this.activeBtns = {};
    this.activeControls = {};
  }

  get() {
    return this.state;
  }

  set(text) {
    this.prev = this.state;
    this.state = text;
    this.onChange(this.state, this.prev);
  }

  setLang(lang) {
    this.lang = lang;
    this.onChangeLang(this.lang);
  }

  getLang() {
    return this.lang;
  }

  getCursor() {
    return this.cursor;
  }

  setCursor({ line, pos, number }) {
    this.cursor = { line, pos, number };
    this.moveCursor({ start: number, end: number });
  }

  getTextRow() {
    return this.textRow;
  }

  setTextRow(textRow) {
    this.textRow = textRow;
  }

  getCapsLock() {
    return this.capsLock;
  }

  changeCapsLock() {
    this.capsLock = !this.capsLock;
  }

  getActiveBtns() {
    return this.activeBtns;
  }

  changeActiveBtns(activeBtns) {
    this.activeBtns = activeBtns;
  }
}

export { KeyboardState };
