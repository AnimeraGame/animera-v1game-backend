'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('race', {
    race_id: {type: 'int', primaryKey: true, autoIncrement: true},
    race_name: {type: 'string', length: 40, notNull: true},
    race_trace: {type: 'string', length: 255, notNull: true},
    start_time: {type: 'datetime'},
    end_time: {type: 'datetime', },
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('race', callback);
};

exports._meta = {
  "version": 1
};
