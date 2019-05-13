var fs = require('fs');
var path = require('path');

module.exports = function (rootDir, tableDefinitions) {
  if(!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);
  var existingKeys = [];
  if(fs.existsSync(path.join(rootDir, 'index.js'))) {
    var currentIndex = fs.readFileSync(path.join(rootDir, 'index.js'), "utf8").split('\n');
    currentIndex.shift();
    currentIndex.pop();
    for(var i=0, ii=currentIndex.length; i !== ii; i++) {
      var entry = currentIndex[i].trim();
      if(entry === '' || entry === '};' || /module\.exports/.test(entry)) continue;
      var file = entry.replace(',', '').split(' ').pop().slice(11, -2);
      existingKeys.push({ file: file, line: currentIndex[i] });
    }
  }
  return function writeEnumFromFile(defWrapper, cb) {
    var enumFile = '';
    var def = defWrapper.def;
    var enums = defWrapper.enums;
    enums.forEach(function(enumerable, index){
      var keys = Object.keys(enumerable);
      var columnName = def.valueColumns[index];
      c('var ' + columnName + ' = {');
      for(var i=0, ii=keys.length; i !== ii; i++) {
        var key = keys[i]
        var suffix = i === (ii - 1) ? '' : ',';
        c("  " + key + ": " + enumerable[key] + suffix);
      }
      c('};');
      c('');
    });
    if (enums.length === 1) {
      c('module.exports = ' + def.valueColumns[0] + ';');
    } else {
      c('module.exports = {');
      var ii = def.valueColumns.length;
      def.valueColumns.forEach(function(col, i){
        var suffix = i === (ii - 1) ? '' : ',';
        c('  ' + col + ': ' + col + suffix);
      });
      c('};');
    }
    fs.writeFile(path.join(rootDir, def.file + '.js'), enumFile, 'utf8', cb);

    function c(str) {
      enumFile += str + '\n';
    }
  };
};
