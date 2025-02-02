const { sendEmail } = require('../utils/handleEmail')
const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require('express-validator')

exports.send = async (req, res) => {

    try {
        const {cif} = req.user
        const info = matchedData(req)
       
        if (!cif) {
            return handleHttpError(res, 'CIF_REQUIRED', 400);
        }

        // Incluir el CIF en la información enviada
        const data = await sendEmail({ ...info, cif });

    } catch (err) {
        
        handleHttpError(res, 'ERROR_SEND_EMAIL')

    }

}

