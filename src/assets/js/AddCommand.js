import { Command } from './Command.js';

class AddCommand extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      this.saveBackup();
      editor.addSymbol(controller.addSymbol);
      return true;
    });
  }
}

export { AddCommand };
