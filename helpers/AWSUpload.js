const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

AWS.config.update({
  accessKeyId: "ASIA5O22Z5JG3EOBLC5I",
  secretAccessKey: "Nkz4Cd1PdkP432cgQcYRYzi5FKuovSuNDticckJw",
  region: "us-east-1",
});

const S0 = new AWS.S3({});
const upload = multer({
  storage: multerS3({
    s3: S0,
    bucket: "footballkik-salah",
    acl: "public-read",
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    },
    rename(fieldName, fileName) {
      return fileName.replace(/\W+/g, "-");
    },
  }),
});

exports.Upload = upload;
