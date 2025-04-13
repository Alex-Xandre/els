const fs = require("fs");

module.exports = (req, res, next) => {
  console.log(req.file);
  // check file existence
  if (typeof req.file === "undefined" || typeof req.body === "undefined")
    return res.status(400).json({ msg: "Issue with uploading this file." });

  // app use upload
  let file = req.file.path;

  // file type
  if (
    !req.file.mimetype.includes("jpeg") &&
    !req.file.mimetype.includes("jpg") &&
    !req.file.mimetype.includes("png") &&
    !req.file.mimetype.includes("mp4") &&
    !req.file.mimetype.includes("pdf") &&
    !req.file.mimetype.includes("msword") && // .doc
    !req.file.mimetype.includes(
      "vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) && // .docx
    !req.file.mimetype.includes("vnd.ms-excel") && // .xls
    !req.file.mimetype.includes(
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) &&
    !req.file.mimetype.includes(
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
  ) {
    // remove file
    fs.unlinkSync(file);
    return res.status(400).json({ msg: "This file type is not supported." });
  }

  // file size
  if (req.file.size > 100 * 1024 * 1024) {
    // Updated size limit to 100MB
    // remove file
    fs.unlinkSync(file);
    return res.status(400).json({ msg: "This file is too large (Max: 100MB)" });
  }

  // success
  next();
};
