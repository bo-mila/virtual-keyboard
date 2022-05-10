import { DataApi } from './DataApi.js';
import { Control } from './Control.js';
import { Button } from './Button.js';
import { Textarea } from './Textarea.js';

class KeyboardView extends Control {
  constructor(parent, state, controller) {
    super({ parent, tagName: 'div', className: 'keyboard' });
    this.node.tabIndex = '-1';
    this.node.onclick = () => this.textView.node.focus();
    this.data = [];
    this.keys = [];
    this.controller = controller;
    this.state = state;
    this.state.onChangeLang = (lang) => {
      this.changeLang(lang);
    };
    this.lang = 'en';
    this.header = new Control({
      parent: this.node,
      className: 'keyboard__header header',
    });
    this.langElement = new Control({
      parent: this.header.node,
      className: 'keyboard__lang lang',
    });
    this.langElement.node.innerText = this.lang;
    this.descriptionElement = new Control({
      parent: this.header.node,
      className: 'keyboard__description description',
      content: `
        <span>Virtual Keyboard реализована для Window OS</span>
        <span>Для зажатия контрольной кнопки используйте двойной клик</span>
      `,
    });
    this.textView = new Textarea({
      parent: this.node,
      tagName: 'textarea',
      className: 'keyboard__textarea textarea',
      onKey: (eventType, code, time) => {
        const { findBtn, index } = this.findKey(code);
        if (findBtn !== null) {
          this.controller[`${eventType}`](findBtn, index, this.lang, time);
          this.setActiveKey();
        }
      },
      onChangePoint: (event) => { controller.changePoint(event); },
    });
    this.textView.node.focus();
    this.btns = new Control({
      parent: this.node,
      className: 'keyboard__btns btns',
    });
    this.row = new Control({ className: 'btns__row' });
    this.row.tabIndex = '-1';
    for (let i = 0; i < 5; i += 1) {
      this[`row${i + 1}`] = this.row.node.cloneNode(true);
      this.btns.node.append(this[`row${i + 1}`]);
    }
    const data = new DataApi();
    data.getKeysData().then((loaded) => {
      this.data = loaded;
    })
      .then(() => {
        this.data.forEach((btn, index) => {
          const {
            code, row,
          } = btn;
          const content = btn[`${this.lang}`].name;
          const button = new Button({
            parent: this[`row${row}`],
            className: `btns__btn btn ${code}`,
            content,
            onClick: (eventType, time) => {
              this.controller[`${eventType}`](btn, index, this.lang, time);
              this.textView.node.focus();
              this.setActiveKey();
            },
            id: index,
          });
          this.keys.push(button);
        });
        this.state.onChange = (current) => {
          this.update(current);
        };
        this.state.moveCursor = ({ start, end }) => {
          this.updateCursor({ start, end });
        };
        this.update(state.get());
        this.controller.initLang();
      });
    this.note = new Control({
      parent: this.node,
      className: 'keyboard__note note',
      content: `
        Из контрольных комбинаций реализована Ctrl+Z (отмена) и Ctrl+Shift (смена языка)
      `,
    });
  }

  findKey(code) {
    const buttonId = this.data.findIndex((key) => key.code === code);
    if (buttonId === -1) return null;
    return { findBtn: this.data[buttonId], index: buttonId };
  }

  setActiveKey() {
    Object.keys(this.controller.activeBtns).forEach((btn) => {
      if (this.controller.activeBtns[btn] === 1) this.keys[btn].node.classList.add('active');
      if (this.controller.activeBtns[btn] === 0) {
        this.keys[btn].node.classList.remove('active');
        delete this.controller.activeBtns[btn];
      }
    });
  }

  update(current) {
    this.textView.node.value = current;
  }

  updateCursor({ start, end }) {
    this.textView.node.setSelectionRange(start, end);
  }

  changeLang(lang) {
    this.lang = lang;
    for (let i = 0; i < this.keys.length; i += 1) {
      this.keys[i].update(this.data[i][`${lang}`].name);
    }
    this.langElement.node.innerText = lang;
  }
}

export { KeyboardView };
