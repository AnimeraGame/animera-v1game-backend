const express   = require("express");
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const BUCKET_NAME = 'swift-spar';
const IAM_USER_KEY = 'AKIAJRAXHXXB26O44X2A';
const IAM_USER_SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
});

let upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: 'swift-spar',
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            let str = file.originalname;
            cb(null, Date.now().toString() + str.replace(/[^A-Z0-9]+/ig, "_"));
        }
    })
});


module.exports = (folder)=> {
    let upload = multer({
        storage: multerS3({
            s3: s3,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            bucket: 'swift-spar/'+folder,
            metadata: function (req, file, cb) {
                cb(null, {
                    fieldName: file.fieldname
                });
            },
            key: function (req, file, cb) {
                cb(null, Date.now().toString() + file.originalname.replace(/[^A-Z0-9.]+/ig, "_"));
            }
        })
    });
    
    return upload
}
