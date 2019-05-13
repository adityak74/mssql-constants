var fs = require('fs');
var path = require('path');

function indexFile(files) {
  var file = '';
  c('module.exports = {');
  for(var i=0, ii=files.length; i !== ii; i++) {
    var f = files[i].replace('.js', '');
    var suffix = ((ii - 1) === i) ? '' : ',';
    c("  '" + f + "': require('./" + f + "')" + suffix);
  }
  c('};')
  return file;
  function c(str) { file += (str + '\n'); }
}

module.exports = (directory, cb) => {
  fs.readdir(directory, (readErr, files) => {
    if (readErr) throw readErr;
    const index = indexFile(files);
    fs.writeFile(
      path.join(directory, 'index.js'),
      index,
      'utf8',
      cb,
    )
  });
};