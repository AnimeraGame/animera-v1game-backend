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
  db.createTable('material', {
    id: {type: 'int', primaryKey: true, autoIncrement: true},
    material_id: {type: 'string', length: 100, notNull: true},
    metallic: {type: 'decimal', precision: 10, scale: 8},
    roughness: {type: 'decimal', precision: 10, scale: 8},
    has_alpha: {type: 'boolean'},
    alpha: {type: 'decimal', precision: 10, scale: 8},
    shape: {type: 'string', length: 100},
    albedo_color_r: {type: 'decimal', precision: 10, scale: 8},
    albedo_color_g: {type: 'decimal', precision: 10, scale: 8},
    albedo_color_b: {type: 'decimal', precision: 10, scale: 8},
    albedo_color_a: {type: 'decimal', precision: 10, scale: 8},
    albedo_texture: {type: 'string', length: 255},
    emissive_color_r: {type: 'decimal', precision: 10, scale: 8},
    emissive_color_g: {type: 'decimal', precision: 10, scale: 8},
    emissive_color_b: {type: 'decimal', precision: 10, scale: 8},
    emissive_color_a: {type: 'decimal', precision: 10, scale: 8},
    emissive_texture: {type: 'string', length: 255},
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('material', callback);
};

exports._meta = {
  "version": 1
};
