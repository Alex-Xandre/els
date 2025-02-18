const cloudinary = require('cloudinary');
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
const uploadController = {
  uploadAvatar: async (req, res) => {
    try {
      //getfile
      const file = req.file;
      //upload to cloudinary
      cloudinary.v2.uploader.upload(
        file.path,
        {
          folder: 'docs',
          resource_type: 'auto',
        },
        (err, result) => {
          if (err) throw err;
          fs.unlinkSync(file.path);
          res.status(200).json({
            msg: 'Uploaded succesfully',
            url: result.secure_url,
          });
        }
      );
    } catch (err) {
      console.log('d');
    }
  },
};

module.exports = uploadController;
