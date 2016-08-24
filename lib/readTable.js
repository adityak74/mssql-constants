var mssql = require('mssql');
module.exports = function (sqlParams) {
  return function readTable(defWrapper, cb) {
    var conn = new mssql.Connection({
      database: sqlParams.database,
      password: sqlParams.password,
      server: sqlParams.server,
      user: sqlParams.user
    }, function(err1) {
      if (err1) return cb(err1);
      var req = new mssql.Request(conn);
      req.query('SELECT * FROM ' + defWrapper.def.table, function(err2, table) {
        if (err2) return cb(err2);
        defWrapper.table = table;
        cb(null);
      });
    });
  };
};
