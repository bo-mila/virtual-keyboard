import { Control } from './Control.js';

class Textarea extends Control {
  constructor({
    parent = null, className = '', onKey, onChangePoint,
  }) {
    super({ parent, tagName: 'textarea', className });
    this.node.tabIndex = '1';
    this.node.focus();

    this.node.onkeydown = (event) => {
      const { code } = event;
      event.preventDefault();
      onKey('keyDown', code);
    };

    this.node.onkeyup = (event) => {
      const { code, timeStamp } = event;
      event.preventDefault();
      onKey('keyUp', code, timeStamp);
    };

    this.node.onpointerdown = (event) => {
      onChangePoint(event);
    };

    this.node.onpointerup = (event) => {
      onChangePoint(event);
    };
  }
}

export { Textarea };
