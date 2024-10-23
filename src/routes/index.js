const fs = require("fs");
const { Router } = require("express");

const router = Router();

fs.readdirSync(__dirname).filter((file) => {
    const name = file.split(".").shift();
    if (name !== "index") router.use(`/${name}`, require("./" + name));
});

module.exports = router;