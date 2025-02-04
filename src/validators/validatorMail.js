const { check } = require("express-validator");
const { validateResults } = require("../utils/handleValidator");

const validatorMail = [
    check("subject").exists().notEmpty().withMessage("Subject is required"),
    check("text").exists().notEmpty().withMessage("Text is required"),
    check("to").exists().notEmpty().withMessage("Recipient (to) is required"),
    (req, res, next) => {
        return validateResults(req, res, next);
    },
];

module.exports = { validatorMail };
