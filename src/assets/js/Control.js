class Control {
  constructor({
    parent = null, tagName = 'div', className = '', content = '',
  }) {
    const element = document.createElement(tagName);
    element.classList = className;
    element.innerHTML = content;
    if (parent) parent.append(element);
    this.node = element;
  }

  destroy() {
    this.node.remove();
  }
}

export { Control };
