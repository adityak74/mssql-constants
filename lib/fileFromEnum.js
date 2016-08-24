var fs = require('fs');
var path = require('path');
module.exports = function (rootDir, tableDefinitions) {
  if(!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);
  /*
  fs.writeFileSync(
    path.join(rootDir, 'index.js'),
    indexFile(tableDefinitions),
    'utf8'
  );
  */
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
      def.valueColumns.forEach(function(col, index){
        c('  ' + col + ': ' + col + ',');
      });
      c('};');
    }
    fs.writeFile(path.join(rootDir, def.file + '.js'), enumFile, 'utf8', cb);

    function c(str) {
      enumFile += str + '\n';
    }
  };
};

function indexFile(tableDefinitions) {
  var file = '';
  c('module.exports = {');
  for(var i=0, ii=tableDefinitions.length; i !== ii; i++) {
    var def = tableDefinitions[i];
    var suffix = (ii - 1) === i ? '' : ',';
    c("  '" + def.file + "': require('./" + def.file + "')" + suffix);
  }
  c('};')
  return file;
  function c(str) { file += str + '\n'; }
}
