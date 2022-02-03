var ghpages = require('gh-pages');

ghpages.publish('dist', {
  branch: 'gh-pages',
  repo: 'git@github.com:ahocevar/fossgis-2022-openlayers.git'
}, function(err) {
  console.log(err ? err.message : 'Deployed!');
});