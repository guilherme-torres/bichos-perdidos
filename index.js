const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
require('dotenv').config()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DBNAME
} = process.env;

const conn = mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DBNAME
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

app.get("/animals/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM `animal` WHERE id = ?";
    conn.execute(sql, [id], (err, results) => {
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
