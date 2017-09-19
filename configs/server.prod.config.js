const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  if(app.get('env') !== 'production') {
    return;
  }
  fs.stat(path.resolve(__dirname, '../dist/manifest.json'), (err, stats) => {
    if(err || !stats.isFile()) {
      err ? console.log(err) : () => {};
      return;
    }
    fs.readFile(path.resolve(__dirname, '../dist/manifest.json'), (err, data) => {
      if(err) {
        console.log(err);
        return;
      }
      const manifest = JSON.parse(data);
      app.locals.manifest = Object.assign({}, manifest);
    });
  });
}