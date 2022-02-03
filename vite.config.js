// vite.config.js
const { resolve, join } = require('path')
const { defineConfig } = require('vite')
const { readdirSync } = require('fs');

const nested = readdirSync(join(__dirname, 'inline-examples'), {encoding: 'utf8', withFileTypes: true})
  .filter(file => file.name.endsWith('.html'))
  .reduce((previous, current) => {
    previous[current.name] = resolve(__dirname, 'inline-examples', current.name);
    return previous;
  }, {});

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...nested
      }
    }
  }
})