module.exports = function () {
  return function readTable(defWrapper, cb) {
    var def = defWrapper.def;
    var table = defWrapper.table;
    var keyColumn = def.keyColumn;
    var tableFilter = def.tableFilter;
    var keyTransform  = def.keyTransform;
    var tableRows = table
      .filter(function(row) {
        return tableFilter(row);
      });
    var enumKeys = tableRows.map(function(row) {
      return row[keyColumn];
    });
    var valueColumns = def.valueColumns;
    var valueTransform = def.valueTransform;
    defWrapper.enums = def.valueColumns.map(function(value) {
      var enumValues = tableRows.map(function(row) {
        return valueTransform(row[value]);
      });
      var enumerable = {};
      enumKeys.forEach(function(_key, index) {
        var key = _key;
        if (enumerable[key]) {
          var duplicateIndex = 2;
          while(enumerable[key + duplicateIndex]) duplicateIndex += 1;
          key = key + duplicateIndex;
        }
        enumerable[keyTransform(key)] = enumValues[index];
      });
      return enumerable;
    });
    cb();
  };
};
