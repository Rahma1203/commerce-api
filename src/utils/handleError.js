exports.handleHttpError = (res, message, code = 400) => {
    res.status(code).send({ error: message});
    }
    