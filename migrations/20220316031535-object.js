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
  db.createTable('object', {
    object_id: {type: 'int', primaryKey: true, autoIncrement: true},
    entity_id: {type: 'string', length: 100, notNull: true},
    parent_id: {type: 'string', length: 100},
    entity_name: {type: 'string', length: 100},
    shape: {type: 'string', length: 100},
    material_id: {type: 'string', length: 100},
    position_x: {type: 'decimal', precision: 10, scale: 8},
    position_y: {type: 'decimal', precision: 10, scale: 8},
    position_z: {type: 'decimal', precision: 10, scale: 8},
    rotation_x: {type: 'decimal', precision: 10, scale: 8},
    rotation_y: {type: 'decimal', precision: 10, scale: 8},
    rotation_z: {type: 'decimal', precision: 10, scale: 8},
    rotation_w: {type: 'decimal', precision: 10, scale: 8},
    scale_x: {type: 'decimal', precision: 10, scale: 8},
    scale_y: {type: 'decimal', precision: 10, scale: 8},
    scale_z: {type: 'decimal', precision: 10, scale: 8},
    with_collisions: {type: 'boolean'},
    gltf_path: {type: 'string', length: 255},
    gltf_rotation_x: {type: 'decimal', precision: 10, scale: 8},
    gltf_rotation_y: {type: 'decimal', precision: 10, scale: 8},
    gltf_rotation_z: {type: 'decimal', precision: 10, scale: 8},
    gltf_rotation_w: {type: 'decimal', precision: 10, scale: 8},
    text_string: {type: 'text'},
    text_color_r: {type: 'decimal', precision: 10, scale: 8},
    text_color_g: {type: 'decimal', precision: 10, scale: 8},
    text_color_b: {type: 'decimal', precision: 10, scale: 8},
    text_color_a: {type: 'decimal', precision: 10, scale: 8},
    text_width: {type: 'decimal', precision: 10, scale: 6},
    text_height: {type: 'decimal', precision: 10, scale: 6},
    text_size: {type: 'decimal', precision: 10, scale: 6},
    audio_path: {type: 'string', length: 255},
    audio_playing: {type: 'boolean'},
    audio_volume: {type: 'int'},
    audio_loop: {type: 'boolean'},
    audio_pitch: {type: 'int'},
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('object', callback);
};

exports._meta = {
  "version": 1
};
