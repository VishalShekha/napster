import express from "express"
import multer from "multer"

const router = express.Router()

// Configure multer for file uploads (audio + image)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/") // save in /uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage })

// POST /uploads/song
router.post(
  "/song",
  upload.fields([{ name: "audio", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  (req, res) => {
    const { title, artist, album, genre, description } = req.body
    const audioFile = req.files["audio"] ? req.files["audio"][0] : null
    const coverFile = req.files["cover"] ? req.files["cover"][0] : null

    res.json({
      message: "Song uploaded successfully",
      data: {
        title,
        artist,
        album,
        genre,
        description,
        audioPath: audioFile?.path,
        coverPath: coverFile?.path,
      },
    })
  }
)

export default router
