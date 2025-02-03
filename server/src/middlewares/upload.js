const fs = require('fs');

module.exports = (req, res, next) => {

  console.log(req.file)
  // check file existence
  if (typeof req.file === 'undefined' || typeof req.body === 'undefined')
    return res.status(400).json({ msg: 'Issue with uploading this file.' });

  // app use upload
  let file = req.file.path;

  // file type
  if (
    !req.file.mimetype.includes('jpeg') &&
    !req.file.mimetype.includes('jpg') &&
    !req.file.mimetype.includes('png') &&
    !req.file.mimetype.includes('pdf') && // Accept PDF files
    !req.file.mimetype.includes('msword') && // Accept Word .doc files
    !req.file.mimetype.includes('vnd.openxmlformats-officedocument.wordprocessingml.document') // Accept Word .docx files
  ) {
    // remove file
    fs.unlinkSync(file);
    return res.status(400).json({ msg: 'This file type is not supported.' });
  }

  // file size
  if (req.file.size > 10 * 1024 * 1024) {
    // Updated size limit to 10MB
    // remove file
    fs.unlinkSync(file);
    return res.status(400).json({ msg: 'This file is too large (Max: 10MB)' });
  }

  // success
  next();
};
