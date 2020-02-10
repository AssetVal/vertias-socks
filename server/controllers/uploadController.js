const AWS = require('aws-sdk');
const multer = require('@koa/multer');
const multerS3 = require('multer-s3');
const RoleController = require('./roleController');
const {spreadsheetFilter, photoFilter, pdfSpreadFilter, pdfFilter, documentFilter} = require('../filters/fileFilters');
const mimeTypes = require('../modules/mimeTypes');

AWS.config.update({
  secretAccessKey: process.env.AWS_S3_Secret_Access_Key,
  accessKeyId: process.env.AWS_S3_Access_Key_ID,
  region: 'us-west-1',
});
const s3 = new AWS.S3();

const orderUpload = multer({
  spreadsheetFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'veritasorders',
    cacheControl: 'max-age=31536000',
    acl: 'public-read',
    contentDisposition: 'attachment',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: async function(request, file, cb) {
      cb(null, {
        clientID: await RoleController.findRoleAndKey(request, 'id'),
        createdOn: new Date().toLocaleString(),
        originalName: file.originalname,
      });
    },
    key: async function(request, file, cb) {
      const client = await RoleController.findRoleAndKey(request, 'name');
      if (mimeTypes.spreadsheets.includes(file.mimetype)){
        if (file.mimetype === 'application/vnd.ms-excel') {
          cb(null, `${client}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.xls`);
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          cb(null, `${client}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.xlsx`);
        }
      } else if (file.mimetype === mimeTypes.text) {
        cb(null, `${client}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.txt`);
      } else if (file.mimetype === mimeTypes.xml) {
        cb(null, `${client}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.xml`);
      } else {
        return false;
      }
    },
  }),
});

const photoUpload = multer({
  photoFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'assetvalphotos',
    cacheControl: 'max-age=31536000',
    acl: 'public-read',
    contentDisposition: 'attachment',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: async function(request, file, cb) {
      cb(null, {
        // user: req.user.fullNamePreferred,
        clientID: await RoleController.findRoleAndKey(request, 'id'),
        createdOn: new Date().toLocaleString(),
        originalName: file.originalname,
      });
    },
    key: async function(request, file, cb) {
      const user = await RoleController.findRoleAndKey(request, 'name');
      if (file.mimetype === 'image/jpeg'){
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.jpeg`);
      } else if (file.mimetype === 'image/png') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.png`);
      } else if (file.mimetype === 'image/webp') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.webp`);
      } else {
        return false;
      }
    },
  }),
});

const profilePhotoUpload = multer({
  photoFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'veritasprofile',
    cacheControl: 'max-age=31536000',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: async function(request, file, cb) {
      cb(null, {
        clientID: await RoleController.findRoleAndKey(request, 'id', true),
        createdOn: new Date().toLocaleString(),
        originalName: file.originalname,
      });
    },
    key: async function(request, file, cb) {
      const user = await RoleController.findRoleAndKey(request, 'id', true);
      if (file.mimetype === 'image/jpeg'){
        cb(null, `${user}-profile.jpeg`);
      } else if (file.mimetype === 'image/png') {
        cb(null, `${user}-profile.png`);
      } else if (file.mimetype === 'image/webp') {
        cb(null, `${user}-profile.webp`);
      } else {
        return false;
      }
    },
  }),
});

const pdfUpload = multer({
  pdfSpreadFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'veritaspdf',
    cacheControl: 'max-age=31536000',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: async function(request, file, cb) {
      cb(null, {
        clientID: await RoleController.findRoleAndKey(request, 'id'),
        createdOn: new Date().toLocaleString(),
        originalName: file.originalname,
      });
    },
    key: async function(request, file, cb) {
      const user = await RoleController.findRoleAndKey(request, 'name');
      if (file.mimetype === 'application/pdf') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.pdf`);
      } else if (file.mimetype === 'application/vnd.oasis.opendocument.spreadsheet') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.ods`);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.xlsx`);
      } else if (file.mimetype === 'application/vnd.ms-excel') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.xls`);
      } else {
        return false;
      }
    },
  }),
});

const licenseUpload = multer({
  pdfFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'veritaslicense',
    cacheControl: 'max-age=31536000',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: async function(request, file, cb) {
      cb(null, {
        clientID: await RoleController.findRoleAndKey(request, 'id'),
        createdOn: new Date().toLocaleString(),
        originalName: file.originalname,
      });
    },
    key: async function(request, file, cb) {
      const user = await RoleController.findRoleAndKeys(request, ['name', request.body.state]);
      if (file.mimetype === 'application/pdf') {
        cb(null, `${user.name}-${user.state}.pdf`);
      } else {
        return false;
      }
    },
  }),
});

const docUpload = multer({
  documentFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'veritasdocs',
    cacheControl: 'max-age=31536000',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: async function(request, file, cb) {
      cb(null, {
        clientID: await RoleController.findRoleAndKey(request, 'id'),
        createdOn: new Date().toLocaleString(),
        originalName: file.originalname,
      });
    },
    key: async function(request, file, cb) {
      const user = await RoleController.findRoleAndKey(request, 'name');
      if (file.mimetype === 'application/x-abiword') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.abw`);
      } else if (file.mimetype === 'application/vnd.ms-excel') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.xls`);
      } else if (file.mimetype === '\tapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.xlsx`);
      } else if (file.mimetype === 'application/msword') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.doc`);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.docx`);
      } else if (file.mimetype === 'application/vnd.oasis.opendocument.text') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.odt`);
      } else if (file.mimetype === 'application/rtf') {
        cb(null, `${user}-${new Date().getUTCMilliseconds()}${Math.floor((Math.random() * 250) + 1)}.rtf`);
      } else {
        return false;
      }
    },
  }),
});
module.exports = {photoUpload, orderUpload, profilePhotoUpload, pdfUpload, licenseUpload, docUpload};
