import { Command } from './Command.js';

class UndoCommand extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      controller.undo();
      return false;
    });
  }
}

export { UndoCommand };
