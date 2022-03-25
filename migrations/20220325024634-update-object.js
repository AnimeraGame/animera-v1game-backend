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
  db.addColumn('object', 'bound_center_x', {type: 'decimal', precision: 10, scale: 8}, function(err) {if (err) return callback(err);});
  db.addColumn('object', 'bound_center_y', {type: 'decimal', precision: 10, scale: 8}, function(err) {if (err) return callback(err);});
  db.addColumn('object', 'bound_center_z', {type: 'decimal', precision: 10, scale: 8}, function(err) {if (err) return callback(err);});

  db.addColumn('object', 'bound_size_x', {type: 'decimal', precision: 10, scale: 8}, function(err) {if (err) return callback(err);});
  db.addColumn('object', 'bound_size_y', {type: 'decimal', precision: 10, scale: 8}, function(err) {if (err) return callback(err);});
  db.addColumn('object', 'bound_size_z', {type: 'decimal', precision: 10, scale: 8}, function(err) {if (err) return callback(err);});
};

exports.down = function(db, callback) {
  db.removeColumn('object', 'bound_size_z', function(err) {if (err) return callback(err);});
  db.removeColumn('object', 'bound_size_y', function(err) {if (err) return callback(err);});
  db.removeColumn('object', 'bound_size_x', function(err) {if (err) return callback(err);});

  db.removeColumn('object', 'bound_center_z', function(err) {if (err) return callback(err);});
  db.removeColumn('object', 'bound_center_y', function(err) {if (err) return callback(err);});
  db.removeColumn('object', 'bound_center_x', function(err) {if (err) return callback(err);});
};

exports._meta = {
  "version": 1
};
