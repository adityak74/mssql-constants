# sql-constants

## Dependencies

* [Node.js](https://nodejs.org/en/)
* Sequelize

## Consumption

This module writes a directory of enumerable constants based on SQL tables.
All constant files are meant to be easily read.
The goal here is to maintain dryness within the SQL environment.
To me, this is ensured by deriving our constants directly from the SQL layer.

## Example

```
var sqlConstants = require('sql-constants');

sqlConstants.createConstantFiles(
  {
    // SQL details, required to query tables
    database: configuration.sql_database,
    dialect: 'mysql | mssql',
    password: configuration.sql_password,
    server: configuration.sql_server,
    user: configuration.sql_user,
  },
  // Directory to write constants into
  __dirname + '/constants',
  [
    // Each table definition corresponds to a constant file
    // If multiple value columns are specified, the file will export a dictionary of enums
    // If just one value column is specified, the file will export the enum directly
    sqlConstants.tableDefinition({
      file: 'locations',
      table: 'Locations',
      keyColumn: 'locationName',
      valueColumns: [
        'city',
        'state',
      ]
    }),
    mssqlConstants.tableDefinition({
      file: 'country',
      table: 'Countries',
      keyColumn: 'countryName',
      tableFilter: function(row) { return row.fieldVal === 'WhatWeWant'; },
      keyTransform: CONSTANT_FORMAT,
      valueColumns: ['countryID']
    }),
  ],
  function(err) {
    if (err) {
      console.warn(err);
      return process.exit(1);
    }
    return process.exit(0);
  }
);

function CONSTANT_FORMAT(str) {
  return "'" + str.toUpperCase().replace(/ /g, '_') + "'";
}


```
