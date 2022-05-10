import { KeyboardController } from './assets/js/KeyboardController.js';
import { KeyboardView } from './assets/js/KeyboardView.js';
import { KeyboardState } from './assets/js/KeyboardStatel.js';
import { Editor } from './assets/js/Editor.js';
import { CommandHistory } from './assets/js/CommandHistory.js';

import './style.scss';

const state = new KeyboardState('');
const editor = new Editor();
const history = new CommandHistory();
const controller = new KeyboardController(state, editor, history);
const keyboard = new KeyboardView(document.body, state, controller);
keyboard.controller.initLang();
