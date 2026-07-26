import './styles.css';
import { GlobularRoamGame } from './game.js';
import { loadSave } from './persistence.js';
import { GameUI } from './ui.js';

const root = document.getElementById('app');
const save = loadSave();
const ui = new GameUI(root);
ui.configureStart(save);

const game = new GlobularRoamGame(ui, save);
window.globularRoam = game;
