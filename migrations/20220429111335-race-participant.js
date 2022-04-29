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
  db.createTable('race_participant', {
    participant_id: {type: 'int', primaryKey: true, autoIncrement: true},
    race_id: {type: 'int', length: 11, notNull: true},
    user_id: {type: 'int', length: 11, notNull: true},
    vehicle_id: {type: 'string', length: 255, notNull: true},
    rank: {type: 'int'},
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('race_participant', callback);
};

exports._meta = {
  "version": 1
};
