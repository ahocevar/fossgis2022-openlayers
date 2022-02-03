import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/beige.css';
import 'reveal.js/plugin/highlight/zenburn.css';
import './style.css';
import './css/customized.css';
import './css/animate.css';
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';

const deck = new Reveal({
  dependencies: [
    new Markdown(),
    new Highlight()
  ],
  history: true
});
deck.initialize();