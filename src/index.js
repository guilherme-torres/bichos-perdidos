const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const conn = require("./db");

const sql = `
CREATE TABLE IF NOT EXISTS animal (
    id int not null auto_increment primary key,
    photo_url text not null,
    phone_number varchar(25) not null,
    city varchar(100) not null,
    uf char(2) not null,
    info text
)`;
conn.query(sql, (err) => {
    if (err) throw err;
    console.log("Table created");
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(routes);

app.listen(3333, () => {
    console.log("Servidor rodando em: http://localhost:3333/");
});