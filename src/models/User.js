const mongoose = require("mongoose")


const UserScheme = new mongoose.Schema(
    {
        nombre: {type: String},
        edad: {type: Number},
        ciudad: {type: String,required: true,lowercase: true,index: true},
        email: {type: String,unique: true,lowercase: true,required: true},
        password: {type: String },//Save the HASH
        interests: {type: [String], default:[],index: true},
        permiteRecibirOfertas: {type: Boolean, default: false,index: true},
        role: {type: String,enum: ["user", "admin"],default: "user"}
    },
    {
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)



module.exports = mongoose.model("Users", UserScheme) ;
