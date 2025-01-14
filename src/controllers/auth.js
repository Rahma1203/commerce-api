exports.registerCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const password = await encrypt(req.password)
        const body = {...req, password} // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
        const dataUser = await usersModel.create(body)
        //Si no queremos que se devuelva el hash con "findOne", en el modelo de users ponemos select: false en el campo password
        //Además, en este caso con "create", debemos setear la propiedad tal que:  
        dataUser.set('password', undefined, { strict: false })

        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
        }
        res.send(data)  
    }catch(err) {
        console.log(err)
        handleHttpError(res, "ERROR_REGISTER_USER")
    }
}



exports.loginCtrl = async (req, res) => {
    try {
        req = matchedData(req);
        const user = await usersModel.findOne({ email: req.email }).select("password name role email");
        if(!user){
            handleHttpError(res, "USER_NOT_EXISTS", 404);
            return;
        }
        const hashPassword = user.password;
        const check = await compare(req.password, hashPassword);
        if(!check){
            handleHttpError(res, "INVALID_PASSWORD", 401);
            return;
        }
        user.set("password", undefined, {strict: false});
        const data = {
            token: await tokenSign(user),
            user
        };
        res.send(data);
    } catch(err){
        console.log(err);
        handleHttpError(res, "ERROR_LOGIN_USER");
    }
}
