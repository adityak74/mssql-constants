var fs = require('fs');
var async = require('async');
var readTable = require('./lib/readTable');
var fileFromEnum = require('./lib/fileFromEnum');
var enumsFromTable = require('./lib/enumsFromTable');

function tableDefinition(def) {
  return {
    file: def.file,
    // [STR] Relative path to the file
    table: def.table,
    // [STR] Table name from the database
    keyColumn: def.keyColumn,
    // [STR] Column to key enum off of
    keyTransform: def.keyTransform || respectType,
    // [FN(enumKeys)] FN to transform keys
    tableFilter: def.tableFilter || alwaysTrue,
    // [FN(tableRows)] FN to filter table rows
    valueColumns: def.valueColumns,
    // [Array[STR]] Creates one enum per value column
    valueTransform: def.valueTransform || respectType
    // [FN(enumValues)] FN to transform values
  };

  function alwaysTrue() { return true; }

  function respectType(v) {
    if(typeof v === 'string') return "'" + v + "'";
    return v;
  }
}

function writeConstantsDirectory(
  sqlParams,
  directoryPath,
  tableDefinitions,
  done
) {
  const definitionWrapper = tableDefinitions.map(function(d){
    return { def: d, table: [], enums: [] };
  });

  async.series([
    mapFn(readTable(sqlParams), definitionWrapper),
    mapFn(enumsFromTable(), definitionWrapper),
    mapFn(fileFromEnum(directoryPath, tableDefinitions), definitionWrapper)
  ], done);
};

function mapFn(op, list) {
  return function mappedFn (cb) {
    async.map(list, op, cb);
  };
}

module.exports = {
  tableDefinition: tableDefinition,
  createConstantFiles: writeConstantsDirectory
};
