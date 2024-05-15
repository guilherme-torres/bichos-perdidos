const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const conn = mysql.createConnection({
    host: "172.20.0.1",
    port: 3306,
    user: "root",
    password: "PASSWORD",
    database: "bichos_perdidos"
});

const upload = multer({ storage: storage });

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/animals", upload.single("animalPhoto"), (req, res) => {
    const photoUrl = "http://localhost:3333/uploads/" + req.file.filename;
    const { phoneNumber, city, uf, info } = req.body;

    const sql = "INSERT INTO `animal` (`photo_url`, `phone_number`, `city`, `uf`, `info`) VALUES (?, ?, ?, ?, ?)";
    const values = [photoUrl, phoneNumber, city, uf, info];

    conn.execute(sql, values, (err) => {
        if (err) {
            console.log(err);
            return res.status(502);
        }
        return res.status(201).json({ photoUrl, phoneNumber, city, uf, info });
    });
});

app.get("/animals", (req, res) => {
    const sql = "SELECT * FROM `animal`";
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(502);
        }
        return res.status(200).json(results);
    });
});

app.listen(3333, () => {
    console.log("Servidor rodando em: http://localhost:3333/");
});
