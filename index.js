const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});
  
const upload = multer({ storage: storage });

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/animal", upload.single("animalPhoto"), (req, res) => {
    const photoUrl = "http://localhost:3333/uploads/" + req.file.filename;
    const { phoneNumber, city, uf, info } = req.body;
    return res.json({ photoUrl, phoneNumber, city, uf, info });
});

app.listen(3333);
