exports.validatorMail = [

    check("subject").exists().notEmpty(),
    
    check("text").exists().notEmpty(),
    
    check("to").exists().notEmpty(),
    
    (req, res, next) => {
    
    return validateResults(req, res, next)
    
    }
    
    ]
    
   