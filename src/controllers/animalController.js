const conn = require("../db");

class AnimalController {
    create(req, res) {
        const photoUrl = "http://localhost:3333/uploads/" + req.file.filename;
        const { phoneNumber, city, uf, info } = req.body;

        const sql = "INSERT INTO `animal` (`photo_url`, `phone_number`, `city`, `uf`, `info`) VALUES (?, ?, ?, ?, ?)";
        const values = [photoUrl, phoneNumber, city, uf, info];

        conn.execute(sql, values, (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(502);
            }
            return res.sendStatus(201);
        });
    }

    list(req, res) {
        const sql = "SELECT * FROM `animal`";
        conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.sendStatus(502);
            }
            return res.status(200).json(results);
        });
    }

    get(req, res) {
        const { id } = req.params;
        const sql = "SELECT * FROM `animal` WHERE id = ?";
        conn.execute(sql, [id], (err, results) => {
            if (err) {
                console.log(err);
                return res.sendStatus(502);
            }
            return res.status(200).json(results);
        });
    }

    delete(req, res) {
        const { id } = req.params;
        const sql = "DELETE FROM `animal` WHERE id = ?";
        conn.execute(sql, [id], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(502);
            }
            return res.sendStatus(200);
        });
    }
}

module.exports = AnimalController;