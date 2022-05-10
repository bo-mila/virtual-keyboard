import { CopyCommand } from './CopyCommand.js';
import { CutCommand } from './CutCommand.js';
import { PasteCommand } from './PasteCommand.js';
import { UndoCommand } from './UndoCommand.js';
import { AddCommand } from './AddCommand.js';
import { DeleteCommand } from './DeleteCommand.js';
import { Cursor } from './Cursor.js';

class KeyboardController {
  constructor(model, editor, history) {
    this.state = model;
    this.select = '';
    this.editor = editor;
    this.history = history;
    this.cursor = new Cursor(this.state);
    this.lastKey = null;
    this.addSymbol = '';
    this.activeControls = {};
    this.lastControl = { id: null, time: null };
    this.hasActivShift = () => {
      const activeKeys = Object.keys(this.activeControls)
        .filter((i) => this.activeControls[i] !== 0);
      return activeKeys.length === 1 && (activeKeys.includes('ShiftLeft') || activeKeys.includes('ShiftRight'));
    };
    this.hasControls = () => Object.keys(this.activeControls)
      .filter((i) => this.activeControls[i] !== 0).length !== 0;
    this.resetControls = () => { this.activeControls = {}; };
  }

  controlCombinations = [
    ['Control', 'Delete'],
    ['Control', 'Backspace'],
    ['Control', 'KeyX'],
    ['Control', 'KeyC'],
    ['Control', 'KeyV'],
    ['Control', 'KeyZ'],
    ['Control', 'KeyS'],
    ['Control', 'KeyA'],
    ['Control', 'KeyB'],
    ['Control', 'KeyI'],
    ['Control', 'KeyU'],
    ['Control', 'BracketLeft'],
    ['Control', 'BracketRight'],
    ['Control', 'KeyL'],
    ['Control', 'KeyE'],
    ['Control', 'KeyR'],
    ['Control', 'KeyY'],
    ['Control', 'Shift'],
  ];

  initLang() {
    const LANGUAGES = ['en', 'ru'];
    const currentBrowserLanguage = window.navigator.language.slice(0, 2);
    const storageLanguage = localStorage.getItem('key_lang') || '';
    const confirmedBrowserLang = LANGUAGES.includes(currentBrowserLanguage) ? currentBrowserLanguage : 'en';
    if (!LANGUAGES.includes(storageLanguage)) this.state.setLang(confirmedBrowserLang);
    else this.state.setLang(storageLanguage);
  }

  mouseUp(btn, index) {
    const { code } = btn;
    this.activeBtns = this.state.getActiveBtns();
    if (this.lastKey === index) {
      if (this.hasControls()) {
        if (this.activeControls[code] === 0) this.activeBtns[index] = 0;
        this.lastKey = null;
      } else {
        const arr = Object.keys(this.activeBtns);
        for (let i = 0; i < arr.length; i += 1) {
          this.activeBtns[arr[i]] = 0;
        }
      }
    } else if (this.lastKey !== null) {
      if (this.hasControls()) {
        if (this.activeControls[this.lastKey] === 0) this.activeBtns[this.lastKey] = 0;
        this.lastKey = null;
      } else {
        const arr = Object.keys(this.activeBtns);
        for (let i = 0; i < arr.length; i += 1) {
          this.activeBtns[arr[i]] = 0;
        }
      }
    }
    this.state.changeActiveBtns(this.activeBtns);
  }

  mouseDown(btn, index, lang, time) {
    const { type, code } = btn;
    this.activeBtns = this.state.getActiveBtns();
    if (type === 'control') {
      if ((this.lastControl.id && this.lastControl.id === code)
      && (this.lastControl.time && ((time - this.lastControl.time) < 300))) {
        this.activeControls[code] = 1;
        this.activeBtns[index] = 1;
        this.lastKey = index;
      } else {
        if (!this.hasControls()) {
          this.lastControl = { id: code, time };
          this.activeBtns[index] = 1;
          this.lastKey = index;
        }
        if (this.hasControls()) {
          if (this.activeControls[code]) {
            this.activeControls[code] = 0;
            this.activeBtns[index] = 1;
            this.lastKey = index;
            this.lastControl = { id: null, time: null };
          } else if (!this.keyControl(code)) {
            this.activeBtns[index] = 1;
            this.lastKey = index;
            this.lastControl = { id: code, time };
          } else {
            this.resetControls();
            this.lastControl = { id: null, time: null };
            this.activeBtns[index] = 1;
            this.lastKey = index;
          }
        }
      }
    } else if (this.hasControls()) {
      if (this.keyControl(code)) {
        this.resetControls();
        this.lastControl = { id: null, time: null };
        this.lastKey = index;
        this.activeBtns[index] = 1;
      } else {
        if (type === 'capslock') this.state.changeCapsLock();
        else if (type === 'move') this.moveCursor(code);
        else if (type === 'delete') this.delete(code);
        else if (type === 'meta');
        else this[`${type}`](code, btn[`${lang}`]);
        this.resetControls();
        this.lastControl = { id: null, time: null };
        this.lastKey = index;
        this.activeBtns[index] = 1;
      }
    } else {
      this.lastControl = { id: null, time: null };
      this.lastKey = index;
      this.activeBtns[index] = 1;
      if (type === 'capslock') this.state.changeCapsLock();
      else if (type === 'move') this.moveCursor(code);
      else if (type === 'delete') this.delete(code);
      else if (type === 'meta');
      else this[`${type}`](code, btn[`${lang}`]);
    }
    this.state.changeActiveBtns(this.activeBtns);
  }

  keyUp(btn, index) {
    const { code } = btn;
    this.activeBtns = this.state.getActiveBtns();
    if (this.hasControls()) {
      this.activeBtns[index] = 0;
      if (this.activeControls[code] === 1) {
        this.activeControls[code] = 0;
      }
    } else {
      if (this.activeControls[code] === 1) this.activeControls[code] = 0;
      const arr = Object.keys(this.activeBtns);
      for (let i = 0; i < arr.length; i += 1) {
        this.activeBtns[arr[i]] = 0;
      }
    }
    this.state.changeActiveBtns(this.activeBtns);
  }

  keyDown(btn, index, lang) {
    const { type, code } = btn;
    this.activeBtns = this.state.getActiveBtns();
    if (type === 'control') {
      if (!this.hasControls()) {
        this.activeControls[code] = 1;
        this.activeBtns[index] = 1;
      }
      if (this.hasControls()) {
        if (this.activeControls[code]) {
          this.activeBtns[index] = 1;
        } else if (!this.keyControl(code)) {
          this.activeBtns[index] = 1;
          this.activeControls[code] = 1;
        } else {
          this.activeBtns[index] = 1;
        }
      }
    } else if (this.hasControls()) {
      if (this.keyControl(code)) {
        this.activeBtns[index] = 1;
      } else {
        if (type === 'capslock') this.state.changeCapsLock();
        else if (type === 'move') this.moveCursor(code);
        else if (type === 'delete') this.delete(code);
        else if (type === 'meta');
        else this[`${type}`](code, btn[`${lang}`]);
        this.activeBtns[index] = 1;
      }
    } else {
      this.activeBtns[index] = 1;
      if (type === 'capslock') this.state.changeCapsLock();
      else if (type === 'move') this.moveCursor(code);
      else if (type === 'delete') this.delete(code);
      else if (type === 'meta');
      else this[`${type}`](code, btn[`${lang}`]);
    }
    this.state.changeActiveBtns(this.activeBtns);
  }

  symbol(code, { value, value_shift: shiftValue }) {
    let symbol = '';
    if (code.includes('Key')) symbol = ((this.hasActivShift() && !this.state.getCapsLock()) || (!this.hasActivShift() && this.state.getCapsLock())) ? shiftValue : value;
    else symbol = this.hasActivShift() ? shiftValue : value;
    this.add(symbol);
  }

  space(code, { value }) {
    this.add(value);
  }

  moveCursor(code) {
    const direction = code.slice(5).toLowerCase();
    this[direction]();
    return true;
  }

  keyControl(code) {
    const controlsKeys = Object.keys(this.activeControls);
    controlsKeys.push(code);
    const activeControlsKeys = controlsKeys
      .filter((i) => (this.activeControls[i] !== 0 || i === code))
      .map((i) => {
        if (i === 'ShiftLeft' || i === 'ShiftRight') return 'Shift';
        if (i === 'AltLeft' || i === 'AltRight') return 'Alt';
        if (i === 'ControlLeft' || i === 'ControlRight') return 'Control';
        return i;
      });
    for (let i = 0; i < this.controlCombinations.length; i += 1) {
      if (this.controlCombinations[i].every((l) => (activeControlsKeys.includes(l)))) {
        if (this.controlCombinations[i].join('') === 'ControlShift') {
          const lang = this.state.getLang() === 'en' ? 'ru' : 'en';
          this.state.setLang(lang);
          localStorage.setItem('key_lang', lang);
        }
        if (this.controlCombinations[i].join('') === 'ControlKeyZ') {
          const backCommand = this.history.history.pop();
          if (backCommand) {
            this.state.set(backCommand.backup);
            this.state.setCursor(backCommand.backCursor);
            this.state.setTextRow(backCommand.textRow);
          }
        }
        return this.controlCombinations[i];
      }
    }
    return null;
  }

  up = () => {
    const { line, pos, number } = this.state.getCursor();
    const textRow = this.state.getTextRow();
    if (line !== 0) {
      if (textRow[line - 1].length > pos) {
        const newNumber = number - pos - (textRow[line - 1].length - pos);
        this.state.setCursor({ line: (line - 1), pos, number: newNumber });
      } else if (textRow[line - 1].length === pos) {
        const newNumber = number - pos - 1;
        this.state.setCursor({
          line: (line - 1),
          pos: (textRow[line - 1].length - 1),
          number: newNumber,
        });
      } else {
        const newNumber = number - pos - 1;
        this.state.setCursor({
          line: (line - 1),
          pos: textRow[line - 1].length - 1,
          number: newNumber,
        });
      }
    }
  };

  down = () => {
    const { line, pos, number } = this.state.getCursor();
    const textRow = this.state.getTextRow();
    if (line !== textRow.length - 1) {
      if (textRow[line + 1].length > pos) {
        const newNumber = number + (textRow[line].length - pos) + pos;
        this.state.setCursor({ line: (line + 1), pos, number: newNumber });
      } else {
        const newNumber = number + (textRow[line].length - pos) + textRow[line + 1].length - 1;
        this.state.setCursor({
          line: (line + 1),
          pos: textRow[line + 1].length - 1,
          number: newNumber,
        });
      }
    }
  };

  left = () => {
    const { line, pos, number } = this.state.getCursor();
    const textRow = this.state.getTextRow();
    if (pos !== 0) {
      this.state.setCursor({ line, pos: (pos - 1), number: (number - 1) });
    } else if (line !== 0) {
      this.state.setCursor({
        line: (line - 1),
        pos: textRow[line - 1].length - 1,
        number: (number - 1),
      });
    }
  };

  right = () => {
    const { line, pos, number } = this.state.getCursor();
    const text = this.state.get();
    const textRow = this.state.getTextRow();
    if (number < text.length) {
      if (pos < textRow[line].length - 1) {
        this.state.setCursor({
          line,
          pos: (pos + 1),
          number: (number + 1),
        });
      } else {
        this.state.setCursor({
          line: (line + 1),
          pos: 0,
          number: (number + 1),
        });
      }
    }
  };

  add = (symbol) => {
    this.addSymbol = symbol;
    this.editor.text = this.state.get();
    this.editor.textRow = this.state.getTextRow();
    this.editor.cursor = this.state.getCursor();
    this.executeCommand(new AddCommand(this, this.editor));
    this.state.set(this.editor.text);
    this.state.setCursor(this.editor.cursor);
    this.state.setTextRow(this.editor.textRow);
    this.addSymbol = '';
  };

  delete = (code) => {
    this.deleteDirection = code === 'Backspace' ? 'prev' : 'next';
    this.editor.text = this.state.get();
    this.editor.textRow = this.state.getTextRow();
    this.editor.cursor = this.state.getCursor();
    this.executeCommand(new DeleteCommand(this, this.editor));
    this.state.set(this.editor.text);
    this.state.setCursor(this.editor.cursor);
    this.state.setTextRow(this.editor.textRow);
  };

  copy = () => {
    this.executeCommand(new CopyCommand(this, this.editor));
  };

  cut = () => {
    this.executeCommand(new CutCommand(this, this.editor));
  };

  paste = () => {
    this.executeCommand(new PasteCommand(this, this.editor));
  };

  undo = () => {
    this.executeCommand(new UndoCommand(this, this.editor));
  };

  executeCommand(command) {
    if (command.execute()) {
      this.history.push(command);
    }
  }
}

export { KeyboardController };
