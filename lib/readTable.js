module.exports = function (sqlConnPool) {
  return function readTable(defWrapper, cb) {
    sqlConnPool.query('SELECT * FROM ' + defWrapper.def.table)
      .then((table) => {
        defWrapper.table = table[0];
        cb(null);
      });
  };
};
