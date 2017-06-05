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
        var duplicateIndex = 1;
        var key = keyTransform(_key);
        while(enumerable[key]) {
          duplicateIndex += 1;
          key = keyTransform(_key + duplicateIndex);
        }
        enumerable[key] = enumValues[index];
      });
      return enumerable;
    });
    cb();
  };
};
