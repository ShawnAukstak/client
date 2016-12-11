import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

// Make right-clicks show context menu (copy/paste/etc) on input fields
const inputMenu = require('electron-input-menu');
const context = require('electron-contextmenu-middleware');

context.use(inputMenu);
context.activate();

export function main() {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
