// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')
const { readdirSync } = require('fs');

const nested = readdirSync(__dirname, {encoding: 'utf8', withFileTypes: true})
  .filter(file => file.name.endsWith('.html'))
  .reduce((previous, current) => {
    previous[current.name] = resolve(__dirname, current.name);
    return previous;
  }, {});

module.exports = defineConfig({
  base: '',
  build: {
    rollupOptions: {
      input: {
        ...nested
      }
    }
  }
})