import { Command } from './Command.js';

class PasteCommand extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      this.saveBackup();
      editor.replaceSelect(controller.select);
      editor.deleteSelect();
      return true;
    });
  }
}

export { PasteCommand };
