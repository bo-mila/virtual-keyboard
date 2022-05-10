class CommandHistory {
  constructor() {
    this.history = [];
  }

  push(command) {
    this.history.push(command);
  }

  pop() {
    this.history.pop();
  }
}

export { CommandHistory };
