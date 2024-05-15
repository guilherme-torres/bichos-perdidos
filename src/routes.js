const express = require("express");
const multer = require("multer");
const path = require("path");
const AnimalController = require("./controllers/animalController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

const routes = express.Router();

const animalController = new AnimalController();

routes.post("/animals", upload.single("animalPhoto"), animalController.create);
routes.get("/animals", animalController.list);
routes.get("/animals/:id", animalController.get);
routes.delete("/animals/:id", animalController.delete);

module.exports = routes;