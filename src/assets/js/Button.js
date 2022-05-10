import { Control } from './Control.js';

class Button extends Control {
  constructor({
    parent = null, className = '', content = '', onClick, id,
  }) {
    super({ parent, tagName: 'button', className });
    this.id = id;
    this.node.tabIndex = '-1';
    this.update = (contentBtn) => { this.setContent(contentBtn); };
    this.setContent(content);
    this.node.onmousedown = (event) => { onClick('mouseDown', event.timeStamp); this.node.onmouseover = () => this.node.onmouseup(); };
    this.node.onmouseup = () => { onClick('mouseUp'); this.node.onmouseover = null; };
  }

  setContent(content) {
    if (content.length === 2) this.node.innerHTML = `<span class="btn__before">${content[0]}</span><span class="btn__content">${content[1]}</span>`;
    else this.node.innerHTML = `<span class="btn__content">${content[0]}</span>`;
  }
}

export { Button };
