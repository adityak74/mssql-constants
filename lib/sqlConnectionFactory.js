var sequelize = require('sequelize');

module.exports = function sqlConnectionFactory(sqlParams, done) {
  const sequelizeConn = new sequelize(
    sqlParams.database, 
    sqlParams.user,
    sqlParams.password,
    {
      dialect: sqlParams.dialect,
      host: sqlParams.server,
      logging: false,
    }
  );
  // Grab connection
  sequelizeConn
    .authenticate()
    .then(function(error) {
      if (error) done(error, null);
      done(null, sequelizeConn);
    });
}
