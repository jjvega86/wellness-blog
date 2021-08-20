const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { Image } = require("../models/image");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const newImage = Image({ image: url + "/images/" + req.file.filename });
    await newImage.save();
    return res.status(200).send(newImage);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
