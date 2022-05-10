import { Command } from './Command.js';

class UpCommand extends Command {
  constructor(controller, cursor) {
    super(controller, cursor, () => {
      this.cursor = cursor;
      this.controller = controller;
      cursor.addSymbol(this.controller.cursorPoint);
      return false;
    });
  }
}

export { UpCommand };
