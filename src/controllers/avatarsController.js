const fs = require('fs').promises
const jimp = require('jimp')
const path = require('path')

const avatarsController = async (req, res) => {
  if (req.file) {
    const avatarUrl = await saveAvatar(req.user._id, req.token, req.file)
    return res.status(200).json({ status: 'success', avatarUrl })
  }
  if (!req.file) {
    return res.status(400).json({ message: 'please, download file' })
  }
}

const saveAvatar = async (file) => {
  const AVATARS_DIR = path.resolve('public/avatars')
  const newNameAvatar = `${Date.now().toString()}-${file.originalname}`

  const img = await jimp.read(file.path)
  await img
    .autocrop()
    .cover(
      250,
      250,
      jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(file.path)
  try {
    await fs.rename(
      file.path,
      path.join(file.path, path.join(AVATARS_DIR, newNameAvatar))
    )
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  avatarsController
}
