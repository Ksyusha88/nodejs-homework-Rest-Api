const path = require('path')
require('dotenv').config()
const multer = require('multer')

const AVATARS_DIR = path.join(process.cwd(), process.env.AVATARS_DIR)
// const TEMP_DIR = path.join(process.cwd(), process.env.TEMP_DIR)

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, AVATARS_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
    }
    cb(null, false)
  }
})

module.exports = {
  upload,
  AVATARS_DIR
  // TEMP_DIR
}
