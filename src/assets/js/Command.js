class Command {
  constructor(controller, editor, onExecute) {
    this.controller = controller;
    this.editor = editor;
    this.backup = '';
    this.backCursor = { line: 0, pos: 0, number: 0 };
    this.textRow = [''];
    this.execute = () => onExecute();
  }

  saveBackup() {
    this.backup = this.editor.text;
    this.backCursor = this.editor.cursor;
    this.textRow = this.editor.textRow;
  }

  undo() {
    this.editor = this.backup;
  }
}

export { Command };
