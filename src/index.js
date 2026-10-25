import './styles/main.css';
import * as store from './store.js';
import * as domController from './dom/domController.js';

store.init();
domController.init(document.getElementById('app'));
